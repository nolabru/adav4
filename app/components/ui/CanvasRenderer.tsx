interface NOptions {
  phase?: number;
  offset?: number;
  frequency?: number;
  amplitude?: number;
}

function n(this: any, e: NOptions) {
  this.init(e || {});
}
n.prototype = {
  // @ts-ignore - prototype method with 'this' context
  init(e) {
    // @ts-ignore - accessing dynamic property
    this.phase = e.phase || 0;

    // @ts-ignore - accessing dynamic property
    this.offset = e.offset || 0;

    // @ts-ignore - accessing dynamic property
    this.frequency = e.frequency || 0.001;

    // @ts-ignore - accessing dynamic property
    this.amplitude = e.amplitude || 1;
  },
  update() {
    // @ts-ignore - modifying dynamic property
    this.phase += this.frequency;

    // @ts-ignore - assigning to external variable
    e = this.offset + Math.sin(this.phase) * this.amplitude;

    return e;
  },
  value() {
    return e;
  },
};

interface LineOptions {
  spring: number;
}

function Line(this: any, e: LineOptions) {
  this.init(e || {});
}

Line.prototype = {
  // @ts-ignore - prototype method with 'this' context
  init(e) {
    // @ts-ignore - accessing dynamic property
    this.spring = e.spring + 0.1 * Math.random() - 0.05;

    // @ts-ignore - accessing dynamic property
    this.friction = E.friction + 0.01 * Math.random() - 0.005;

    // @ts-ignore - accessing dynamic property
    this.nodes = [];

    for (let t, n = 0; n < E.size; n++) {
      t = new (Node as any)();

      // @ts-ignore - assigning to dynamic property
      t.x = pos.x;

      // @ts-ignore - assigning to dynamic property
      t.y = pos.y;

      // @ts-ignore - accessing dynamic property
      this.nodes.push(t);
    }
  },
  update() {
    // @ts-ignore - accessing dynamic property
    let e = this.spring,
      // @ts-ignore - accessing dynamic property
      t = this.nodes[0];

    // @ts-ignore - modifying dynamic property
    t.vx += (pos.x - t.x) * e;

    // @ts-ignore - modifying dynamic property
    t.vy += (pos.y - t.y) * e;

    // @ts-ignore - accessing dynamic property
    for (let n, i = 0, a = this.nodes.length; i < a; i++) {
      // @ts-ignore - needed to access nodes array
      t = this.nodes[i];

      if (0 < i) {
        // @ts-ignore - accessing dynamic property
        n = this.nodes[i - 1];
        t.vx += (n.x - t.x) * e;
        t.vy += (n.y - t.y) * e;
        t.vx += n.vx * E.dampening;
        t.vy += n.vy * E.dampening;
      }

      // @ts-ignore - modifying dynamic property
      t.vx *= this.friction;

      // @ts-ignore - modifying dynamic property
      t.vy *= this.friction;
      t.x += t.vx;
      t.y += t.vy;
      e *= E.tension;
    }
  },
  draw() {
    let e, t;

    // @ts-ignore - accessing dynamic property
    let n = this.nodes[0].x,
      // @ts-ignore - accessing dynamic property
      i = this.nodes[0].y;

    // @ts-ignore - accessing canvas context
    ctx.beginPath();

    // @ts-ignore - accessing canvas context
    ctx.moveTo(n, i);

    // @ts-ignore - accessing dynamic property
    for (let a = 1, o = this.nodes.length - 2; a < o; a++) {
      // @ts-ignore - accessing dynamic property
      e = this.nodes[a];

      // @ts-ignore - accessing dynamic property
      t = this.nodes[a + 1];
      n = 0.5 * (e.x + t.x);
      i = 0.5 * (e.y + t.y);

      // @ts-ignore - accessing canvas context
      ctx.quadraticCurveTo(e.x, e.y, n, i);
    }

    // @ts-ignore - accessing dynamic property
    e = this.nodes[a];

    // @ts-ignore - accessing dynamic property
    t = this.nodes[a + 1];

    // @ts-ignore - accessing canvas context
    ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);

    // @ts-ignore - accessing canvas context
    ctx.stroke();

    // @ts-ignore - accessing canvas context
    ctx.closePath();
  },
};

// @ts-ignore - event handler with DOM manipulation
function onMousemove(e) {
  function o() {
    lines = [];

    for (let e = 0; e < E.trails; e++) {
      lines.push(new (Line as any)({ spring: 0.45 + (e / E.trails) * 0.025 }));
    }
  }

  // @ts-ignore - event handler function
  function c(e) {
    if (e.touches) {
      // @ts-ignore - touch event handling
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    } else {
      // @ts-ignore - mouse event handling
      pos.x = e.clientX;
      pos.y = e.clientY;
    }

    e.preventDefault();
  }

  // @ts-ignore - touch event handler
  function l(e) {
    // @ts-ignore - touch event handling
    if (1 == e.touches.length) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    }
  }
  document.removeEventListener('mousemove', onMousemove);
  document.removeEventListener('touchstart', onMousemove);
  document.addEventListener('mousemove', c);
  document.addEventListener('touchmove', c);
  document.addEventListener('touchstart', l);
  c(e);
  o();
  render();
}

function render() {
  // @ts-ignore - accessing canvas context
  if (ctx.running) {
    // @ts-ignore - accessing canvas context
    ctx.globalCompositeOperation = 'source-over';

    // @ts-ignore - accessing canvas context
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // @ts-ignore - accessing canvas context
    ctx.globalCompositeOperation = 'lighter';

    // @ts-ignore - accessing canvas context
    ctx.strokeStyle = 'hsla(' + Math.round(f.update()) + ',100%,50%,0.025)';

    // @ts-ignore - accessing canvas context
    ctx.lineWidth = 10;

    for (let e, t = 0; t < E.trails; t++) {
      // @ts-ignore - accessing array element
      e = lines[t];
      e.update();
      e.draw();
    }

    // @ts-ignore - accessing canvas context
    ctx.frame++;
    window.requestAnimationFrame(render);
  }
}

function resizeCanvas() {
  // @ts-ignore - accessing canvas context
  ctx.canvas.width = window.innerWidth - 20;

  // @ts-ignore - accessing canvas context
  ctx.canvas.height = window.innerHeight;
}

interface NodeType {
  x: number;
  y: number;
  vy: number;
  vx: number;
}

interface LineType {
  spring: number;
  friction: number;
  nodes: NodeType[];
  update: () => void;
  draw: () => void;
}

interface NType {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;
  update: () => number;
  value: () => number;
}

let ctx: any;
let f: NType;
let e = 0;
const pos: { x: number; y: number } = { x: 0, y: 0 };
let lines: LineType[] = [];
const E = {
  debug: true,
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
};

function Node(this: NodeType) {
  this.x = 0;
  this.y = 0;
  this.vy = 0;
  this.vx = 0;
}

export const renderCanvas = function () {
  // @ts-ignore - DOM manipulation
  ctx = document.getElementById('canvas').getContext('2d');
  ctx.running = true;
  ctx.frame = 1;
  f = new (n as any)({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });
  document.addEventListener('mousemove', onMousemove);
  document.addEventListener('touchstart', onMousemove);
  document.body.addEventListener('orientationchange', resizeCanvas);
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('focus', () => {
    // @ts-ignore - accessing canvas context
    if (!ctx.running) {
      // @ts-ignore - accessing canvas context
      ctx.running = true;
      render();
    }
  });
  window.addEventListener('blur', () => {
    // @ts-ignore - accessing canvas context
    ctx.running = true;
  });
  resizeCanvas();
};
