from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase

from apps.properties.models import Property
from .models import ListingRequest
from .permissions import AGENT_GROUP_NAME

User = get_user_model()

VALID_PAYLOAD = {
    'property_type': 'buy',
    'area_sqft': '2250',
    'bedrooms': 3,
    'bathrooms': 2,
    'floor': '2nd',
    'furnishing': 'semi_furnished',
    'property_age': 5,
    'city': 'Lahore',
    'area_name': 'DHA Phase 5',
    'address': 'Street 12, Block D, DHA Phase 5',
    'landmark': 'Near park',
    'latitude': '31.4697',
    'longitude': '74.4142',
    'owner_name': 'Ahmed Khan',
    'cnic': '3520112345671',
    'document_type': 'registry',
    'asking_price': '25000000',
    'is_negotiable': True,
    'contact_name': 'Ahmed Khan',
    'email': 'ahmed@example.com',
    'phone': '03001234567',
    'whatsapp': '03001234567',
}


class ListingRequestCreateTests(APITestCase):
    def test_valid_submission_creates_listing_and_sends_email(self):
        response = self.client.post('/api/listings/', VALID_PAYLOAD, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ListingRequest.objects.count(), 1)
        listing = ListingRequest.objects.first()
        self.assertEqual(listing.status, 'pending')
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('ahmed@example.com', mail.outbox[0].to)

    def test_missing_required_field_rejected(self):
        payload = {**VALID_PAYLOAD}
        del payload['owner_name']
        response = self.client.post('/api/listings/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_set_status_or_assigned_agent_on_create(self):
        payload = {**VALID_PAYLOAD, 'status': 'live', 'assigned_agent': 1}
        response = self.client.post('/api/listings/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        listing = ListingRequest.objects.first()
        self.assertEqual(listing.status, 'pending')
        self.assertIsNone(listing.assigned_agent)


class TrackEndpointTests(APITestCase):
    def setUp(self):
        self.listing = ListingRequest.objects.create(**{**VALID_PAYLOAD, 'area_sqft': 2250})

    def test_track_by_valid_token(self):
        response = self.client.get(f'/api/listings/track/{self.listing.unique_token}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'pending')
        # PII must not leak through the public tracking endpoint
        self.assertNotIn('cnic', response.data)
        self.assertNotIn('phone', response.data)

    def test_track_by_invalid_token_404s(self):
        response = self.client.get('/api/listings/track/00000000-0000-0000-0000-000000000000/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_rejection_reason_only_shown_when_rejected(self):
        self.listing.admin_notes = 'Not a real reason yet'
        self.listing.save()
        response = self.client.get(f'/api/listings/track/{self.listing.unique_token}/')
        self.assertEqual(response.data['admin_notes'], '')

        self.listing.status = 'rejected'
        self.listing.save()
        response = self.client.get(f'/api/listings/track/{self.listing.unique_token}/')
        self.assertEqual(response.data['admin_notes'], 'Not a real reason yet')


class RoleScopingTests(APITestCase):
    def setUp(self):
        self.staff = User.objects.create_user('staffuser', password='pass12345', is_staff=True)
        agent_group = Group.objects.create(name=AGENT_GROUP_NAME)
        self.agent1 = User.objects.create_user('agent1', password='pass12345')
        self.agent1.groups.add(agent_group)
        self.agent2 = User.objects.create_user('agent2', password='pass12345')
        self.agent2.groups.add(agent_group)

        self.listing_for_agent1 = ListingRequest.objects.create(
            **{**VALID_PAYLOAD, 'area_sqft': 2250}, assigned_agent=self.agent1,
        )
        self.listing_for_agent2 = ListingRequest.objects.create(
            **{**VALID_PAYLOAD, 'area_sqft': 2250}, assigned_agent=self.agent2,
        )

    def test_agent_only_sees_own_assigned_listings(self):
        self.client.force_authenticate(self.agent1)
        response = self.client.get('/api/listings/')
        ids = [item['id'] for item in response.data['results']]
        self.assertIn(self.listing_for_agent1.id, ids)
        self.assertNotIn(self.listing_for_agent2.id, ids)

    def test_staff_sees_all_listings(self):
        self.client.force_authenticate(self.staff)
        response = self.client.get('/api/listings/')
        ids = [item['id'] for item in response.data['results']]
        self.assertIn(self.listing_for_agent1.id, ids)
        self.assertIn(self.listing_for_agent2.id, ids)

    def test_anonymous_blocked_from_admin_actions(self):
        response = self.client.post(f'/api/listings/{self.listing_for_agent1.id}/approve/')
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_non_staff_agent_blocked_from_approve(self):
        self.client.force_authenticate(self.agent1)
        response = self.client.post(f'/api/listings/{self.listing_for_agent1.id}/approve/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ApprovalWorkflowTests(APITestCase):
    def setUp(self):
        self.staff = User.objects.create_user('staffuser', password='pass12345', is_staff=True)
        self.listing = ListingRequest.objects.create(**{**VALID_PAYLOAD, 'area_sqft': 2250})
        self.client.force_authenticate(self.staff)

    def test_approve_creates_verified_property_and_sends_email(self):
        response = self.client.post(f'/api/listings/{self.listing.id}/approve/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.listing.refresh_from_db()
        self.assertEqual(self.listing.status, 'live')
        self.assertIsNotNone(self.listing.created_property)

        prop = self.listing.created_property
        self.assertTrue(prop.is_verified)
        self.assertEqual(prop.category, self.listing.property_type)
        self.assertEqual(prop.price, self.listing.asking_price)
        self.assertEqual(prop.price_history.count(), 1)
        self.assertEqual(len(mail.outbox), 1)

    def test_approve_is_idempotent(self):
        self.client.post(f'/api/listings/{self.listing.id}/approve/')
        first_property_id = Property.objects.first().id
        self.client.post(f'/api/listings/{self.listing.id}/approve/')
        self.assertEqual(Property.objects.count(), 1)
        self.assertEqual(Property.objects.first().id, first_property_id)

    def test_reject_requires_reason_and_blocks_property_creation(self):
        response = self.client.post(f'/api/listings/{self.listing.id}/reject/', {'admin_notes': ''})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(f'/api/listings/{self.listing.id}/reject/', {'admin_notes': 'Documents incomplete'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.listing.refresh_from_db()
        self.assertEqual(self.listing.status, 'rejected')
        self.assertIsNone(self.listing.created_property)
        self.assertEqual(Property.objects.count(), 0)

    def test_generic_patch_is_blocked(self):
        response = self.client.patch(f'/api/listings/{self.listing.id}/', {'status': 'live'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.listing.refresh_from_db()
        self.assertEqual(self.listing.status, 'pending')
