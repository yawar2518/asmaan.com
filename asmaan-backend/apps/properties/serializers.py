from rest_framework import serializers
from .models import Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image_url', 'is_primary']


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'category', 'status', 'price',
            'size', 'bedrooms', 'bathrooms', 'floors',
            'area', 'city', 'address',
            'latitude', 'longitude',
            'is_verified', 'description', 'images',
            'created_at',
        ]

    def get_latitude(self, obj):
        return obj.location.y if obj.location else None

    def get_longitude(self, obj):
        return obj.location.x if obj.location else None