import json
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
from .forms import PromptJournalForm
from .models import Account, BudgetCategory
from .utils import parse_prompt

@csrf_exempt
def prompt_journal(request):
    if request.method == 'GET':
        # For a React frontend we just return success, the form is built on client side
        return JsonResponse({'status': 'ok'})
    elif request.method == 'POST':
        form = PromptJournalForm(request.POST, request.FILES)
        if not form.is_valid():
            return HttpResponseBadRequest(json.dumps({'error': 'Form tidak valid'}), content_type='application/json')
        data = form.cleaned_data
        try:
            parsed = parse_prompt(data['prompt_text'])
        except ValueError as e:
            return HttpResponseBadRequest(json.dumps({'error': str(e)}), content_type='application/json')
        # Resolve accounts
        src = Account.objects.filter(name__iexact=parsed['source_name']).first()
        dst_objs = [Account.objects.filter(name__iexact=n).first() for n in parsed['dest_names']]
        if not src or any(d is None for d in dst_objs):
            return HttpResponseNotFound(json.dumps({'error': 'Salah satu akun tidak ditemukan'}), content_type='application/json')
        # Build preview entries
        entries = []
        # Credit entry for source
        entries.append({
            'date': data['date'].isoformat(),
            'account': src.name,
            'type': 'credit',
            'amount': str(parsed['amount']),
            'description': f"{parsed['donor']} menymbang {parsed['amount']}"
        })
        # Debit entries for each destination
        for dst in dst_objs:
            entries.append({
                'date': data['date'].isoformat(),
                'account': dst.name,
                'type': 'debit',
                'amount': str(parsed['amount']),
                'description': f"{parsed['donor']} menymbang {parsed['amount']}"
            })
        # Cache preview for 10 minutes, per session key
        cache_key = f"journal_preview_{request.session.session_key}_{data['date']}"
        cache.set(cache_key, entries, timeout=600)
        response = {
            'date': data['date'].isoformat(),
            'budget_type': data['budget_type'].name,
            'entries': entries
        }
        return JsonResponse(response)
    else:
        return HttpResponseBadRequest(json.dumps({'error': 'Method not allowed'}), content_type='application/json')
