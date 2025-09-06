from django.urls import path
# from . import views
# from .views.rapor import test1
from . import views

urlpatterns = [
    path("", views.anasayfa, name="index"),
]

