import os
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr, field_validator
import requests

router = APIRouter()


class ContactRequest(BaseModel):
    """Contact form submission data"""
    name: str
    email: EmailStr
    message: str

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('Name is required')
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip()

    @field_validator('message')
    @classmethod
    def validate_message(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('Message is required')
        if len(v.strip()) < 10:
            raise ValueError('Message must be at least 10 characters long')
        return v.strip()


class ContactResponse(BaseModel):
    """Response after successful contact form submission"""
    success: bool
    message: str


async def send_telegram_notification(name: str, email: str, message: str):
    """Send contact form submission to Telegram"""
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = "6154182938"  # Your Telegram chat ID
    
    if not bot_token:
        print("⚠️ TELEGRAM_BOT_TOKEN not configured")
        return
    
    # Format the message
    telegram_message = f"""🔔 <b>Новая заявка с Helix.GP</b>

👤 <b>Имя:</b> {name}
📧 <b>Email:</b> {email}
💬 <b>Сообщение:</b>
{message}"""
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": telegram_message,
        "parse_mode": "HTML"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            print(f"✅ Telegram notification sent for {email}")
        else:
            print(f"❌ Telegram API error: {response.text}")
    except Exception as e:
        print(f"❌ Failed to send Telegram notification: {e}")


@router.post("/contact", response_model=ContactResponse)
async def submit_contact_form(body: ContactRequest) -> ContactResponse:
    """
    Handle contact form submission.
    
    Validates and logs contact form data.
    Sends notification to Telegram.
    """
    # Log the contact form submission
    print("\n" + "="*60)
    print("📬 NEW CONTACT FORM SUBMISSION")
    print("="*60)
    print(f"Name:    {body.name}")
    print(f"Email:   {body.email}")
    print(f"Message: {body.message}")
    print("="*60 + "\n")
    
    # Send Telegram notification
    await send_telegram_notification(body.name, body.email, body.message)
    
    # Return success response
    return ContactResponse(
        success=True,
        message="Спасибо за ваше обращение! Мы свяжемся с вами в ближайшее время."
    )
