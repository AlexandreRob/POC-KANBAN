from rest_framework import serializers
from .models import Task, Tableau

class TaskSerializer(serializers.ModelSerializer):
    class Meta :
        model = Task
        fields = '__all__'

class TableauSerializer(serializers.ModelSerializer):
    class Meta :
        model = Tableau
        fields = '__all__'