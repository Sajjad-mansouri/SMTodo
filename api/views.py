from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import TodoSerializer
from django.db.models import Q

from todo.models import Day,Todo
from datetime import datetime,timezone

class TodoAPIList(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            str_datetime=self.kwargs.get('date')
            # Define the format string
            if str_datetime:
                format_str = "%Y-%m-%dT%H:%M:%S.%fZ"

                parsed_datetime=datetime.strptime(str_datetime,format_str)

                # Convert to Python datetime object
                python_datetime = parsed_datetime.astimezone(timezone.utc)

                date=Day.objects.get(date=python_datetime.date())
                queryset=Todo.objects.filter(Q(date=date)& Q(user=self.request.user))
            else:
                queryset=Todo.objects.filter(user=self.request.user)

        except Exception as e:
            print(e)
            queryset= None
        return queryset
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)





class TodoAPIDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)