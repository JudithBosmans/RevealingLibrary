<template>
  <div v-if="book">
    <h1>{{ book.title }}</h1>
    <p>{{ book.author_creator }}</p>
    <p>{{ book.description }}</p>
  </div>
  <div ref="sceneContainer" :class="styles.threeContainer"></div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import styles from "./index.module.scss";

const route = useRoute();
const book = ref(null);
const sceneContainer = ref(null);

onMounted(async () => {
  const res = await fetch("/data/books.json");
  const books = await res.json();
  book.value = books.find((b) => b.id === route.params.id);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

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

  camera.position.set(0, 1, 0.1);

  const light = new THREE.AmbientLight(0xffffff, 2);
  scene.add(light);

  const loader = new GLTFLoader();

  if (book.value) {
    loader.load(book.value.model, (gltf) => {
      const model = gltf.scene;

      model.rotation.set(0, 0, 0);
      model.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.center();
          child.geometry?.computeBoundingBox();
        }
      });

      // SCALE
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const targetHeight = 1.75;
      const scaleFactor = targetHeight / size.y;
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Reposition at bottom y
      const scaledBox = new THREE.Box3().setFromObject(model);
      const minY = scaledBox.min.y;
      model.position.y = -minY;

      scene.add(model);
    });
  }

  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  });

  const animate = () => {
    requestAnimationFrame(animate);

    //SEt up raycaster for book & mouse dedection and enlarge on gover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    let newHovered = null;
    if (intersects.length > 0) {
      newHovered = intersects[0].object;
      while (newHovered.parent && newHovered.parent.type !== "Scene") {
        newHovered = newHovered.parent;
      }
    }

    renderer.render(scene, camera);
  };
  animate();
});
</script>
