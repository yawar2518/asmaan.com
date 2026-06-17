import uuid
from django.db import models
from django.conf import settings


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
    size = models.DecimalField(max_digits=8, decimal_places=2, help_text='Size in Marla')
    bedrooms = models.IntegerField(null=True, blank=True)
    bathrooms = models.IntegerField(null=True, blank=True)

    # Location
    address = models.TextField()
    landmark = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    # Owner
    owner_name = models.CharField(max_length=255)
    cnic = models.CharField(max_length=15, help_text='Owner CNIC')
    document_type = models.CharField(max_length=100, help_text='Ownership document type')

    # Pricing
    asking_price = models.DecimalField(max_digits=12, decimal_places=2)
    is_negotiable = models.BooleanField(default=True)
    available_from = models.DateField(null=True, blank=True)

    # Contact
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

    # Tracking
    unique_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f'{self.owner_name} — {self.property_type} ({self.status})'