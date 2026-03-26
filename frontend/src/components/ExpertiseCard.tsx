import React from 'react';
import Expertise3DIcon from './Expertise3DIcon';
import type { ExpertiseItem } from 'types';
import { useLanguageStore } from 'utils/languageStore';
import { getExpertiseTitle, getExpertiseDescription, getIconType } from 'utils/translations';

interface Props {
  item: ExpertiseItem;
  index: number;
  cardRef: React.RefObject<HTMLDivElement>;
}

/**
 * Expertise card component with isolated local state.
 * Prevents grid reflow by avoiding global state updates on mouse movement.
 * Uses pure utility functions for translations instead of unstable callbacks.
 */
const ExpertiseCard = React.memo<Props>(({ 
  item, 
  index, 
  cardRef
}) => {
  console.log('[ExpertiseCard] RENDER card', item.id);
  
  // Get current language from store (only subscribe to language, not setLanguage)
  const language = useLanguageStore((state) => state.language);
  
  // Get translations using pure functions (no unstable callbacks)
  const title = getExpertiseTitle(item.id, language);
  const description = getExpertiseDescription(item.id, language);
  const iconType = getIconType(item.icon);
  
  // ✅ Local state - не вызывает re-render родителя
  const [isHovered, setIsHovered] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState<{ x: number; y: number } | null>(null);

  return (
    <div
      ref={cardRef}
      className="group relative h-[400px] backdrop-blur-[12px] bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[24px] p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)]"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition(null);
      }}
      onMouseMove={(e) => {
        if (isHovered) {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }
      }}
    >
      <div className="flex flex-col items-center text-center h-full justify-center">
        {/* 3D Icons */}
        <div className="mb-8">
          <Expertise3DIcon 
            type={iconType}
            size={140}
            isHovered={isHovered}
            mousePosition={mousePosition}
          />
        </div>
        <h3 className="text-2xl text-white mb-4">{title}</h3>
        <p className="text-[#9CA3AF] text-base">{description}</p>
      </div>
    </div>
  );
});

ExpertiseCard.displayName = 'ExpertiseCard';

export default ExpertiseCard;
