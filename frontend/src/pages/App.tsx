import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Mail, Send, Languages } from "lucide-react";
import { ContactForm } from "components/ContactForm";
import { ParticleBackground } from "components/ParticleBackground";
import { HelixLogo } from "components/HelixLogo";
import { HelixNavLogo } from "components/HelixNavLogo";
import { GradientOverlay } from "components/GradientOverlay";
import { APP_BASE_PATH } from "app";
import Expertise3DIcon from 'components/Expertise3DIcon';
import { useLanguageStore } from 'utils/languageStore';
import { translations } from 'utils/translations';
import ExpertiseCard from 'components/ExpertiseCard';

// Local types
interface ExpertiseItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  color_accent: string;
}

interface Partner {
  id: number;
  name: string;
  logo_url: string;
  website_url: string;
  description?: string;
}

// Static expertise data
const EXPERTISE_ITEMS: ExpertiseItem[] = [
  { id: 1, title: "Branding & Identity", description: "Complete brand development and visual identity systems", icon: "globe", color_accent: "#C026D3" },
  { id: 2, title: "Web Development", description: "Modern web applications with cutting-edge technologies", icon: "code", color_accent: "#C026D3" },
  { id: 3, title: "Digital Marketing", description: "Strategic digital campaigns and growth optimization", icon: "zap", color_accent: "#C026D3" },
  { id: 4, title: "Business Analytics", description: "Data-driven insights and strategic business intelligence", icon: "database", color_accent: "#C026D3" },
  { id: 5, title: "Operational Optimization", description: "Process automation and efficiency improvements", icon: "server", color_accent: "#C026D3" },
  { id: 6, title: "AI Integration", description: "Machine learning solutions and intelligent automation", icon: "shield", color_accent: "#C026D3" },
];

// Static partners data
const PARTNERS_ITEMS: Partner[] = [
  { id: 1, name: "Splav", logo_url: "https://raw.githubusercontent.com/nickolastheblade/logos/main/splav%20wh.svg", website_url: "https://splav1.su" },
  { id: 2, name: "Space Dynamics Architects", logo_url: "https://raw.githubusercontent.com/nickolastheblade/logos/main/SDA%20vector-01.svg", website_url: "https://sda.example.com" },
  { id: 3, name: "morph.in", logo_url: "https://raw.githubusercontent.com/nickolastheblade/logos/main/CLEAR%20morphin-logo-white.svg", website_url: "https://morphin.pro" },
];

// Glass Skeleton Component
const GlassSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`backdrop-blur-[12px] bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[24px] animate-pulse ${className}`} />
);

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const { language, setLanguage } = useLanguageStore();
  const t = translations[language];
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  
  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    if (isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageMenuOpen]);
  
  // Loading animation state
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [isInterfaceReady, setIsInterfaceReady] = useState(false);
  
  // Static data - no loading needed
  const expertiseItems = EXPERTISE_ITEMS;
  const expertiseLoading = false;
  const expertiseError = null;
  const partners = PARTNERS_ITEMS;
  const partnersLoading = false;
  const partnersError = null;

  // Card refs initialized statically
  const cardRefs = useRef<React.RefObject<HTMLDivElement>[]>(
    EXPERTISE_ITEMS.map(() => React.createRef<HTMLDivElement>())
  );

  // Loading animation sequence
  useEffect(() => {
    // Ensure initial state is fully rendered before starting transitions
    requestAnimationFrame(() => {
      // Phase 1: Logo appears (50ms delay, 750ms duration = finishes at 800ms)
      const timer1 = setTimeout(() => setLoadingPhase(1), 50);
      // Phase 2: Particles appear after logo finishes (850ms delay)
      const timer2 = setTimeout(() => setLoadingPhase(2), 850);
      // Phase 3: Interface appears (1400ms delay)
      const timer3 = setTimeout(() => setLoadingPhase(3), 1400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    });
  }, []);

  // Initialize expertise items with skeletons if empty to prevent layout shift initially
  // Real data will replace this, but allows us to render the grid structure immediately
  const expertiseSkeletons = Array(6).fill(null).map((_, i) => ({ id: i }));
  const partnersSkeletons = Array(3).fill(null).map((_, i) => ({ id: i }));

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);

      // Update active section - find which section is closest to top of viewport
      const sections = ["hero", "expertise", "partnership", "partners", "contact"];
      let closestSection = "hero";
      let closestDistance = Infinity;
      
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Distance from section top to viewport top (100px for nav offset)
          const distance = Math.abs(rect.top - 100);
          
          // Only consider sections that are visible or near the top
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            if (distance < closestDistance) {
              closestDistance = distance;
              closestSection = section;
            }
          }
        }
      });
      
      setActiveSection(closestSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Contact (offset 40) is the reference point
      // Contact has py-24 (96px), header positioned at 40 + 96 = 136px from top
      // Other sections have py-16 (64px), so they need offset 136 - 64 = 72px
      const offsets: Record<string, number> = {
        hero: 0,
        expertise: 72,
        partnership: 72,
        partners: 72,
        contact: 40
      };
      const navHeight = offsets[id] || 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div 
      className="text-white relative overflow-x-hidden min-h-screen bg-[#000000] w-full flex flex-col items-center"
    >
      {/* Scroll Progress Indicator */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 w-0.5 h-64 bg-white/5 z-50 hidden md:block">
        <div
          className="w-full bg-gradient-to-b from-[#9CA3AF]/30 to-[#9CA3AF]/80 transition-all duration-300 shadow-[0_0_8px_rgba(156,163,175,0.4)]"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Particle Background */}
      <ParticleBackground 
        cardRefs={cardRefs.current}
        className={`transition-all duration-[500ms] ${
          loadingPhase >= 2 
            ? 'opacity-100 blur-none' 
            : 'opacity-0 blur-[20px]'
        }`}
      />

      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 w-full h-full z-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-[20px] transition-all duration-300" style={{ opacity: Math.min(1, Math.max(0, (scrollProgress - 2) / 15)) }}>
        </div>
      </div>

      <nav className={`fixed top-8 left-1/2 -translate-x-1/2 z-40 backdrop-blur-[20px] bg-[rgba(10,10,10,0.6)] rounded-[24px] px-8 py-4 border border-white/5 transition-all duration-[500ms] hidden md:flex ${
        loadingPhase >= 3 
          ? 'opacity-100 blur-none' 
          : 'opacity-0 blur-[20px]'
      }`}>
        <div className="flex gap-8 items-center">
          {/* Logo - returns to Hero section */}
          <button
            onClick={() => scrollToSection("hero")}
            className="px-3 py-2 rounded-[12px] text-white transition-all duration-300 hover:bg-white/5"
          >
            <HelixNavLogo />
          </button>
          
          {/* Other navigation items */}
          {["expertise", "partnership", "partners", "contact"].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-300 ${
                activeSection === section
                  ? "bg-white/10 text-white"
                  : "text-[#9CA3AF] hover:bg-white/5"
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
          <div className="relative" ref={languageMenuRef}>
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="p-2 rounded-[8px] text-sm font-medium transition-all duration-300 text-[#9CA3AF] hover:bg-white/5"
            >
              <Languages className="w-5 h-5" />
            </button>
            {isLanguageMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-[#0A0A0A]/95 backdrop-blur-[12px] border border-white/10 rounded-[8px] overflow-hidden">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setIsLanguageMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-all duration-300 ${
                    language === 'en' ? 'bg-white/10 text-white' : 'text-[#9CA3AF] hover:bg-white/5'
                  }`}
                >
                  En
                </button>
                <button
                  onClick={() => {
                    setLanguage('ru');
                    setIsLanguageMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-all duration-300 ${
                    language === 'ru' ? 'bg-white/10 text-white' : 'text-[#9CA3AF] hover:bg-white/5'
                  }`}
                >
                  Ru
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative px-6 md:px-4">
        <div className="text-center z-10 w-full flex flex-col items-center">
          {/* Logo appears first (Phase 1) */}
          <div className="mb-8 flex justify-center w-full">
            <div 
              className={`${
                loadingPhase >= 1 
                  ? 'opacity-100 blur-none' 
                  : 'opacity-0 blur-[8px]'
              }`}
              style={{
                transition: 'opacity 750ms ease-in-out, transform 750ms ease-in-out, filter 750ms ease-in-out',
                willChange: loadingPhase < 1 ? 'opacity, transform, filter' : 'auto'
              }}
            >
              <div className="h-[48px] md:h-[72px] flex justify-center">
                <HelixLogo size="large" glow={false} className="h-full" />
              </div>
            </div>
          </div>
          
          {/* Content appears later (Phase 3) */}
          <p className={`text-[#9CA3AF] text-lg md:text-xl mb-12 max-w-2xl mx-auto transition-all duration-[500ms] delay-75 ${
            loadingPhase >= 3 
              ? 'opacity-100 blur-none' 
              : 'opacity-0 blur-[20px]'
          }`} style={{ fontFamily: "Inter, sans-serif" }}>
            {t.hero.tagline}
          </p>
          <button 
            onClick={() => scrollToSection("contact")}
            className={`backdrop-blur-[12px] bg-[rgba(255,255,255,0.05)] border border-white/10 px-8 py-4 rounded-[16px] text-white font-medium hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)] ${
            loadingPhase >= 3 
              ? 'opacity-100 blur-none' 
              : 'opacity-0 blur-[20px]'
          }`} style={{ transitionDuration: '500ms', transitionDelay: loadingPhase >= 3 ? '200ms' : '0ms' }}>
            {t.hero.cta}
          </button>
        </div>
        <button
          onClick={() => scrollToSection("expertise")}
          className={`absolute bottom-24 transition-all duration-500 delay-300 chevron-bounce ${
            loadingPhase >= 3 
              ? 'opacity-100 blur-none' 
              : 'opacity-0 blur-[20px]'
          }`}
        >
          <ChevronDown className="w-8 h-8 text-[#9CA3AF]" />
        </button>
        <style>{`
          @keyframes smooth-bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
            }
          }
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .chevron-bounce {
            animation: smooth-bounce 2.5s ease-in-out infinite;
          }
          
          @keyframes fadeInOnce {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-12 md:py-16 px-6 md:px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[32px] md:text-[48px] text-white mb-2 md:mb-3 text-center" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            {t.expertise.title}
          </h2>
          <p className="text-[#9CA3AF] text-center text-lg md:text-xl max-w-3xl mx-auto mb-12 md:mb-16" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            {t.expertise.subtitle}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
            {expertiseLoading ? (
              // Show Glass Skeletons while loading
              expertiseSkeletons.map((skel) => (
                <GlassSkeleton key={`skel-${skel.id}`} className="h-[400px]" />
              ))
            ) : expertiseError ? (
              <div className="col-span-full flex items-center justify-center min-h-[400px]">
                <p className="text-red-400 text-lg">{expertiseError}</p>
              </div>
            ) : (
              // Show real content with fade-in
              expertiseItems.map((item, index) => {
                console.log('[Expertise] Rendering card', item.id, 'at index', index);
                return (
                  <div 
                    key={item.id}
                    style={{
                      animation: 'fadeInOnce 0.7s ease-out forwards',
                      animationDelay: `${index * 100}ms`,
                      opacity: 0
                    }}
                  >
                    <ExpertiseCard
                      item={item}
                      index={index}
                      cardRef={cardRefs.current[index]}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Partnership Block */}
      <section id="partnership" className="py-12 md:py-16 px-6 md:px-4 relative z-10 pb-6 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[32px] md:text-[48px] text-white mb-2 md:mb-3 text-center" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            {t.partnership.title}
          </h2>
          <p className="text-[#9CA3AF] text-lg md:text-xl text-center max-w-3xl mx-auto" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            {t.partnership.description}<br />
            {t.partnership.formatsLabel} <span className="text-white">{t.partnership.formatsList}</span>.<br />
            {t.partnership.access}
          </p>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-12 md:py-16 px-6 md:px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[32px] md:text-[48px] text-white mb-8 md:mb-10 text-center" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            {t.partners.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto min-h-[240px]">
            {partnersLoading ? (
               // Show Glass Skeletons while loading
               partnersSkeletons.map((skel) => (
                <GlassSkeleton key={`p-skel-${skel.id}`} className="h-[240px]" />
              ))
            ) : partnersError ? (
              <div className="col-span-full flex items-center justify-center min-h-[240px]">
                <p className="text-red-400 text-lg">{partnersError}</p>
              </div>
            ) : (
              partners.map((partner, index) => {
                return (
                <a
                  key={partner.id}
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-[340px] h-[240px] backdrop-blur-[12px] bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[24px] p-8 flex items-center justify-center transition-all duration-300 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)]"
                  style={{ 
                    opacity: 0,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <img 
                    src={partner.logo_url}
                    alt={partner.name}
                    className="object-contain w-full h-full pointer-events-none opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </a>
              )})
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-16 md:py-24 px-6 md:px-4 relative z-10 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-[32px] md:text-[48px] text-white mb-6 md:mb-8 text-center" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            {t.contact.title}
          </h2>
          
          <p className="text-[#9CA3AF] text-base md:text-lg text-center mb-12">
            {t.contact.subtitle}
          </p>

          {/* Contact Tiles: Telegram and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Telegram Tile */}
            <a
              href="https://t.me/helixgp"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-[180px] backdrop-blur-[12px] bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[24px] p-8 transition-all duration-300 flex flex-col justify-center overflow-hidden hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)]"
            >
              <Send className="w-10 h-10 text-white mb-4 relative z-10" />
              <h3 className="text-white mb-2 relative z-10">Telegram</h3>
              <p className="text-[#9CA3AF] text-sm group-hover:underline group-hover:underline-offset-4 transition-all relative z-10">
                @helixgp
              </p>
            </a>

            {/* Email Tile */}
            <a
              href="mailto:hello@helixgp.tech"
              className="group relative h-[180px] backdrop-blur-[12px] bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[24px] p-8 transition-all duration-300 flex flex-col justify-center overflow-hidden hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)]"
            >
              <Mail className="w-10 h-10 text-white mb-4 relative z-10" />
              <h3 className="text-white mb-2 relative z-10">Email</h3>
              <p className="text-[#9CA3AF] text-sm group-hover:underline group-hover:underline-offset-4 transition-all relative z-10">
                hello@helixgp.tech
              </p>
            </a>
          </div>

          {/* Contact Form */}
          <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[24px] p-8">
            <h3 className="text-2xl text-white mb-6 text-center">
              {t.contact.formTitle}
            </h3>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-[#9CA3AF] text-sm border-t border-white/5 relative z-10">
        <p>© 2025 Helix.GP. All rights reserved.</p>
      </footer>
    </div>
  );
}
