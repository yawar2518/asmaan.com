from django.contrib.gis.geos import Point
from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction

from apps.properties.models import Property, PropertyImage, PriceHistory


def create_property_from_listing_request(listing_request):
    """Auto-creates a live, verified Property from an approved ListingRequest.

    Idempotent: if this listing request already produced a Property
    (e.g. Approve clicked twice), the existing one is returned rather
    than creating a duplicate.
    """
    if listing_request.created_property_id:
        return listing_request.created_property

    with transaction.atomic():
        title = f'{listing_request.get_property_type_display()} in {listing_request.area_name or listing_request.city}'
        property_obj = Property.objects.create(
            title=title,
            category=listing_request.property_type,
            status='available',
            price=listing_request.asking_price,
            size=listing_request.size,
            area_sqft=listing_request.area_sqft,
            bedrooms=listing_request.bedrooms,
            bathrooms=listing_request.bathrooms,
            floor=listing_request.floor,
            furnishing=listing_request.furnishing,
            property_age=listing_request.property_age,
            area=listing_request.area_name or listing_request.landmark or listing_request.city,
            city=listing_request.city,
            address=listing_request.address,
            location=Point(float(listing_request.longitude), float(listing_request.latitude)),
            contact_name=listing_request.contact_display_name,
            contact_phone=listing_request.whatsapp or listing_request.phone,
            is_verified=True,
            description=(
                f'Verified by an Asmaan.com field agent.\n\n{listing_request.visit_notes}'.strip()
            ),
        )

        PriceHistory.objects.create(property=property_obj, price=listing_request.asking_price)

        for photo in listing_request.photos.all():
            PropertyImage.objects.create(
                property=property_obj,
                image_url=_absolute_media_url(photo.image.url),
                is_primary=not property_obj.images.exists(),
            )

        listing_request.created_property = property_obj
        listing_request.status = 'live'
        listing_request.save(update_fields=['created_property', 'status', 'updated_at'])

    return property_obj


def send_submission_confirmation_email(listing_request):
    send_mail(
        subject='Asmaan.com — Listing request received',
        message=(
            f'Hi {listing_request.contact_display_name},\n\n'
            f'We received your listing request for your {listing_request.get_property_type_display().lower()} '
            f'in {listing_request.area_name or listing_request.city}.\n\n'
            f'Track its status anytime at: {getattr(settings, "FRONTEND_URL", "")}/track/{listing_request.unique_token}\n\n'
            f'An Asmaan agent will visit and verify the property soon.\n\n'
            f'— Asmaan.com'
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=_recipient_list(listing_request),
        fail_silently=True,
    )


def send_listing_live_email(listing_request):
    send_mail(
        subject='Asmaan.com — Your listing is now live!',
        message=(
            f'Hi {listing_request.contact_display_name},\n\n'
            f'Great news — your property has been verified and is now live on Asmaan.com '
            f'with a Verified badge.\n\n'
            f'Track it at: {getattr(settings, "FRONTEND_URL", "")}/track/{listing_request.unique_token}\n\n'
            f'— Asmaan.com'
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=_recipient_list(listing_request),
        fail_silently=True,
    )


def send_listing_rejected_email(listing_request):
    send_mail(
        subject='Asmaan.com — Update on your listing request',
        message=(
            f'Hi {listing_request.contact_display_name},\n\n'
            f"Unfortunately we're unable to list your property at this time.\n\n"
            f'Reason: {listing_request.admin_notes}\n\n'
            f'— Asmaan.com'
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=_recipient_list(listing_request),
        fail_silently=True,
    )


def _recipient_list(listing_request):
    return [listing_request.email]


def _absolute_media_url(url):
    # Cloudinary URLs are already absolute (https://res.cloudinary.com/...);
    # local FileSystemStorage URLs are relative (/media/...) and need the
    # backend origin prefixed so the frontend (a different port) can load them.
    if url.startswith('http://') or url.startswith('https://'):
        return url
    return f'{settings.BACKEND_BASE_URL}{url}'
