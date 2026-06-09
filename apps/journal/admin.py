from django.contrib import admin
from .models import BudgetCategory, Journal, JournalEntry

@admin.register(BudgetCategory)
class BudgetCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)

@admin.register(Journal)
class JournalAdmin(admin.ModelAdmin):
    list_display = ("date", "description", "created_at")
    list_filter = ("date",)
    search_fields = ("description",)

@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ("journal", "account", "debit", "credit", "description")
    list_filter = ("journal",)
    search_fields = ("account__name", "description")
