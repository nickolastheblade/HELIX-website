import React from 'react';

interface Props {
  type: 'fingerprint' | 'web' | 'marketing' | 'analytics' | 'optimization' | 'ai';
  size?: number;
  isHovered?: boolean;
  mousePosition?: { x: number; y: number } | null;
}

// Native SVG icon components to replace lucide-react
const FingerprintIcon = ({ stroke = 'currentColor', strokeWidth = 2, ...props }: React.SVGProps<SVGGElement>) => (
  <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" {...props}>
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/>
    <path d="M14 13.12c0 2.38 0 6.38-1 8.88"/>
    <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/>
    <path d="M2 12a10 10 0 0 1 18-6"/>
    <path d="M2 16h.01"/>
    <path d="M21.8 16c.2-2 .131-5.354 0-6"/>
    <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/>
    <path d="M8.65 22c.21-.66.45-1.32.57-2"/>
    <path d="M9 6.8a6 6 0 0 1 9 5.2v2"/>
  </g>
);

const TrendingUpIcon = ({ stroke = 'currentColor', strokeWidth = 2, ...props }: React.SVGProps<SVGGElement>) => (
  <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" {...props}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </g>
);

const BarChart3Icon = ({ stroke = 'currentColor', strokeWidth = 2, ...props }: React.SVGProps<SVGGElement>) => (
  <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" {...props}>
    <path d="M3 3v18h18"/>
    <path d="M18 17V9"/>
    <path d="M13 17V5"/>
    <path d="M8 17v-3"/>
  </g>
);

const RefreshCwIcon = ({ stroke = 'currentColor', strokeWidth = 2, ...props }: React.SVGProps<SVGGElement>) => (
  <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" {...props}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M8 16H3v5"/>
  </g>
);

const CpuIcon = ({ stroke = 'currentColor', strokeWidth = 2, ...props }: React.SVGProps<SVGGElement>) => (
  <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" {...props}>
    <rect width="16" height="16" x="4" y="4" rx="2"/>
    <rect width="6" height="6" x="9" y="9" rx="1"/>
    <path d="M15 2v2"/>
    <path d="M15 20v2"/>
    <path d="M2 15h2"/>
    <path d="M2 9h2"/>
    <path d="M20 15h2"/>
    <path d="M20 9h2"/>
    <path d="M9 2v2"/>
    <path d="M9 20v2"/>
  </g>
);

const MonitorSmartphoneIcon = ({ stroke = 'currentColor', strokeWidth = 2, ...props }: React.SVGProps<SVGGElement>) => (
  <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" {...props}>
    <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8"/>
    <path d="M10 19v-3.96 3.15"/>
    <path d="M7 19h5"/>
    <rect width="6" height="10" x="16" y="12" rx="2"/>
  </g>
);

const colorSchemes = {
  fingerprint: { hex: '#10B981', rgb: '16, 185, 129' },
  web: { hex: '#06B6D4', rgb: '6, 182, 212' },
  marketing: { hex: '#8B5CF6', rgb: '139, 92, 246' },
  analytics: { hex: '#F97316', rgb: '249, 115, 22' },
  optimization: { hex: '#3B82F6', rgb: '59, 130, 246' },
  ai: { hex: '#EC4899', rgb: '236, 72, 153' },
};

