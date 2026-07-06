import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Compass, Mic, Camera, AlertCircle, BookOpen, Wallet,
  MapPin, Calendar, Sparkles, Check, ChevronDown,
  Star, Play, Globe, MessageSquare, ArrowRight, Shield,
  CreditCard, Menu, X, ArrowUpRight, ArrowLeft, Volume2, User
} from 'lucide-react';

// Register GSAP ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------
// THREE.JS CANVAS 1: INTERACTIVE 3D GLOBE
// -------------------------------------------------------------
const Globe3D = ({ scrollProgress }) => {
  const containerRef = useRef(null);
  const targetRotationY = useRef(0);
  const currentRotationY = useRef(0);
  const isDragging = useRef(false);
  const previousMouseX = useRef(0);
  
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    // Dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Globe Sphere
    const radius = 2.2;
    const globeGeo = new THREE.SphereGeometry(radius, 64, 64);
    
    // Custom material for futuristic grid look
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x0f172a,
      emissive: 0x1e293b,
      specular: 0x3b82f6,
      shininess: 15,
      transparent: true,
      opacity: 0.95,
      wireframe: false
    });
    
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globe);

    // Coordinate Grid lines (Futuristic look)
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.15,
      wireframe: true
    });
    const gridGlobe = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.01, 32, 32), gridMat);
    globeGroup.add(gridGlobe);

    // Glow Atmosphere Ring
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(0.2, 0.5, 1.0, 1.0) * intensity * 0.8;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.25, 32, 32), atmosphereMat);
    scene.add(atmosphere);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x3b82f6, 1.5);
    dirLight1.position.set(5, 3, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 0.8);
    dirLight2.position.set(-5, -2, -5);
    scene.add(dirLight2);

    // Cities Coordinates mapping helper
    const latLonToVector3 = (lat, lon, rad) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(rad * Math.sin(phi) * Math.sin(theta));
      const y = rad * Math.cos(phi);
      const z = rad * Math.sin(phi) * Math.cos(theta);
      return new THREE.Vector3(x, y, z);
    };

    // Major locations to draw markers & paths
    const cities = [
      { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
      { name: 'Kyoto', lat: 35.0116, lon: 135.7681 },
      { name: 'Paris', lat: 48.8566, lon: 2.3522 },
      { name: 'Bali', lat: -8.4095, lon: 115.1889 },
      { name: 'London', lat: 51.5074, lon: -0.1278 }
    ];

    const markers = [];
    const paths = [];

    // Add city markers
    cities.forEach(city => {
      const pos = latLonToVector3(city.lat, city.lon, radius);
      
      // Marker point
      const markerGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      globeGroup.add(marker);
      markers.push({ mesh: marker, basePos: pos.clone() });

      // Pulsing ring around marker
      const ringGeo = new THREE.RingGeometry(0.08, 0.12, 16);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0,0,0));
      globeGroup.add(ring);
      markers.push({ mesh: ring, isRing: true, basePos: pos.clone() });
    });

    // Draw Bézier Curve flight paths between cities
    const createFlightPath = (c1, c2) => {
      const v1 = latLonToVector3(c1.lat, c1.lon, radius);
      const v2 = latLonToVector3(c2.lat, c2.lon, radius);

      // Midpoint bulging outwards to create arc altitude
      const midpoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      const distance = v1.distanceTo(v2);
      const arcHeight = radius + distance * 0.28;
      midpoint.normalize().multiplyScalar(arcHeight);

      const curve = new THREE.QuadraticBezierCurve3(v1, midpoint, v2);
      const points = curve.getPoints(50);
      
      const pathGeo = new THREE.BufferGeometry().setFromPoints(points);
      const pathMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.4
      });
      const flightLine = new THREE.Line(pathGeo, pathMat);
      globeGroup.add(flightLine);

      // Animated airplane dot along the path
      const dotGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      globeGroup.add(dot);

      paths.push({ curve, dot, progress: Math.random() });
    };

    // Generate paths connecting routes
    for (let i = 0; i < cities.length; i++) {
      createFlightPath(cities[i], cities[(i + 1) % cities.length]);
    }

    // Drag interaction handlers
    const onMouseDown = (e) => {
      isDragging.current = true;
      previousMouseX.current = e.clientX;
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMouseX.current;
      targetRotationY.current += deltaX * 0.007;
      previousMouseX.current = e.clientX;
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMouseX.current = e.touches[0].clientX;
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMouseX.current;
      targetRotationY.current += deltaX * 0.007;
      previousMouseX.current = e.touches[0].clientX;
    };

    containerRef.current.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    containerRef.current.addEventListener('touchstart', onTouchStart);
    containerRef.current.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onMouseUp);

    // Animation loop
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Slow idle rotation if user is not dragging
      if (!isDragging.current) {
        targetRotationY.current += 0.0015;
      }

      // Smooth interpolation for inertia rotation
      currentRotationY.current += (targetRotationY.current - currentRotationY.current) * 0.15;
      globeGroup.rotation.y = currentRotationY.current;
      globeGroup.rotation.x = Math.sin(time * 0.1) * 0.15; // gentle tilt oscillation

      // Animate pulsing city markers rings
      markers.forEach(m => {
        if (m.isRing) {
          const scale = 1.0 + (time * 1.5 % 1.5) * 0.5;
          m.mesh.scale.set(scale, scale, 1);
          m.mesh.material.opacity = 1.0 - (time * 1.5 % 1.5) / 1.5;
        }
      });

      // Animate planes flying along pathways
      paths.forEach(p => {
        p.progress = (p.progress + 0.005) % 1.0;
        const pos = p.curve.getPointAt(p.progress);
        p.dot.position.copy(pos);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resizing
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // dispose WebGL resources
      globeGeo.dispose();
      globeMat.dispose();
      gridMat.dispose();
      atmosphereMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Update target rotation based on outer scroll progress
  useEffect(() => {
    if (!isDragging.current) {
      targetRotationY.current = scrollProgress * Math.PI * 2.5;
    }
  }, [scrollProgress]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

// -------------------------------------------------------------
// THREE.JS CANVAS 2: FLOATING TRAVEL OBJECTS
// -------------------------------------------------------------
const FloatingAssets = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Groups for floating objects
    const airplaneGroup = new THREE.Group();
    const suitcaseGroup = new THREE.Group();
    const compassGroup = new THREE.Group();
    const passportGroup = new THREE.Group();

    scene.add(airplaneGroup, suitcaseGroup, compassGroup, passportGroup);

    // Positional arrangement of objects
    airplaneGroup.position.set(-2.2, 1.3, 0);
    suitcaseGroup.position.set(2.2, -1.2, 0);
    compassGroup.position.set(-2.0, -1.5, 0);
    passportGroup.position.set(2.4, 1.2, 0);

    // 1. Sleek Origami Airplane Geometry
    const planeGeo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0.7,   -0.5, 0, -0.4,   0, 0.1, -0.2, // Left wing folding
      0, 0, 0.7,   0, 0.1, -0.2,    0.5, 0, -0.4, // Right wing folding
      0, 0.1, -0.2,  -0.5, 0, -0.4,   0, 0, -0.5, // Left flap tail
      0, 0.1, -0.2,   0, 0, -0.5,     0.5, 0, -0.4  // Right flap tail
    ]);
    planeGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    planeGeo.computeVertexNormals();
    const planeMat = new THREE.MeshPhongMaterial({ color: 0x38bdf8, shininess: 100, side: THREE.DoubleSide });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.scale.set(1.2, 1.2, 1.2);
    airplaneGroup.add(planeMesh);

    // 2. Leather Suitcase Geometry
    const caseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.3),
      new THREE.MeshPhongMaterial({ color: 0x0284c7, shininess: 30 })
    );
    const strapL = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.62, 0.32),
      new THREE.MeshPhongMaterial({ color: 0x0f172a })
    );
    strapL.position.x = -0.22;
    const strapR = strapL.clone();
    strapR.position.x = 0.22;
    suitcaseGroup.add(caseMesh, strapL, strapR);

    // 3. Brass Compass Geometry
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.05, 12, 48),
      new THREE.MeshPhongMaterial({ color: 0xd97706, shininess: 120 })
    );
    const needle = new THREE.Mesh(
      new THREE.ConeGeometry(0.07, 0.4, 4),
      new THREE.MeshPhongMaterial({ color: 0xef4444, shininess: 80 })
    );
    needle.rotation.x = Math.PI / 2;
    const needleSouth = new THREE.Mesh(
      new THREE.ConeGeometry(0.07, 0.4, 4),
      new THREE.MeshPhongMaterial({ color: 0x475569, shininess: 80 })
    );
    needleSouth.rotation.x = -Math.PI / 2;
    compassGroup.add(ring, needle, needleSouth);

    // 4. Passport Book Geometry
    const cover = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.65, 0.05),
      new THREE.MeshPhongMaterial({ color: 0x1e3a8a, shininess: 40 })
    );
    const pages = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.62, 0.04),
      new THREE.MeshBasicMaterial({ color: 0xf8fafc })
    );
    pages.position.z = -0.01;
    passportGroup.add(cover, pages);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Oscillating float movement (Sine waves) and rotators
      airplaneGroup.position.y = 1.3 + Math.sin(elapsed * 1.2) * 0.15;
      airplaneGroup.rotation.y = elapsed * 0.4;
      airplaneGroup.rotation.x = Math.sin(elapsed * 0.8) * 0.2;

      suitcaseGroup.position.y = -1.2 + Math.cos(elapsed * 0.9) * 0.15;
      suitcaseGroup.rotation.y = -elapsed * 0.25;
      suitcaseGroup.rotation.z = Math.sin(elapsed * 0.5) * 0.1;

      compassGroup.position.y = -1.5 + Math.sin(elapsed * 1.5) * 0.12;
      compassGroup.rotation.y = elapsed * 0.6;
      compassGroup.rotation.x = 0.3; // tilt fixed

      passportGroup.position.y = 1.2 + Math.cos(elapsed * 1.1) * 0.12;
      passportGroup.rotation.y = elapsed * 0.3;
      passportGroup.rotation.z = Math.sin(elapsed * 0.4) * 0.15;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      planeGeo.dispose();
      planeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

