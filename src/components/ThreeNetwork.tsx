"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NetworkPointsProps {
  count: number;
}

function NetworkPoints({ count }: NetworkPointsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate random spherical positions
  const { positions, linePositions } = useMemo(() => {
    const tempPositions = new Float32Array(count * 3);
    const tempLines: number[] = [];
    const radius = 6;

    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      tempPositions[i * 3] = x + THREE.MathUtils.randFloatSpread(1.5);
      tempPositions[i * 3 + 1] = y + THREE.MathUtils.randFloatSpread(1.5);
      tempPositions[i * 3 + 2] = z + THREE.MathUtils.randFloatSpread(1.5);
    }

    // Connect close points
    for (let i = 0; i < count; i++) {
      const x1 = tempPositions[i * 3];
      const y1 = tempPositions[i * 3 + 1];
      const z1 = tempPositions[i * 3 + 2];

      // Check against subsequent points to find close ones
      let connections = 0;
      for (let j = i + 1; j < count; j++) {
        if (connections >= 2) break; // Limit edges per node for performance

        const x2 = tempPositions[j * 3];
        const y2 = tempPositions[j * 3 + 1];
        const z2 = tempPositions[j * 3 + 2];

        const dist = Math.sqrt(
          (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2
        );

        if (dist < 4.5) {
          tempLines.push(x1, y1, z1, x2, y2, z2);
          connections++;
        }
      }
    }

    return {
      positions: tempPositions,
      linePositions: new Float32Array(tempLines),
    };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
      pointsRef.current.rotation.x = time * 0.02;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.05;
      linesRef.current.rotation.x = time * 0.02;
    }
  });

  return (
    <group>
      {/* Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#0A66C2"
          size={0.15}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
        />
      </points>

      {/* Edges */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#0A66C2"
          transparent={true}
          opacity={0.15}
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
}

export default function ThreeNetwork() {
  return (
    <div className="w-full h-full min-h-[300px] relative rounded-[2rem] overflow-hidden border border-slate-200/60 bg-white/40 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-slate-100">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <ambientLight intensity={1.5} />
          <NetworkPoints count={120} />
        </Canvas>
      </div>

      <div className="relative z-10 p-6 pointer-events-none text-center select-none">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/50 px-3 py-1 text-[10px] font-black text-[#0077b5]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0077b5] animate-pulse" />
          Connection Topology Active
        </div>
      </div>
    </div>
  );
}
