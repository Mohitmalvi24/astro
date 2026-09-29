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
    # Check for Groq API Key or General AI API Key
    api_key = os.environ.get('GROQ_API_KEY', '').strip() or os.environ.get('AI_API_KEY', '').strip()
    
    print(f"--- AI RESPONSE DEBUG ---")
    print(f"User message: {user_message}")
    print(f"API Key present: {bool(api_key)}, Key prefix: {api_key[:6] if api_key else 'NONE'}")

    if not api_key:
        print("DEBUG: No API key found in environment variables (GROQ_API_KEY/AI_API_KEY). Using fallback response.")
        return generate_smart_astrology_response(user_message)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    # If Groq Key, query active models dynamically from Groq
    candidate_models = []
    if api_key.startswith('gsk_'):
        models_url = "https://api.groq.com/openai/v1/models"
        try:
            req_m = urllib.request.Request(models_url, headers=headers, method='GET')
            with urllib.request.urlopen(req_m, timeout=10) as resp_m:
                m_body = json.loads(resp_m.read().decode('utf-8'))
                data_list = m_body.get('data', [])
                candidate_models = [m['id'] for m in data_list if 'id' in m]
                print(f"DEBUG: Dynamically fetched active Groq models: {candidate_models[:5]}")
        except Exception as err_m:
            print(f"DEBUG ERROR fetching models list: {err_m}")
        
        if not candidate_models:
            candidate_models = ["llama-3.3-70b-specdec", "llama-3.1-70b-versatile", "llama-3.2-3b-preview", "qwen-2.5-coder-32b"]
        
        url = "https://api.groq.com/openai/v1/chat/completions"
    else:
        url = "https://api.openai.com/v1/chat/completions"
        candidate_models = ["gpt-3.5-turbo"]

    for model_name in candidate_models:
        print(f"DEBUG: Trying Groq/AI model: {model_name}")
        payload = {
            "model": model_name,
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
            with urllib.request.urlopen(req, timeout=15) as response:
                res_body = response.read().decode('utf-8')
                res_json = json.loads(res_body)
                print(f"DEBUG: Groq API response SUCCESS with model: {model_name}! Status: {response.status}")
                choices = res_json.get('choices', [])
                if choices and 'message' in choices[0]:
                    ai_text = choices[0]['message']['content'].strip()
                    print(f"DEBUG: Generated AI Text length: {len(ai_text)}")
                    return ai_text
        except urllib.error.HTTPError as http_err:
            error_body = http_err.read().decode('utf-8') if http_err.fp else ''
            print(f"DEBUG ERROR ({model_name}): HTTPError {http_err.code}: {http_err.reason}. Body: {error_body}")
        except Exception as e:
            print(f"DEBUG ERROR ({model_name}): General Exception: {type(e).__name__} - {e}")

    print("DEBUG: Falling back to smart generator due to API error/failure.")
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
