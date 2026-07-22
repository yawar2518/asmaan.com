from rest_framework.permissions import BasePermission

AGENT_GROUP_NAME = 'Field Agents'


def is_field_agent(user):
    return user.is_authenticated and user.groups.filter(name=AGENT_GROUP_NAME).exists()


class IsStaffUser(BasePermission):
    """Admin-only actions (approve, reject, assign, bulk actions)."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class IsAssignedAgentOrStaff(BasePermission):
    """Agent actions on a listing request — restricted to the assigned agent, or staff."""

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_staff:
            return True
        return is_field_agent(user) and obj.assigned_agent_id == user.id
