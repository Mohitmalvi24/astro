import os
import json
import urllib.request
import urllib.error
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from .models import ChatMessage
from .serializers import ChatMessageSerializer

ASTRO_SYSTEM_PROMPT = (
    "You are Astro, a warm, curious AI assistant who loves talking about space, "
    "astronomy, and grounded cosmic insights in a friendly, approachable tone. "
    "Keep responses helpful, concise, warm, and natural — never overly mystical or dramatic."
)

FALLBACK_MESSAGE = (
    "I'm feeling a bit out of orbit right now. Let's try chatting again in a moment!"
)

def generate_smart_astrology_response(prompt: str) -> str:
    text = prompt.lower()
    
    if any(k in text for k in ['job', 'career', 'work', 'future', 'get job', 'full time']):
        return (
            "✨ Based on your birth energy (Virgo/Libra transition): "
            "The cosmic alignment shows strong Jupiter positioning entering your 10th House of Career over the next 6-9 months! "
            "Focus on skill refinement between now and early 2027. Opportunities in technology, analysis, and creative problem solving are highly favored. "
            "Keep pushing forward — the stars indicate a major professional breakthrough coming your way soon! 🌟"
        )
    elif any(k in text for k in ['name', 'birth', 'date of birth', 'dob', 'born']):
        return (
            "🌟 Greetings! Your birth details carry the grounded wisdom of Mercury and Earth element energy. "
            "You possess sharp analytical thinking and a natural drive for success. "
            "What specific area of your life would you like cosmic guidance on today? (Career, Relationships, or Personal Growth)"
        )
    elif any(k in text for k in ['love', 'marriage', 'relationship', 'partner']):
        return (
            "💖 Venus aligns gracefully in your chart, indicating emotional depth and meaningful connections. "
            "Patience and authentic communication will bring strong harmony into your relationships this year!"
        )
    elif any(k in text for k in ['hi', 'hello', 'hey', 'astro', 'who are you']):
        return (
            "✨ Hello! I am Astro, your cosmic assistant. "
            "Ask me anything about your astrological insights, career guidance, space exploration, or daily horoscopes!"
        )
    else:
        return (
            "✨ The stars reflect great potential in your query. "
            "Remember that your choices align with cosmic timing. "
            "Focus on consistent effort, stay patient, and trust your journey through the cosmos! 🌌"
        )


def get_ai_response(user_message: str) -> str:
    api_key = os.environ.get('AI_API_KEY', '')
    if not api_key:
        return generate_smart_astrology_response(user_message)

    # Standard OpenAI-compatible format or Gemini endpoint fallback
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": ASTRO_SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }

    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = response.read().decode('utf-8')
            res_json = json.loads(res_body)
            choices = res_json.get('choices', [])
            if choices and 'message' in choices[0]:
                return choices[0]['message']['content'].strip()
    except Exception as e:
        print(f"AI API call exception: {e}")

    return generate_smart_astrology_response(user_message)



class StandardResultsSetPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 100


class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_text = request.data.get('message', '').strip()
        if not user_text:
            return Response({'error': 'Message content is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Save user's message
        user_msg = ChatMessage.objects.create(
            user=request.user,
            sender_type=ChatMessage.SENDER_USER,
            message=user_text
        )

        # 2. Get AI reply
        ai_reply_text = get_ai_response(user_text)

        # 3. Save AI's message
        astro_msg = ChatMessage.objects.create(
            user=request.user,
            sender_type=ChatMessage.SENDER_ASTRO,
            message=ai_reply_text
        )

        return Response({
            'user_message': ChatMessageSerializer(user_msg).data,
            'astro_message': ChatMessageSerializer(astro_msg).data,
        }, status=status.HTTP_201_CREATED)


class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        messages = ChatMessage.objects.filter(user=request.user).order_by('-timestamp')
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(messages, request)
        if page is not None:
            # Reverse order of current page to display chronologically in chat UI
            serializer = ChatMessageSerializer(reversed(page), many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = ChatMessageSerializer(reversed(messages), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
