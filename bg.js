const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x100c08, 0.0008);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20; 
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
const sunLight = new THREE.DirectionalLight(0xffaa33, 2.0);
sunLight.position.set(10, 10, 10);
scene.add(sunLight);
const ambientLight = new THREE.AmbientLight(0x404040, 1.5); 
scene.add(ambientLight);
const sunGeometry = new THREE.SphereGeometry(6, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffddaa,
    transparent: true,
    opacity: 0.9
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.set(-12, 8, -15);
scene.add(sunMesh);
const spriteMaterial = new THREE.SpriteMaterial({ 
    map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/glow.png'), 
    color: 0xffaa00, 
    transparent: true, 
    blending: THREE.AdditiveBlending,
    opacity: 0.7
});
const sunGlow = new THREE.Sprite(spriteMaterial);
sunGlow.scale.set(50, 50, 1.0);
sunMesh.add(sunGlow);
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2500; 
const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);
const sizesArray = new Float32Array(particlesCount);
const colorInside = new THREE.Color(0xffb74d); 
const colorOutside = new THREE.Color(0x4fc3f7); 

for(let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    posArray[i3] = (Math.random() - 0.5) * 80;
    posArray[i3+1] = (Math.random() - 0.5) * 80;
    posArray[i3+2] = (Math.random() - 0.5) * 60;
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, Math.random());
    colorsArray[i3] = mixedColor.r;
    colorsArray[i3+1] = mixedColor.g;
    colorsArray[i3+2] = mixedColor.b; 
    sizesArray[i] = Math.random() * 0.3 + 0.05;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.9, 
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
const raysGroup = new THREE.Group();
const rayGeo = new THREE.PlaneGeometry(2, 120);
const rayMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.06, 
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

for (let i = 0; i < 12; i++) {
    const ray = new THREE.Mesh(rayGeo, rayMat);
    ray.position.copy(sunMesh.position);
    ray.rotation.z = Math.random() * Math.PI;
    ray.rotation.x = (Math.random() - 0.5) * 1.5;
    ray.scale.x = 1 + Math.random() * 4;
    raysGroup.add(ray);
}
scene.add(raysGroup);


let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2; 
    document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
});

const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();
    targetX = targetX * 0.95 + mouseX * 0.05;
    targetY = targetY * 0.95 + mouseY * 0.05;
    particles.rotation.y = elapsedTime * 0.03;
    particles.rotation.x = targetY * 0.15;
    particles.rotation.z = targetX * 0.1;
    raysGroup.children.forEach((ray, i) => {
        ray.rotation.z += 0.003 * (i % 2 === 0 ? 1 : -1);
        ray.material.opacity = 0.04 + Math.sin(elapsedTime * 0.8 + i) * 0.03; 
    });

    sunMesh.position.y = 8 + Math.sin(elapsedTime * 0.3) * 2;
    sunMesh.rotation.z += 0.001;
    camera.position.x += (targetX * 2 - camera.position.x) * 0.03;
    camera.position.y += (-targetY * 2 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});