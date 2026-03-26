import { X } from "lucide-react";
import { useLanguageStore } from "utils/languageStore";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PRIVACY_URLS = {
  ru: "https://raw.githubusercontent.com/nickolastheblade/DOCS/main/helixgp-privacy.md",
  en: "https://raw.githubusercontent.com/nickolastheblade/DOCS/main/helixgp-privacy-en.md",
};

/**
 * Privacy Policy Modal Component
 * Dynamically loads privacy policy markdown from GitHub based on selected language.
 * Matches the exact styling of the contact form.
 * Features smooth entrance animation and premium dark scrollbar.
 */
export default function PrivacyPolicyModal({ isOpen, onClose }: Props) {
  const { language } = useLanguageStore();
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Trigger animation
    setIsAnimating(true);

    const fetchPrivacyPolicy = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Add timestamp to URL to bypass cache
        const baseUrl = PRIVACY_URLS[language];
        const timestamp = new Date().getTime();
        const url = `${baseUrl}?t=${timestamp}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to load privacy policy: ${response.status}`);
        }
        
        const text = await response.text();
        setMarkdown(text);
      } catch (err) {
        console.error("Error loading privacy policy:", err);
        setError(language === 'ru' 
          ? 'Не удалось загрузить политику конфиденциальности'
          : 'Failed to load privacy policy'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-4xl h-[600px] backdrop-blur-[12px] bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[24px] overflow-hidden flex flex-col shadow-[0_8px_32px_rgba(255,255,255,0.15)] transition-all duration-300 ${
          isAnimating ? 'animate-in zoom-in-95 slide-in-from-bottom-4' : ''
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-6 border-b border-white/5 backdrop-blur-[12px] bg-[rgba(255,255,255,0.02)]">
          <h2 className="text-2xl font-semibold text-white">
            {language === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-[12px] hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-6 overflow-y-auto custom-scrollbar">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && markdown && (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-white mt-0 mb-6">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-white mt-8 mb-4">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-[#9CA3AF] leading-relaxed mb-4">{children}</p>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      className="text-white/80 hover:text-white underline transition-colors"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 space-y-1 mb-4 text-[#9CA3AF]">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 space-y-1 mb-4 text-[#9CA3AF]">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-[#9CA3AF]">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-white font-semibold">{children}</strong>
                  ),
                  code: ({ children }) => (
                    <code className="px-1.5 py-0.5 bg-white/5 rounded text-white/90 text-sm">{children}</code>
                  ),
                  hr: () => (
                    <hr className="my-8 border-white/10" />
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="bg-white/5 border-l-2 border-white/10 pl-4 py-2 my-4 italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
