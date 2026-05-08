"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Html, Line } from "@react-three/drei";
import * as THREE from "three";

export interface Tree3DMember {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  relation: string;
  parent_id?: string | null;
}

interface PositionedNode extends Tree3DMember {
  x: number;
  y: number;
  z: number;
  depth: number;
  childIndex: number;
  siblings: number;
}

/**
 * Layout: root(s) at the top (y high), children spread radially below at increasing depth.
 * Each generation occupies a horizontal ring; sibling angle is distributed evenly.
 */
function layoutTree(members: Tree3DMember[]): PositionedNode[] {
  if (!members.length) return [];

  const map = new Map<string, Tree3DMember>();
  members.forEach((m) => map.set(m.id, m));

  const childrenOf = new Map<string | null, Tree3DMember[]>();
  members.forEach((m) => {
    const key = m.parent_id || null;
    if (!childrenOf.has(key)) childrenOf.set(key, []);
    childrenOf.get(key)!.push(m);
  });

  const placed: PositionedNode[] = [];
  const ySpacing = 2.8;
  const radiusBase = 2.2;

  type Frame = { node: Tree3DMember; depth: number; angle: number; spread: number; parentX: number; parentZ: number };
  const queue: Frame[] = [];
  const roots = childrenOf.get(null) || [];

  roots.forEach((root, i) => {
    const angle = roots.length > 1 ? (i / roots.length) * Math.PI * 2 : 0;
    queue.push({ node: root, depth: 0, angle, spread: Math.PI * 2, parentX: 0, parentZ: 0 });
  });

  while (queue.length) {
    const { node, depth, angle, spread, parentX, parentZ } = queue.shift()!;
    const r = depth === 0 ? 0 : radiusBase * (1 + depth * 0.45);
    const x = depth === 0 ? parentX : parentX + Math.cos(angle) * r;
    const z = depth === 0 ? parentZ : parentZ + Math.sin(angle) * r;
    const y = -depth * ySpacing + 2;

    const children = childrenOf.get(node.id) || [];
    placed.push({
      ...node,
      x, y, z,
      depth,
      childIndex: 0,
      siblings: children.length,
    });

    if (children.length) {
      const childSpread = Math.min(spread, Math.PI * 1.2);
      const startAngle = angle - childSpread / 2;
      children.forEach((child, i) => {
        const childAngle = children.length === 1 ? angle : startAngle + (i / (children.length - 1 || 1)) * childSpread;
        queue.push({
          node: child,
          depth: depth + 1,
          angle: childAngle,
          spread: childSpread,
          parentX: x,
          parentZ: z,
        });
      });
    }
  }

  return placed;
}

function displayName(n: Tree3DMember): string {
  const fn = n.first_name?.trim();
  const ln = n.last_name?.trim();
  if (fn || ln) return [fn, ln].filter(Boolean).join(" ");
  return n.name || "—";
}

function NodeOrb({ node, focused, onClick }: { node: PositionedNode; focused: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isRoot = node.depth === 0;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    // Subtle pulse
    const scale = 1 + Math.sin(t * 1.5 + node.x) * 0.04;
    meshRef.current.scale.setScalar(focused ? scale * 1.3 : scale);
  });

  const color = isRoot ? "#F2EEDD" : "#B59551";
  const emissive = isRoot ? "#E8C078" : "#8B6B2E";
  const radius = isRoot ? 0.42 : 0.28;

  return (
    <group position={[node.x, node.y, node.z]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh ref={meshRef} onClick={onClick} onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = "default"; }}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={isRoot ? 1.2 : 0.6}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>

        {/* Outer halo glow */}
        <mesh>
          <sphereGeometry args={[radius * 1.6, 32, 32]} />
          <meshBasicMaterial color={emissive} transparent opacity={0.08} />
        </mesh>

        <Html center distanceFactor={10} occlude={false} style={{ pointerEvents: "none" }}>
          <div className="select-none whitespace-nowrap text-center -translate-y-10">
            <p className={`text-xs font-bold ${isRoot ? "text-ivoire-ancien" : "text-or-ancestral"}`} style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
              {displayName(node)}
            </p>
            <p className="text-[9px] uppercase tracking-widest opacity-50" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}>
              {node.relation}
            </p>
          </div>
        </Html>
      </Float>
    </group>
  );
}

function Edges({ nodes }: { nodes: PositionedNode[] }) {
  const lines = useMemo(() => {
    const byId = new Map(nodes.map((n) => [n.id, n] as const));
    const out: { from: [number, number, number]; to: [number, number, number] }[] = [];
    for (const n of nodes) {
      if (!n.parent_id) continue;
      const p = byId.get(n.parent_id);
      if (!p) continue;
      out.push({ from: [p.x, p.y, p.z], to: [n.x, n.y, n.z] });
    }
    return out;
  }, [nodes]);

  return (
    <>
      {lines.map((l, i) => (
        <Line
          key={i}
          points={[l.from, l.to]}
          color="#B59551"
          lineWidth={1.2}
          transparent
          opacity={0.45}
        />
      ))}
    </>
  );
}

function SceneRotate({ children, autoRotate }: { children: React.ReactNode; autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!groupRef.current || !autoRotate) return;
    groupRef.current.rotation.y += delta * 0.06;
  });
  return <group ref={groupRef}>{children}</group>;
}

interface Tree3DProps {
  members: Tree3DMember[];
  focusedId?: string | null;
  onNodeClick?: (id: string) => void;
  autoRotate?: boolean;
}

export default function Tree3D({ members, focusedId, onNodeClick, autoRotate = true }: Tree3DProps) {
  const positioned = useMemo(() => layoutTree(members), [members]);

  if (!members.length) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 rounded-full bg-or-ancestral/10 border border-or-ancestral/20 flex items-center justify-center mb-4 animate-pulse">
          <span className="text-3xl">🌳</span>
        </div>
        <p className="font-display text-lg text-ivoire-ancien/70 mb-1">L'arbre attend sa première graine</p>
        <p className="text-xs text-ivoire-ancien/40">Ajoutez le premier membre de votre lignée.</p>
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1, 9], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#F2EEDD" />
      <pointLight position={[-5, 3, -3]} intensity={0.6} color="#B59551" />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#E8C078" distance={6} />

      {/* Background stars */}
      <Stars radius={50} depth={30} count={1500} factor={3} saturation={0} fade speed={0.5} />

      {/* Auto-rotating group */}
      <SceneRotate autoRotate={autoRotate}>
        <Edges nodes={positioned} />
        {positioned.map((n) => (
          <NodeOrb
            key={n.id}
            node={n}
            focused={focusedId === n.id}
            onClick={() => onNodeClick?.(n.id)}
          />
        ))}
      </SceneRotate>

      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={20}
        autoRotate={false}
        enableDamping
        dampingFactor={0.05}
      />

      <fog attach="fog" args={["#0B1714", 12, 30]} />
    </Canvas>
  );
}
