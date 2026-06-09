from django.urls import path

from .api_views import (
    AccountCategoryDetailApi,
    AccountCategoryListCreateApi,
    AccountDetailApi,
    AccountListCreateApi,
    JournalDetailApi,
    JournalListCreateApi,
    PemasukanPreviewApi,
    PengeluaranPreviewApi,
    PeriodDetailApi,
    PeriodListCreateApi,
)


urlpatterns = [
    path("api/categories/", AccountCategoryListCreateApi.as_view(), name="api_category_list"),
    path("api/categories/<int:pk>/", AccountCategoryDetailApi.as_view(), name="api_category_detail"),
    path("api/accounts/", AccountListCreateApi.as_view(), name="api_account_list"),
    path("api/accounts/<int:pk>/", AccountDetailApi.as_view(), name="api_account_detail"),
    path("api/periods/", PeriodListCreateApi.as_view(), name="api_period_list"),
    path("api/periods/<int:pk>/", PeriodDetailApi.as_view(), name="api_period_detail"),
    path("api/journals/", JournalListCreateApi.as_view(), name="api_journal_list"),
    path("api/journals/<int:pk>/", JournalDetailApi.as_view(), name="api_journal_detail"),
    path("api/pemasukan/preview/", PemasukanPreviewApi.as_view(), name="api_pemasukan_preview"),
    path("api/pengeluaran/preview/", PengeluaranPreviewApi.as_view(), name="api_pengeluaran_preview"),
]
