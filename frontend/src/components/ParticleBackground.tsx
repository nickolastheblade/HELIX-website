import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface ParticleBackgroundProps {
  cardRefs?: React.RefObject<HTMLElement>[];
  className?: string;
}

// Easing function for smooth force application
const easeOutQuad = (x: number): number => {
  return 1 - (1 - x) * (1 - x);
};

// Create fragmented geometry for small particles
const createFragmentedGeometry = (size: number): THREE.BufferGeometry => {
  // Proportional segments: 6-10 segments for small particles (enough to look round-ish)
  // Size range: 0.010-0.025 → Segments: 6-10
  const segments = Math.round(6 + ((size - 0.010) / 0.015) * 4);
  const geometry = new THREE.CircleGeometry(size, segments);
  const positions = geometry.attributes.position.array as Float32Array;
  
  // Moderate random deformation (less aggressive than before)
  for (let i = 1; i <= segments; i++) {
    const idx = i * 3; // Each vertex has x, y, z
    const x = positions[idx];
    const y = positions[idx + 1];
    
    // Moderate deviation: 0.6 to 1.4 (±40% from radius) - less extreme
    const randomFactor = 0.6 + Math.random() * 0.8;
    
    positions[idx] = x * randomFactor;
    positions[idx + 1] = y * randomFactor;
  }
  
  geometry.attributes.position.needsUpdate = true;
  return geometry;
};

// Create meteor-like geometry with random dents
const createMeteorGeometry = (size: number): THREE.BufferGeometry => {
  // Proportional segments: 10-16 segments for large particles
  // Size range: 0.025-0.050 → Segments: 10-16
  const segments = Math.round(10 + ((size - 0.025) / 0.025) * 6);
  const geometry = new THREE.CircleGeometry(size, segments);
  const positions = geometry.attributes.position.array as Float32Array;
  
  // Применяем легкую случайную деформацию к каждой вершине (кроме центра)
  for (let i = 1; i <= segments; i++) {
    const idx = i * 3; // Each vertex has x, y, z
    const x = positions[idx];
    const y = positions[idx + 1];
    
    // Случайное отклонение от 0.7 до 1.2 (±30% от радиуса)
    const randomFactor = 0.7 + Math.random() * 0.5;
    
    positions[idx] = x * randomFactor;
    positions[idx + 1] = y * randomFactor;
  }
  
  geometry.attributes.position.needsUpdate = true;
  return geometry;
};

/**
 * Interactive particle background using Three.js
 * Features:
 * - 900 small particles (0.01 radius) with sine wave vertical flow
 * - Particles move up along a sinusoidal axis
 * - Axis shifts peak toward cursor X position
 * - Speed and brightness based on distance to axis (closer = faster + brighter)
 * - Card contouring effect on hover (highest priority)
 * - Magnetic cursor attraction (medium priority)
 * - Smooth easing to prevent jitter
 * - Optimized for 60 FPS
 */
export function ParticleBackground({ cardRefs = [], className = "" }: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 }); // Start at center instead of -1000
  const hoveredCard = useRef<DOMRect | null>(null);
  const sineWaveParams = useRef({
    cursorX: 0, // Target X position of sine peak
    cursorY: 0, // Vertical offset for entire wave
    defaultX: 0.8, // Resting wave position (subtle wave within viewport)
    animationProgress: 0, // Entrance animation progress (0-1)
  });
  const particles = useRef<Array<{
    mesh: THREE.Mesh;
    baseY: number; // Position along sine wave (0-1)
    baseOpacity: number;
    velocity: THREE.Vector3;
    index: number;
    offsetX: number;
    offsetZ: number;
    shouldCheckCardGlow: boolean; // Only ~10% of particles check card glow for performance
    // Spiral motion parameters (optional - only for particles with spiral motion)
    spiralRadius?: number;
    spiralAngle?: number;
    spiralSpeed?: number;
    spiralRotations?: number;
  }>>([]);
  const glowTubes = useRef<THREE.Mesh[]>([]); // Store tube meshes
  const centerAxis = useRef<THREE.Line | null>(null); // Ultra-thin center line
  const spiralLines = useRef<{ line: THREE.Line; spiralRadius: number; spiralAngle: number; spiralRotations: number }[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Add ambient light for StandardMaterial circles to be visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Pure black, alpha 0 for transparency
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-1';
    renderer.domElement.style.pointerEvents = 'none';
    // Remove blur filter - made everything blurry instead of glowing
    
    containerRef.current.appendChild(renderer.domElement);

    // Убираем post-processing - рендерим напрямую без blur
    // const composer = new EffectComposer(renderer);
    // const renderPass = new RenderPass(scene, camera);
    // composer.addPass(renderPass);
    //
    // const bloomPass = new UnrealBloomPass(...)
    // composer.addPass(bloomPass);

    // Create 650 particles (increased from 500 for richer spiral motion)
    const particleCount = 650;

    for (let i = 0; i < particleCount; i++) {
      // Random particle size with bias towards smaller particles
      // 97% будут 0.008-0.020 (мелкие), 3% будут 0.020-0.035 (крупные, уменьшенный максимум)
      const rand = Math.random();
      const particleSize = rand < 0.97 
        ? 0.008 + Math.random() * 0.012  // Мелкие: 0.008-0.020
        : 0.020 + Math.random() * 0.015; // Крупные: 0.020-0.035 (было 0.025-0.050)
      
      // Use meteor geometry for large particles (> 0.020, was > 0.025)
      const particleGeometry = particleSize > 0.020 
        ? createMeteorGeometry(particleSize)
        : createFragmentedGeometry(particleSize);

      // Distribute along Y axis (0-1 for sine wave position)
      const baseY = Math.random();
      
      // 90% of particles will have spiral motion (rotating around main axis)
      const hasSpiral = Math.random() < 0.90;
      
      // Create 3D offset from axis using cylindrical coordinates
      const u = 1 - Math.random();
      const v = Math.random();
      const gaussianZ = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      const radiusFromAxis = Math.abs(gaussianZ) * 0.3; // Distance from axis
      const angle = Math.random() * Math.PI * 2; // Random angle around axis
      
      // Offset in X and Z to create tube around axis
      const offsetX = Math.cos(angle) * radiusFromAxis;
      const offsetZ = Math.sin(angle) * radiusFromAxis;
      
      // Spiral parameters (if particle has spiral motion)
      let spiralRadius: number | undefined;
      let spiralAngle: number | undefined;
      let spiralSpeed: number | undefined;
      let spiralRotations: number | undefined;
      
      if (hasSpiral) {
        spiralRadius = 0.03 + Math.random() * 0.15; // Smaller radius than comets: 0.03-0.18
        spiralAngle = Math.random() * Math.PI * 2;
        spiralSpeed = 0.02 + Math.random() * 0.03; // 0.02-0.05
        spiralRotations = 20 + Math.random() * 20; // 20-40 rotations (very tight spiral)
      }
      
      const x = 0; // Start vertically (no offset)
      const y = (baseY - 0.5) * 12; // Map to screen height (-6 to +6)
      const z = 0; // Start vertically (no offset)

      // Base opacity depends on distance from axis - EXTREME contrast
      const distFromAxis = Math.sqrt(offsetX * offsetX + offsetZ * offsetZ);
      const axisProximity = Math.max(0, 1 - distFromAxis / 0.25); // Very tight radius
      const baseOpacity = 0.05 + axisProximity * 0.85; // 0.05 far, 0.9 close - extreme contrast

      const color = 0xffffff;

      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: baseOpacity,
        blending: THREE.AdditiveBlending, // Restore additive blending for glow effect
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(particleGeometry, material);
      mesh.position.set(x, y, z);
      scene.add(mesh);

      particles.current.push({
        mesh,
        baseY,
        baseOpacity,
        velocity: new THREE.Vector3(
          0,
          0.0015 + Math.random() * 0.001, // Much slower upward velocity (0.0015-0.0025)
          0
        ),
        index: i,
        offsetX,
        offsetZ,
        shouldCheckCardGlow: Math.random() < 0.1, // Only ~10% of particles check card glow
        spiralRadius,
        spiralAngle,
        spiralSpeed,
        spiralRotations,
      });
    }

    // Create simple thin line along sine wave axis
    const tubeSegments = 200; // High resolution for smooth curve
    
    // Make center line more visible to show main spiral axis
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(200 * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25, // More visible (increased from 0.1)
      blending: THREE.AdditiveBlending, // Add subtle glow
    });
    
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    centerAxis.current = line;

    // Create 15 white spiral trajectory lines showing particle paths
    const spiralLineCount = 15;
    for (let i = 0; i < spiralLineCount; i++) {
      // Varied spiral parameters for visual diversity
      const spiralRadius = 0.05 + Math.random() * 0.25; // 0.05-0.30
      const spiralAngle = Math.random() * Math.PI * 2; // Random starting angle
      const spiralRotations = 4 + Math.random() * 12; // 4-16 rotations
      
      // Generate spiral path points
      const pathPoints = [];
      for (let t = 0; t <= 1; t += 0.05) {
        const wavePhase = t * Math.PI * 3;
        const sineValue = Math.sin(wavePhase);
        const axisX = -sineValue * sineWaveParams.current.defaultX;
        
        const pathSpiralAngle = spiralAngle + (t * Math.PI * 2 * spiralRotations);
        const spiralOffsetX = Math.cos(pathSpiralAngle) * spiralRadius;
        const spiralOffsetZ = Math.sin(pathSpiralAngle) * spiralRadius;
        
        const x = axisX + spiralOffsetX;
        const y = (t - 0.5) * 12;
        const z = spiralOffsetZ;
        
        pathPoints.push(new THREE.Vector3(x, y, z));
      }
      
      // Create smooth curve from control points
      const pathCurve = new THREE.CatmullRomCurve3(pathPoints);
      const smoothPathPoints = pathCurve.getPoints(200);
      
      const pathGeometry = new THREE.BufferGeometry().setFromPoints(smoothPathPoints);
      const pathMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15, // Visible white spiral lines
        blending: THREE.AdditiveBlending,
      });
      const spiralLine = new THREE.Line(pathGeometry, pathMaterial);
      scene.add(spiralLine);
      
      spiralLines.current.push({
        line: spiralLine,
        spiralRadius,
        spiralAngle,
        spiralRotations,
      });
    }

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    // Card hover tracking
    const handleCardHover = () => {
      cardRefs.forEach((ref) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const isHovered = ref.current.matches(':hover');
          if (isHovered) {
            hoveredCard.current = rect;
          }
        }
      });
    };

    const handleMouseLeave = () => {
      hoveredCard.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousemove', handleCardHover);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    let animationId: number;
    let lastTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = performance.now();
      const deltaTime = time - lastTime;
      lastTime = time;

      // Entrance animation: smoothly transition from vertical (0) to default wave
      if (sineWaveParams.current.animationProgress < 1) {
        sineWaveParams.current.animationProgress += deltaTime * 0.0008; // Slow entrance over ~1.25 seconds
        if (sineWaveParams.current.animationProgress > 1) {
          sineWaveParams.current.animationProgress = 1;
        }
        
        // Keep cursorX at 0 during entrance animation (stays vertical)
        sineWaveParams.current.cursorX = 0;
        sineWaveParams.current.cursorY = 0; // Keep vertical during entrance
      } else {
        // After entrance, follow cursor
        const targetCursorX = -mousePosition.current.x * 6; // Inverted - cursor right = wave right
        const targetCursorY = Math.max(-1, Math.min(1, mousePosition.current.y * 1.5)); // Very limited vertical: -1 to +1
        
        // Smooth transition from defaultX to cursor position
        sineWaveParams.current.cursorX += (targetCursorX - sineWaveParams.current.cursorX) * 0.15;
        sineWaveParams.current.cursorY += (targetCursorY - sineWaveParams.current.cursorY) * 0.15;
      }

      // Update glow tubes to follow sine wave
      glowTubes.current.forEach((tube) => {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i <= tubeSegments; i++) {
          const baseY = i / tubeSegments; // 0-1
          const wavePhase = baseY * Math.PI * 3;
          const sineValue = Math.sin(wavePhase);
          const axisX = -sineWaveParams.current.cursorX * sineValue;
          const yPos = (baseY - 0.5) * 12 + sineWaveParams.current.cursorY;
          points.push(new THREE.Vector3(axisX, yPos, 0));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeom = tube.geometry as THREE.TubeGeometry;
        tube.geometry.dispose();
        tube.geometry = new THREE.TubeGeometry(
          curve,
          tubeSegments,
          (tubeGeom.parameters as any).radius || 0.012,
          8,
          false
        );
      });

      // Update ultra-thin center line to follow sine wave
      if (centerAxis.current) {
        const positions = centerAxis.current.geometry.attributes.position.array as Float32Array;
        const tubeSegments = 200;
        
        for (let i = 0; i <= tubeSegments; i++) {
          const baseY = i / tubeSegments;
          const wavePhase = baseY * Math.PI * 3;
          const sineValue = Math.sin(wavePhase);
          const axisX = -sineWaveParams.current.cursorX * sineValue;
          const yPos = (baseY - 0.5) * 12 + sineWaveParams.current.cursorY;
          
          positions[i * 3] = axisX;
          positions[i * 3 + 1] = yPos;
          positions[i * 3 + 2] = 0;
        }
        
        centerAxis.current.geometry.attributes.position.needsUpdate = true;
      }

      // Update spiral trajectory lines to follow cursor
      spiralLines.current.forEach(({ line, spiralRadius, spiralAngle, spiralRotations }) => {
        const pathPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
          const wavePhase = t * Math.PI * 3;
          const sineValue = Math.sin(wavePhase);
          const axisX = -sineWaveParams.current.cursorX * sineValue;
          
          const pathSpiralAngle = spiralAngle + (t * Math.PI * 2 * spiralRotations);
          const spiralOffsetX = Math.cos(pathSpiralAngle) * spiralRadius;
          const spiralOffsetZ = Math.sin(pathSpiralAngle) * spiralRadius;
          
          const offsetMultiplier = sineWaveParams.current.animationProgress;
          const x = axisX + spiralOffsetX * offsetMultiplier;
          const y = (t - 0.5) * 12 + sineWaveParams.current.cursorY;
          const z = spiralOffsetZ * offsetMultiplier;
          
          pathPoints.push(new THREE.Vector3(x, y, z));
        }
        
        const pathCurve = new THREE.CatmullRomCurve3(pathPoints);
        const smoothPathPoints = pathCurve.getPoints(200);
        
        const oldGeometry = line.geometry;
        line.geometry = new THREE.BufferGeometry().setFromPoints(smoothPathPoints);
        oldGeometry.dispose();
      });

      particles.current.forEach((particle) => {
        const { mesh, baseY, velocity, baseOpacity, index, offsetX, offsetZ, spiralRadius, spiralAngle, spiralRotations } = particle;

        // Calculate axis position (sine wave with higher frequency)
        const wavePhase = baseY * Math.PI * 3; // 3 full waves instead of 1
        const sineValue = Math.sin(wavePhase);
        const axisX = -sineWaveParams.current.cursorX * sineValue; // Inverted sine direction
        
        // Apply offset only after entrance animation completes
        const offsetMultiplier = sineWaveParams.current.animationProgress;
        
        // Particle position calculation depends on whether it has spiral motion
        if (spiralRadius !== undefined && spiralAngle !== undefined && spiralRotations !== undefined) {
          // Particle with spiral motion (75% of particles)
          const t = baseY; // Progress along path (0-1)
          const pathSpiralAngle = spiralAngle + (t * Math.PI * 2 * spiralRotations);
          const spiralOffsetX = Math.cos(pathSpiralAngle) * spiralRadius;
          const spiralOffsetZ = Math.sin(pathSpiralAngle) * spiralRadius;
          
          mesh.position.x = axisX + spiralOffsetX * offsetMultiplier;
          mesh.position.z = spiralOffsetZ * offsetMultiplier;
        } else {
          // Particle without spiral motion (25% of particles) - move STRICTLY along central axis
          mesh.position.x = axisX; // No offset - exactly on the axis
          mesh.position.z = 0; // No Z offset - strictly on center line
        }
        
        // Y position: base movement + global cursor offset
        const baseYPos = (baseY - 0.5) * 12;
        mesh.position.y = baseYPos + sineWaveParams.current.cursorY;

        // Distance from axis (in XZ plane) - calculate based on actual position
        const actualOffsetX = mesh.position.x - axisX;
        const actualOffsetZ = mesh.position.z;
        const distFromAxis = Math.sqrt(actualOffsetX * actualOffsetX + actualOffsetZ * actualOffsetZ);
        const axisProximity = Math.max(0, 1 - distFromAxis / 0.3); // Tighter for strong contrast
        
        // Speed calculation: depends on particle type
        let speedMultiplier;
        if (spiralRadius !== undefined && spiralAngle !== undefined && spiralRotations !== undefined) {
          // Spiral particles: moderate speed for smooth rotation
          // spiralRadius range: 0.03-0.18 → speed multiplier: 4.0-6.0 (outer faster than inner)
          const spiralDistanceFactor = (spiralRadius - 0.03) / 0.15; // 0-1 normalized
          speedMultiplier = 4.0 + spiralDistanceFactor * 2.0; // 4.0 (close) to 6.0 (far)
        } else {
          // Non-spiral particles on main axis: MUCH SLOWER - central beam is calm
          speedMultiplier = 1.5 + axisProximity * 1.5; // 1.5x-3.0x (much slower than spirals)
        }
        
        // Move upward with calculated speed (halved from 0.016 to 0.008 for calmer movement)
        particle.baseY += velocity.y * speedMultiplier * 0.008;

        // Brightness boost on axis (in addition to base opacity)
        const brightnessBoost = axisProximity * 0.3;

        // Peak glow: brighten particles near actual sine wave peaks
        // Peaks are at baseY = 1/6, 1/2, 5/6 (where sin = ±1 for 3 waves)
        const peakPositions = [1/6, 1/2, 5/6];
        let distanceToPeak = 1.0; // Start with max distance
        
        // Find distance to nearest peak
        for (const peakY of peakPositions) {
          const dist = Math.abs(baseY - peakY);
          distanceToPeak = Math.min(distanceToPeak, dist);
        }
        
        // Glow when close to peak - MUCH WIDER and STRONGER
        const peakProximity = Math.max(0, 1 - distanceToPeak / 0.1); // Narrow radius to see distinct peaks
        const peakGlow = Math.pow(peakProximity, 2) * 8.0; // Lower power + huge multiplier = up to 800% boost!

        // Card glow - NO position change
        let cardGlow = 0;
        if (hoveredCard.current) {
          const card = hoveredCard.current;
          const particleScreen = new THREE.Vector3();
          particleScreen.copy(mesh.position);
          particleScreen.project(camera);
          
          const particleX = (particleScreen.x * 0.5 + 0.5) * window.innerWidth;
          const particleY = (particleScreen.y * -0.5 + 0.5) * window.innerHeight;
          
          const margin = 100;
          if (
            particleX >= card.left - margin &&
            particleX <= card.right + margin &&
            particleY >= card.top - margin &&
            particleY <= card.bottom + margin
          ) {
            const cardCenterX = (card.left + card.right) / 2;
            const cardCenterY = (card.top + card.bottom) / 2;
            const dx = particleX - cardCenterX;
            const dy = particleY - cardCenterY;
            const distToCenter = Math.sqrt(dx * dx + dy * dy);
            const maxDist = Math.sqrt(Math.pow(card.width / 2 + margin, 2) + Math.pow(card.height / 2 + margin, 2));
            cardGlow = Math.max(0, 1 - distToCenter / maxDist) * 0.3;
          }
        }

        // Cursor glow - NO position change
        let cursorGlow = 0;
        const cursorWorldX = mousePosition.current.x * 6;
        const cursorWorldY = mousePosition.current.y * 6;
        const dx = mesh.position.x - cursorWorldX;
        const dy = mesh.position.y - cursorWorldY;
        const distToCursor = Math.sqrt(dx * dx + dy * dy);
        
        if (distToCursor < 2.5) {
          cursorGlow = (1 - distToCursor / 2.5) * 0.3;
        }

        // Update opacity ONLY - no position changes
        const material = mesh.material as THREE.MeshBasicMaterial;

        // Reduce opacity for particles far from axis
        const axisOpacityFactor = 0.3 + axisProximity * 0.7; // 30% to 100% based on distance
        const adjustedBaseOpacity = baseOpacity * axisOpacityFactor;

        // Final opacity with all effects combined
        const finalOpacity = Math.min(1, adjustedBaseOpacity + brightnessBoost + cardGlow + cursorGlow);
        
        // Peak glow: boost RGB brightness at peaks (values > 1.0 create bloom with AdditiveBlending)
        if (peakGlow > 0) {
          // Extreme RGB boost for visible white glow (10-20x brightness)
          const rgbBoost = 1 + peakGlow * 10.0; // Up to 81x brightness at peak center!
          material.color.setRGB(rgbBoost, rgbBoost, rgbBoost);
        } else {
          material.color.setRGB(1.0, 1.0, 1.0); // Normal white
        }
        
        material.opacity = finalOpacity;

        // Respawn at bottom when reaches top
        if (particle.baseY > 1) {
          particle.baseY = 0; // Reset to bottom
          
          // Recalculate random position based on spiral or static offset
          if (particle.spiralRadius !== undefined) {
            // Spiral particle - reset spiral angle
            particle.spiralAngle = Math.random() * Math.PI * 2;
          } else {
            // Static offset particle - recalculate position in tube
            const u = 1 - Math.random();
            const v = Math.random();
            const gaussianZ = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            const radiusFromAxis = Math.abs(gaussianZ) * 0.2;
            const angle = Math.random() * Math.PI * 2;
            
            particle.offsetX = Math.cos(angle) * radiusFromAxis;
            particle.offsetZ = Math.sin(angle) * radiusFromAxis;
          }
          
          // Spawn at START of sine wave (baseY=0, sin(0)=0, so axisX=0)
          const spawnOffsetX = particle.spiralRadius !== undefined 
            ? Math.cos(particle.spiralAngle!) * particle.spiralRadius
            : particle.offsetX;
          const spawnOffsetZ = particle.spiralRadius !== undefined
            ? Math.sin(particle.spiralAngle!) * particle.spiralRadius  
            : particle.offsetZ;
            
          mesh.position.x = spawnOffsetX; // Center + offset
          mesh.position.y = -6 + sineWaveParams.current.cursorY;
          mesh.position.z = spawnOffsetZ;
        }

        // Update baseY
        particle.baseY += velocity.y * 0.004;
        if (particle.baseY > 1) particle.baseY = 0;

        // Keep in bounds
        if (Math.abs(mesh.position.x) > 8) mesh.position.x *= 0.9;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleCardHover);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      particles.current.forEach((p) => scene.remove(p.mesh));
      glowTubes.current.forEach((tube) => {
        tube.geometry.dispose();
        (tube.material as THREE.Material).dispose();
        scene.remove(tube);
      });
      if (centerAxis.current) {
        centerAxis.current.geometry.dispose();
        (centerAxis.current.material as THREE.Material).dispose();
        scene.remove(centerAxis.current);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [cardRefs]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}
