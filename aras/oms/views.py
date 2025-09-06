from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy


# Create your views here.
@login_required(login_url="/")  # kök path'e gönder
def anasayfa(request):
    return render(request, 'oms/index.html')