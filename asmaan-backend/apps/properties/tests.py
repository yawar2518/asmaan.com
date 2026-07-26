from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Property

User = get_user_model()


def make_property(**overrides):
    defaults = dict(
        title='Test House',
        category='buy',
        status='available',
        price=10_000_000,
        size=5,
        area_sqft=1125,
        bedrooms=3,
        city='Lahore',
        area='DHA Phase 5',
        address='Street 1',
        location=Point(74.35, 31.52),
    )
    defaults.update(overrides)
    return Property.objects.create(**defaults)


class PropertyFilterTests(APITestCase):
    def setUp(self):
        make_property(title='Cheap Lahore House', price=5_000_000, bedrooms=2, city='Lahore')
        make_property(title='Expensive Lahore House', price=50_000_000, bedrooms=5, city='Lahore')
        make_property(title='Karachi House', price=15_000_000, bedrooms=3, city='Karachi')
        make_property(title='Sold House', price=15_000_000, bedrooms=3, city='Lahore', status='sold')

    def test_only_available_properties_returned_by_default(self):
        response = self.client.get('/api/properties/')
        titles = [p['title'] for p in response.data['results']]
        self.assertNotIn('Sold House', titles)

    def test_filter_by_city(self):
        response = self.client.get('/api/properties/', {'city': 'Karachi'})
        titles = [p['title'] for p in response.data['results']]
        self.assertEqual(titles, ['Karachi House'])

    def test_filter_by_bedrooms(self):
        response = self.client.get('/api/properties/', {'bedrooms': 3})
        titles = {p['title'] for p in response.data['results']}
        self.assertEqual(titles, {'Karachi House', 'Expensive Lahore House'})

    def test_filter_by_price_range(self):
        response = self.client.get('/api/properties/', {'min_price': 10_000_000, 'max_price': 20_000_000})
        titles = [p['title'] for p in response.data['results']]
        self.assertEqual(titles, ['Karachi House'])


class PropertyWritePermissionTests(APITestCase):
    def setUp(self):
        self.property = make_property()
        self.staff = User.objects.create_user('staffuser', password='pass12345', is_staff=True)
        self.regular = User.objects.create_user('regular', password='pass12345')

    def test_anonymous_cannot_update_status(self):
        response = self.client.patch(f'/api/properties/{self.property.id}/', {'status': 'sold'}, format='json')
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_non_staff_cannot_update_status(self):
        self.client.force_authenticate(self.regular)
        response = self.client.patch(f'/api/properties/{self.property.id}/', {'status': 'sold'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_update_status(self):
        self.client.force_authenticate(self.staff)
        response = self.client.patch(f'/api/properties/{self.property.id}/', {'status': 'sold'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.property.refresh_from_db()
        self.assertEqual(self.property.status, 'sold')
