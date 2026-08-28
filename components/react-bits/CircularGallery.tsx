"use client";

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import "./CircularGallery.css";

export type GalleryItem = {
  image: string;
  text: string;
};

type CircularGalleryProps = {
  items: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
};

type ScrollState = {
  ease: number;
  current: number;
  target: number;
  last: number;
  position: number;
};

type Size = { width: number; height: number };

function debounce<T extends (...args: never[]) => void>(fn: T, wait: number) {
  let timer = 0;
  return (...args: Parameters<T>) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function fontSizePx(font: string) {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(
  gl: Renderer["gl"],
  text: string,
  font: string,
  color: string,
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.font = font;
  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(fontSizePx(font) * 1.2);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  mesh: Mesh;

  constructor({
    gl,
    plane,
    text,
    textColor,
    font,
  }: {
    gl: Renderer["gl"];
    plane: Mesh;
    text: string;
    textColor: string;
    font: string;
  }) {
    const packed = createTextTexture(gl, text, font, textColor);
    if (!packed) {
      this.mesh = new Mesh(gl, {
        geometry: new Plane(gl),
        program: new Program(gl, {
          vertex: "attribute vec3 position; void main(){ gl_Position = vec4(position,1.0); }",
          fragment: "void main(){ gl_FragColor = vec4(0.0); }",
          transparent: true,
        }),
      });
      return;
    }

    const { texture, width, height } = packed;
    const geometry = new Plane(gl);
    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });

    this.mesh = new Mesh(gl, { geometry, program });
    const aspect = width / height;
    const textHeight = plane.scale.y * 0.15;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
    this.mesh.setParent(plane);
  }
}

