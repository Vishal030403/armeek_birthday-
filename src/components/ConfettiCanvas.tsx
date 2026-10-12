import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  isHeart: boolean;
  size: number;
  speedX: number;
  speedY: number;
  gravity: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  color: string;
}

// Global dispatch functions
export const confettiEmitter = {
  blast: (x?: number, y?: number, count = 90) => {
    window.dispatchEvent(new CustomEvent('confetti-blast', { detail: { x, y, count } }));
  },
  hearts: (count = 45) => {
    window.dispatchEvent(new CustomEvent('confetti-hearts', { detail: { count } }));
  },
  sparkles: (rect: DOMRect) => {
    window.dispatchEvent(new CustomEvent('confetti-sparkles', { detail: { rect } }));
  },
};

export default function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationId: number | null = null;

    const colors = ['#9D88FF', '#FFB5C5', '#E4802B', '#CABEFF', '#614BBE', '#FFD9E0', '#FFB783', '#F2E2FF'];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    function createParticle(x: number, y: number, isHeart = false): Particle {
      return {
        x,
        y,
        isHeart,
        size: isHeart ? Math.random() * 16 + 12 : Math.random() * 10 + 6,
        speedX: (Math.random() - 0.5) * 16,
        speedY: (Math.random() - 0.7) * 18,
        gravity: 0.35,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    }

    function createHeartFloat(): Particle {
      return {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight - 60,
        isHeart: true,
        size: Math.random() * 18 + 12,
        speedX: (Math.random() - 0.5) * 3,
        speedY: -Math.random() * 6 - 3,
        gravity: -0.04, // Float upward!
        rotation: (Math.random() - 0.5) * 20,
        rotSpeed: (Math.random() - 0.5) * 2,
        opacity: 1,
        color: ['#FFB5C5', '#FFD9E0', '#874D5B', '#9D88FF', '#E4802B'][Math.floor(Math.random() * 5)],
      };
    }

    function loop() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += p.gravity;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.011;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.isHeart) {
          ctx.beginPath();
          const topCurveHeight = p.size * 0.3;
          ctx.moveTo(0, topCurveHeight);
          ctx.bezierCurveTo(0, 0, -p.size / 2, 0, -p.size / 2, topCurveHeight);
          ctx.bezierCurveTo(-p.size / 2, (p.size + topCurveHeight) / 2, 0, p.size, 0, p.size);
          ctx.bezierCurveTo(0, p.size, p.size / 2, (p.size + topCurveHeight) / 2, p.size / 2, topCurveHeight);
          ctx.bezierCurveTo(p.size / 2, 0, 0, 0, 0, topCurveHeight);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }
        ctx.restore();

        if (p.opacity <= 0 || p.y > canvas.height + 60 || p.y < -100) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animationId = requestAnimationFrame(loop);
      } else {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    }

    const startAnimation = () => {
      if (!animationId) {
        animationId = requestAnimationFrame(loop);
      }
    };

    const onBlast = (e: Event) => {
      const custom = e as CustomEvent<{ x?: number; y?: number; count?: number }>;
      const originX = custom.detail?.x ?? window.innerWidth / 2;
      const originY = custom.detail?.y ?? window.innerHeight / 2;
      const count = custom.detail?.count ?? 90;

      for (let i = 0; i < count; i++) {
        particles.push(createParticle(originX, originY, Math.random() > 0.65));
      }
      startAnimation();
    };

    const onHearts = (e: Event) => {
      const custom = e as CustomEvent<{ count?: number }>;
      const count = custom.detail?.count ?? 45;
      for (let i = 0; i < count; i++) {
        particles.push(createHeartFloat());
      }
      startAnimation();
    };

    const onSparkles = (e: Event) => {
      const custom = e as CustomEvent<{ rect: DOMRect }>;
      const rect = custom.detail.rect;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      for (let i = 0; i < 22; i++) {
        const p = createParticle(cx, cy, Math.random() > 0.5);
        p.speedX = (Math.random() - 0.5) * 8;
        p.speedY = (Math.random() - 0.5) * 8 - 2;
        p.size = Math.random() * 6 + 4;
        particles.push(p);
      }
      startAnimation();
    };

    window.addEventListener('confetti-blast', onBlast);
    window.addEventListener('confetti-hearts', onHearts);
    window.addEventListener('confetti-sparkles', onSparkles);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('confetti-blast', onBlast);
      window.removeEventListener('confetti-hearts', onHearts);
      window.removeEventListener('confetti-sparkles', onSparkles);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      id="partyCanvas"
    />
  );
}
