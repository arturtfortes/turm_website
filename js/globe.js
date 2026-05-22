(function initHubGlobe(){
  const container = document.getElementById('hub-globe');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080A0D, 0.045);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 20);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const objectGroup = new THREE.Group();
  scene.add(objectGroup);

  const geometry = new THREE.IcosahedronGeometry(6.2, 40);
  const uniforms = {
    uTime: { value: 0 },
    uDistortion: { value: 0.18 },
    uSize: { value: 1.8 },
    uColor: { value: new THREE.Color('#00A3FF') },
    uColorAccent: { value: new THREE.Color('#7DE3FF') },
    uMouse: { value: new THREE.Vector2(0, 0) }
  };
  const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('hubVertexShader').textContent,
    fragmentShader: document.getElementById('hubFragmentShader').textContent,
    uniforms: uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(geometry, material);
  objectGroup.add(points);

  let time = 0, mouseX = 0, mouseY = 0;
  container.parentElement.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    uniforms.uMouse.value.x += (mouseX - uniforms.uMouse.value.x) * 0.05;
    uniforms.uMouse.value.y += (mouseY - uniforms.uMouse.value.y) * 0.05;
  });

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', resize);
  resize();

  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;
    objectGroup.rotation.y = time * 0.1;
    objectGroup.rotation.x = Math.sin(time * 0.05) * 0.1;
    uniforms.uTime.value = time;
    renderer.render(scene, camera);
  }
  animate();
})();
