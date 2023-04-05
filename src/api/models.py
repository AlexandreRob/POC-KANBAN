from django.db import models

# Create your models here.

class Tableau(models.Model):
    id_tableau = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=200)
    position = models.IntegerField()
    
    class Meta:
        ordering = ['position']

    def __str__(self):
        return self.titre

class Task(models.Model):
    id_tache = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=200)
    position_col = models.IntegerField()
    tableau = models.ForeignKey(Tableau, on_delete=models.DO_NOTHING)
    class Meta:
        # permet d'assurer que la combinaison de kanban et position soit unique
        unique_together = ('tableau', 'position_col')
        
    def __str__(self):
        return self.titre
    