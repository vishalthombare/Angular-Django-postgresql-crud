from django.shortcuts import render
from rest_framework import viewsets
from myapp.models import *
from myapp.serializers import *

class CustomerView(viewsets.ModelViewSet):
    queryset = tbl_customer_details.objects.filter(is_deleted='N').order_by('-id')
    serializer_class = CustomerModelSerializer

    def delete(self):
        self.queryset = tbl_customer_details.objects.filter(self=self).update(is_deleted='Y')
