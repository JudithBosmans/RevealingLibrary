<template>
  <div ref="sceneContainer" class="three-container"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const sceneContainer = ref(null);

onMounted(async () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  sceneContainer.value.appendChild(renderer.domElement);

  camera.position.set(0, 1, 5);

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  const res = await fetch("/data/books.json");
  const books = await res.json();

  const loader = new GLTFLoader();

  books.forEach((book, index) => {
    loader.load(
      book.model,
      (gltf) => {
        const model = gltf.scene;

        // Normalize model size
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 2 / maxDim;
        model.scale.setScalar(scaleFactor);

        // Center the model
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);

        // Position books with spacing
        model.position.x = index * 2 - (books.length - 0);
        model.position.y = 0;

        scene.add(model);
      },
      undefined,
      (error) => {
        console.error(`❌ Failed to load ${book.title}:`, error);
      }
    );
  });

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();
});
</script>

<style scoped>
.three-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
