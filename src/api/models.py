from django.db import models

# Create your models here.

class Tableau(models.Model):
    id_tableau = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=200)
    position_col = models.IntegerField(unique=True)

    def __str__(self):
        return self.titre

class Task(models.Model):
    id_tache = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=200)
    position_col = models.IntegerField(unique=True)
    tableau = models.ForeignKey(Tableau, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.titre