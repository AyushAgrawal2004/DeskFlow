import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';

class Workspace3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.clock = new THREE.Clock();
        this.particles = [];
        
        // Add animation properties
        this.rotationSpeed = 0.0001;
        this.floatSpeed = 0.0005;
        this.lastTime = 0;
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        
        // Add scroll handling properties
        this.scrollTarget = 0;
        this.scrollCurrent = 0;
        this.scrollEase = 0.05; // Reduced for smoother transitions
        
        this.init();
        this.createObjects();
        this.createParticles();
        this.animate();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 7;
        this.camera.position.y = 3;
        this.camera.lookAt(0, 0, 0);

        // Enhanced fog for better depth
        this.scene.fog = new THREE.FogExp2(0xe0e7ff, 0.03);

        window.addEventListener('resize', () => this.onWindowResize(), false);
        window.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    }

    createObjects() {
        this.workspaceObjects = new THREE.Group();
        
        // Create floating desks
        for (let i = 0; i < 5; i++) {
            const desk = this.createDesk();
            desk.position.set(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 5
            );
            desk.rotation.set(
                Math.random() * Math.PI * 0.1,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 0.1
            );
            this.workspaceObjects.add(desk);
        }

        // Create room shapes
        for (let i = 0; i < 3; i++) {
            const room = this.createRoom();
            room.position.set(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 6
            );
            room.rotation.set(
                Math.random() * Math.PI * 0.1,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 0.1
            );
            this.workspaceObjects.add(room);
        }

        // Add decorative elements
        for (let i = 0; i < 15; i++) {
            const decoration = this.createDecoration();
            decoration.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 8
            );
            this.workspaceObjects.add(decoration);
        }

        this.scene.add(this.workspaceObjects);

        // Basic lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x6366f1, 1, 10);
        pointLight.position.set(2, 2, 2);
        this.scene.add(pointLight);
    }

    createParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 300;
        const positions = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
            scales[i] = Math.random() * 0.2 + 0.1;
            
            // Add color variation
            colors[i * 3] = 0.4 + Math.random() * 0.2;     // R
            colors[i * 3 + 1] = 0.4 + Math.random() * 0.2; // G
            colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particleSystem);
    }

    createDesk() {
        const group = new THREE.Group();

        // Basic desktop surface
        const surface = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.05, 0.5),
            new THREE.MeshPhongMaterial({
                color: 0x6366f1,
                transparent: true,
                opacity: 0.7
            })
        );
        group.add(surface);

        // Add legs
        const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
        const legMaterial = new THREE.MeshPhongMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.8
        });

        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            const x = (i % 2 === 0 ? 0.35 : -0.35);
            const z = (i < 2 ? 0.2 : -0.2);
            leg.position.set(x, -0.175, z);
            group.add(leg);
        }

        return group;
    }

    createRoom() {
        const group = new THREE.Group();

        // Basic room frame
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 1, 1.2),
            new THREE.MeshPhongMaterial({
                color: 0x818cf8,
                transparent: true,
                opacity: 0.2,
                wireframe: true
            })
        );
        group.add(frame);

        // Basic room walls
        const walls = new THREE.Mesh(
            new THREE.BoxGeometry(1.18, 0.98, 1.18),
            new THREE.MeshPhongMaterial({
                color: 0x818cf8,
                transparent: true,
                opacity: 0.15,
                side: THREE.DoubleSide
            })
        );
        group.add(walls);

        return group;
    }

    createDecoration() {
        const geometry = new THREE.IcosahedronGeometry(0.2, 1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        return new THREE.Mesh(geometry, material);
    }

    onMouseMove(event) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        // Smoother camera movement
        this.camera.position.x += (mouseX * 2 - this.camera.position.x) * 0.05;
        this.camera.position.y += (mouseY * 2 - this.camera.position.y) * 0.05;
        this.camera.lookAt(0, 0, 0);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateScroll(scrollPercent) {
        this.scrollTarget = scrollPercent;
        
        // Smooth scroll transition
        this.scrollCurrent += (this.scrollTarget - this.scrollCurrent) * this.scrollEase;
        
        // Update target rotation based on scroll
        this.targetRotation.y = this.scrollCurrent * Math.PI * 2;
        this.targetRotation.x = this.scrollCurrent * Math.PI / 6;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = this.clock.getElapsedTime();
        const delta = Math.min(time - this.lastTime, 0.1);
        this.lastTime = time;

        // Add auto-rotation to target rotation
        this.targetRotation.y += this.rotationSpeed * delta * 60;
        this.targetRotation.x += this.rotationSpeed * 0.5 * delta * 60;
        
        // Smooth transition to target rotation
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
        
        this.workspaceObjects.rotation.y = this.currentRotation.y;
        this.workspaceObjects.rotation.x = this.currentRotation.x;

        // Subtle floating motion
        this.workspaceObjects.children.forEach((object, index) => {
            const floatOffset = Math.sin(time * this.floatSpeed + index) * 0.01;
            object.position.y += (floatOffset - object.position.y) * 0.02;
        });

        // Particle system animation
        this.particleSystem.rotation.y += this.rotationSpeed * 0.5 * delta * 60;
        const positions = this.particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const floatOffset = Math.sin(time * this.floatSpeed + i) * 0.002;
            positions[i + 1] += (floatOffset - positions[i + 1]) * 0.02;
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
    }
}

export default Workspace3D; 