from django.contrib.gis import admin
from .models import Property, PropertyImage, PriceHistory


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1


class PriceHistoryInline(admin.TabularInline):
    model = PriceHistory
    extra = 0
    readonly_fields = ['price', 'recorded_at']
    can_delete = False


@admin.register(Property)
class PropertyAdmin(admin.GISModelAdmin):
    list_display = [
        'title',
        'category',
        'price',
        'area',
        'city',
        'status',
        'is_verified',
        'created_at',
    ]
    list_filter = ['category', 'status', 'is_verified', 'city', 'area']
    search_fields = ['title', 'address', 'area', 'description']
    list_editable = ['is_verified', 'status']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [PropertyImageInline, PriceHistoryInline]

    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'category', 'status', 'is_verified', 'description')
        }),
        ('Pricing', {
            'fields': ('price',)
        }),
        ('Property Details', {
            'fields': ('size', 'bedrooms', 'bathrooms', 'floors')
        }),
        ('Location', {
            'fields': ('area', 'city', 'address', 'location')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ['property', 'is_primary', 'uploaded_at']
    list_filter = ['is_primary', 'uploaded_at']


@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = ['property', 'price', 'recorded_at']
    readonly_fields = ['recorded_at']