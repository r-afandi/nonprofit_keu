import json
from decimal import Decimal, InvalidOperation

from django.core.exceptions import ValidationError
from django.db import transaction
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Account, AccountCategory, Journal, JournalDetail, Period
from .services.pemasukan_preview import build_pemasukan_preview
from .services.pengeluaran_preview import build_pengeluaran_preview


def parse_body(request):
    if not request.body:
        return {}
    return json.loads(request.body.decode("utf-8"))


def error_response(message, status=400):
    return JsonResponse({"error": message}, status=status)


def parse_decimal(value, field_name):
    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        raise ValidationError({field_name: f"{field_name} must be a valid number."})


def serialize_category(category):
    return {
        "id": str(category.id),
        "nama": category.name,
        "deskripsi": category.description or "",
    }


def serialize_account(account):
    return {
        "id": str(account.id),
        "kode": account.code,
        "nama": account.name,
        "deskripsi": account.description or "",
        "kategoriId": str(account.category_id) if account.category_id else "",
        "kategoriNama": account.category.name if account.category_id else "",
        "isKasBank": account.is_cash_bank,
        "isRestrict": account.is_restricted,
        "isActive": account.is_active,
    }


def serialize_period(period):
    return {
        "id": str(period.id),
        "nama": period.name,
        "mulai": period.start_date.isoformat(),
        "akhir": period.end_date.isoformat(),
        "isActive": period.is_active,
        "isClosed": period.is_closed,
    }


def serialize_journal_detail(detail):
    return {
        "id": str(detail.id),
        "accountId": str(detail.account_id),
        "accountName": detail.account.name,
        "debit": str(detail.debit),
        "credit": str(detail.credit),
    }


def serialize_journal(journal):
    return {
        "id": str(journal.id),
        "periodId": str(journal.period_id),
        "periodName": journal.period.name,
        "code": journal.code,
        "date": journal.date.isoformat(),
        "name": journal.name,
        "description": journal.description or "",
        "status": journal.status,
        "user": journal.user,
        "published": journal.published,
        "details": [serialize_journal_detail(detail) for detail in journal.details.select_related("account").all()],
    }


@method_decorator(csrf_exempt, name="dispatch")
class AccountCategoryListCreateApi(View):
    def get(self, request):
        categories = AccountCategory.objects.order_by("name")
        return JsonResponse([serialize_category(category) for category in categories], safe=False)

    def post(self, request):
        try:
            payload = parse_body(request)
            category = AccountCategory.objects.create(
                name=payload["nama"].strip(),
                description=payload.get("deskripsi", "").strip(),
            )
            return JsonResponse(serialize_category(category), status=201)
        except KeyError:
            return error_response("Field 'nama' is required.")
        except ValidationError as exc:
            return JsonResponse({"errors": exc.message_dict}, status=400)


@method_decorator(csrf_exempt, name="dispatch")
class AccountCategoryDetailApi(View):
    def get_object(self, pk):
        return AccountCategory.objects.filter(pk=pk).first()

    def get(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return error_response("Category not found.", status=404)
        return JsonResponse(serialize_category(category))

    def put(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return error_response("Category not found.", status=404)

        try:
            payload = parse_body(request)
            category.name = payload["nama"].strip()
            category.description = payload.get("deskripsi", "").strip()
            category.full_clean()
            category.save()
            return JsonResponse(serialize_category(category))
        except KeyError:
            return error_response("Field 'nama' is required.")
        except ValidationError as exc:
            return JsonResponse({"errors": exc.message_dict}, status=400)

    def delete(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return error_response("Category not found.", status=404)
        category.delete()
        return JsonResponse({}, status=204)


@method_decorator(csrf_exempt, name="dispatch")
class AccountListCreateApi(View):
    def get(self, request):
        accounts = Account.objects.select_related("category").order_by("code")
        return JsonResponse([serialize_account(account) for account in accounts], safe=False)

    def post(self, request):
        try:
            payload = parse_body(request)
            category = None
            if payload.get("kategoriId"):
                category = AccountCategory.objects.get(pk=payload["kategoriId"])

            account = Account.objects.create(
                code=payload["kode"].strip(),
                name=payload["nama"].strip(),
                category=category,
                description=payload.get("deskripsi", "").strip(),
                is_cash_bank=bool(payload.get("isKasBank", False)),
                is_restricted=bool(payload.get("isRestrict", False)),
                is_active=bool(payload.get("isActive", True)),
            )
            return JsonResponse(serialize_account(account), status=201)
        except KeyError as exc:
            return error_response(f"Field '{exc.args[0]}' is required.")
        except AccountCategory.DoesNotExist:
            return error_response("Selected category was not found.", status=404)
        except ValidationError as exc:
            return JsonResponse({"errors": exc.message_dict}, status=400)


@method_decorator(csrf_exempt, name="dispatch")
class AccountDetailApi(View):
    def get_object(self, pk):
        return Account.objects.select_related("category").filter(pk=pk).first()

    def get(self, request, pk):
        account = self.get_object(pk)
        if not account:
            return error_response("Account not found.", status=404)
        return JsonResponse(serialize_account(account))

    def put(self, request, pk):
        account = self.get_object(pk)
        if not account:
            return error_response("Account not found.", status=404)

        try:
            payload = parse_body(request)
            category = None
            if payload.get("kategoriId"):
                category = AccountCategory.objects.get(pk=payload["kategoriId"])

            account.code = payload["kode"].strip()
            account.name = payload["nama"].strip()
            account.category = category
            account.description = payload.get("deskripsi", "").strip()
            account.is_cash_bank = bool(payload.get("isKasBank", False))
            account.is_restricted = bool(payload.get("isRestrict", False))
            account.is_active = bool(payload.get("isActive", True))
            account.save()
            return JsonResponse(serialize_account(account))
        except KeyError as exc:
            return error_response(f"Field '{exc.args[0]}' is required.")
        except AccountCategory.DoesNotExist:
            return error_response("Selected category was not found.", status=404)
        except ValidationError as exc:
            return JsonResponse({"errors": exc.message_dict}, status=400)

    def delete(self, request, pk):
        account = self.get_object(pk)
        if not account:
            return error_response("Account not found.", status=404)
        account.delete()
        return JsonResponse({}, status=204)


@method_decorator(csrf_exempt, name="dispatch")
class PeriodListCreateApi(View):
    def get(self, request):
        periods = Period.objects.order_by("start_date")
        return JsonResponse([serialize_period(period) for period in periods], safe=False)

    def post(self, request):
        try:
            payload = parse_body(request)
            period = Period.objects.create(
                name=payload["nama"].strip(),
                start_date=payload["mulai"],
                end_date=payload["akhir"],
                is_active=bool(payload.get("isActive", False)),
                is_closed=bool(payload.get("isClosed", False)),
            )
            return JsonResponse(serialize_period(period), status=201)
        except KeyError as exc:
            return error_response(f"Field '{exc.args[0]}' is required.")
        except ValidationError as exc:
            return JsonResponse({"errors": exc.message_dict}, status=400)


@method_decorator(csrf_exempt, name="dispatch")
class PeriodDetailApi(View):
    def get_object(self, pk):
        return Period.objects.filter(pk=pk).first()

    def get(self, request, pk):
        period = self.get_object(pk)
        if not period:
            return error_response("Period not found.", status=404)
        return JsonResponse(serialize_period(period))

    def put(self, request, pk):
        period = self.get_object(pk)
        if not period:
            return error_response("Period not found.", status=404)

        try:
            payload = parse_body(request)
            period.name = payload["nama"].strip()
            period.start_date = payload["mulai"]
            period.end_date = payload["akhir"]
            period.is_active = bool(payload.get("isActive", False))
            period.is_closed = bool(payload.get("isClosed", False))
            period.full_clean()
            period.save()
            return JsonResponse(serialize_period(period))
        except KeyError as exc:
            return error_response(f"Field '{exc.args[0]}' is required.")
        except ValidationError as exc:
            return JsonResponse({"errors": exc.message_dict}, status=400)

    def delete(self, request, pk):
        period = self.get_object(pk)
        if not period:
            return error_response("Period not found.", status=404)
        period.delete()
        return JsonResponse({}, status=204)


def validate_journal_details(details):
    if not details:
        raise ValidationError({"details": ["At least one journal detail is required."]})

    total_debit = Decimal("0")
    total_credit = Decimal("0")

    for detail in details:
        debit = parse_decimal(detail.get("debit", 0), "debit")
        credit = parse_decimal(detail.get("credit", 0), "credit")
        if debit > 0 and credit > 0:
            raise ValidationError({"details": ["A journal detail cannot have debit and credit at the same time."]})
        if debit <= 0 and credit <= 0:
            raise ValidationError({"details": ["Each journal detail must contain either debit or credit."]})
        total_debit += debit
        total_credit += credit

    if total_debit != total_credit:
        raise ValidationError({"details": ["Total debit and credit must be balanced."]})


def save_journal_details(journal, details):
    journal.details.all().delete()
    for detail in details:
        account = Account.objects.get(pk=detail["accountId"])
        JournalDetail.objects.create(
            journal=journal,
            account=account,
            debit=parse_decimal(detail.get("debit", 0), "debit"),
            credit=parse_decimal(detail.get("credit", 0), "credit"),
        )


@method_decorator(csrf_exempt, name="dispatch")
class JournalListCreateApi(View):
    def get(self, request):
        journals = Journal.objects.select_related("period").prefetch_related("details__account").order_by("-date", "-id")
        return JsonResponse([serialize_journal(journal) for journal in journals], safe=False)

    @transaction.atomic
    def post(self, request):
        try:
            payload = parse_body(request)
            details = payload.get("details", [])
            validate_journal_details(details)
            period = Period.objects.get(pk=payload["periodId"])
            journal = Journal.objects.create(
                period=period,
                code=payload["code"].strip(),
                date=payload["date"],
                name=payload["name"].strip(),
                description=payload.get("description", "").strip(),
                status=payload.get("status", "draft"),
                user=payload.get("user", "").strip(),
                published=bool(payload.get("published", payload.get("status") == "posted")),
            )
            save_journal_details(journal, details)
            journal.refresh_from_db()
            return JsonResponse(serialize_journal(journal), status=201)
        except KeyError as exc:
            return error_response(f"Field '{exc.args[0]}' is required.")
        except Period.DoesNotExist:
            return error_response("Selected period was not found.", status=404)
        except Account.DoesNotExist:
            return error_response("Selected account was not found.", status=404)
        except ValidationError as exc:
            if hasattr(exc, "message_dict"):
                return JsonResponse({"errors": exc.message_dict}, status=400)
            return JsonResponse({"errors": exc.messages}, status=400)


@method_decorator(csrf_exempt, name="dispatch")
class JournalDetailApi(View):
    def get_object(self, pk):
        return Journal.objects.select_related("period").prefetch_related("details__account").filter(pk=pk).first()

    def get(self, request, pk):
        journal = self.get_object(pk)
        if not journal:
            return error_response("Journal not found.", status=404)
        return JsonResponse(serialize_journal(journal))

    @transaction.atomic
    def put(self, request, pk):
        journal = self.get_object(pk)
        if not journal:
            return error_response("Journal not found.", status=404)

        try:
            payload = parse_body(request)
            details = payload.get("details", [])
            validate_journal_details(details)
            period = Period.objects.get(pk=payload["periodId"])

            journal.period = period
            journal.code = payload["code"].strip()
            journal.date = payload["date"]
            journal.name = payload["name"].strip()
            journal.description = payload.get("description", "").strip()
            journal.status = payload.get("status", journal.status)
            journal.user = payload.get("user", "").strip()
            journal.published = bool(payload.get("published", journal.status == "posted"))
            journal.full_clean()
            journal.save()

            save_journal_details(journal, details)
            journal.refresh_from_db()
            return JsonResponse(serialize_journal(journal))
        except KeyError as exc:
            return error_response(f"Field '{exc.args[0]}' is required.")
        except Period.DoesNotExist:
            return error_response("Selected period was not found.", status=404)
        except Account.DoesNotExist:
            return error_response("Selected account was not found.", status=404)
        except ValidationError as exc:
            if hasattr(exc, "message_dict"):
                return JsonResponse({"errors": exc.message_dict}, status=400)
            return JsonResponse({"errors": exc.messages}, status=400)

    def delete(self, request, pk):
        journal = self.get_object(pk)
        if not journal:
            return error_response("Journal not found.", status=404)
        journal.delete()
        return JsonResponse({}, status=204)


@method_decorator(csrf_exempt, name="dispatch")
class PemasukanPreviewApi(View):
    def post(self, request):
        try:
            payload = parse_body(request)
            preview = build_pemasukan_preview(
                date=payload["date"],
                prompt=payload["prompt"],
                budget_type=payload.get("budgetType", "Operasional"),
                explicit_amount=payload.get("explicitAmount"),
                proof_file_name=payload.get("proofFileName", ""),
            )
            return JsonResponse(preview)
        except KeyError as exc:
            return error_response(f"Field '{exc.args[0]}' is required.")
        except ValidationError as exc:
            return JsonResponse({"error": exc.messages[0] if exc.messages else "Preview failed."}, status=400)


@method_decorator(csrf_exempt, name="dispatch")
class PengeluaranPreviewApi(View):
    def post(self, request):
        try:
            payload = parse_body(request)
            available_accounts = list(
                Account.objects.filter(is_active=True).values_list("name", flat=True),
            )
            preview = build_pengeluaran_preview(
                date=payload["date"],
                prompt=payload["prompt"],
                budget_type=payload.get("budgetType", "Operasional"),
                explicit_amount=payload.get("explicitAmount"),
                proof_file_name=payload.get("proofFileName", ""),
                available_accounts=available_accounts,
            )
            return JsonResponse(preview)
        except KeyError as exc:
            return error_response(f"Field '{exc.args[0]}' is required.")
        except ValueError as exc:
            return JsonResponse({"error": str(exc)}, status=400)
        except ValidationError as exc:
            return JsonResponse({"error": exc.messages[0] if exc.messages else "Preview failed."}, status=400)
