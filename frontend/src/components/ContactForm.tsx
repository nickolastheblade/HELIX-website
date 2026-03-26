import React, { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "utils/languageStore";
import { translations } from "utils/translations";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const TELEGRAM_BOT_TOKEN = "8547795302:AAGICFGEJywczaW_aENBKUDZoJeAfF67AKg";
const TELEGRAM_CHAT_ID = "6154182938";

export interface ContactFormProps {
  className?: string;
}

/**
 * Contact form component with validation and API integration.
 * Displays success toast on submission and handles errors gracefully.
 * Includes privacy policy checkbox with modal dialog.
 */
export function ContactForm({ className = "" }: ContactFormProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
    privacy: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate single field
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      
      case "email":
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value)) return "Please enter a valid email";
        return "";
      
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10) return "Message must be at least 10 characters";
        return "";
      
      default:
        return "";
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
      privacy: agreedToPrivacy ? "" : t.contact.form.privacyRequired,
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const telegramMessage = `🔔 <b>Новая заявка с Helix.GP</b>\n\n👤 <b>Имя:</b> ${formData.name}\n📧 <b>Email:</b> ${formData.email}\n💬 <b>Сообщение:</b>\n${formData.message}`;
      
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: "HTML",
        }),
      });
      
      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.description || "Telegram API error");
      }
      
      toast.success(t.contact.form.success || "Сообщение отправлено!");
      setFormData({ name: "", email: "", message: "" });
      setErrors({ name: "", email: "", message: "", privacy: "" });
      setAgreedToPrivacy(false);
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(t.contact.form.error || "Ошибка отправки. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
      
      <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
            {t.contact.form.name} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={
              `w-full px-4 py-3 rounded-[16px] backdrop-blur-[12px] bg-[rgba(255,255,255,0.05)] border text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:bg-[rgba(255,255,255,0.08)] ${
                errors.name
                  ? "border-red-500/60 focus:ring-red-500/40"
                  : "border-white/10 focus:border-white/40 focus:ring-white/20"
              }`
            }
            placeholder={t.contact.form.name}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            {t.contact.form.email} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={
              `w-full px-4 py-3 rounded-[16px] backdrop-blur-[12px] bg-[rgba(255,255,255,0.05)] border text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:bg-[rgba(255,255,255,0.08)] ${
                errors.email
                  ? "border-red-500/60 focus:ring-red-500/40"
                  : "border-white/10 focus:border-white/30 focus:ring-white/10"
              }`
            }
            placeholder={t.contact.form.email}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Message Textarea */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
            {t.contact.form.message} *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className={
              `w-full px-4 py-3 rounded-[16px] backdrop-blur-[12px] bg-[rgba(255,255,255,0.05)] border text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 resize-none focus:bg-[rgba(255,255,255,0.08)] ${
                errors.message
                  ? "border-red-500/60 focus:ring-red-500/40"
                  : "border-white/10 focus:border-white/30 focus:ring-white/10"
              }`
            }
            placeholder={t.contact.form.message}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-400">{errors.message}</p>
          )}
        </div>

        {/* Privacy Policy Checkbox */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="privacy"
              checked={agreedToPrivacy}
              onChange={(e) => {
                setAgreedToPrivacy(e.target.checked);
                if (errors.privacy && e.target.checked) {
                  setErrors(prev => ({ ...prev, privacy: "" }));
                }
              }}
              className="mt-1 w-4 h-4 rounded border-white/20 bg-[rgba(255,255,255,0.05)] text-white focus:ring-2 focus:ring-white/20 focus:ring-offset-0 cursor-pointer"
              disabled={isSubmitting}
            />
            <label htmlFor="privacy" className="text-sm text-[#9CA3AF] leading-relaxed cursor-pointer select-none">
              {t.contact.form.privacy}{' '}
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-white/80 hover:text-white underline transition-colors"
              >
                {t.contact.form.privacyLink}
              </button>
            </label>
          </div>
          {errors.privacy && (
            <p className="text-sm text-red-400 pl-7">{errors.privacy}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 rounded-[16px] backdrop-blur-[12px] bg-[rgba(255,255,255,0.05)] border border-white/10 text-white font-medium hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>
      </form>
    </>
  );
}
