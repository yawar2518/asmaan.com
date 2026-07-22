from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand

from apps.listings.permissions import AGENT_GROUP_NAME

User = get_user_model()


class Command(BaseCommand):
    """DEV/DEMO ONLY — creates a superuser and a field-agent account with
    well-known credentials so the seller -> agent -> admin workflow can be
    demoed immediately. Never run this against a real production database.
    """

    help = 'Seed demo admin/agent accounts (admin/admin123, agent/agent123) for local demoing.'

    def handle(self, *args, **options):
        agent_group, _ = Group.objects.get_or_create(name=AGENT_GROUP_NAME)

        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@asmaan.com', 'is_staff': True, 'is_superuser': True},
        )
        admin_user.set_password('admin123')
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        self.stdout.write(self.style.SUCCESS(
            f"{'Created' if created else 'Updated'} admin user: admin / admin123"
        ))

        agent_user, created = User.objects.get_or_create(
            username='agent',
            defaults={'email': 'agent@asmaan.com', 'first_name': 'Field', 'last_name': 'Agent'},
        )
        agent_user.set_password('agent123')
        agent_user.save()
        agent_user.groups.add(agent_group)
        self.stdout.write(self.style.SUCCESS(
            f"{'Created' if created else 'Updated'} agent user: agent / agent123"
        ))
