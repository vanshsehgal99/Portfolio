// ============================================
// Three.js Interactive 3D Website Enhancement
// ============================================

let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
let normMouseX = 0, normMouseY = 0;
let animationId;
let time = 0;
let particleVelocities = [];
let particleOriginalPositions = [];
let neonLightning;
let neonHexagon;

function initThreeJS() {
    const canvas = document.getElementById('threejs-canvas');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050810);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x050810, 1);
    
    // Create particle system
    createParticles();
    
    // Create neon lightning
    createNeonLightning();
    
    // Create neon hexagon
    createNeonHexagon();
    
    // Create purple glowing flicker object
    createPurpleFlicker();
    
    // Add lighting
    addLights();
    
    // Event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('scroll', onScroll);
    
    // Start animation
    animate();
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 500;
    
    const positions = new Float32Array(particleCount * 3);
    particleVelocities = [];
    particleOriginalPositions = [];
    
    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 15;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        particleVelocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.01
        });
        
        particleOriginalPositions.push({ x, y, z });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xDAF1DE,
        size: 0.08,
        sizeAttenuation: true,
        transparent: true,
        opacity: 1,
        emissive: 0xDAF1DE,
        emissiveIntensity: 0.7,
        toneMapped: false,
        fog: false
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createNeonLightning() {
    // Create lightning bolt with neon glow effect
    const points = [
        new THREE.Vector3(0, 3, -8),
        new THREE.Vector3(-1.5, 2, -8),
        new THREE.Vector3(0.8, 1, -8),
        new THREE.Vector3(-0.5, -0.5, -8),
        new THREE.Vector3(1.2, -1.5, -8),
        new THREE.Vector3(0, -3, -8)
    ];
    
    const curvePoints = [];
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        for (let t = 0; t <= 1; t += 0.1) {
            const point = new THREE.Vector3(
                p1.x + (p2.x - p1.x) * t,
                p1.y + (p2.y - p1.y) * t,
                p1.z
            );
            curvePoints.push(point);
        }
    }
    
    const tubeGeometry = new THREE.TubeGeometry(
        new THREE.LineCurve3(points[0], points[points.length - 1]),
        20,
        0.15,
        8,
        false
    );
    
    const lightningGeometry = new THREE.BufferGeometry();
    const positions = [];
    
    for (let i = 0; i < points.length; i++) {
        positions.push(points[i].x, points[i].y, points[i].z);
    }
    
    lightningGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    
    const neonMaterial = new THREE.LineBasicMaterial({
        color: 0xDAF1DE,
        linewidth: 8,
        transparent: true,
        opacity: 1,
        emissive: 0xDAF1DE,
        fog: false,
        toneMapped: false
    });
    
    const lightningLine = new THREE.Line(lightningGeometry, neonMaterial);
    lightningLine.position.set(1, 0, 0);
    lightningLine.name = 'neonLightning';
    scene.add(lightningLine);
    
    // Create glow effect with additional lines
    const glowGeometry = new THREE.BufferGeometry();
    glowGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    
    const glowMaterial = new THREE.LineBasicMaterial({
        color: 0xDAF1DE,
        linewidth: 2,
        transparent: true,
        opacity: 0.3,
        emissive: 0xDAF1DE,
        fog: false,
        toneMapped: false
    });
    
    const glowLine = new THREE.Line(glowGeometry, glowMaterial);
    glowLine.position.set(1, 0, 0);
    glowLine.scale.set(1.5, 1.5, 1);
    glowLine.name = 'neonGlow';
    scene.add(glowLine);
    
    neonLightning = { line: lightningLine, glow: glowLine };
}

