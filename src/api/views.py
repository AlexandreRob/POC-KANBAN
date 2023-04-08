from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import TaskSerializer, TableauSerializer
from .models import Task, Tableau
from rest_framework import viewsets

# Create your views here.

class TableauViewset(viewsets.ModelViewSet):
    serializer_class = TableauSerializer

    def get_queryset(self):
        return Tableau.objects.all().order_by('position')
    
class TaskViewset(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        board_id = self.request.query_params.get('tableau', None)
        if board_id is not None:
            return Task.objects.filter(id_tache=board_id)

        return Task.objects.all()

