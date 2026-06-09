from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q

# name forms,views,urls = account

#kategori akun
class AccountCategory(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
#akun akuntansi
class Account(models.Model):
    code = models.CharField(max_length=20)
    name = models.CharField(max_length=255)
    category = models.ForeignKey(
        AccountCategory,
        on_delete=models.PROTECT,
        related_name="accounts",
        null=True,
        blank=True,
    )
    description = models.TextField(blank=True, null=True)
    is_cash_bank = models.BooleanField(default=False)
    is_restricted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=["code"], name="account_code_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.code} - {self.name}"
    
    def clean(self):
        if self.is_restricted and not self.category:
            raise ValidationError("Restricted accounts must have a category.")
    
    def save(self, *args, **kwargs):
        self.full_clean()  # Ensure clean() is called before saving
        super().save(*args, **kwargs)   
    
class Period(models.Model):
    name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)
    is_closed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_date"]

    def __str__(self):
        return self.name

class Journal(models.Model):
    period = models.ForeignKey(Period, on_delete=models.PROTECT, related_name="journals")
    code = models.CharField(max_length=20, unique=True)
    date = models.DateField()
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[("draft", "Draft"), ("posted", "Posted")],
        default="draft",
    )
    user = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    published = models.BooleanField(default=False)

    class Meta:
        db_table = "journal"
        ordering = ["date"]

    def __str__(self):
        return self.name

class JournalDetail(models.Model):
    journal = models.ForeignKey(Journal, on_delete=models.CASCADE, related_name="details")
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    debit = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "journal_details"
        ordering = ["journal_id", "id"]

    def clean(self):
        has_debit = self.debit and self.debit > 0
        has_credit = self.credit and self.credit > 0

        if has_debit and has_credit:
            raise ValidationError("Journal detail cannot contain debit and credit at the same time.")
        if not has_debit and not has_credit:
            raise ValidationError("Journal detail must contain either debit or credit.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
