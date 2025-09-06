from django.test import TestCase
from django.contrib.auth import get_user_model

class SmokeTest(TestCase):
    def test_user_create_with_il(self):
        User = get_user_model()
        u = User.objects.create_user(username="u1", email="u1@example.com", password="x", il="AĞRI")
        self.assertEqual(u.il, "AĞRI")
