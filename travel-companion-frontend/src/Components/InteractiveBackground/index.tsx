import React, { useRef, useEffect, useCallback } from 'react';
import styles from './index.module.css';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

const PARTICLE_COUNT_FACTOR = 0.00004;
const CONNECTION_DISTANCE = 140;
const MOUSE_RADIUS = 180;
const MOUSE_PUSH_STRENGTH = 0.08;
const RETURN_SPEED = 0.03;
const FRICTION = 0.92;
const RIPPLE_SPEED = 6;
const RIPPLE_PUSH = 3;

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef<number>(0);
  const dprRef = useRef(1);

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.floor(width * height * PARTICLE_COUNT_FACTOR);
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        radius: 1.5 + Math.random() * 1.5,
        baseRadius: 1.5 + Math.random() * 1.5,
      });
    }
    particlesRef.current = particles;
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = dprRef.current;
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;
    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: 300 * dpr,
      opacity: 1,
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = dprRef.current;
    mouseRef.current.x = (e.clientX - rect.left) * dpr;
    mouseRef.current.y = (e.clientY - rect.top) * dpr;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    const animate = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const ripples = ripplesRef.current;
      const mouse = mouseRef.current;
      const mouseRadiusScaled = MOUSE_RADIUS * dpr;

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += RIPPLE_SPEED * dpr;
        r.opacity = 1 - r.radius / r.maxRadius;
        if (r.opacity <= 0) {
          ripples.splice(i, 1);
        }
      }

      // Update particles
      for (const p of particles) {
        // Mouse interaction
        const dxM = p.x - mouse.x;
        const dyM = p.y - mouse.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);

        if (distM < mouseRadiusScaled && distM > 0) {
          const force =
            (1 - distM / mouseRadiusScaled) * MOUSE_PUSH_STRENGTH * dpr;
          p.vx += (dxM / distM) * force;
          p.vy += (dyM / distM) * force;
          p.radius = p.baseRadius + (1 - distM / mouseRadiusScaled) * 2;
        } else {
          p.radius += (p.baseRadius - p.radius) * 0.1;
        }

        // Ripple interaction
        for (const r of ripples) {
          const dxR = p.x - r.x;
          const dyR = p.y - r.y;
          const distR = Math.sqrt(dxR * dxR + dyR * dyR);
          const ringDist = Math.abs(distR - r.radius);
          if (ringDist < 30 * dpr && distR > 0) {
            const push = (1 - ringDist / (30 * dpr)) * RIPPLE_PUSH * r.opacity;
            p.vx += (dxR / distR) * push;
            p.vy += (dyR / distR) * push;
          }
        }

        // Return to base
        p.vx += (p.baseX - p.x) * RETURN_SPEED;
        p.vy += (p.baseY - p.y) * RETURN_SPEED;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      const connDist = CONNECTION_DISTANCE * dpr;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connDist) {
            const alpha = (1 - dist / connDist) * 0.25;
            ctx.strokeStyle = `rgba(79, 110, 247, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const dxM = p.x - mouse.x;
        const dyM = p.y - mouse.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        const proximity = distM < mouseRadiusScaled ? 1 - distM / mouseRadiusScaled : 0;

        // Glow
        if (proximity > 0.1) {
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.radius * 6,
          );
          gradient.addColorStop(
            0,
            `rgba(79, 110, 247, ${proximity * 0.4})`,
          );
          gradient.addColorStop(1, 'rgba(79, 110, 247, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core dot
        const coreAlpha = 0.4 + proximity * 0.6;
        ctx.fillStyle = `rgba(79, 110, 247, ${coreAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw ripple rings
      for (const r of ripples) {
        ctx.strokeStyle = `rgba(79, 110, 247, ${r.opacity * 0.5})`;
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [initParticles, handleMouseMove, handleMouseLeave, handleClick]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default InteractiveBackground;
