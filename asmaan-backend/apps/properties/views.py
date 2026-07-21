from rest_framework import viewsets, filters
from .models import Property
from .serializers import PropertySerializer


class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PropertySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'area', 'address', 'description']
    ordering_fields = ['price', 'size', 'created_at']

    def get_queryset(self):
        queryset = Property.objects.filter(status='available')
        category = self.request.query_params.get('category') # type: ignore
        if category:
            queryset = queryset.filter(category=category)

        min_price = self.request.query_params.get('min_price') # type: ignore
        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        max_price = self.request.query_params.get('max_price') # type: ignore
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset