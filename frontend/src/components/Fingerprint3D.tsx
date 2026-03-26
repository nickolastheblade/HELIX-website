import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  size: number;
  color: string;
}

const FingerprintGeometry: React.FC<{ color: string }> = ({ color }) => {
  // Create 3D tube geometries for each fingerprint arc
  const tubes = useMemo(() => {
    const arcs = [
      { radius: 1.0, start: 0.3, end: 1.9, thickness: 0.12 },
      { radius: 1.4, start: 0.2, end: 2.0, thickness: 0.13 },
      { radius: 1.8, start: 0.15, end: 2.1, thickness: 0.14 },
      { radius: 2.2, start: 0.1, end: 2.15, thickness: 0.15 },
      { radius: 2.6, start: 0.05, end: 2.2, thickness: 0.16 },
    ];

    return arcs.map((arc, index) => {
      // Create 2D curve for the arc
      const curve = new THREE.EllipseCurve(
        0, 0,           // center
        arc.radius, arc.radius, // radii
        arc.start, arc.end * Math.PI, // angles
        false,          // clockwise
        0               // rotation
      );

      // Get points and convert to 3D path
      const points = curve.getPoints(50);
      const path = new THREE.CatmullRomCurve3(
        points.map(p => new THREE.Vector3(p.x, p.y, 0))
      );

      // Create tube geometry
      const geometry = new THREE.TubeGeometry(
        path,
        64,              // tubular segments
        arc.thickness,   // radius
        8,               // radial segments
        false            // closed
      );

      return { geometry, key: `arc-${index}` };
    });
  }, []);

  return (
    <group>
      {tubes.map(({ geometry, key }) => (
        <mesh key={key} geometry={geometry}>
          <meshStandardMaterial
            color="#D1D5DB"
            metalness={0.7}
            roughness={0.2}
            emissive="#000000"
            emissiveIntensity={0}
          />
        </mesh>
      ))}

      {/* Lighting */}
      <directionalLight
        position={[3, 5, 3]}
        intensity={1.5}
        color="#FFFFFF"
      />
      <pointLight
        position={[0, -2, 2]}
        intensity={1.2}
        color={color}
        distance={8}
        decay={2}
      />
      <ambientLight intensity={0.4} color="#FFFFFF" />
    </group>
  );
};

const Fingerprint3D: React.FC<Props> = ({ size, color }) => {
  return (
    <Canvas
      style={{ width: size, height: size }}
      camera={{
        position: [0, 0, 8],
        fov: 35,
      }}
      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      <FingerprintGeometry color={color} />
    </Canvas>
  );
};

export default Fingerprint3D;
