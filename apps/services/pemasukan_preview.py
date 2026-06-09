import re

from django.core.exceptions import ValidationError

from apps.models import Account


ACTION_WORDS = [
    "menyumbang",
    "menyumbangkan",
    "memberi",
    "memberikan",
    "transfer",
    "membayar",
    "bayar",
    "donasi",
    "sumbang",
    "setor",
    "menyetor",
]


def title_case(value):
    return " ".join(word[:1].upper() + word[1:].lower() for word in value.split() if word)


def normalize_spaces(value):
    return re.sub(r"\s+", " ", value).strip()


def parse_amount(prompt, explicit_amount=None):
    if isinstance(explicit_amount, (int, float)) and explicit_amount > 0:
        return int(explicit_amount)

    amount_match = re.search(r"(\d[\d.,]*)", prompt)
    if not amount_match:
        return 0

    normalized = re.sub(r"[.,](?=\d{3}\b)", "", amount_match.group(1)).replace(",", ".")
    try:
        return int(float(normalized))
    except ValueError:
        return 0


def extract_mentions(prompt):
    mentions = []
    separators = [",", ";", ".", "!", "?", "\n"]

    for index, char in enumerate(prompt):
        if char != "@":
            continue

        end = len(prompt)
        for separator in separators:
            separator_index = prompt.find(separator, index + 1)
            if separator_index != -1 and separator_index < end:
                end = separator_index

        next_at = prompt.find("@", index + 1)
        if next_at != -1 and next_at < end:
            end = next_at

        raw_mention = normalize_spaces(prompt[index + 1 : end])
        if raw_mention:
            mentions.append(raw_mention)

    return mentions


def normalize_account_name(raw, available_accounts):
    normalized = normalize_spaces(raw).lower()
    matched_account = next(
        (
            account
            for account in available_accounts
            if normalize_spaces(account).lower() == normalized
        ),
        None,
    )

    if not matched_account:
        raise ValidationError(f'Akun "{normalize_spaces(raw)}" tidak ditemukan di apps_account.')

    return matched_account


def remove_amount(text):
    return normalize_spaces(re.sub(r"(\d[\d.,]*)", "", text))


def extract_actor_and_description(prompt):
    narrative = normalize_spaces((prompt or "").split("@")[0] if prompt else "")
    without_amount = remove_amount(narrative)

    actor_match = re.match(
        rf"^(.*?)\s+(?:{'|'.join(ACTION_WORDS)})\b",
        without_amount,
        re.IGNORECASE,
    )

    if actor_match and actor_match.group(1):
        actor_name = title_case(actor_match.group(1))
        description = normalize_spaces(without_amount[len(actor_match.group(1)) :])
        return actor_name, title_case(description) if description else title_case(without_amount)

    words = without_amount.split()
    actor_name = title_case(" ".join(words[:2])) if len(words) >= 2 else ""
    description = without_amount[len(actor_name) :].strip() if actor_name else without_amount
    return actor_name, title_case(description) if description else "Pemasukan"


def build_pemasukan_preview(date, prompt, budget_type, explicit_amount=None, proof_file_name=""):
    trimmed_prompt = normalize_spaces(prompt)
    mentions = extract_mentions(trimmed_prompt)
    amount = parse_amount(trimmed_prompt, explicit_amount)
    active_accounts = list(
        Account.objects.filter(is_active=True).values_list("id", "name"),
    )
    account_names = [name for _, name in active_accounts]
    account_id_by_name = {normalize_spaces(name).lower(): str(account_id) for account_id, name in active_accounts}

    if len(mentions) < 2:
        raise ValidationError("Gunakan minimal 2 akun dengan format @Akun Kredit, lalu @Akun Debit.")

    if amount <= 0:
        raise ValidationError("Nominal belum terbaca. Isi nominal atau tulis angka pada prompt.")

    credit_account = normalize_account_name(mentions[0], account_names)
    debit_account = normalize_account_name(mentions[1], account_names)
    actor_name, description = extract_actor_and_description(trimmed_prompt)

    return {
        "date": date,
        "description": description,
        "actorName": actor_name,
        "budgetType": budget_type,
        "amount": amount,
        "prompt": trimmed_prompt,
        "proofFileName": proof_file_name or "",
        "rows": [
            {
                "id": "inc-debit",
                "account": debit_account,
                "accountId": account_id_by_name[normalize_spaces(debit_account).lower()],
                "debit": amount,
                "credit": 0,
            },
            {
                "id": "inc-credit",
                "account": credit_account,
                "accountId": account_id_by_name[normalize_spaces(credit_account).lower()],
                "debit": 0,
                "credit": amount,
            },
        ],
    }
