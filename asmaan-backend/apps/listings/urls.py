from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import ListingRequestViewSet
from .auth_views import me

router = DefaultRouter()
router.register(r'listings', ListingRequestViewSet, basename='listing-request')

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', me, name='auth_me'),
    path('', include(router.urls)),
]
