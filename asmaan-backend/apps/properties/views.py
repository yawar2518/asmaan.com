from rest_framework import filters, viewsets
from .models import Property
from .permissions import IsAdminOrReadOnly
from .serializers import PropertySerializer


class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'area', 'address', 'description']
    ordering_fields = ['price', 'size', 'created_at']
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        queryset = Property.objects.all()

        # Staff can see everything (needed for the admin properties console);
        # buyers only ever see available listings.
        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(status='available')

        params = self.request.query_params

        category = params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        min_price = params.get('min_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        max_price = params.get('max_price')
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        bedrooms = params.get('bedrooms')
        if bedrooms:
            queryset = queryset.filter(bedrooms__gte=bedrooms)

        min_area = params.get('min_area')
        if min_area:
            queryset = queryset.filter(area_sqft__gte=min_area)

        max_area = params.get('max_area')
        if max_area:
            queryset = queryset.filter(area_sqft__lte=max_area)

        city = params.get('city')
        if city:
            queryset = queryset.filter(city__iexact=city)

        zone = params.get('zone')
        if zone:
            queryset = queryset.filter(area__icontains=zone)

        return queryset
