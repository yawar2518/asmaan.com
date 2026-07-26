from django.contrib import admin
from .models import ListingRequest, ListingRequestPhoto
from .services import (
    create_property_from_listing_request,
    send_listing_live_email,
    send_listing_rejected_email,
)


class ListingRequestPhotoInline(admin.TabularInline):
    model = ListingRequestPhoto
    extra = 0
    readonly_fields = ['uploaded_at']


@admin.action(description='Approve selected listing requests (creates live Property)')
def bulk_approve(modeladmin, request, queryset):
    for listing_request in queryset:
        create_property_from_listing_request(listing_request)
        listing_request.refresh_from_db()
        send_listing_live_email(listing_request)


@admin.action(description='Reject selected listing requests')
def bulk_reject(modeladmin, request, queryset):
    queryset.update(status='rejected')
    for listing_request in queryset:
        send_listing_rejected_email(listing_request)


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
    search_fields = ['owner_name', 'phone', 'email', 'address', 'cnic']
    list_editable = ['status']
    readonly_fields = ['unique_token', 'submitted_at', 'updated_at', 'created_property']
    inlines = [ListingRequestPhotoInline]
    actions = [bulk_approve, bulk_reject]

    fieldsets = (
        ('Owner Information', {
            'fields': ('owner_name', 'email', 'phone', 'whatsapp', 'cnic', 'preferred_contact_time')
        }),
        ('Property Details', {
            'fields': (
                'property_type', 'area_sqft', 'size', 'bedrooms', 'bathrooms',
                'floor', 'furnishing', 'property_age',
                'has_electricity', 'has_gas', 'has_water', 'document_type',
            )
        }),
        ('Location', {
            'fields': ('city', 'area_name', 'address', 'landmark', 'latitude', 'longitude')
        }),
        ('Pricing', {
            'fields': ('asking_price', 'is_negotiable', 'available_from')
        }),
        ('Contact for buyers', {
            'fields': ('contact_name',)
        }),
        ('Workflow', {
            'fields': ('status', 'assigned_agent', 'visit_notes', 'admin_notes', 'created_property')
        }),
        ('Tracking', {
            'fields': ('unique_token', 'submitted_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
