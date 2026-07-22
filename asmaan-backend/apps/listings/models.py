import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from apps.properties.models import FURNISHING_CHOICES, SQFT_PER_MARLA

DOCUMENT_TYPE_CHOICES = [
    ('registry', 'Registry'),
    ('allotment_letter', 'Allotment Letter'),
    ('transfer_letter', 'Transfer Letter'),
    ('possession_letter', 'Possession Letter'),
    ('other', 'Other'),
]


class ListingRequest(models.Model):
    PROPERTY_TYPE_CHOICES = [
        ('buy', 'Buy'),
        ('rent', 'Rent'),
        ('plot', 'Plot'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('agent_assigned', 'Agent Assigned'),
        ('visit_scheduled', 'Visit Scheduled'),
        ('visit_completed', 'Visit Completed'),
        ('under_review', 'Under Review'),
        ('live', 'Live'),
        ('rejected', 'Rejected'),
    ]

    # Property details
    property_type = models.CharField(max_length=10, choices=PROPERTY_TYPE_CHOICES)
    # default=0 exists only to satisfy the DB column on migrate; this field
    # is still required at the API layer (see ListingRequestCreateSerializer).
    area_sqft = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text='Total area in square feet')
    size = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, help_text='Size in Marla (auto-derived from area_sqft)')
    bedrooms = models.IntegerField(null=True, blank=True)
    bathrooms = models.IntegerField(null=True, blank=True)
    floor = models.CharField(max_length=20, blank=True, default='', help_text='Which floor this unit is on')
    furnishing = models.CharField(max_length=20, choices=FURNISHING_CHOICES, blank=True, default='')
    property_age = models.PositiveIntegerField(null=True, blank=True, help_text='Age of the property in years')
    has_electricity = models.BooleanField(default=True)
    has_gas = models.BooleanField(default=True)
    has_water = models.BooleanField(default=True)

    # Location
    city = models.CharField(max_length=100, default='Lahore')
    area_name = models.CharField(max_length=100, blank=True, default='', help_text='e.g. DHA Phase 5')
    address = models.TextField()
    landmark = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    # Owner
    owner_name = models.CharField(max_length=255)
    cnic = models.CharField(max_length=15, help_text='Owner CNIC')
    document_type = models.CharField(max_length=100, choices=DOCUMENT_TYPE_CHOICES, help_text='Ownership document type')

    # Pricing
    asking_price = models.DecimalField(max_digits=12, decimal_places=2)
    is_negotiable = models.BooleanField(default=True)
    available_from = models.DateField(null=True, blank=True)

    # Contact
    contact_name = models.CharField(max_length=255, blank=True, default='', help_text='Who buyers should reach out to, if different from owner')
    # default='' exists only to satisfy the DB column on migrate; email is
    # still required at the API layer (see ListingRequestCreateSerializer).
    email = models.EmailField(default='', help_text='Used to send status updates and confirmations')
    phone = models.CharField(max_length=20)
    whatsapp = models.CharField(max_length=20, blank=True)
    preferred_contact_time = models.CharField(max_length=100, blank=True)

    # Workflow
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='assigned_listings',
    )
    visit_notes = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    created_property = models.OneToOneField(
        'properties.Property',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='source_listing_request',
    )

    # Tracking
    unique_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']

    def save(self, *args, **kwargs):
        if self.area_sqft and not self.size:
            self.size = (self.area_sqft / SQFT_PER_MARLA).quantize(Decimal('0.01'))
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.owner_name} — {self.property_type} ({self.status})'

    @property
    def contact_display_name(self):
        return self.contact_name or self.owner_name


class ListingRequestPhoto(models.Model):
    listing_request = models.ForeignKey(
        ListingRequest,
        related_name='photos',
        on_delete=models.CASCADE,
    )
    image = models.ImageField(upload_to='listing_photos/')
    caption = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']

    def __str__(self):
        return f'Photo for {self.listing_request.owner_name} ({self.uploaded_at.date()})'
