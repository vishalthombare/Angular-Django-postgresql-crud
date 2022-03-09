from rest_framework import serializers
from myapp.models import *

class CustomerModelSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required = False)
    class Meta:
        model = tbl_customer_details
        fields  = ('__all__')