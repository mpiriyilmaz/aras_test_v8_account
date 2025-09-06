"""
Bu dosya: account/urls.py
--------------------------------
Login sayfası için URL eşlemesi.
"""

from django.urls import path
from .views import login_request

urlpatterns = [
    path("", login_request, name="login"),  # örn. / (root) login’e gitsin
]
