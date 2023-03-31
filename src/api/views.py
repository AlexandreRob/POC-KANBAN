from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import TaskSerializer, TableauSerializer
from .models import Task, Tableau
from rest_framework import viewsets

# Create your views here.

class TaskViewset(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TableauViewset(viewsets.ModelViewSet):
    queryset = Tableau.objects.all()
    serializer_class = TableauSerializer

@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'Liste des tache' : 'task-list/',
        'Liste des tableau' : 'tableau-list/',
        'Detail tache' : 'task-detail/<str:pk>/',
        'Detail tableau' : 'tableau-detail/<str:pk>/',
        'Create task': 'task-create/',
        'Create tableau': 'tableau-create/',
        'Update task': 'task-uptdate/<str:pk>/',
        'Update tableau': 'tableau-update/<str:pk>/',
        'Delete': 'task-delete/<str:pk>/'
        }
    
    return Response(api_urls)

@api_view(['GET'])
def taskList(request):
    task = Task.objects.all()
    serializer = TaskSerializer(task, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def tableauList(request):
    tableau = Tableau.objects.all()
    serializer = TableauSerializer(tableau, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def taskDetail(request, pk):
    tasks = Task.objects.get(id_tache=pk)
    serializer = TaskSerializer(tasks, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def tableauDetail(request, pk):
    tableau = Tableau.objects.get(id_tableau=pk)
    serializer = TableauSerializer(tableau, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def taskCreate(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def tableauCreate(request):
    serializer = TableauSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def taskUpdate(request, pk):
    task = Task.objects.get(id_tache=pk)
    serializer = TaskSerializer(instance=task,data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['POST'])
def tableauUpdate(request, pk):
    task = Tableau.objects.get(id_tableau=pk)
    serializer = TableauSerializer(instance=task,data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['DELETE'])
def taskDeletee(request, pk):
    task = Task.objects.get(id_tache=pk)
    task.delete()
    return Response('Delete fait')