function createNeonHexagon() {
    // Create hexagon group
    const hexGroup = new THREE.Group();
    hexGroup.name = 'neonHexagon';
    hexGroup.position.set(8, 2, -8);
    
    // Green neon material for filled hexagon
    const greenNeonMaterial = new THREE.MeshBasicMaterial({
        color: 0xDAF1DE,
        transparent: true,
        opacity: 0.6,
        emissive: 0xDAF1DE,
        emissiveIntensity: 0.7,
        fog: false,
        toneMapped: false
    });
    
    // Green neon line material
    const greenLineNeonMaterial = new THREE.LineBasicMaterial({
        color: 0xDAF1DE,
        linewidth: 4,
        transparent: true,
        opacity: 1,
        emissive: 0xDAF1DE,
        emissiveIntensity: 0.8,
        fog: false,
        toneMapped: false
    });
    
    // Create main filled hexagon
    const hexGeometry = new THREE.BufferGeometry();
    const hexRadius = 1.2;
    const hexPositions = [];
    const hexIndices = [];
    
    // Create hexagon vertices
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        hexPositions.push(
            Math.cos(angle) * hexRadius,
            Math.sin(angle) * hexRadius,
            0
        );
    }
    
    // Create triangles to fill the hexagon
    for (let i = 1; i < 5; i++) {
        hexIndices.push(0, i, i + 1);
    }
    
    hexGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(hexPositions), 3));
    hexGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(hexIndices), 1));
    const filledHexagon = new THREE.Mesh(hexGeometry, greenNeonMaterial);
    hexGroup.add(filledHexagon);
    
    // Create hexagon outline
    const outlineGeometry = new THREE.BufferGeometry();
    const outlinePositions = [];
    for (let i = 0; i <= 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        outlinePositions.push(
            Math.cos(angle) * hexRadius,
            Math.sin(angle) * hexRadius,
            0
        );
    }
    outlineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(outlinePositions), 3));
    const outline = new THREE.Line(outlineGeometry, greenLineNeonMaterial);
    hexGroup.add(outline);
    
    // Create inner filled hexagon (rotated 30 degrees)
    const innerHexGeometry = new THREE.BufferGeometry();
    const innerRadius = 0.6;
    const innerHexPositions = [];
    const innerIndices = [];
    
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        innerHexPositions.push(
            Math.cos(angle) * innerRadius,
            Math.sin(angle) * innerRadius,
            0
        );
    }
    
    // Create triangles for inner hexagon
    for (let i = 1; i < 5; i++) {
        innerIndices.push(0, i, i + 1);
    }
    
    innerHexGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(innerHexPositions), 3));
    innerHexGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(innerIndices), 1));
    
    // Inner hexagon with slightly different opacity
    const innerFillMaterial = new THREE.MeshBasicMaterial({
        color: 0xDAF1DE,
        transparent: true,
        opacity: 0.4,
        emissive: 0xDAF1DE,
        emissiveIntensity: 0.6,
        fog: false,
        toneMapped: false
    });
    
    const innerFilledHexagon = new THREE.Mesh(innerHexGeometry, innerFillMaterial);
    hexGroup.add(innerFilledHexagon);
    
    // Create inner hexagon outline
    const innerOutlineGeometry = new THREE.BufferGeometry();
    const innerOutlinePositions = [];
    for (let i = 0; i <= 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        innerOutlinePositions.push(
            Math.cos(angle) * innerRadius,
            Math.sin(angle) * innerRadius,
            0
        );
    }
    innerOutlineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(innerOutlinePositions), 3));
    const innerOutline = new THREE.Line(innerOutlineGeometry, greenLineNeonMaterial);
    hexGroup.add(innerOutline);
    
    // Create connecting lines from outer to inner hexagon
    const connectGeometry = new THREE.BufferGeometry();
    const connectPositions = [];
    
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const outerX = Math.cos(angle) * hexRadius;
        const outerY = Math.sin(angle) * hexRadius;
        const innerAngle = angle + Math.PI / 6;
        const innerX = Math.cos(innerAngle) * innerRadius;
        const innerY = Math.sin(innerAngle) * innerRadius;
        
        connectPositions.push(outerX, outerY, 0, innerX, innerY, 0);
    }
    
    connectGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(connectPositions), 3));
    const connectors = new THREE.LineSegments(connectGeometry, greenLineNeonMaterial);
    hexGroup.add(connectors);
    
    // Create glow effect
    const glowMaterial = new THREE.LineBasicMaterial({
        color: 0xDAF1DE,
        linewidth: 8,
        transparent: true,
        opacity: 0.3,
        emissive: 0xDAF1DE,
        emissiveIntensity: 0.5,
        fog: false,
        toneMapped: false
    });
    
    const glowHexGeometry = new THREE.BufferGeometry();
    glowHexGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(outlinePositions), 3));
    const glowHexagon = new THREE.Line(glowHexGeometry, glowMaterial);
    glowHexagon.scale.set(1.5, 1.5, 1);
    hexGroup.add(glowHexagon);
    
    scene.add(hexGroup);
    neonHexagon = hexGroup;
}

