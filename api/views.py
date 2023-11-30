from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import TodoSerializer
from .mixins import OwnerMixin


class TodoAPIList(OwnerMixin,generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]




class TodoAPIDetail(OwnerMixin,generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]