from django import forms
from .models import BudgetCategory

class PromptJournalForm(forms.Form):
    date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    prompt_text = forms.CharField(widget=forms.Textarea(attrs={'rows': 3, 'placeholder': 'contoh: pak bambang menymbang 100.000 at Sumbangan online ke at kas umum'}))
    budget_type = forms.ModelChoiceField(queryset=BudgetCategory.objects.all())
    attachment = forms.FileField(required=False)