const Expertise3DIcon: React.FC<Props> = ({ type, size = 120, isHovered = false, mousePosition = null }) => {
  const colors = colorSchemes[type];
  const borderRadius = `${Math.round(size * 0.28)}px`;
  
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [canTrack, setCanTrack] = React.useState(false);
  const [isLifted, setIsLifted] = React.useState(false);
  const [rotationTransition, setRotationTransition] = React.useState('transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)');
  const [isTracking, setIsTracking] = React.useState(false);

  // Manage lift and tracking states with proper timing
  React.useEffect(() => {
    if (isHovered) {
      // Start both lift and tracking immediately
      setIsLifted(true);
      setCanTrack(true);
      // Use slower transition for smooth entry
      setRotationTransition('transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)');
    } else {
      // Exit sequence: instant and simultaneous
      setIsTracking(false);
      setRotationTransition('transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)');
      setCanTrack(false);
      // Lower immediately - no delay, happens together with rotation reset
      setIsLifted(false);
    }
  }, [isHovered]);

  // Calculate rotation based on mouse position from parent
  React.useEffect(() => {
    if (!canTrack || !mousePosition || !containerRef.current) {
      setRotation({ x: 0, y: 0 });
      return;
    }

    // Mark as actively tracking after first movement
    if (!isTracking) {
      setIsTracking(true);
      // After initial entry, use faster transition for responsive tracking
      setTimeout(() => {
        if (canTrack) {
          setRotationTransition('transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)');
        }
      }, 500);
    }

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    
    // Calculate rotation based on mouse position (±15 degrees max)
    // Only horizontal rotation (rotateY), no vertical rotation (rotateX always 0)
    const rotateY = ((mousePosition.x - centerX) / rect.width) * 15;
    const rotateX = 0; // No vertical rotation
    
    setRotation({ x: rotateX, y: rotateY });
  }, [canTrack, mousePosition, isTracking]);

  // Reset rotation when hover ends
  React.useEffect(() => {
    if (!isHovered) {
      setRotation({ x: 0, y: 0 });
    }
  }, [isHovered]);

  const glowConfig = type === 'marketing'
    ? isHovered
      ? {
          shadow: '0 12px 24px -8px rgba(139, 92, 246, 0.6)',
          gradient: 'radial-gradient(ellipse at center bottom, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)',
          bottomGlowOpacity: 0.15,
          embossOpacity: 1.0,
        }
      : {
          shadow: '0 12px 24px -8px rgba(139, 92, 246, 0.4)',
          gradient: 'radial-gradient(ellipse at center bottom, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)',
          bottomGlowOpacity: 0.12,
          embossOpacity: 0.8,
        }
    : type === 'ai'
    ? isHovered
      ? {
          shadow: '0 12px 24px -8px rgba(236, 72, 153, 0.6)',
          gradient: 'radial-gradient(ellipse at center bottom, rgba(236, 72, 153, 0.25) 0%, rgba(236, 72, 153, 0.1) 40%, transparent 70%)',
          bottomGlowOpacity: 0.15,
          embossOpacity: 1.0,
        }
      : {
          shadow: '0 12px 24px -8px rgba(236, 72, 153, 0.4)',
          gradient: 'radial-gradient(ellipse at center bottom, rgba(236, 72, 153, 0.25) 0%, rgba(236, 72, 153, 0.1) 40%, transparent 70%)',
          bottomGlowOpacity: 0.12,
          embossOpacity: 0.8,
        }
    : {
        shadow: `0 12px 24px -8px rgba(${colors.rgb}, ${isHovered ? '0.6' : '0.4'})`,
        gradient: `radial-gradient(ellipse at center bottom, rgba(${colors.rgb}, 0.25) 0%, rgba(${colors.rgb}, 0.1) 40%, transparent 70%)`,
        bottomGlowOpacity: isHovered ? 0.15 : 0.12,
        embossOpacity: isHovered ? 1.0 : 0.8,
      };

  return (
    <div
      ref={containerRef}
      className="icon-wrapper"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        perspective: '1000px',
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        pointerEvents: 'none',
      }}
    >
      {/* External glow layer - bottom only */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '60%',
          background: type === 'marketing'
            ? `radial-gradient(ellipse at center, rgba(139, 92, 246, ${isHovered ? '0.7' : '0'}) 0%, rgba(139, 92, 246, ${isHovered ? '0.45' : '0'}) 40%, rgba(139, 92, 246, ${isHovered ? '0.2' : '0'}) 60%, transparent 80%)`
            : type === 'ai'
            ? `radial-gradient(ellipse at center, rgba(236, 72, 153, ${isHovered ? '0.7' : '0'}) 0%, rgba(236, 72, 153, ${isHovered ? '0.45' : '0'}) 40%, rgba(236, 72, 153, ${isHovered ? '0.2' : '0'}) 60%, transparent 80%)`
            : `radial-gradient(ellipse at center, rgba(${colors.rgb}, ${isHovered ? '0.7' : '0'}) 0%, rgba(${colors.rgb}, ${isHovered ? '0.45' : '0'}) 40%, rgba(${colors.rgb}, ${isHovered ? '0.2' : '0'}) 60%, transparent 80%)`,
          filter: 'blur(16px)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease, background 0.3s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Volumetric container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(145deg, #1A1A1A 0%, #0F0F0F 50%, #0A0A0A 100%)`,
          borderRadius: borderRadius,
          border: '2.5px solid transparent',
          backgroundImage: type === 'marketing'
            ? `
              linear-gradient(145deg, #121212 0%, #080808 50%, #050505 100%),
              linear-gradient(135deg, 
                rgba(255, 255, 255, 1.0) 0%, 
                rgba(255, 255, 255, 0.9) 8%, 
                rgba(255, 255, 255, 0.5) 18%, 
                rgba(255, 255, 255, 0.15) 28%, 
                transparent 38%
              ),
              radial-gradient(ellipse 70% 50% at bottom center, rgba(139, 92, 246, 1.0) 0%, rgba(139, 92, 246, 0.95) 20%, rgba(139, 92, 246, 0.7) 40%, transparent 65%)
            `
            : type === 'ai'
            ? `
              linear-gradient(145deg, #121212 0%, #080808 50%, #050505 100%),
              linear-gradient(135deg, 
                rgba(255, 255, 255, 1.0) 0%, 
                rgba(255, 255, 255, 0.9) 8%, 
                rgba(255, 255, 255, 0.5) 18%, 
                rgba(255, 255, 255, 0.15) 28%, 
                transparent 38%
              ),
              radial-gradient(ellipse 70% 50% at bottom center, rgba(236, 72, 153, 1.0) 0%, rgba(236, 72, 153, 0.95) 20%, rgba(236, 72, 153, 0.7) 40%, transparent 65%)
            `
            : `
              linear-gradient(145deg, #121212 0%, #080808 50%, #050505 100%),
              linear-gradient(135deg, 
                rgba(255, 255, 255, 1.0) 0%, 
                rgba(255, 255, 255, 0.9) 8%, 
                rgba(255, 255, 255, 0.5) 18%, 
                rgba(255, 255, 255, 0.15) 28%, 
                transparent 38%
              ),
              radial-gradient(ellipse 70% 50% at bottom center, rgba(${colors.rgb}, 1.0) 0%, rgba(${colors.rgb}, 0.95) 20%, rgba(${colors.rgb}, 0.7) 40%, transparent 65%)
            `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box, border-box',
          overflow: 'hidden',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isLifted ? 'translateY(-4px)' : 'translateY(0)'}`,
          transformOrigin: 'center center',
          transition: `${rotationTransition}, box-shadow 0.3s ease`,
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.8),
            inset 0 1px 2px rgba(255, 255, 255, 0.15),
            inset 0 -1px 2px rgba(0, 0, 0, 0.6),
            ${glowConfig.shadow}
          `,
        }}
      >
        {/* Subtle gray light overlay on surface */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 85% 85% at top left, rgba(156, 163, 175, 0.35) 0%, rgba(156, 163, 175, 0.2) 25%, rgba(156, 163, 175, 0.1) 45%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        
        {/* Gray light from bottom colored glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: type === 'marketing'
              ? isHovered
                ? 'radial-gradient(ellipse 85% 65% at bottom center, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.0975) 35%, rgba(139, 92, 246, 0.0525) 55%, transparent 75%)'
                : 'radial-gradient(ellipse 85% 65% at bottom center, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.078) 35%, rgba(139, 92, 246, 0.042) 55%, transparent 75%)'
              : type === 'ai'
              ? isHovered
                ? 'radial-gradient(ellipse 85% 65% at bottom center, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0.0975) 35%, rgba(236, 72, 153, 0.0525) 55%, transparent 75%)'
                : 'radial-gradient(ellipse 85% 65% at bottom center, rgba(236, 72, 153, 0.12) 0%, rgba(236, 72, 153, 0.078) 35%, rgba(236, 72, 153, 0.042) 55%, transparent 75%)'
              : `radial-gradient(ellipse 85% 65% at bottom center, rgba(${colors.rgb}, ${glowConfig.bottomGlowOpacity}) 0%, rgba(${colors.rgb}, ${glowConfig.bottomGlowOpacity * 0.65}) 35%, rgba(${colors.rgb}, ${glowConfig.bottomGlowOpacity * 0.35}) 55%, transparent 75%)`,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
          }}
        />
        {/* 3D Symbol */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
          }}
        >
          <svg
            width={size * 0.65}
            height={size * 0.65}
            viewBox="0 0 24 24"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              transformOrigin: 'center center',
              filter: 'none',
            }}
          >
            {type === 'fingerprint' && (
              <>
                <defs>
                  {/* Mask - shape of the symbol */}
                  <mask id="symbol-mask-fingerprint">
                    <FingerprintIcon
                      size={24}
                      stroke="white"
                      strokeWidth={2.0}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </mask>

                  {/* White light overlay - top-left diagonal */}
                  <linearGradient id="white-light-overlay-fingerprint" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="15%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="rgba(255, 255, 255, 0.6)" />
                    <stop offset="45%" stopColor="rgba(255, 255, 255, 0.2)" />
                    <stop offset="60%" stopColor="transparent" />
                  </linearGradient>

                  {/* Bottom edge gradient mask - shows color only on bottom edges */}
                  <linearGradient id="bottom-edge-mask-fingerprint" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="black" stopOpacity="0" />
                    <stop offset="40%" stopColor="black" stopOpacity="0" />
                    <stop offset="70%" stopColor="black" stopOpacity="0.3" />
                    <stop offset="85%" stopColor="black" stopOpacity="1" />
                    <stop offset="100%" stopColor="black" stopOpacity="1" />
                  </linearGradient>

                  {/* Radial gradient from bottom center */}
                  <radialGradient id="unified-bottom-light-fingerprint" cx="50%" cy="85%" r="65%">
                    <stop offset="0%" stopColor="rgba(16, 185, 129, 0.9)" />
                    <stop offset="20%" stopColor="rgba(16, 185, 129, 0.7)" />
                    <stop offset="40%" stopColor="rgba(16, 185, 129, 0.45)" />
                    <stop offset="60%" stopColor="rgba(16, 185, 129, 0.2)" />
                    <stop offset="80%" stopColor="rgba(16, 185, 129, 0.05)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* LAYER 1: Wide radial gradient (background) */}
                <g style={{ mask: 'url(#bottom-edge-mask-fingerprint)' }}>
                  <FingerprintIcon
                    size={24}
                    stroke="url(#unified-bottom-light-fingerprint)"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>

                {/* LAYER 1.5: Colored bottom shadow (embossing effect) */}
                <FingerprintIcon
                  size={24}
                  stroke="rgba(16, 185, 129, 0.8)"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ transform: 'translateY(0.5px)' }}
                />

                {/* LAYER 2: Dark base (creates depth) */}
                <FingerprintIcon
                  size={24}
                  stroke="#064E3B"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                {/* LAYER 3: WHITE LIGHT OVERLAY - applied to entire symbol via mask */}
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  fill="url(#white-light-overlay-fingerprint)"
                  mask="url(#symbol-mask-fingerprint)"
                />
              </>
            )}

            {type === 'web' && (
              <>
                <defs>
                  {/* Mask - shape of the symbol */}
                  <mask id="symbol-mask-web">
                    <g stroke="white" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" fill="none">
                      <MonitorSmartphoneIcon
                        size={24}
                        stroke="white"
                        strokeWidth={2.0}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </g>
                  </mask>

                  {/* White light overlay - top-left diagonal */}
                  <linearGradient id="white-light-overlay-web" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="15%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="rgba(255, 255, 255, 0.6)" />
                    <stop offset="45%" stopColor="rgba(255, 255, 255, 0.2)" />
                    <stop offset="60%" stopColor="transparent" />
                  </linearGradient>

                  {/* Bottom edge gradient mask - shows color only on bottom edges */}
                  <linearGradient id="bottom-edge-mask-web" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="black" stopOpacity="0" />
                    <stop offset="40%" stopColor="black" stopOpacity="0" />
                    <stop offset="70%" stopColor="black" stopOpacity="0.3" />
                    <stop offset="85%" stopColor="black" stopOpacity="1" />
                    <stop offset="100%" stopColor="black" stopOpacity="1" />
                  </linearGradient>

                  {/* Radial gradient from bottom center */}
                  <radialGradient id="unified-bottom-light-web" cx="50%" cy="85%" r="65%">
                    <stop offset="0%" stopColor="rgba(6, 182, 212, 0.9)" />
                    <stop offset="20%" stopColor="rgba(6, 182, 212, 0.7)" />
                    <stop offset="40%" stopColor="rgba(6, 182, 212, 0.45)" />
                    <stop offset="60%" stopColor="rgba(6, 182, 212, 0.2)" />
                    <stop offset="80%" stopColor="rgba(6, 182, 212, 0.05)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* LAYER 1: Wide radial gradient (background) */}
                <g style={{ mask: 'url(#bottom-edge-mask-web)' }}>
                  <g stroke="url(#unified-bottom-light-web)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <MonitorSmartphoneIcon
                      size={24}
                      stroke="url(#unified-bottom-light-web)"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </g>
                </g>

                {/* LAYER 1.5: Colored bottom shadow (embossing effect) */}
                <MonitorSmartphoneIcon
                  size={24}
                  stroke="rgba(6, 182, 212, 0.8)"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ transform: 'translateY(0.5px)' }}
                />

                {/* LAYER 2: Dark base (creates depth) */}
                <g stroke="#0C4A6E" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <MonitorSmartphoneIcon
                    size={24}
                    stroke="#0C4A6E"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>

                {/* LAYER 3: WHITE LIGHT OVERLAY - applied to entire symbol via mask */}
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  fill="url(#white-light-overlay-web)"
                  mask="url(#symbol-mask-web)"
                />
              </>
            )}

            {type === 'marketing' && (
              <>
                <defs>
                  {/* Mask - shape of the symbol */}
                  <mask id="symbol-mask-marketing">
                    <TrendingUpIcon
                      size={24}
                      stroke="white"
                      strokeWidth={2.0}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </mask>

                  {/* White light overlay - top-left diagonal */}
                  <linearGradient id="white-light-overlay-marketing" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="15%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="rgba(255, 255, 255, 0.6)" />
                    <stop offset="45%" stopColor="rgba(255, 255, 255, 0.2)" />
                    <stop offset="60%" stopColor="transparent" />
                  </linearGradient>

                  {/* Bottom edge gradient mask - shows color only on bottom edges */}
                  <linearGradient id="bottom-edge-mask-marketing" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="black" stopOpacity="0" />
                    <stop offset="40%" stopColor="black" stopOpacity="0" />
                    <stop offset="70%" stopColor="black" stopOpacity="0.3" />
                    <stop offset="85%" stopColor="black" stopOpacity="1" />
                    <stop offset="100%" stopColor="black" stopOpacity="1" />
                  </linearGradient>

                  {/* Radial gradient from bottom center */}
                  <radialGradient id="unified-bottom-light-marketing" cx="50%" cy="85%" r="65%">
                    <stop offset="0%" stopColor="rgba(139, 92, 246, 0.9)" />
                    <stop offset="20%" stopColor="rgba(139, 92, 246, 0.7)" />
                    <stop offset="40%" stopColor="rgba(139, 92, 246, 0.45)" />
                    <stop offset="60%" stopColor="rgba(139, 92, 246, 0.2)" />
                    <stop offset="80%" stopColor="rgba(139, 92, 246, 0.05)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* LAYER 1: Wide radial gradient (background) */}
                <g style={{ mask: 'url(#bottom-edge-mask-marketing)' }}>
                  <TrendingUpIcon
                    size={24}
                    stroke="url(#unified-bottom-light-marketing)"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>

                {/* LAYER 1.5: Colored bottom shadow (embossing effect) */}
                <TrendingUpIcon
                  size={24}
                  stroke="rgba(139, 92, 246, 0.8)"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ transform: 'translateY(0.5px)' }}
                />

                {/* LAYER 2: Dark base (creates depth) */}
                <TrendingUpIcon
                  size={24}
                  stroke="#4C1D95"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                {/* LAYER 3: WHITE LIGHT OVERLAY - applied to entire symbol via mask */}
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  fill="url(#white-light-overlay-marketing)"
                  mask="url(#symbol-mask-marketing)"
                />
              </>
            )}

            {type === 'analytics' && (
              <>
                <defs>
                  {/* Mask - shape of the symbol */}
                  <mask id="symbol-mask-analytics">
                    <BarChart3Icon
                      size={24}
                      stroke="white"
                      strokeWidth={2.0}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </mask>

                  {/* White light overlay - top-left diagonal */}
                  <linearGradient id="white-light-overlay-analytics" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="15%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="rgba(255, 255, 255, 0.6)" />
                    <stop offset="45%" stopColor="rgba(255, 255, 255, 0.2)" />
                    <stop offset="60%" stopColor="transparent" />
                  </linearGradient>

                  {/* Bottom edge gradient mask - shows color only on bottom edges */}
                  <linearGradient id="bottom-edge-mask-analytics" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="black" stopOpacity="0" />
                    <stop offset="40%" stopColor="black" stopOpacity="0" />
                    <stop offset="70%" stopColor="black" stopOpacity="0.3" />
                    <stop offset="85%" stopColor="black" stopOpacity="1" />
                    <stop offset="100%" stopColor="black" stopOpacity="1" />
                  </linearGradient>

                  {/* Radial gradient from bottom center */}
                  <radialGradient id="unified-bottom-light-analytics" cx="50%" cy="85%" r="65%">
                    <stop offset="0%" stopColor="rgba(249, 115, 22, 0.9)" />
                    <stop offset="20%" stopColor="rgba(249, 115, 22, 0.7)" />
                    <stop offset="40%" stopColor="rgba(249, 115, 22, 0.45)" />
                    <stop offset="60%" stopColor="rgba(249, 115, 22, 0.2)" />
                    <stop offset="80%" stopColor="rgba(249, 115, 22, 0.05)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* LAYER 1: Wide radial gradient (background) */}
                <g style={{ mask: 'url(#bottom-edge-mask-analytics)' }}>
                  <BarChart3Icon
                    size={24}
                    stroke="url(#unified-bottom-light-analytics)"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>

                {/* LAYER 1.5: Colored bottom shadow (embossing effect) */}
                <BarChart3Icon
                  size={24}
                  stroke="rgba(249, 115, 22, 0.8)"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ transform: 'translateY(0.5px)' }}
                />

                {/* LAYER 2: Dark base (creates depth) */}
                <BarChart3Icon
                  size={24}
                  stroke="#7C2D12"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                {/* LAYER 3: WHITE LIGHT OVERLAY - applied to entire symbol via mask */}
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  fill="url(#white-light-overlay-analytics)"
                  mask="url(#symbol-mask-analytics)"
                />
              </>
            )}

            {type === 'optimization' && (
              <>
                <defs>
                  {/* Mask - shape of the symbol */}
                  <mask id="symbol-mask-optimization">
                    <RefreshCwIcon
                      size={24}
                      stroke="white"
                      strokeWidth={2.0}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </mask>

                  {/* White light overlay - top-left diagonal */}
                  <linearGradient id="white-light-overlay-optimization" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="15%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="rgba(255, 255, 255, 0.6)" />
                    <stop offset="45%" stopColor="rgba(255, 255, 255, 0.2)" />
                    <stop offset="60%" stopColor="transparent" />
                  </linearGradient>

                  {/* Bottom edge gradient mask - shows color only on bottom edges */}
                  <linearGradient id="bottom-edge-mask-optimization" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="black" stopOpacity="0" />
                    <stop offset="40%" stopColor="black" stopOpacity="0" />
                    <stop offset="70%" stopColor="black" stopOpacity="0.3" />
                    <stop offset="85%" stopColor="black" stopOpacity="1" />
                    <stop offset="100%" stopColor="black" stopOpacity="1" />
                  </linearGradient>

                  {/* Radial gradient from bottom center */}
                  <radialGradient id="unified-bottom-light-optimization" cx="50%" cy="85%" r="65%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.9)" />
                    <stop offset="20%" stopColor="rgba(59, 130, 246, 0.7)" />
                    <stop offset="40%" stopColor="rgba(59, 130, 246, 0.45)" />
                    <stop offset="60%" stopColor="rgba(59, 130, 246, 0.2)" />
                    <stop offset="80%" stopColor="rgba(59, 130, 246, 0.05)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* LAYER 1: Wide radial gradient (background) */}
                <g style={{ mask: 'url(#bottom-edge-mask-optimization)' }}>
                  <RefreshCwIcon
                    size={24}
                    stroke="url(#unified-bottom-light-optimization)"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>

                {/* LAYER 1.5: Colored bottom shadow (embossing effect) */}
                <RefreshCwIcon
                  size={24}
                  stroke={`rgba(59, 130, 246, ${glowConfig.embossOpacity})`}
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ transform: 'translateY(0.5px)', transition: 'stroke 0.3s ease' }}
                />

                {/* LAYER 2: Dark base (creates depth) */}
                <RefreshCwIcon
                  size={24}
                  stroke="#1E40AF"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                {/* LAYER 3: WHITE LIGHT OVERLAY - applied to entire symbol via mask */}
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  fill="url(#white-light-overlay-optimization)"
                  mask="url(#symbol-mask-optimization)"
                />
              </>
            )}

            {type === 'ai' && (
              <>
                <defs>
                  {/* Mask - shape of the symbol */}
                  <mask id="symbol-mask-ai">
                    <CpuIcon
                      size={24}
                      stroke="white"
                      strokeWidth={2.0}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </mask>

                  {/* White light overlay - top-left diagonal */}
                  <linearGradient id="white-light-overlay-ai" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="15%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="rgba(255, 255, 255, 0.6)" />
                    <stop offset="45%" stopColor="rgba(255, 255, 255, 0.2)" />
                    <stop offset="60%" stopColor="transparent" />
                  </linearGradient>

                  {/* Bottom edge gradient mask - shows color only on bottom edges */}
                  <linearGradient id="bottom-edge-mask-ai" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="black" stopOpacity="0" />
                    <stop offset="40%" stopColor="black" stopOpacity="0" />
                    <stop offset="70%" stopColor="black" stopOpacity="0.3" />
                    <stop offset="85%" stopColor="black" stopOpacity="1" />
                    <stop offset="100%" stopColor="black" stopOpacity="1" />
                  </linearGradient>

                  {/* Radial gradient from bottom center */}
                  <radialGradient id="unified-bottom-light-ai" cx="50%" cy="85%" r="65%">
                    <stop offset="0%" stopColor="rgba(236, 72, 153, 0.9)" />
                    <stop offset="20%" stopColor="rgba(236, 72, 153, 0.7)" />
                    <stop offset="40%" stopColor="rgba(236, 72, 153, 0.45)" />
                    <stop offset="60%" stopColor="rgba(236, 72, 153, 0.2)" />
                    <stop offset="80%" stopColor="rgba(236, 72, 153, 0.05)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* LAYER 1: Wide radial gradient (background) */}
                <g style={{ mask: 'url(#bottom-edge-mask-ai)' }}>
                  <CpuIcon
                    size={24}
                    stroke="url(#unified-bottom-light-ai)"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>

                {/* LAYER 1.5: Colored bottom shadow (embossing effect) */}
                <CpuIcon
                  size={24}
                  stroke="rgba(236, 72, 153, 0.8)"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ transform: 'translateY(0.5px)' }}
                />

                {/* LAYER 2: Dark base (creates depth) */}
                <CpuIcon
                  size={24}
                  stroke="#831843"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                {/* LAYER 3: WHITE LIGHT OVERLAY - applied to entire symbol via mask */}
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  fill="url(#white-light-overlay-ai)"
                  mask="url(#symbol-mask-ai)"
                />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

// ✅ Мемоизируем компонент для предотвращения лишних ре-рендеров
export default React.memo(Expertise3DIcon);
