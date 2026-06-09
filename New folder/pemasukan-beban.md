# AI-Assisted Accounting UI Design (Next.js + v0)

You are a senior frontend engineer and product designer.

Design a modern, clean, and production-ready accounting UI using Next.js and Tailwind CSS.

The application is focused on:
- AI-assisted accounting workflows
- Simple financial input for non-accounting users
- Double-entry accounting behind the scenes

IMPORTANT:
This prompt is ONLY for frontend UI generation.
Do NOT implement backend logic.

---

# 🎯 DESIGN STYLE

- Minimal
- Modern SaaS dashboard
- Clean spacing
- Soft shadows
- Rounded cards
- Professional accounting interface
- Desktop-first
- Responsive

Color palette:
- Primary: blue
- Success: green
- Warning: orange
- Danger: red

Use:
- Card layouts
- Sticky table footer
- Clean typography
- Compact but readable data tables

---

# 🧭 SIDEBAR MENU

Create a left sidebar navigation with:

- Dashboard
- Pemasukan
- Pengeluaran
- Anggaran
- Laporan
- Pengaturan

Use icons for each menu.

---

# 📥 PEMASUKAN PAGE

Create a complete "Pemasukan" page.

The page should support AI-assisted journal generation.

---

## PAGE LAYOUT

Top section:
- Page title
- Small description
- Action buttons

Main layout:
- Left side:
  - Input form
- Right side:
  - AI journal preview

Desktop layout:
- 2 column grid

Mobile:
- Stack vertically

---

# ✍️ INPUT PEMASUKAN FORM

Create a modern card form.

Fields:
- Tanggal
- Deskripsi transaksi (large textarea)
- Nominal (optional)
- Upload bukti transaksi

Placeholder example:

"Dana pembangunan masjid 5 juta transfer BCA dari Pak Ahmad"

Buttons:
- Generate AI Journal
- Reset

Style:
- Large textarea
- Friendly UI
- Clean spacing

---

# 🤖 AI GENERATED JOURNAL PREVIEW

After clicking Generate AI Journal, show a journal table preview.

The table must resemble a general journal.

---

## TABLE STRUCTURE

Columns:
| Account | Debit | Credit | Action |

Features:
- Editable account dropdown
- Editable debit/credit inputs
- Add row button
- Delete row button
- Keyboard-friendly layout

---

## TABLE UX

- Highlight invalid rows
- Real-time total calculation
- Sticky footer totals

Footer:

Total Debit
Total Credit

If balanced:
- show green success badge

If not balanced:
- show red warning badge

---

# 📌 ACTION SECTION

Bottom right:
- Save Draft
- Post Journal

Primary button:
- Post Journal

---

# 📜 RIWAYAT PEMASUKAN PAGE

Create a clean transaction history page.

---

## FILTER SECTION

Top filters:
- Search input
- Date range
- Status dropdown

---

## TABLE

Columns:
| Date | Description | Amount | Status | Action |

Status badges:
- Draft
- Posted
- Revised

Actions:
- View
- Edit
- Print

---

# 📊 LAPORAN PEMASUKAN PAGE

Create a financial report dashboard.

---

## TOP SUMMARY CARDS

Cards:
- Total Pemasukan
- Pemasukan Bulan Ini
- Pemasukan Terbesar
- Jumlah Transaksi

---

## CHART SECTION

Create:
- Monthly income bar chart
- Income category pie chart

Use modern card containers.

---

## REPORT TABLE

Columns:
| Tanggal | Deskripsi | Akun | Nominal |

Include:
- Export PDF button
- Export Excel button

---

# 💸 PENGELUARAN PAGE

Create a complete "Pengeluaran" page.

This page should visually mirror the Pemasukan page.

Theme:
- slightly different accent color
- expense-oriented visual cues

---

# ✍️ INPUT PENGELUARAN FORM

Fields:
- Tanggal
- Deskripsi transaksi
- Nominal
- Upload bukti transaksi

Placeholder:

"Bayar listrik kantor 700 ribu dari Bank BCA"

Buttons:
- Generate AI Journal
- Reset

---

# 🤖 AI GENERATED JOURNAL PREVIEW

Generate editable journal table.

Example:

| Account | Debit | Credit |
|----------|--------|---------|
| Beban Listrik | 700000 | 0 |
| Bank BCA | 0 | 700000 |

Features:
- Editable
- Add/remove row
- Realtime balancing

---

# 📜 RIWAYAT PENGELUARAN PAGE

Transaction history table.

Columns:
| Date | Description | Amount | Status |

Actions:
- View
- Edit
- Print

---

# 📊 LAPORAN PENGELUARAN PAGE

Create:
- Expense summary cards
- Monthly expense chart
- Expense breakdown chart
- Expense report table

---

# 🎨 UI COMPONENTS

Use reusable components:
- Sidebar
- Header
- Card
- DataTable
- JournalTable
- StatusBadge
- ChartCard
- SummaryCard

---

# 📱 RESPONSIVENESS

Desktop:
- professional accounting dashboard layout

Tablet:
- responsive grid

Mobile:
- stacked cards and simplified tables

---

# 🚀 OUTPUT REQUIREMENTS

Generate:
- Complete Next.js page UI
- Tailwind CSS styling
- Reusable React components
- Modern dashboard design
- No backend implementation
- No mock API calls
- Focus on UI/UX only