// -------------------------------------------------------------
// THREE.JS CANVAS 3: AI GLOWING ORB
// -------------------------------------------------------------
const AIGlowingOrb = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Glowing morphing orb geometry
    const sphereGeo = new THREE.SphereGeometry(0.85, 48, 48);
    const basePositions = sphereGeo.attributes.position.clone();

    // Material with metallic transmission
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x0f172a,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.6,
      thickness: 0.5
    });

    const orb = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(orb);

    // Swirling orbital particle ring
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.3 + Math.random() * 0.2;
      posArr[i * 3] = Math.cos(angle) * radius;
      posArr[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
      posArr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.8
    });
    const ringParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(ringParticles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0x3b82f6, 3, 5);
    light1.position.set(2, 2, 2);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x06b6d4, 2, 5);
    light2.position.set(-2, -2, -2);
    scene.add(light2);

    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Vertex displacement loop for morphing lava lamp blob
      const posAttr = sphereGeo.attributes.position;
      const tempV = new THREE.Vector3();

      for (let i = 0; i < posAttr.count; i++) {
        tempV.fromBufferAttribute(basePositions, i);
        // Custom math displacement equations to mock vertex shaders noise
        const wave = Math.sin(tempV.x * 3.5 + elapsed * 3) * Math.cos(tempV.y * 3.5 + elapsed * 3) * 0.12;
        tempV.normalize().multiplyScalar(0.85 + wave);
        posAttr.setXYZ(i, tempV.x, tempV.y, tempV.z);
      }
      posAttr.needsUpdate = true;
      sphereGeo.computeVertexNormals();

      // Rotate whole group
      orb.rotation.y = elapsed * 0.25;
      orb.rotation.x = elapsed * 0.15;

      ringParticles.rotation.y = -elapsed * 0.5;
      ringParticles.rotation.x = 0.2; // slight angle tilt

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      sphereMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

