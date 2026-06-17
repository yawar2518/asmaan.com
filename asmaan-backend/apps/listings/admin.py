from django.contrib import admin
from .models import ListingRequest


@admin.register(ListingRequest)
class ListingRequestAdmin(admin.ModelAdmin):
    list_display = [
        'owner_name',
        'property_type',
        'asking_price',
        'address',
        'status',
        'assigned_agent',
        'submitted_at',
    ]
    list_filter = ['status', 'property_type', 'is_negotiable', 'submitted_at']
    search_fields = ['owner_name', 'phone', 'address', 'cnic']
    list_editable = ['status']
    readonly_fields = ['unique_token', 'submitted_at', 'updated_at']

    fieldsets = (
        ('Owner Information', {
            'fields': ('owner_name', 'phone', 'whatsapp', 'cnic', 'preferred_contact_time')
        }),
        ('Property Details', {
            'fields': ('property_type', 'size', 'bedrooms', 'bathrooms', 'document_type')
        }),
        ('Location', {
            'fields': ('address', 'landmark', 'latitude', 'longitude')
        }),
        ('Pricing', {
            'fields': ('asking_price', 'is_negotiable', 'available_from')
        }),
        ('Workflow', {
            'fields': ('status', 'assigned_agent', 'visit_notes', 'admin_notes')
        }),
        ('Tracking', {
            'fields': ('unique_token', 'submitted_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )