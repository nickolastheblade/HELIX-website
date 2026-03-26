export const translations = {
  en: {
    nav: {
      expertise: 'Expertise',
      partnership: 'Partnership',
      partners: 'Partners',
      contact: 'Contact',
    },
    hero: {
      tagline: 'A technology company with an innovative development strategy',
      cta: 'Contact',
    },
    expertise: {
      title: 'Our expertise',
      subtitle: 'We combine deep expertise and cutting-edge technology with a comprehensive development strategy to unlock new horizons of possibility',
      items: {
        identity: 'Digital identity and authentication',
        web: 'Web and mobile development',
        marketing: 'Digital marketing and analytics',
        analytics: 'Data analytics and visualization',
        optimization: 'Process optimization',
        ai: 'AI and machine learning',
      },
    },
    partnership: {
      title: 'Partnership opportunities',
      description: 'We are open to cooperation with companies seeking systemic change.',
      formatsLabel: 'Formats:',
      formatsList: 'long-term support, joint projects, equity participation',
      access: 'Partners gain access to our operational expertise and proprietary developments.',
    },
    partners: {
      title: 'Our partners',
      subtitle: 'We collaborate with leading companies and organizations to deliver exceptional results',
    },
    contact: {
      title: 'How to become a partner',
      subtitle: 'If you see potential in cooperation — write to us:',
      formTitle: 'Or Send Us a Message',
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        privacy: 'I agree to the',
        privacyLink: 'Privacy Policy',
        privacyRequired: 'You must agree to the privacy policy',
        submit: 'Send Message',
        sending: 'Sending...',
        success: 'Message sent successfully!',
        error: 'Failed to send message. Please try again.',
      },
    },
  },
  ru: {
    nav: {
      expertise: 'Экспертиза',
      partnership: 'Партнёрство',
      partners: 'Партнёры',
      contact: 'Контакты',
    },
    hero: {
      tagline: 'Технологическая компания с инновационной стратегией развития',
      cta: 'Связаться',
    },
    expertise: {
      title: 'Наша экспертиза',
      subtitle: 'Мы объединяем глубокую экспертизу и передовые технологии с комплексной стратегией развития, чтобы открывать новые горизонты возможностей',
      items: {
        identity: 'Цифровая идентификация и аутентификация',
        web: 'Веб и мобильная разработка',
        marketing: 'Цифровой маркетинг и аналитика',
        analytics: 'Аналитика и визуализация данных',
        optimization: 'Оптимизация процессов',
        ai: 'ИИ и машинное обучение',
      },
    },
    partnership: {
      title: 'Возможности партнёрства',
      description: 'Мы сотрудничаем с компаниями, открытыми к системным преобразованиям.',
      formatsLabel: 'Форматы:',
      formatsList: 'долгосрочная поддержка, совместные проекты, долевое участие',
      access: 'Партнёры получают доступ к нашей экспертизе и разработкам.',
    },
    partners: {
      title: 'Наши партнёры',
      subtitle: 'Мы сотрудничаем с ведущими компаниями и организациями для достижения исключительных результатов',
    },
    contact: {
      title: 'Как стать партнёром',
      subtitle: 'Если вы видите потенциал в сотрудничестве — напишите нам:',
      formTitle: 'Или отправьте нам сообщение',
      form: {
        name: 'Имя',
        email: 'Email',
        message: 'Сообщение',
        privacy: 'Я согласен с',
        privacyLink: 'политикой конфиденциальности',
        privacyRequired: 'Необходимо согласиться с политикой конфиденциальности',
        submit: 'Отправить',
        sending: 'Отправка...',
        success: 'Сообщение успешно отправлено!',
        error: 'Не удалось отправить сообщение. Попробуйте ещё раз.',
      },
    },
  },
};

export type TranslationKey = typeof translations.en;

// ============================================================
// Expertise Cards Static Translations
// ============================================================
// Static mapping for expertise card titles and descriptions.
// Used directly in ExpertiseCard to avoid unstable callbacks
// that cause massive re-renders.

export type Language = 'en' | 'ru';

export const expertiseTranslations: Record<number, Record<Language, { title: string; description: string }>> = {
  1: {
    en: { 
      title: 'Branding & Identity', 
      description: 'Complete brand development and visual identity systems' 
    },
    ru: { 
      title: 'Брендинг и идентичность', 
      description: 'Комплексная разработка бренда и систем визуальной идентичности' 
    }
  },
  2: {
    en: { 
      title: 'Web Development', 
      description: 'Modern web applications with cutting-edge technologies' 
    },
    ru: { 
      title: 'Веб-разработка', 
      description: 'Современные веб-приложения с передовыми технологиями' 
    }
  },
  3: {
    en: { 
      title: 'Digital Marketing', 
      description: 'Strategic digital campaigns and growth optimization' 
    },
    ru: { 
      title: 'Цифровой маркетинг', 
      description: 'Стратегические цифровые кампании и оптимизация роста' 
    }
  },
  4: {
    en: { 
      title: 'Business Analytics', 
      description: 'Data-driven insights and strategic business intelligence' 
    },
    ru: { 
      title: 'Бизнес-аналитика', 
      description: 'Идеи на основе данных и стратегический бизнес-интеллект' 
    }
  },
  5: {
    en: { 
      title: 'Operational Optimization', 
      description: 'Process automation and efficiency improvements' 
    },
    ru: { 
      title: 'Операционная оптимизация', 
      description: 'Автоматизация процессов и повышение эффективности' 
    }
  },
  6: {
    en: { 
      title: 'AI Integration', 
      description: 'Machine learning solutions and intelligent automation' 
    },
    ru: { 
      title: 'Интеграция ИИ', 
      description: 'Решения машинного обучения и интеллектуальная автоматизация' 
    }
  },
};

/**
 * Get expertise card title by ID and language.
 * Pure function - always returns same result for same inputs.
 * Does not depend on React context or changing callbacks.
 */
export const getExpertiseTitle = (id: number, lang: Language): string => {
  return expertiseTranslations[id]?.[lang]?.title || '';
};

/**
 * Get expertise card description by ID and language.
 * Pure function - always returns same result for same inputs.
 * Does not depend on React context or changing callbacks.
 */
export const getExpertiseDescription = (id: number, lang: Language): string => {
  return expertiseTranslations[id]?.[lang]?.description || '';
};

// ============================================================
// Icon Type Mapping
// ============================================================
// Static mapping for icon types used in Expertise cards.
// Converts backend icon string to typed icon name.

export type IconType = 'fingerprint' | 'web' | 'marketing' | 'analytics' | 'optimization' | 'ai';

const ICON_TYPE_MAP: Record<string, IconType> = {
  globe: 'fingerprint',    // Branding & Identity
  code: 'web',             // Web Development
  zap: 'marketing',        // Digital Marketing
  database: 'analytics',   // Business Analytics
  server: 'optimization',  // Operational Optimization
  shield: 'ai',            // AI Integration
};

/**
 * Get icon type from backend icon string.
 * Pure function with constant mapping.
 */
export const getIconType = (iconType: string): IconType => {
  return ICON_TYPE_MAP[iconType] || 'fingerprint';
};
