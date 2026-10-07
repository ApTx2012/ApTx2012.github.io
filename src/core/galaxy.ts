/**
 * Three.js 3D 粒子星系背景
 * - 数千粒子构成旋转星云
 * - 鼠标交互：视差旋转
 * - 性能自适应：移动端降低粒子数
 */
import * as THREE from 'three';

export interface GalaxyHandle {
  destroy: () => void;
}

export function initGalaxy(canvas: HTMLCanvasElement): GalaxyHandle {
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COUNT = isMobile ? 2500 : 6500;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x05060f, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060f, 0.0016);

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 260);

  // ---------- 主星系粒子 ----------
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  const cCyan = new THREE.Color(0x00f0ff);
  const cMagenta = new THREE.Color(0xff2e97);
  const cPurple = new THREE.Color(0xa06bff);

  for (let i = 0; i < COUNT; i++) {
    // 螺旋星系分布
    const radius = Math.pow(Math.random(), 0.7) * 420;
    const armCount = 3;
    const arm = i % armCount;
    const armAngle = (arm / armCount) * Math.PI * 2;
    const spin = radius * 0.012;
    const angle = armAngle + spin + (Math.random() - 0.5) * 0.9;
    const spread = (Math.random() - 0.5) * (40 + radius * 0.12);

    const x = Math.cos(angle) * radius + spread;
    const y = (Math.random() - 0.5) * (60 + radius * 0.08) + Math.sin(radius * 0.01) * 20;
    const z = Math.sin(angle) * radius + spread;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // 内圈偏洋红，外圈偏青紫
    const t = radius / 420;
    const col = cMagenta.clone().lerp(cCyan, t).lerp(cPurple, Math.random() * 0.4);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // 圆形软粒子纹理
  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = spriteCanvas.height = 64;
  const ctx = spriteCanvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const spriteTex = new THREE.CanvasTexture(spriteCanvas);

  const mat = new THREE.PointsMaterial({
    size: 3.2,
    map: spriteTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // ---------- 核心光晕 ----------
  const coreGeo = new THREE.SphereGeometry(6, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.85 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  const haloGeo = new THREE.SphereGeometry(22, 32, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Mesh(haloGeo, haloMat));

  // ---------- 鼠标视差 ----------
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };

  const onPointerMove = (e: PointerEvent) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // ---------- 尺寸 ----------
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  // ---------- 渲染循环 ----------
  let raf = 0;
  let running = true;
  const clock = new THREE.Clock();

  const tick = () => {
    if (!running) return;
    const t = clock.getElapsedTime();

    if (!reduced) {
      points.rotation.y = t * 0.045;
      points.rotation.x = Math.sin(t * 0.12) * 0.08;
    }

    // 平滑鼠标视差
    current.x += (target.x - current.x) * 0.04;
    current.y += (target.y - current.y) * 0.04;
    camera.position.x = current.x * 55;
    camera.position.y = -current.y * 35;
    camera.lookAt(0, 0, 0);

    // 核心呼吸
    const pulse = 1 + Math.sin(t * 1.6) * 0.18;
    core.scale.setScalar(pulse);
    coreMat.opacity = 0.65 + Math.sin(t * 1.6) * 0.2;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  tick();

  // 页面隐藏时暂停，省电
  const onVisibility = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      tick();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      geo.dispose();
      mat.dispose();
      spriteTex.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      renderer.dispose();
    },
  };
}