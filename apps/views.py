from decimal import Decimal

from django.contrib import messages
from django.db import transaction
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.views import View
from django.views.generic import ListView,CreateView,UpdateView,DeleteView

# kategori akun
class AccountCategoryList(ListView):
    model = AccountCategory
    template_name = "account/list.html"
    context_object_name = "categories"

class AccountCategoryCreate(CreateView):
    model = AccountCategory
    template_name = "account/form.html"
    fields = ["name", "description"]
    success_url = reverse_lazy("account_category_list")

class AccountCategoryUpdate(UpdateView):
    model = AccountCategory
    template_name = "account/form.html"
    fields = ["name", "description"]
    success_url = reverse_lazy("account_category_list")

# akun akuntansi

class AccountList(ListView):
    model = Account
    template_name = "account/list.html"
    context_object_name = "accounts"

class AccountCreate(CreateView):
    model = Account
    template_name = "account/form.html"
    fields = ["code", "name", "category", "description", "is_cash_bank", "is_restricted", "is_active"]
    success_url = reverse_lazy("account_list")

class AccountUpdate(UpdateView):
    model = Account
    template_name = "account/form.html"
    fields = ["code", "name", "category", "description", "is_cash_bank", "is_restricted", "is_active"]
    success_url = reverse_lazy("account_list")