function createPurpleFlicker() {
    // Create purple glowing crystal with flicker animation
    const purpleGroup = new THREE.Group();
    purpleGroup.name = 'purpleFlicker';
    purpleGroup.position.set(-8, 8, -8);
    
    // Create crystal geometry - using octahedron for pointed crystal shape
    const crystalGeometry = new THREE.OctahedronGeometry(1.5, 2);
    
    // Purple neon material with metallic crystal appearance
    const purpleMaterial = new THREE.MeshStandardMaterial({
        color: 0xDAF1DE,
        transparent: true,
        opacity: 0.8,
        emissive: 0xDAF1DE,
        emissiveIntensity: 0.9,
        metalness: 0.6,
        roughness: 0.2,
        fog: false,
        toneMapped: false
    });
    
    // Create filled crystal
    const crystal = new THREE.Mesh(crystalGeometry, purpleMaterial);
    purpleGroup.add(crystal);
    
    // Create outer glow crystal wireframe
    const glowGeometry = new THREE.OctahedronGeometry(1.5, 2);
    const glowMaterial = new THREE.LineBasicMaterial({
        color: 0xDAF1DE,
        linewidth: 2,
        transparent: true,
        opacity: 0.95,
        emissive: 0xDAF1DE,
        emissiveIntensity: 1,
        fog: false,
        toneMapped: false
    });
    
    // Create wireframe version for crystal edge glow
    const glowCrystal = new THREE.LineSegments(
        new THREE.WireframeGeometry(glowGeometry),
        glowMaterial
    );
    glowCrystal.scale.set(1.9, 1.9, 1.9);
    purpleGroup.add(glowCrystal);
    
    // Add inner crystal geometry for depth
    const innerCrystalGeometry = new THREE.TetrahedronGeometry(0.8, 1);
    const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0xDAF1DE,
        transparent: true,
        opacity: 0.6,
        emissive: 0xDAF1DE,
        emissiveIntensity: 0.7,
        metalness: 0.8,
        roughness: 0.1,
        fog: false,
        toneMapped: false
    });
    
    const innerCrystal = new THREE.Mesh(innerCrystalGeometry, innerMaterial);
    purpleGroup.add(innerCrystal);
    
    // Store flicker reference for animation
    purpleGroup.flickerIntensity = 1;
    purpleGroup.flickerSpeed = 0.1;
    
    scene.add(purpleGroup);
}

function createGeometry() {
    // Create rotating wireframe sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(1, 4);
    const wireMaterial = new THREE.MeshPhongMaterial({
        color: 0x667eea,
        emissive: 0x667eea,
        emissiveIntensity: 0.3,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    const wireframeSphere = new THREE.Mesh(sphereGeometry, wireMaterial);
    wireframeSphere.position.set(0, 0, -5);
    wireframeSphere.name = 'wireframeSphere';
    scene.add(wireframeSphere);
    
    // Create rotating rings
    const ringGeometry = new THREE.TorusGeometry(2, 0.05, 32, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0x764ba2,
        emissive: 0x764ba2,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.5
    });
    
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI * 0.3;
    ring1.position.set(-2, 1, -5);
    ring1.name = 'ring1';
    scene.add(ring1);
    
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring2.rotation.y = Math.PI * 0.3;
    ring2.position.set(2, -1, -5);
    ring2.name = 'ring2';
    scene.add(ring2);
    
    // Create floating cubes
    const cubeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x00d4ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 0.5
    });
    
    for (let i = 0; i < 3; i++) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            -5 + (Math.random() - 0.5) * 2
        );
        cube.name = `floatingCube${i}`;
        scene.add(cube);
    }
}

function addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x667eea, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x764ba2, 0.8, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0x00d4ff, 0.6, 100);
    pointLight3.position.set(0, 0, 15);
    scene.add(pointLight3);
}

function onMouseMove(event) {
    normMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    normMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function onScroll() {
    const homeSection = document.querySelector('section.home');
    if (homeSection) {
        const homeRect = homeSection.getBoundingClientRect();
        const canvas = document.getElementById('threejs-canvas');
        
        // Smoothly fade canvas when scrolled past home section
        if (homeRect.bottom < 0) {
            canvas.style.opacity = '0';
            canvas.style.pointerEvents = 'none';
        } else {
            // Calculate opacity based on scroll position
            const opacity = Math.max(0, Math.min(1, homeRect.bottom / window.innerHeight));
            canvas.style.opacity = opacity.toString();
            canvas.style.pointerEvents = 'none';
        }
    }
}

function animate() {
    animationId = requestAnimationFrame(animate);
    time += 0.016;
    
    // Animate neon lightning
    if (neonLightning) {
        const flicker = Math.random() > 0.9 ? Math.random() * 0.5 : 1;
        const pulse = 0.7 + Math.sin(time * 3) * 0.3;
        
        neonLightning.line.material.opacity = flicker * pulse;
        neonLightning.glow.material.opacity = flicker * pulse * 0.3;
        
        // Add subtle rotation
        neonLightning.line.rotation.z += 0.001;
        neonLightning.glow.rotation.z += 0.001;
        
        // Horizontal oscillation
        neonLightning.line.position.x = 1 + Math.sin(time * 2) * 0.3;
        neonLightning.glow.position.x = 1 + Math.sin(time * 2) * 0.3;
    }
    
    // Animate neon hexagon
    if (neonHexagon) {
        // Smooth rotation
        neonHexagon.rotation.z += 0.015;
        
        // Pulsing glow
        const hexPulse = 0.7 + Math.sin(time * 2) * 0.3;
        neonHexagon.children.forEach(child => {
            if (child.material && child.material.opacity < 0.5) {
                child.material.opacity = 0.4 * hexPulse;
            }
        });
        
        // Floating vertical motion
        neonHexagon.position.y = Math.sin(time * 1.5) * 0.5;
    }
    
    // Animate purple flicker
    const purpleFlicker = scene.getObjectByName('purpleFlicker');
    if (purpleFlicker) {
        // Random flicker effect
        const flicker = Math.random() > 0.85 ? 0.4 + Math.random() * 0.6 : 1;
        
        // Pulsing glow
        const pulse = 0.7 + Math.sin(time * 2.5) * 0.3;
        
        purpleFlicker.children.forEach(child => {
            if (child.material) {
                child.material.opacity = flicker * pulse;
                if (child.material.emissiveIntensity !== undefined) {
                    child.material.emissiveIntensity = flicker * pulse;
                }
            }
        });
        
        // Floating rotation
        purpleFlicker.rotation.x += 0.008;
        purpleFlicker.rotation.y += 0.012;
        
        // Floating vertical motion
        purpleFlicker.position.y = 8 + Math.sin(time * 1.5) * 0.5;
    }
    
    // Enhanced rotation and movement for geometries
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
            if (child.name === 'wireframeSphere') {
                // Rotate sphere smoothly
                child.rotation.x += 0.0008;
                child.rotation.y += 0.0012;
                // Subtle pulsing
                child.scale.z = 1 + Math.sin(time * 2) * 0.05;
            } else if (child.name === 'ring1') {
                // Rotate ring 1
                child.rotation.x += 0.005;
                child.rotation.z += 0.003;
            } else if (child.name === 'ring2') {
                // Rotate ring 2
                child.rotation.y += 0.005;
                child.rotation.z -= 0.003;
            } else if (child.name.includes('floatingCube')) {
                // Float and rotate cubes
                child.rotation.x += 0.01;
                child.rotation.y += 0.015;
                child.position.y += Math.sin(time + child.position.x) * 0.002;
            }
        }
    });
    
    // Animate particles with advanced physics
    if (particles) {
        const positions = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const index = i / 3;
            const originalPos = particleOriginalPositions[index];
            const velocity = particleVelocities[index];
            
            // Floating motion
            const seed = index * 0.01;
            const floatX = Math.sin(time * 0.5 + seed) * 0.5;
            const floatY = Math.cos(time * 0.3 + seed * 2) * 0.5;
            const floatZ = Math.sin(time * 0.4 + seed * 1.5) * 0.3;
            
            // Mouse repulsion effect
            const dx = positions[i] - normMouseX * 5;
            const dy = positions[i + 1] - normMouseY * 5;
            const dz = positions[i + 2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (distance < 12) {
                const force = (12 - distance) / 12;
                velocity.x += (dx / (distance + 0.1)) * force * 0.15;
                velocity.y += (dy / (distance + 0.1)) * force * 0.15;
            }
            
            // Apply velocity
            positions[i] = originalPos.x + velocity.x + floatX;
            positions[i + 1] = originalPos.y + velocity.y + floatY;
            positions[i + 2] = originalPos.z + velocity.z + floatZ;
            
            // Damping
            velocity.x *= 0.93;
            velocity.y *= 0.93;
            velocity.z *= 0.96;
            
            // Screen wrapping
            if (Math.abs(positions[i]) > 30) positions[i] = -Math.sign(positions[i]) * 30;
            if (Math.abs(positions[i + 1]) > 30) positions[i + 1] = -Math.sign(positions[i + 1]) * 30;
            if (Math.abs(positions[i + 2]) > 25) positions[i + 2] = -Math.sign(positions[i + 2]) * 25;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
    }
    
    // Camera parallax effect
    camera.position.x += (normMouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (normMouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeJS);
} else {
    initThreeJS();
}

// ============================================
// Portfolio Functionality
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const viewMoreBtn = document.querySelector('.view-more-btn');
    const hiddenCertificates = document.querySelectorAll('.certificate-card.hidden');

    if (viewMoreBtn && hiddenCertificates.length > 0) {
        viewMoreBtn.addEventListener('click', function() {
            hiddenCertificates.forEach(certificate => {
                certificate.classList.remove('hidden');
                certificate.style.animation = 'fadeIn 0.5s ease forwards';
            });
            viewMoreBtn.style.display = 'none';
        });
    }

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            links.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    const fadeElements = document.querySelectorAll('section, .project-card, .certificate-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach((element, index) => {
        element.classList.add('fade-in-section');
        element.classList.add(`delay-${index % 3 + 1}`);
        fadeInObserver.observe(element);
    });
});

// ============================================
// EmailJS Contact Form Handler
// ============================================
(function() {
    // Initialize EmailJS
    emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS public key
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Disable button and show loading state
            const submitBtn = contactForm.querySelector('.email-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Prepare template parameters
            const templateParams = {
                from_name: contactForm.querySelector('[name="from_name"]').value,
                from_email: contactForm.querySelector('[name="from_email"]').value,
                message: contactForm.querySelector('[name="message"]').value,
                to_email: 'vanshsehgal6267@gmail.com'
            };
            
            // Send email using EmailJS
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .then(function(response) {
                    console.log('Email sent successfully:', response);
                    
                    // Show success message
                    alert('Message sent successfully! I will get back to you soon.');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Restore button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, function(error) {
                    console.error('Error sending email:', error);
                    alert('Failed to send message. Please try again or email me directly.');
                    
                    // Restore button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
})();
