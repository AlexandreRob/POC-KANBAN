from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.conf import settings

# Create your views here.

def home(request):
    context = {
        'api_url' : settings.API_URL
    }
    return render(request, "home.html",context)