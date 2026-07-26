from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from .models import ListingRequest
from .permissions import AGENT_GROUP_NAME, IsAssignedAgentOrStaff, IsStaffUser, is_field_agent
from .serializers import (
    AdminNotesSerializer,
    AgentSerializer,
    AssignAgentSerializer,
    BulkActionSerializer,
    CompleteVisitSerializer,
    ListingRequestCreateSerializer,
    ListingRequestPhotoSerializer,
    ListingRequestSerializer,
    ListingRequestTrackSerializer,
    RejectSerializer,
)
from .services import (
    create_property_from_listing_request,
    send_listing_live_email,
    send_listing_rejected_email,
    send_submission_confirmation_email,
)

User = get_user_model()

STAFF_ACTIONS = {'assign_agent', 'set_admin_notes', 'approve', 'reject', 'bulk_action', 'agents'}
AGENT_OR_STAFF_ACTIONS = {'upload_photo', 'start_visit', 'complete_visit'}


class ListingRequestViewSet(viewsets.ModelViewSet):
    queryset = (
        ListingRequest.objects
        .select_related('assigned_agent', 'created_property')
        .prefetch_related('photos')
        .all()
    )
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_serializer_class(self):
        if self.action == 'create':
            return ListingRequestCreateSerializer
        return ListingRequestSerializer

    def get_permissions(self):
        if self.action == 'create' or self.action == 'track':
            return [permissions.AllowAny()]
        if self.action in STAFF_ACTIONS:
            return [IsStaffUser()]
        if self.action in AGENT_OR_STAFF_ACTIONS:
            return [permissions.IsAuthenticated(), IsAssignedAgentOrStaff()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if not user.is_authenticated:
            return qs.none()
        if user.is_staff:
            status_param = self.request.query_params.get('status')
            if status_param:
                qs = qs.filter(status=status_param)
            return qs
        if is_field_agent(user):
            return qs.filter(assigned_agent=user)
        return qs.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        listing_request = serializer.save()
        send_submission_confirmation_email(listing_request)
        out = ListingRequestSerializer(listing_request, context=self.get_serializer_context())
        return Response(out.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        # All mutations go through the explicit workflow actions below
        # (assign-agent, start-visit, complete-visit, admin-notes, approve,
        # reject) so that status transitions always run their business
        # logic — a generic PATCH here would let an agent set status/notes
        # directly and skip it.
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(
        detail=False, methods=['get'],
        url_path='track/(?P<token>[0-9a-f-]+)',
        permission_classes=[permissions.AllowAny],
    )
    def track(self, request, token=None):
        listing_request = get_object_or_404(ListingRequest, unique_token=token)
        return Response(ListingRequestTrackSerializer(listing_request).data)

    @action(detail=False, methods=['get'])
    def agents(self, request):
        field_agents = User.objects.filter(groups__name=AGENT_GROUP_NAME).order_by('username')
        return Response(AgentSerializer(field_agents, many=True).data)

    @action(detail=True, methods=['patch'], url_path='assign-agent')
    def assign_agent(self, request, pk=None):
        listing_request = self.get_object()
        serializer = AssignAgentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        agent = User.objects.get(pk=serializer.validated_data['agent_id'])
        listing_request.assigned_agent = agent
        listing_request.status = 'agent_assigned'
        listing_request.save(update_fields=['assigned_agent', 'status', 'updated_at'])
        return Response(ListingRequestSerializer(listing_request, context=self.get_serializer_context()).data)

    @action(detail=True, methods=['patch'], url_path='start-visit')
    def start_visit(self, request, pk=None):
        listing_request = self.get_object()
        listing_request.status = 'visit_scheduled'
        listing_request.save(update_fields=['status', 'updated_at'])
        return Response(ListingRequestSerializer(listing_request, context=self.get_serializer_context()).data)

    @action(detail=True, methods=['post'], url_path='photos')
    def upload_photo(self, request, pk=None):
        listing_request = self.get_object()
        image = request.FILES.get('image')
        if not image:
            return Response({'image': 'This field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        photo = listing_request.photos.create(image=image, caption=request.data.get('caption', ''))
        return Response(
            ListingRequestPhotoSerializer(photo, context=self.get_serializer_context()).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['patch'], url_path='complete-visit')
    def complete_visit(self, request, pk=None):
        listing_request = self.get_object()
        serializer = CompleteVisitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if 'visit_notes' in serializer.validated_data:
            listing_request.visit_notes = serializer.validated_data['visit_notes']
        listing_request.status = 'visit_completed'
        listing_request.save(update_fields=['visit_notes', 'status', 'updated_at'])
        return Response(ListingRequestSerializer(listing_request, context=self.get_serializer_context()).data)

    @action(detail=True, methods=['patch'], url_path='admin-notes')
    def set_admin_notes(self, request, pk=None):
        listing_request = self.get_object()
        serializer = AdminNotesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        listing_request.admin_notes = serializer.validated_data['admin_notes']
        if listing_request.status == 'visit_completed':
            listing_request.status = 'under_review'
        listing_request.save(update_fields=['admin_notes', 'status', 'updated_at'])
        return Response(ListingRequestSerializer(listing_request, context=self.get_serializer_context()).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        listing_request = self.get_object()
        create_property_from_listing_request(listing_request)
        listing_request.refresh_from_db()
        send_listing_live_email(listing_request)
        return Response(ListingRequestSerializer(listing_request, context=self.get_serializer_context()).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        listing_request = self.get_object()
        serializer = RejectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        listing_request.admin_notes = serializer.validated_data['admin_notes']
        listing_request.status = 'rejected'
        listing_request.save(update_fields=['admin_notes', 'status', 'updated_at'])
        send_listing_rejected_email(listing_request)
        return Response(ListingRequestSerializer(listing_request, context=self.get_serializer_context()).data)

    @action(detail=False, methods=['post'], url_path='bulk-action')
    def bulk_action(self, request):
        serializer = BulkActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        listings = ListingRequest.objects.filter(pk__in=data['ids'])

        succeeded, failed = [], []
        for listing_request in listings:
            try:
                if data['action'] == 'approve':
                    create_property_from_listing_request(listing_request)
                    listing_request.refresh_from_db()
                    send_listing_live_email(listing_request)
                else:
                    listing_request.admin_notes = data.get('admin_notes', '')
                    listing_request.status = 'rejected'
                    listing_request.save(update_fields=['admin_notes', 'status', 'updated_at'])
                    send_listing_rejected_email(listing_request)
                succeeded.append(listing_request.id)
            except Exception as exc:  # pragma: no cover - defensive
                failed.append({'id': listing_request.id, 'error': str(exc)})

        return Response({'succeeded': succeeded, 'failed': failed})
