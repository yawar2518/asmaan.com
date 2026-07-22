from rest_framework import serializers
from .models import Property, PropertyImage, PriceHistory


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image_url', 'is_primary']


class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = ['price', 'recorded_at']


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    price_history = PriceHistorySerializer(many=True, read_only=True)
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'category', 'status', 'price',
            'size', 'area_sqft', 'bedrooms', 'bathrooms', 'floors', 'floor',
            'furnishing', 'property_age',
            'area', 'city', 'address',
            'latitude', 'longitude',
            'contact_name', 'contact_phone',
            'is_verified', 'description', 'images', 'price_history',
            'created_at',
        ]

    def get_latitude(self, obj):
        return obj.location.y if obj.location else None

    def get_longitude(self, obj):
        return obj.location.x if obj.location else None