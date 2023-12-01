from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import TodoSerializer
from .mixins import OwnerMixin
from todo.models import Day
from datetime import datetime,timezone

class TodoAPIList(OwnerMixin,generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        str_datetime=self.kwargs.get('date')
        # Define the format string
        format_str = "%Y-%m-%dT%H:%M:%S.%fZ"

        parsed_datetime=datetime.strptime(str_datetime,format_str)

        # Convert to Python datetime object
        python_datetime = parsed_datetime.astimezone(timezone.utc)

        try:
            day=Day.objects.get(date=python_datetime.date())
            queryset=day.todo_set.all()

        except Exception as e:
            
            queryset= None
        return queryset





class TodoAPIDetail(OwnerMixin,generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]