class Media {
  extra = 0;
  geometry: Plane;
  gl: Renderer["gl"];
  image: string;
  index: number;
  length: number;
  scene: Transform;
  screen: Size;
  text: string;
  viewport: Size;
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
  program: Program;
  plane: Mesh;
  title: Title | null = null;
  scale = 1;
  padding = 2;
  width = 0;
  widthTotal = 0;
  x = 0;
  speed = 0;
  isBefore = false;
  isAfter = false;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius,
    font,
  }: {
    geometry: Plane;
    gl: Renderer["gl"];
    image: string;
    index: number;
    length: number;
    scene: Transform;
    screen: Size;
    text: string;
    viewport: Size;
    bend: number;
    textColor: string;
    borderRadius: number;
    font: string;
  }) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.program = this.createShader();
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
    if (this.text.trim()) {
      this.title = new Title({
        gl: this.gl,
        plane: this.plane,
        text: this.text,
        textColor: this.textColor,
        font: this.font,
      });
    }
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    const program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [1, 1] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    const img = new Image();
    img.decoding = "async";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
    return program;
  }

  update(scroll: ScrollState, direction: "left" | "right") {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(Math.max(R * R - effectiveX * effectiveX, 0));
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport }: { screen?: Size; viewport?: Size } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    this.scale = this.screen.height / 1500;
    this.plane.scale.y =
      (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x =
      (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: ScrollState;
  renderer: Renderer;
  gl: Renderer["gl"];
  camera: Camera;
  scene: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  screen: Size = { width: 1, height: 1 };
  viewport: Size = { width: 1, height: 1 };
  raf = 0;
  isDown = false;
  start = 0;
  boundOnResize: () => void;
  boundOnWheel: (e: WheelEvent) => void;
  boundOnPointerDown: (e: PointerEvent) => void;
  boundOnPointerMove: (e: PointerEvent) => void;
  boundOnPointerUp: () => void;
  boundOnKeyDown: (e: KeyboardEvent) => void;
  onCheckDebounced: () => void;

  constructor(
    container: HTMLElement,
    {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
    }: {
      items: GalleryItem[];
      bend: number;
      textColor: string;
      borderRadius: number;
      font: string;
      scrollSpeed: number;
      scrollEase: number;
    },
  ) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = {
      ease: scrollEase,
      current: 0,
      target: 0,
      last: 0,
      position: 0,
    };
    this.onCheckDebounced = debounce(() => this.onCheck(), 200);

    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);

    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
    this.scene = new Transform();

    this.boundOnResize = () => this.onResize();
    this.boundOnWheel = (e) => this.onWheel(e);
    this.boundOnPointerDown = (e) => this.onPointerDown(e);
    this.boundOnPointerMove = (e) => this.onPointerMove(e);
    this.boundOnPointerUp = () => this.onPointerUp();
    this.boundOnKeyDown = (e) => this.onKeyDown(e);

    this.onResize();
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.addEventListeners();
    this.update();
  }

  createMedias(
    items: GalleryItem[],
    bend: number,
    textColor: string,
    borderRadius: number,
    font: string,
  ) {
    const galleryItems = items.length ? items.concat(items) : items;
    this.medias = galleryItems.map(
      (data, index) =>
        new Media({
          geometry: this.planeGeometry,
          gl: this.gl,
          image: data.image,
          index,
          length: galleryItems.length,
          scene: this.scene,
          screen: this.screen,
          text: data.text,
          viewport: this.viewport,
          bend,
          textColor,
          borderRadius,
          font,
        }),
    );
  }

  onPointerDown(e: PointerEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.clientX;
    this.container.setPointerCapture(e.pointerId);
  }

  onPointerMove(e: PointerEvent) {
    if (!this.isDown) return;
    const distance = (this.start - e.clientX) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }

  onPointerUp() {
    this.isDown = false;
    this.onCheck();
  }

  onWheel(e: WheelEvent) {
    // Vertical wheel belongs to page snap so you can leave this frame.
    // Only sideways trackpad / shift-wheel spins the ring.
    if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) return;

    e.preventDefault();
    e.stopPropagation();
    this.scroll.target +=
      (e.deltaX > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounced();
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      this.scroll.target += this.scrollSpeed * 5;
      this.onCheckDebounced();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      this.scroll.target -= this.scrollSpeed * 5;
      this.onCheckDebounced();
    } else if (e.key === "Home") {
      e.preventDefault();
      this.scroll.target = 0;
      this.onCheckDebounced();
    }
  }

  onCheck() {
    const first = this.medias[0];
    if (!first) return;
    const width = first.width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / Math.max(this.screen.height, 1),
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    this.medias.forEach((media) =>
      media.onResize({ screen: this.screen, viewport: this.viewport }),
    );
  }

  update = () => {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease,
    );
    const direction: "left" | "right" =
      this.scroll.current > this.scroll.last ? "right" : "left";
    this.medias.forEach((media) => media.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update);
  };

  addEventListeners() {
    window.addEventListener("resize", this.boundOnResize);
    this.container.addEventListener("wheel", this.boundOnWheel, {
      passive: false,
    });
    this.container.addEventListener("pointerdown", this.boundOnPointerDown);
    this.container.addEventListener("pointermove", this.boundOnPointerMove);
    this.container.addEventListener("pointerup", this.boundOnPointerUp);
    this.container.addEventListener("pointercancel", this.boundOnPointerUp);
    this.container.addEventListener("keydown", this.boundOnKeyDown);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    this.container.removeEventListener("wheel", this.boundOnWheel);
    this.container.removeEventListener("pointerdown", this.boundOnPointerDown);
    this.container.removeEventListener("pointermove", this.boundOnPointerMove);
    this.container.removeEventListener("pointerup", this.boundOnPointerUp);
    this.container.removeEventListener("pointercancel", this.boundOnPointerUp);
    this.container.removeEventListener("keydown", this.boundOnKeyDown);
    const canvas = this.gl.canvas;
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#fec700",
  borderRadius = 0,
  font = "900 28px zuume",
  scrollSpeed = 2,
  scrollEase = 0.02,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStaticMode(true);
      return;
    }

    const el = containerRef.current;
    if (!el || !items.length) return;

    let app: App | null = null;
    let alive = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || app || !alive || !containerRef.current) {
          return;
        }
        app = new App(containerRef.current, {
          items,
          bend,
          textColor,
          borderRadius,
          font,
          scrollSpeed,
          scrollEase,
        });
      },
      { rootMargin: "80px", threshold: 0.05 },
    );

    io.observe(el);

    return () => {
      alive = false;
      io.disconnect();
      app?.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

  if (staticMode) {
    return (
      <div
        className="circular-gallery circular-gallery-static"
        role="region"
        aria-label="IU25 photo gallery"
      >
        {items.map((item) => (
          <img key={item.image} src={item.image} alt="" />
        ))}
      </div>
    );
  }

  return (
    <div
      className="circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Circular image gallery. Drag, scroll, or use left and right arrows."
    />
  );
}