// -------------------------------------------------------------
// THREE.JS CANVAS 4: TRIP ROUTE MAP VISUALIZER
// -------------------------------------------------------------
const RouteMapVisualizer = ({ activePoint }) => {
  const containerRef = useRef(null);
  const routeDotRef = useRef(null);

  const routePoints = {
    1: { name: 'Hotel', x: -80, y: -40 },
    2: { name: 'Fushimi Inari', x: 80, y: 70 },
    3: { name: 'Ramen Lunch', x: -30, y: 40 },
    4: { name: 'Kiyomizu Temple', x: 60, y: -20 }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // Draw localized mapping grids
    const gridHelper = new THREE.GridHelper(300, 30, 0x334155, 0x1e293b);
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);

    // Markers for locations
    const markers = [];
    Object.keys(routePoints).forEach(key => {
      const pt = routePoints[key];
      const markerGroup = new THREE.Group();
      markerGroup.position.set(pt.x, pt.y, 1);

      const circle = new THREE.Mesh(
        new THREE.RingGeometry(6, 8, 16),
        new THREE.MeshBasicMaterial({ color: 0x3b82f6, side: THREE.DoubleSide })
      );
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(3, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      markerGroup.add(circle, core);
      scene.add(markerGroup);
      markers.push({ key: parseInt(key), group: markerGroup });
    });

    // Draw route path line
    const pathLine = new THREE.CatmullRomCurve3([
      new THREE.Vector3(routePoints[1].x, routePoints[1].y, 1),
      new THREE.Vector3(routePoints[2].x, routePoints[2].y, 1),
      new THREE.Vector3(routePoints[3].x, routePoints[3].y, 1),
      new THREE.Vector3(routePoints[4].x, routePoints[4].y, 1)
    ]);
    const pathPoints = pathLine.getPoints(50);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const lineMat = new THREE.LineDashedMaterial({ color: 0x38bdf8, dashSize: 8, gapSize: 4 });
    const line = new THREE.Line(lineGeo, lineMat);
    line.computeLineDistances(); // necessary for dashed lines
    scene.add(line);

    // Moving traveler vehicle
    const vehicleGeo = new THREE.ConeGeometry(5, 12, 3);
    const vehicleMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const vehicle = new THREE.Mesh(vehicleGeo, vehicleMat);
    vehicle.rotation.z = Math.PI / 2;
    scene.add(vehicle);
    routeDotRef.current = vehicle;

    // Rescale helper
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.left = w / -2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = h / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId;
    let progress = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Interpolate traveler vehicle position based on active item index
      const targetProg = (activePoint - 1) / 3;
      progress += (targetProg - progress) * 0.08;

      const currentPos = pathLine.getPointAt(progress);
      vehicle.position.copy(currentPos);

      // Compute heading/rotation angle towards moving path vectors
      const lookPos = pathLine.getPointAt(Math.min(progress + 0.01, 1));
      const angle = Math.atan2(lookPos.y - currentPos.y, lookPos.x - currentPos.x);
      vehicle.rotation.z = angle - Math.PI / 2;

      // Pulse active marker circle scaling
      markers.forEach(m => {
        if (m.key === activePoint) {
          const s = 1.0 + Math.sin(Date.now() * 0.01) * 0.15;
          m.group.scale.set(s, s, 1);
        } else {
          m.group.scale.set(1, 1, 1);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      vehicleGeo.dispose();
      vehicleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, [activePoint]);

  return <div ref={containerRef} className="w-full h-48 sm:h-56 bg-slate-950/40 rounded-2xl border border-slate-800/80 overflow-hidden" />;
};

// -------------------------------------------------------------
// MAIN HERO LANDING PAGE COMPONENT
// -------------------------------------------------------------
const Hero = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [translationTab, setTranslationTab] = useState('voice');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  
  // Interactive Scroll states for Globe rotation
  const [scrollProgress, setScrollProgress] = useState(0);

  // States for interactive translation mockup
  const [inputText, setInputText] = useState('Where is the nearest train station?');
  const [translatedText, setTranslatedText] = useState('駅はどこですか？ (Eki wa doko desu ka?)');
  const [isTranslating, setIsTranslating] = useState(false);

  // Active showcase timeline index for route planner visualization
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(1);

  const handleTranslateChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    setIsTranslating(true);
    setTimeout(() => {
      if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
        setTranslatedText('こんにちは (Konnichiwa)');
      } else if (text.toLowerCase().includes('hotel') || text.toLowerCase().includes('stay')) {
        setTranslatedText('ホテルはどこですか？ (Hoteru wa doko desu ka?)');
      } else if (text.toLowerCase().includes('thank')) {
        setTranslatedText('ありがとうございます (Arigatou gozaimasu)');
      } else if (text.trim() === '') {
        setTranslatedText('');
      } else {
        setTranslatedText('翻訳中... (Translating...)');
      }
      setIsTranslating(false);
    }, 600);
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Trip Planner', href: '#trip-planner' },
    { name: 'Translation', href: '#translation' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  const features = [
    {
      icon: <Compass className="w-6 h-6 text-blue-400" />,
      title: 'AI Trip Planner',
      description: 'Generates a customized, complete day-by-day itinerary optimized for your budget, speed, and interests.'
    },
    {
      icon: <Mic className="w-6 h-6 text-sky-400" />,
      title: 'Voice Translation',
      description: 'Zero-delay, bi-directional voice translation allowing you to hold natural conversations with locals anywhere.'
    },
    {
      icon: <Camera className="w-6 h-6 text-cyan-400" />,
      title: 'Camera Translation',
      description: 'Point your camera at signs, street nameplates, menus, or receipts to overlay translated text instantly.'
    },
    {
      icon: <Shield className="w-6 h-6 text-rose-500" />,
      title: 'Emergency Assistance',
      description: 'One-tap access to local emergency services, translated critical phrases, and embassy contacts offline.'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      title: 'Offline Phrasebook',
      description: 'Download essential offline translation packages and standard phrases to guide you without cell service.'
    },
    {
      icon: <Wallet className="w-6 h-6 text-purple-400" />,
      title: 'Budget Planner',
      description: 'Organize your travel costs, convert currencies dynamically with live market rates, and limit overspending.'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Enter Destination',
      description: 'Type in any city, country, or region and describe your travel vibe.'
    },
    {
      num: '02',
      title: 'Select Dates & Budget',
      description: 'Define your duration, travel speed preference, and daily spending tiers.'
    },
    {
      num: '03',
      title: 'AI Generates Itinerary',
      description: 'Watch the AI curate optimal paths, bookings, local foods, and must-sees.'
    },
    {
      num: '04',
      title: 'Save & Travel',
      description: 'Sync your itinerary offline, translate in real-time, and embark on your journey.'
    }
  ];

  const itineraryDays = {
    1: {
      theme: 'Cultural Wonders of Kyoto',
      activities: [
        { idx: 1, time: '09:00 AM', title: 'Fushimi Inari Shrine Hike', desc: 'Walk under thousands of vibrant red torii gates before the afternoon crowds arrive.', cost: '$0', tag: 'Must See' },
        { idx: 2, time: '12:30 PM', title: 'Traditional Ramen Lunch', desc: 'Enjoy handmade ramen at a historic noodle stall near Gion.', cost: '$12', tag: 'Food' },
        { idx: 3, time: '02:30 PM', title: 'Kiyomizu-dera Temple', desc: 'Marvel at the panoramic wooden stage overlooking cherry blossoms and hills.', cost: '$4', tag: 'Historic' },
        { idx: 4, time: '06:00 PM', title: 'Gion Tea District Stroll', desc: 'Explore historic wooden machiya townhouses and spot geishas in the evening glow.', cost: '$0', tag: 'Walk' }
      ]
    },
    2: {
      theme: 'Nature & Bamboo Forest Escape',
      activities: [
        { idx: 1, time: '08:30 AM', title: 'Arashiyama Bamboo Grove', desc: 'Stroll through the towering emerald green bamboo stems in tranquil early morning.', cost: '$0', tag: 'Nature' },
        { idx: 2, time: '11:00 AM', title: 'Tenryu-ji Zen Temple Garden', desc: 'Admire the 14th-century landscape garden design bordering mountains.', cost: '$5', tag: 'Zen' },
        { idx: 3, time: '01:30 PM', title: 'Hozu River Lunch Cruise', desc: 'Dine on traditional bento boxes aboard an authentic wooden riverboat.', cost: '$35', tag: 'Unique' },
        { idx: 4, time: '04:30 PM', title: 'Monkey Park Iwatayama', desc: 'Take a light uphill trek to feed native Japanese macaques overlooking Kyoto city.', cost: '$4', tag: 'Fun' }
      ]
    },
    3: {
      theme: 'Modern Architecture & Castles',
      activities: [
        { idx: 1, time: '09:30 AM', title: 'Nijo Castle Heritage Tour', desc: 'Explore nightingale floors designed to squeak when walked on to prevent stealthy attacks.', cost: '$8', tag: 'Castle' },
        { idx: 2, time: '12:30 PM', title: 'Nishiki Food Market Feast', desc: 'Sample famous street snacks like baby octopus, dashi tamago, and matcha sweets.', cost: '$20', tag: 'Culinary' },
        { idx: 3, time: '03:00 PM', title: 'Kyoto Tower Observatory', desc: 'Ascend to Kyoto’s highest viewpoint for a detailed telescope look across the valleys.', cost: '$6', tag: 'View' },
        { idx: 4, time: '07:30 PM', title: 'Kyoto Station Sky Garden Dinner', desc: 'Feast on Japanese skewers surrounded by neon structures and high-speed train views.', cost: '$40', tag: 'Dinner' }
      ]
    }
  };

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Solo Backpacker',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      quote: 'TravelBridge completely transformed my solo trip to Japan. The real-time camera translation made ordering food at tiny street vendor stalls absolute breeze, and the offline map was a lifesaver.'
    },
    {
      name: 'Marcus Chen',
      role: 'Digital Nomad',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      quote: 'As a digital nomad, I shift countries every month. The AI Trip Planner creates deep, optimized itineraries in seconds, letting me focus on work while experiencing the absolute best of local life.'
    },
    {
      name: 'Elena Rostova',
      role: 'Family Traveler',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      quote: 'Planning a trip for five people with diverse interests is stressful. TravelBridge kept us on budget and structured our days perfectly. The emergency SOS feature gave us complete peace of mind.'
    }
  ];

  const pricingTiers = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Core travel features for casual weekend trips.',
      features: [
        '5 AI Itinerary generations per month',
        'Basic Voice Translation (15 languages)',
        'Camera Translation (3 scans/day)',
        'Online-only access',
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 12, yearly: 9 },
      description: 'Ideal plan for frequent explorers and solo travelers.',
      features: [
        'Unlimited AI Itinerary planning',
        'Real-time Voice Translation (100+ languages)',
        'Unlimited Camera Scan translation',
        'Complete Offline Phrasebook download',
        'Smart Budget Planner & currency tracker',
      ],
      cta: 'Start Planning',
      popular: true
    },
    {
      name: 'Business',
      price: { monthly: 29, yearly: 22 },
      description: 'For corporate teams and travel coordinators.',
      features: [
        'Everything in Pro plan',
        'Shared group trip itineraries & comments',
        'Priority AI servers (faster generation)',
        'Custom local guide API integrations',
        '24/7 Premium agent support',
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const faqs = [
    {
      q: 'How does the offline translation mode work?',
      a: 'TravelBridge allows you to download compressed language packages before you depart. This allows you to perform offline text translation, access saved itineraries, and use standard audio phrasebooks without consuming any roaming data.'
    },
    {
      q: 'What makes TravelBridge different from standard translators?',
      a: 'Unlike static translators, TravelBridge combines AI-guided contextual itinerary generation, budgeting, and emergency coordination with real-time translation tools. It is designed to act as a complete travel companion rather than just a dictionary.'
    },
    {
      q: 'Is the itinerary planning accurate?',
      a: 'Yes, our AI agent integrates with real-time location APIs, reviews databases, opening schedules, and public transport tables. It actively checks travel speeds to build schedules that are physically achievable.'
    },
    {
      q: 'Can I import flight and hotel reservations?',
      a: 'Absolutely! Pro and Business users can forward reservation emails or upload PDFs directly, and TravelBridge will instantly parse the details and auto-stitch them into their interactive timeline.'
    }
  ];

  // GSAP ScrollTrigger Setup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track scroll height to update rotating globe targets
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrolled / maxScroll : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);

    // GSAP ScrollTrigger reveals
    gsap.fromTo('.gsap-reveal-hero', 
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.15 }
    );

    gsap.utils.toArray('.gsap-section-reveal').forEach((sec) => {
      gsap.fromTo(sec,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 82%',
          }
        }
      );
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-[#0F172A] text-slate-100 min-h-screen font-sans selection:bg-blue-600/30 selection:text-white overflow-x-hidden relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none z-0" />

      {/* Floating Canvas containing 3D Airplane, Suitcase, etc. */}
      <FloatingAssets />

      {/* Floating Glass Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0F172A]/75 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-2 rounded-xl shadow-md shadow-blue-500/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              TravelBridge
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Nav Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 hover:scale-[1.02]"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/40"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-slate-900/95 border border-slate-800 rounded-xl overflow-hidden px-4 py-4 space-y-4"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-300 hover:text-white font-medium text-sm py-2"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-[1px] bg-slate-800 w-full my-2" />
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                  className="w-full text-center py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-sm font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}
                  className="w-full text-center py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-sm font-medium shadow-md shadow-blue-600/20"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 1. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 md:py-32 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Hero Content */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
          
          {/* Tag */}
          <div className="gsap-reveal-hero inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Travel Assistant
          </div>

          {/* Heading */}
          <h1 className="gsap-reveal-hero text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Plan Your Perfect <br className="hidden sm:inline" />
            Trip With{' '}
            <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-400 bg-clip-text text-transparent animate-pulse">
              AI
            </span>
          </h1>

          {/* Subheadline */}
          <p className="gsap-reveal-hero text-slate-300 text-base sm:text-lg lg:text-xl max-w-xl font-normal leading-relaxed">
            Generate complete itineraries, translate languages instantly, and travel confidently anywhere in the world.
          </p>

          {/* CTAs */}
          <div className="gsap-reveal-hero flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              Start Planning <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#trip-planner"
              className="bg-slate-800/70 hover:bg-slate-800 text-slate-200 border border-slate-700/60 px-8 py-3.5 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-200" /> Watch Demo
            </a>
          </div>

          {/* Small Stats / Trust badge */}
          <div className="gsap-reveal-hero flex flex-wrap gap-8 pt-6 border-t border-slate-800/80 w-full">
            <div>
              <p className="text-2xl font-bold text-white">100+</p>
              <p className="text-xs text-slate-400">Languages</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">10M+</p>
              <p className="text-xs text-slate-400">Translations Daily</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">99.4%</p>
              <p className="text-xs text-slate-400">AI Accuracy Rating</p>
            </div>
          </div>
        </div>

        {/* Right Hero: Cinematic 3D Globe with Flight Paths */}
        <div className="lg:col-span-6 relative flex justify-center w-full min-h-[350px] sm:min-h-[480px]">
          
          {/* Ambient Glow behind the globe */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-cyan-500/10 blur-[60px] rounded-[40px] pointer-events-none" />

          {/* Three.js Globe Container */}
          <div className="w-full h-full absolute inset-0 z-10">
            <Globe3D scrollProgress={scrollProgress} />
          </div>

          {/* Floating Instructions */}
          <div className="absolute bottom-4 left-4 bg-slate-900/80 border border-slate-800/65 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg z-20 text-[10px] text-slate-400 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400 animate-spin" />
            <span>Interactive 3D Globe. Drag to explore.</span>
          </div>
        </div>
      </section>

      {/* 2. Features Grid Section */}
      <section id="features" className="gsap-section-reveal relative max-w-7xl mx-auto px-6 py-24 z-10 border-t border-slate-850">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Packed with Premium Features
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Everything you need to navigate foreign cities, read localized details, and coordinate budgets in one intuitive app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-slate-900/40 border border-slate-800 hover:border-slate-700/60 p-6 rounded-3xl transition-all duration-300 hover:scale-[1.01] hover:bg-slate-800/30 overflow-hidden flex flex-col justify-between"
            >
              {/* Accent glow line at top of cards */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/50 transition-all duration-500" />
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center group-hover:bg-slate-700/30 group-hover:border-slate-600 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-blue-400 transition-colors cursor-pointer" onClick={() => navigate('/signup')}>
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section id="how-it-works" className="gsap-section-reveal relative max-w-7xl mx-auto px-6 py-24 z-10 border-t border-slate-850">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Workflow</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            How It Works
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Set up your entire global trip outline in less than a minute. Let AI manage the coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connection Line on Desktop */}
          <div className="absolute top-12 left-8 right-8 h-[2px] bg-slate-800/60 hidden lg:block z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between items-start space-y-4 hover:border-slate-750 transition-colors">
              <div className="flex justify-between items-center w-full">
                <span className="text-4xl font-black text-slate-800">{step.num}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/80" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">{step.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Trip Planner Showcase Section (With Route Map Visualizer) */}
      <section id="trip-planner" className="gsap-section-reveal relative max-w-7xl mx-auto px-6 py-24 z-10 border-t border-slate-850">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">Showcase</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Interactive Itinerary Builder
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Interact with a sample schedule curated by TravelBridge. See day-by-day routes and real-time cost sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Timeline Activities List */}
          <div className="lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              
              {/* Heading / Tab triggers */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white">Kyoto, Japan Route</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{itineraryDays[activeDay].theme}</p>
                </div>

                <div className="flex items-center bg-slate-800/85 p-1 rounded-xl border border-slate-700/50">
                  {[1, 2, 3].map((dayNum) => (
                    <button
                      key={dayNum}
                      onClick={() => {
                        setActiveDay(dayNum);
                        setActiveShowcaseIdx(1); // reset active travel point
                      }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                        activeDay === dayNum
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Day {dayNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                {itineraryDays[activeDay].activities.map((act, index) => (
                  <div
                    key={index}
                    className="flex gap-4 relative cursor-pointer"
                    onClick={() => setActiveShowcaseIdx(act.idx)}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 z-10">
                      <span className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        activeShowcaseIdx === act.idx ? 'bg-cyan-400' : 'bg-blue-500'
                      }`} />
                    </div>
                    
                    <div className={`flex-1 border p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors ${
                      activeShowcaseIdx === act.idx
                        ? 'bg-slate-800/40 border-cyan-500/40'
                        : 'bg-slate-800/20 border-slate-750/30 hover:border-slate-700'
                    }`}>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold">{act.time}</span>
                        <h5 className="text-sm font-bold text-white mt-0.5">{act.title}</h5>
                        <p className="text-xs text-slate-400 mt-1 max-w-md">{act.desc}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:self-center">
                        <span className="text-[9px] font-bold bg-slate-850 text-slate-300 px-2.5 py-1 rounded border border-slate-750">
                          {act.tag}
                        </span>
                        <span className="text-xs font-extrabold text-white min-w-[32px] text-right">
                          {act.cost}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-850 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-400">
                ⚡ Click a timeline item to direct the traveler route vehicle.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-750 text-slate-200 px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-700/60 transition-colors"
              >
                Generate Your Own Itinerary
              </button>
            </div>
          </div>

          {/* Right: 3D-assisted Route Map Visualizer & Budget */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            
            {/* Route Map Visualizer (Three.js Orthographic map) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Itinerary Route Map</h3>
                <span className="text-[9px] text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">LIVE MAP</span>
              </div>
              <RouteMapVisualizer activePoint={activeShowcaseIdx} />
            </div>

            {/* Budget Breakdown Visualization */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Budget Analytics</h3>
                <p className="text-xs text-slate-400 mb-6">Day {activeDay} Cost Breakdown & Category Limits</p>

                {/* Progress Visualizer */}
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold mb-2">
                      <span className="text-slate-300">Lodging (Hotel Room)</span>
                      <span className="text-white">$120 / $150 limit</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold mb-2">
                      <span className="text-slate-300">Food & Dining</span>
                      <span className="text-white">
                        {activeDay === 1 ? '$12' : activeDay === 2 ? '$35' : '$60'} / $80 limit
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: activeDay === 1 ? '15%' : activeDay === 2 ? '44%' : '75%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold mb-2">
                      <span className="text-slate-300">Transit & Commute</span>
                      <span className="text-white">
                        {activeDay === 1 ? '$4' : activeDay === 2 ? '$5' : '$14'} / $30 limit
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: activeDay === 1 ? '13%' : activeDay === 2 ? '17%' : '47%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold mb-2">
                      <span className="text-slate-300">Activities & Tickets</span>
                      <span className="text-white">
                        {activeDay === 1 ? '$0' : activeDay === 2 ? '$4' : '$6'} / $50 limit
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-500"
                        style={{ width: activeDay === 1 ? '0%' : activeDay === 2 ? '8%' : '12%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Card */}
              <div className="mt-8 bg-slate-800/30 border border-slate-750 p-4 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400">Total Spent</span>
                  <span className="text-xs text-slate-400">Target Cap</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-black text-white">
                    ${activeDay === 1 ? '136.00' : activeDay === 2 ? '164.00' : '200.00'}
                  </span>
                  <span className="text-sm font-bold text-slate-500">/ $310.00</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5" /> Under daily limit budget. Good job saving!
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Translation Features Showcase (With AI Glowing Morphing Orb) */}
      <section id="translation" className="gsap-section-reveal relative max-w-7xl mx-auto px-6 py-24 z-10 border-t border-slate-850">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Real-Time</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Instant AI Translations
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Never get stuck deciphering signs or menus. Speak to anyone smoothly using dedicated modals.
          </p>
        </div>

        {/* Translation workspace alongside AI Orb */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* AI Glowing Orb 3D canvas (Left side on desktop) */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
            <div className="w-48 h-48 sm:w-56 sm:h-56 relative">
              <AIGlowingOrb />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Assistant Core</span>
              <p className="text-[10px] text-slate-500 mt-1">Virtual voice & scanner engine sync active</p>
            </div>
          </div>

          {/* Interactive Translation Box (Right side on desktop) */}
          <div className="lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden w-full">
            
            {/* Header Tabs */}
            <div className="flex bg-slate-900 border-b border-slate-800 p-2 gap-2">
              <button
                onClick={() => setTranslationTab('voice')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  translationTab === 'voice' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4" /> Voice Translation
              </button>
              <button
                onClick={() => setTranslationTab('text')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  translationTab === 'text' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" /> Text Translator
              </button>
              <button
                onClick={() => setTranslationTab('camera')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  translationTab === 'camera' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" /> Camera Scan (OCR)
              </button>
            </div>

            {/* Translation Tab Content */}
            <div className="p-6 md:p-8 min-h-[240px] flex items-center justify-center">
              
              {/* VOICE TAB */}
              {translationTab === 'voice' && (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  {/* Left Speak Balloon */}
                  <div className="bg-slate-800/40 border border-slate-700/30 p-5 rounded-2xl text-left space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Source (English)</span>
                      <Volume2 className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" />
                    </div>
                    <p className="text-base text-white font-semibold">"Excuse me, does this train head towards Gion district?"</p>
                    <div className="flex items-center gap-1.5 pt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      <span className="text-[10px] text-slate-500">Audio Captured</span>
                    </div>
                  </div>

                  {/* Right Translate Balloon */}
                  <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-2xl text-left space-y-3 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Translation (Japanese)</span>
                      <Volume2 className="w-4 h-4 text-blue-400 cursor-pointer hover:text-white" />
                    </div>
                    <p className="text-base text-cyan-300 font-bold">"すみません、この電車は祇園方面に行きますか？"</p>
                    <p className="text-[11px] text-slate-400 font-medium italic">"Sumimasen, kono densha wa Gion houmen ni ikimasu ka?"</p>
                  </div>
                </div>
              )}

              {/* TEXT TAB */}
              {translationTab === 'text' && (
                <div className="w-full flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    
                    {/* Input box */}
                    <div className="flex flex-col text-left">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Type text to translate</label>
                      <textarea
                        value={inputText}
                        onChange={handleTranslateChange}
                        placeholder="Type something here..."
                        className="w-full bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500 flex-1 resize-none min-h-[120px]"
                      />
                    </div>

                    {/* Output box */}
                    <div className="flex flex-col text-left bg-slate-800/20 border border-slate-700/20 p-4 rounded-2xl min-h-[120px] justify-between">
                      <div>
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-2">Translation output (Japanese)</span>
                        <p className={`text-base font-bold ${isTranslating ? 'text-slate-500' : 'text-white'}`}>
                          {translatedText}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-750">
                          Copy
                        </button>
                      </div>
                    </div>

                  </div>
                  <p className="text-[11px] text-slate-500 text-left">
                    💡 Try typing "hello", "thank you", or "where is the hotel" to test the live mockup translation.
                  </p>
                </div>
              )}

              {/* CAMERA TAB */}
              {translationTab === 'camera' && (
                <div className="w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-6 items-center">
                  
                  {/* Camera view screen */}
                  <div className="relative w-full md:w-1/2 aspect-video bg-slate-900 border border-slate-750 rounded-2xl overflow-hidden flex items-center justify-center">
                    <span className="text-xs text-slate-500 font-mono">[ Camera Active: Signboard ]</span>
                    
                    {/* Simulated scanning scanlines */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 opacity-60 animate-bounce" />
                    
                    {/* Japanese elements on sign */}
                    <div className="absolute top-1/4 left-1/4 text-center">
                      <span className="text-lg font-black text-white bg-black/60 px-2 py-0.5 rounded">出口</span>
                      <span className="text-[9px] text-cyan-400 block bg-slate-900/80 px-1 py-0.5 rounded border border-cyan-500/30 mt-1">EXIT</span>
                    </div>

                    <div className="absolute bottom-1/4 right-1/4 text-center">
                      <span className="text-lg font-black text-white bg-black/60 px-2 py-0.5 rounded">切符売場</span>
                      <span className="text-[9px] text-cyan-400 block bg-slate-900/80 px-1 py-0.5 rounded border border-cyan-500/30 mt-1">TICKETS</span>
                    </div>
                  </div>

                  {/* Explanation card */}
                  <div className="w-full md:w-1/2 text-left space-y-4">
                    <h4 className="text-lg font-bold text-white">Signboard & Menu Translation</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Simply hold your camera up. TravelBridge instantly scans written text, identifies the source, and layers translations over the native imagery. Works offline for downloaded language packs.
                    </p>
                    <button onClick={() => navigate('/signup')} className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-lg shadow transition-colors">
                      Try Camera Scan
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="gsap-section-reveal relative max-w-7xl mx-auto px-6 py-24 z-10 border-t border-slate-850">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">Reviews</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Loved by Explorers Worldwide
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Read real stories from global travelers and nomads who rely on TravelBridge daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between hover:border-slate-700/60 transition-colors">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "{test.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-850 mt-6">
                <img
                  src={test.image}
                  alt={test.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-755 shadow"
                />
                <div>
                  <h5 className="text-sm font-bold text-white">{test.name}</h5>
                  <p className="text-xs text-slate-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section id="pricing" className="gsap-section-reveal relative max-w-7xl mx-auto px-6 py-24 z-10 border-t border-slate-850">
        
        {/* Header & Toggle */}
        <div className="text-center space-y-6 max-w-2xl mx-auto mb-16">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Plans</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Choose the perfect tier for your travel rhythm. Switch or cancel anytime.
          </p>

          {/* Toggle Button */}
          <div className="inline-flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'yearly' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly billing (Save 25%)
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {pricingTiers.map((tier, idx) => {
            const currentPrice = billingCycle === 'monthly' ? tier.price.monthly : tier.price.yearly;
            
            return (
              <div
                key={idx}
                className={`relative bg-slate-900/50 border rounded-[32px] p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
                  tier.popular
                    ? 'border-blue-500 shadow-xl shadow-blue-500/5 z-10 before:absolute before:top-0 before:left-1/2 before:-translate-y-1/2 before:-translate-x-1/2 before:bg-blue-600 before:text-white before:px-3 before:py-1 before:rounded-full before:text-[10px] before:font-bold before:uppercase before:content-["Popular"]'
                    : 'border-slate-800 hover:border-slate-750'
                }`}
              >
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-white">{tier.name}</h4>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{tier.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">${currentPrice}</span>
                    <span className="text-slate-500 text-sm">/ {billingCycle === 'monthly' ? 'month' : 'month, billed yearly'}</span>
                  </div>

                  <div className="h-[1px] bg-slate-800" />

                  <ul className="space-y-3.5 text-left">
                    {tier.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => navigate('/signup')}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs mt-8 transition-all ${
                    tier.popular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="gsap-section-reveal relative max-w-4xl mx-auto px-6 py-24 z-10 border-t border-slate-850">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Support</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Got questions about using the app during travel? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            
            return (
              <div
                key={idx}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left text-sm sm:text-base font-bold text-white hover:bg-slate-850/20 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-850 pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner (Pre-Footer) */}
      <section className="gsap-section-reveal relative max-w-5xl mx-auto px-6 py-12 md:py-16 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-500/20 rounded-[40px] blur-sm pointer-events-none border border-blue-500/20" />
        <div className="relative bg-slate-950/80 border border-slate-800 rounded-[40px] p-8 md:p-12 text-center space-y-6 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Explore Without Limits?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Join thousands of travelers who are using TravelBridge to plan smarter, speak easier, and experience native cultures fully.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/25 transition-all duration-200 hover:scale-[1.02] text-sm"
          >
            Claim Your Free Trial
          </button>
        </div>
      </section>

      {/* 9. Footer Section */}
      <footer className="relative max-w-7xl mx-auto px-6 pt-20 pb-12 z-10 border-t border-slate-850">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 text-left">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-2 rounded-xl">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">TravelBridge</span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              AI-powered travel companion generating complete itineraries, providing instant vocal and camera scanning translations, and keeping you on budget.
            </p>

            {/* Newsletter sign up */}
            <div className="space-y-2 max-w-sm">
              <p className="text-xs font-bold text-white">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-650 flex-1"
                />
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Platform</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#trip-planner" className="hover:text-white transition-colors">Showcase</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Support</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#faq" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Sign In</a></li>
              <li><a href="/signup" className="hover:text-white transition-colors">Register</a></li>
              <li><span className="cursor-default hover:text-white transition-colors">Contact Support</span></li>
            </ul>
          </div>

          {/* Column 4: Legal & System */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Legal</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><span className="cursor-default hover:text-white">Privacy Policy</span></li>
              <li><span className="cursor-default hover:text-white">Terms of Service</span></li>
              <li><span className="cursor-default hover:text-white">Cookie Preferences</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & status */}
        <div className="border-t border-slate-850 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TravelBridge. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Security Certifications</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Status Page</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Hero;
