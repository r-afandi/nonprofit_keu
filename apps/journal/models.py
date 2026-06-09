from decimal import Decimal

from django.db import models

class BudgetCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Budget Category"
        verbose_name_plural = "Budget Categories"

    def __str__(self):
        return self.name


# Journal model representing a financial journal entry batch
class Journal(models.Model):
    date = models.DateField()
    description = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        verbose_name = "Journal"
        verbose_name_plural = "Journals"

    def __str__(self):
        return f"Journal {self.id} - {self.date}"

# Individual line items within a journal
class JournalEntry(models.Model):
    journal = models.ForeignKey(
        Journal,
        related_name="entries",
        on_delete=models.CASCADE,
    )
    # Assuming the Account model is defined in apps/models.py
    account = models.ForeignKey(
        "apps.Account",
        on_delete=models.PROTECT,
        related_name="journal_entries",
    )
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    description = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ["journal", "account"]
        verbose_name = "Journal Entry"
        verbose_name_plural = "Journal Entries"
        indexes = [
            models.Index(fields=["journal", "account"], name="journal_entry_idx"),
        ]

    def __str__(self):
        return f"{self.account.code} - {self.debit}/{self.credit}"
