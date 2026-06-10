from django.contrib.gis.db import models


class Property(models.Model):
    CATEGORY_CHOICES = [
        ('buy', 'Buy'),
        ('rent', 'Rent'),
        ('plot', 'Plot'),
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('rented', 'Rented'),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='available')

    price = models.DecimalField(max_digits=12, decimal_places=2)
    size = models.DecimalField(max_digits=8, decimal_places=2, help_text='Size in Marla')
    bedrooms = models.IntegerField(null=True, blank=True)
    bathrooms = models.IntegerField(null=True, blank=True)
    floors = models.IntegerField(null=True, blank=True)

    area = models.CharField(max_length=100, help_text='e.g. DHA Phase 5')
    city = models.CharField(max_length=100, default='Lahore')
    address = models.TextField()
    location = models.PointField(help_text='GPS coordinates (longitude, latitude)')

    is_verified = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Properties'

    def __str__(self):
        return f'{self.title} ({self.get_category_display()})' # type: ignore


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property,
        related_name='images',
        on_delete=models.CASCADE,
    )
    image_url = models.URLField(help_text='Cloudinary URL')
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Image for {self.property.title}'


class PriceHistory(models.Model):
    property = models.ForeignKey(
        Property,
        related_name='price_history',
        on_delete=models.CASCADE,
    )
    price = models.DecimalField(max_digits=12, decimal_places=2)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-recorded_at']
        verbose_name_plural = 'Price histories'

    def __str__(self):
        return f'{self.price} on {self.recorded_at.date()}'