import re


ACTION_WORDS = [
    "membayar",
    "bayar",
    "mengeluarkan",
    "keluar",
    "transfer",
    "belanja",
    "beli",
    "pembayaran",
    "pengeluaran",
    "biaya",
]


def normalize_spaces(value):
    return re.sub(r"\s+", " ", value or "").strip()


def title_case(value):
    return " ".join(word[:1].upper() + word[1:].lower() for word in normalize_spaces(value).split(" ") if word)


def parse_amount(prompt, explicit_amount=None):
    if isinstance(explicit_amount, (int, float)) and explicit_amount > 0:
        return int(explicit_amount)

    match = re.search(r"(\d[\d.,]*)", prompt or "")
    if not match:
        return 0

    normalized = match.group(1).replace(".", "").replace(",", ".")
    try:
        return int(float(normalized))
    except ValueError:
        return 0


def extract_mentions(prompt):
    mentions = []
    separators = [",", ";", ".", "!", "?", "\n"]
    index = 0

    while index < len(prompt):
        if prompt[index] != "@":
            index += 1
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

        index += 1

    return mentions


def normalize_account_name(raw, available_accounts):
    normalized = normalize_spaces(raw).lower()
    matched = next(
        (
            account
            for account in available_accounts
            if normalize_spaces(account).lower() == normalized
        ),
        None,
    )
    if not matched:
        raise ValueError(f'Akun "{normalize_spaces(raw)}" tidak ditemukan di apps_account.')
    return matched


def extract_actor_and_description(prompt):
    narrative = normalize_spaces((prompt or "").split("@")[0])
    without_amount = normalize_spaces(re.sub(r"(\d[\d.,]*)", "", narrative))

    action_pattern = r"^(.*?)\s+(?:%s)\b" % "|".join(ACTION_WORDS)
    match = re.match(action_pattern, without_amount, flags=re.IGNORECASE)
    if match and match.group(1):
        actor_name = title_case(match.group(1))
        description = normalize_spaces(without_amount[len(match.group(1)) :])
        return {
            "actorName": actor_name,
            "description": title_case(description) if description else title_case(without_amount),
        }

    words = without_amount.split(" ")
    words = [word for word in words if word]
    actor_name = title_case(" ".join(words[:2])) if len(words) >= 2 else ""
    description = normalize_spaces(without_amount[len(actor_name) :]) if actor_name else without_amount
    return {
        "actorName": actor_name,
        "description": title_case(description) if description else "Pengeluaran",
    }


def build_pengeluaran_preview(
    *,
    date,
    prompt,
    budget_type,
    explicit_amount=None,
    proof_file_name="",
    available_accounts,
):
    trimmed_prompt = normalize_spaces(prompt)
    mentions = extract_mentions(trimmed_prompt)
    amount = parse_amount(trimmed_prompt, explicit_amount)

    if len(mentions) < 2:
        raise ValueError("Gunakan minimal 2 akun dengan format @Akun Beban, lalu @Akun Kas/Bank.")

    if amount <= 0:
        raise ValueError("Nominal belum terbaca. Isi nominal atau tulis angka pada prompt.")

    debit_account = normalize_account_name(mentions[0], available_accounts)
    credit_account = normalize_account_name(mentions[1], available_accounts)
    actor_data = extract_actor_and_description(trimmed_prompt)

    return {
        "date": date,
        "description": actor_data["description"],
        "actorName": actor_data["actorName"],
        "budgetType": budget_type,
        "amount": amount,
        "prompt": trimmed_prompt,
        "proofFileName": proof_file_name,
        "rows": [
            {
                "id": "exp-debit",
                "account": debit_account,
                "debit": amount,
                "credit": 0,
            },
            {
                "id": "exp-credit",
                "account": credit_account,
                "debit": 0,
                "credit": amount,
            },
        ],
    }
