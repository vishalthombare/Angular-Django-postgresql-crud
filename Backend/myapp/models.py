from django.db import models

# Create your models here.
class tbl_customer_details(models.Model):
    customer_name = models.CharField(max_length=20, verbose_name='Customer Name')
    customer_address = models.CharField(max_length=20, verbose_name='Customer Address')
    customer_phone = models.CharField(max_length=10, verbose_name='Customer Phone')
    is_deleted = models.CharField(max_length=1, default="N", verbose_name="Is Deleted")

    def delete(self):
        self.is_deleted = 'Y'
        self.save()