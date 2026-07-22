from decimal import Decimal

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ListingRequest, ListingRequestPhoto

User = get_user_model()


class ListingRequestPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingRequestPhoto
        fields = ['id', 'image', 'caption', 'uploaded_at']


class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class ListingRequestCreateSerializer(serializers.ModelSerializer):
    """Public submission — sellers can only set their own listing data,
    never workflow fields like status/assigned_agent/notes."""

    # area_sqft/email carry a DB-level default purely so the migration could
    # add them as NOT NULL columns to an existing table; re-assert that
    # they're actually required from the seller's submission.
    area_sqft = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('1'), required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = ListingRequest
        fields = [
            'property_type', 'area_sqft', 'bedrooms', 'bathrooms',
            'floor', 'furnishing', 'property_age',
            'has_electricity', 'has_gas', 'has_water',
            'city', 'area_name', 'address', 'landmark', 'latitude', 'longitude',
            'owner_name', 'cnic', 'document_type',
            'asking_price', 'is_negotiable', 'available_from',
            'contact_name', 'email', 'phone', 'whatsapp', 'preferred_contact_time',
        ]


class ListingRequestSerializer(serializers.ModelSerializer):
    """Full detail — used by staff and the assigned agent."""

    photos = ListingRequestPhotoSerializer(many=True, read_only=True)
    assigned_agent = AgentSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = ListingRequest
        fields = [
            'id', 'property_type', 'area_sqft', 'size', 'bedrooms', 'bathrooms',
            'floor', 'furnishing', 'property_age',
            'has_electricity', 'has_gas', 'has_water',
            'city', 'area_name', 'address', 'landmark', 'latitude', 'longitude',
            'owner_name', 'cnic', 'document_type',
            'asking_price', 'is_negotiable', 'available_from',
            'contact_name', 'email', 'phone', 'whatsapp', 'preferred_contact_time',
            'status', 'status_display', 'assigned_agent', 'visit_notes', 'admin_notes',
            'created_property', 'unique_token', 'submitted_at', 'updated_at', 'photos',
        ]
        read_only_fields = [
            'unique_token', 'submitted_at', 'updated_at', 'created_property',
            'status', 'visit_notes', 'admin_notes',
        ]


class ListingRequestTrackSerializer(serializers.ModelSerializer):
    """Public status-tracking view — no PII (CNIC, phone) exposed."""

    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = ListingRequest
        fields = [
            'property_type', 'area_name', 'city', 'asking_price',
            'status', 'status_display', 'admin_notes',
            'submitted_at', 'updated_at',
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.status != 'rejected':
            data['admin_notes'] = ''
        return data


class AssignAgentSerializer(serializers.Serializer):
    agent_id = serializers.IntegerField()

    def validate_agent_id(self, value):
        from .permissions import is_field_agent
        try:
            user = User.objects.get(pk=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('No such user.')
        if not is_field_agent(user):
            raise serializers.ValidationError('User is not in the Field Agents group.')
        return value


class CompleteVisitSerializer(serializers.Serializer):
    visit_notes = serializers.CharField(allow_blank=True, required=False)


class AdminNotesSerializer(serializers.Serializer):
    admin_notes = serializers.CharField(allow_blank=True)


class RejectSerializer(serializers.Serializer):
    admin_notes = serializers.CharField(allow_blank=False)


class BulkActionSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    admin_notes = serializers.CharField(required=False, allow_blank=True)
