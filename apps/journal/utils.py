import re
from decimal import Decimal

def parse_prompt(text: str):
    """
    Parse sebuah prompt transaksi bahasa Indonesia.

    Format yang diterima (tidak sensitif huruf besar‑kecil):
        <narasi> <nominal> dari @<AkunKredit> ke @<AkunDebit> [, …]

    • <narasi>   – bebas kata (contoh: “Mas Diki bayar listrik”)
    • <nominal> – angka yang boleh memakai '.' sebagai pemisah ribuan
                  dan ',' sebagai pemisah desimal.
    • @AkunKredit – akun yang akan dikreditkan.
    • @AkunDebit  – akun yang akan didebitkan.
    • Beberapa akun tujuan dapat dipisahkan dengan koma atau titik‑koma.

    Mengembalikan dict dengan kunci:
        donor        – nama donor (title‑cased)
        amount       – Decimal
        source_name  – akun kredit (title‑cased)
        dest_names   – list akun debit (title‑cased)
    """
    # ------------------------------------------------------------------
    # 1️⃣  Tangkap narasi, nominal, dan sisa string setelah nominal
    # ------------------------------------------------------------------
    base_pat = r"(?P<narasi>.+?)\s+(?P<amount>[\d.,]+)\s+(?P<rest>.+)"
    m = re.search(base_pat, text, flags=re.IGNORECASE)
    if not m:
        raise ValueError("Gunakan format prompt: narasi nominal @Akun Kredit ke @Akun Debit")

    donor = m.group("narasi").strip().title()

    # ------------------------------------------------------------------
    # 2️⃣  Normalisasi nominal ( '.' → ribuan, ',' → desimal )
    # ------------------------------------------------------------------
    raw_amount = m.group("amount")
    normalized = raw_amount.replace(".", "").replace(",", ".")
    amount = Decimal(normalized)

    rest = m.group("rest")

    # ------------------------------------------------------------------
    # 3️⃣  Ekstrak akun‑akun menggunakan kata kunci “dari” dan “ke”
    # ------------------------------------------------------------------
    # a) Akun kredit (sumber)
    src_pat = r"dari\s+@(?P<src>[^,;@]+)"
    src_match = re.search(src_pat, rest, flags=re.IGNORECASE)
    if not src_match:
        raise ValueError("Gunakan format prompt: narasi nominal @Akun Kredit ke @Akun Debit")
    source = src_match.group("src").strip().title()

    # b) Semua akun debit (tujuan) – dapat dipisahkan koma/semicolon atau kata “ke”
    dest_pat = r"ke\s+@(?P<dest>[^,;@]+)"
    dest_matches = re.finditer(dest_pat, rest, flags=re.IGNORECASE)

    dest_names = [dm.group("dest").strip().title() for dm in dest_matches]

    # Jika tidak ada “ke”, coba pula pencarian berbasis koma/semicolon
    if not dest_names:
        # contoh: “… @Kas Umum, @Beban Operasional .”
        alt_pat = r"@(?P<dest>[^,;@]+)"
        alt_matches = re.finditer(alt_pat, rest, flags=re.IGNORECASE)
        # abaikan akun sumber yang sudah dipakai
        dest_names = [
            am.group("dest").strip().title()
            for am in alt_matches
            if am.group("dest").strip().title() != source
        ]

    if not dest_names:
        raise ValueError("Gunakan format prompt: narasi nominal @Akun Kredit ke @Akun Debit")

    # ------------------------------------------------------------------
    # 4️⃣  Kembalikan hasil
    # ------------------------------------------------------------------
    return {
        "donor": donor,
        "amount": amount,
        "source_name": source,
        "dest_names": dest_names,
    }