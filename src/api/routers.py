from rest_framework.routers import DefaultRouter
from api.views import TaskViewset, TableauViewset

router = DefaultRouter()

router.register('taskViewset', TaskViewset, basename='taskViewset')
router.register('tableauViewset', TableauViewset, basename='tableauViewset')

urlpatterns = router.urls