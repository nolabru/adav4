// Define interfaces for our options
interface WaveOptions {
  phase?: number;
  offset?: number;
  frequency?: number;
  amplitude?: number;
}

interface LineOptions {
  spring: number;
}

// Define our environment settings
const E = {
  debug: true,
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
};

// Position tracking
const pos: { x: number; y: number } = { x: 0, y: 0 };

// Global variables
let ctx: any;
let waveGenerator: Wave;
const e = 0;
let lines: Line[] = [];

// Wave generator class
class Wave {
  phase: number = 0;
  offset: number = 0;
  frequency: number = 0.001;
  amplitude: number = 1;

  constructor(options?: WaveOptions) {
    this.init(options || {});
  }

  init(options: WaveOptions): void {
    this.phase = options.phase || 0;
    this.offset = options.offset || 0;
    this.frequency = options.frequency || 0.001;
    this.amplitude = options.amplitude || 1;
  }

  update(): number {
    this.phase += this.frequency;

    const value = this.offset + Math.sin(this.phase) * this.amplitude;

    return value;
  }

  value(): number {
    return e;
  }
}

// Node class for line segments
class Node {
  x: number = 0;
  y: number = 0;
  vy: number = 0;
  vx: number = 0;
}

// Line class for drawing
class Line {
  spring: number = 0.45;
  friction: number = 0.5;
  nodes: Node[] = [];

  constructor(options?: LineOptions) {
    this.init(options || { spring: 0.45 });
  }

  init(options: LineOptions): void {
    this.spring = options.spring + 0.1 * Math.random() - 0.05;
    this.friction = E.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];

    for (let n = 0; n < E.size; n++) {
      const t = new Node();
      t.x = pos.x;
      t.y = pos.y;
      this.nodes.push(t);
    }
  }

  update(): void {
    let e = this.spring;
    let t = this.nodes[0];

    t.vx += (pos.x - t.x) * e;
    t.vy += (pos.y - t.y) * e;

    for (let i = 0, a = this.nodes.length; i < a; i++) {
      t = this.nodes[i];

      if (i > 0) {
        const n = this.nodes[i - 1];
        t.vx += (n.x - t.x) * e;
        t.vy += (n.y - t.y) * e;
        t.vx += n.vx * E.dampening;
        t.vy += n.vy * E.dampening;
      }

      t.vx *= this.friction;
      t.vy *= this.friction;
      t.x += t.vx;
      t.y += t.vy;
      e *= E.tension;
    }
  }

  draw(): void {
    let e, t;
    let n = this.nodes[0].x;
    let i = this.nodes[0].y;

    ctx.beginPath();
    ctx.moveTo(n, i);

    for (let a = 1, o = this.nodes.length - 2; a < o; a++) {
      e = this.nodes[a];
      t = this.nodes[a + 1];
      n = 0.5 * (e.x + t.x);
      i = 0.5 * (e.y + t.y);
      ctx.quadraticCurveTo(e.x, e.y, n, i);
    }

    const a = this.nodes.length - 2;
    e = this.nodes[a];
    t = this.nodes[a + 1];
    ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
    ctx.stroke();
    ctx.closePath();
  }
}

// Mouse movement handler
function onMousemove(e: MouseEvent | TouchEvent): void {
  // Initialize lines
  function initLines(): void {
    lines = [];

    for (let e = 0; e < E.trails; e++) {
      lines.push(new Line({ spring: 0.45 + (e / E.trails) * 0.025 }));
    }
  }

  // Handle mouse/touch position
  function updatePosition(e: MouseEvent | TouchEvent): void {
    if ('touches' in e) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    } else {
      pos.x = e.clientX;
      pos.y = e.clientY;
    }

    e.preventDefault();
  }

  // Handle touch start
  function handleTouchStart(e: TouchEvent): void {
    if (e.touches.length === 1) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    }
  }

  // Set up event listeners
  document.removeEventListener('mousemove', onMousemove);
  document.removeEventListener('touchstart', onMousemove);
  document.addEventListener('mousemove', updatePosition as any);
  document.addEventListener('touchmove', updatePosition as any);
  document.addEventListener('touchstart', handleTouchStart as any);

  // Initialize
  updatePosition(e);
  initLines();
  render();
}

// Render function
function render(): void {
  if (ctx.running) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'hsla(' + Math.round(waveGenerator.update()) + ',100%,50%,0.025)';
    ctx.lineWidth = 10;

    for (let t = 0; t < E.trails; t++) {
      const line = lines[t];
      line.update();
      line.draw();
    }

    ctx.frame++;
    window.requestAnimationFrame(render);
  }
}

// Resize canvas function
function resizeCanvas(): void {
  ctx.canvas.width = window.innerWidth - 20;
  ctx.canvas.height = window.innerHeight;
}

// Main canvas rendering function
export const renderCanvas = function (): void {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!canvas) {
    return;
  }

  ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  ctx.running = true;
  ctx.frame = 1;

  waveGenerator = new Wave({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });

  document.addEventListener('mousemove', onMousemove as any);
  document.addEventListener('touchstart', onMousemove as any);
  document.body.addEventListener('orientationchange', resizeCanvas);
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('focus', () => {
    if (!ctx.running) {
      ctx.running = true;
      render();
    }
  });

  window.addEventListener('blur', () => {
    ctx.running = true;
  });

  resizeCanvas();
};
