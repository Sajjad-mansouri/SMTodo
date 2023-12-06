from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import TodoSerializer,UserSerializer
from django.db.models import Q
from django.contrib.auth import get_user_model
from rest_framework.parsers import FormParser,MultiPartParser,FileUploadParser
from rest_framework.response import Response
from todo.models import Day,Todo
from datetime import datetime,timezone
from account.models import UserInfo
from .serializers import UserInfoSerializer

UserModel=get_user_model()
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
        print('perform_create todoview')
        serializer.save(user=self.request.user)


class TodoAPIDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)


class UserAPIView(generics.RetrieveUpdateAPIView):
    serializer_class=UserSerializer
    permission_classes=[IsAuthenticated]
    parser_classes = [FormParser,MultiPartParser]

    def get_queryset(self):
        return UserModel.objects.filter(username=self.request.user.username)



