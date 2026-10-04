from django.urls import path
from .views import (
    SendMessageView,
    ChatHistoryView,
    AstrologersView,
    CategoriesView,
    HoroscopeView,
    ServicesView,
)

urlpatterns = [
    path('send', SendMessageView.as_view(), name='chat_send'),
    path('history', ChatHistoryView.as_view(), name='chat_history'),
    path('astrologers', AstrologersView.as_view(), name='astrologers_list'),
    path('categories', CategoriesView.as_view(), name='categories_list'),
    path('horoscope/<str:sign>', HoroscopeView.as_view(), name='horoscope_detail'),
    path('services', ServicesView.as_view(), name='services_list'),
]

