<template>
  <div v-if="book" class="padding twoCols">
    <div :class="styles.text">
      <h2 :class="styles.textTitle">{{ book.title }}</h2>
    </div>
    <br />

    <div>
      <div class="roster">
        <p class="row-start-1">Titel</p>
        <p class="row-start-1">Autheur</p>
        <h3 class="row-start-2">{{ book.title }}</h3>
        <h3 class="row-start-2">{{ book.author_creator }}</h3>
        <p class="row-start-3">Taal</p>
        <p class="row-start-3">Categorie</p>
        <h3 class="row-start-4">{{ book.language }}</h3>
        <h3 class="row-start-4">{{ book.genre_form }}</h3>
        <p class="row-start-5">Beschikbaar</p>
        <p class="row-start-5">Jaar publicatie</p>
        <h3 class="row-start-6">{{ book.availabillity }}</h3>
        <h3 class="row-start-6">{{ book.date_of_publication }}</h3>
        <p class="row-start-7">Referentie nummer</p>
        <h3 class="row-start-8">{{ book.reference_number }}</h3>
      </div>
      <div class="mt-[25%]">
        <p>{{ book.description }}</p>
      </div>
    </div>
  </div>
  <div ref="sceneContainer" :class="styles.threeContainer"></div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import styles from "./index.module.scss";
import { DragControls } from "three/addons/controls/DragControls.js";

const route = useRoute();
const book = ref(null);
const sceneContainer = ref(null);

const startPosition = {
  x: parseFloat(route.query.x || 0),
  y: parseFloat(route.query.y || 0),
  z: parseFloat(route.query.z || 0),
};
const startRotationY = parseFloat(route.query.ry || 0);

onMounted(async () => {
  const res = await fetch("/data/books.json");
  const books = await res.json();
  book.value = books.find((b) => b.id === route.params.id);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  sceneContainer.value.appendChild(renderer.domElement);

  camera.position.set(0, 1.2, 3);

  const light = new THREE.AmbientLight(0xffffff, 2);
  scene.add(light);

  const loader = new GLTFLoader();
  let bookModel = null;

  if (book.value) {
    loader.load(book.value.model, (gltf) => {
      const model = gltf.scene.children[0];

      model.rotation.set(0, startRotationY, 0);
      model.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.center();
          child.geometry?.computeBoundingBox();
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);

      const targetHeight = 1.75;
      const scaleFactor = targetHeight / size.y;
      model.scale.setScalar(scaleFactor);

      model.position.set(startPosition.x, startPosition.y, startPosition.z);
      model.rotation.y = startRotationY;

      bookModel = model;
      scene.add(bookModel);
      animateIn(bookModel);

      const controls = new DragControls([model], camera, renderer.domElement);

      controls.addEventListener("dragstart", (event) => {
        if (event.object.material?.emissive) {
          event.object.material.emissive.set(0xaaaaaa);
        }
      });

      controls.addEventListener("dragend", (event) => {
        if (event.object.material?.emissive) {
          event.object.material.emissive.set(0x000000);
        }
      });
    });
  }

  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  });

  const targetPosition = new THREE.Vector3(-1, 0.8, 0); // or tweak the Y
  const targetRotationY = 0; // face forward
  const targetRotationX = 1.5;
  const targetRotationZ = -0.2;

  const targetScale = 6.5; // whatever size you want when zoomed in

  function animateIn(model) {
    const step = () => {
      const progress = model.position.distanceTo(targetPosition);
      const t = THREE.MathUtils.clamp(progress * 0.2, 0.03, 0.1);

      // Animate position
      model.position.lerp(targetPosition, t);

      // Animate rotation
      model.rotation.y = THREE.MathUtils.lerp(
        model.rotation.y,
        targetRotationY,
        t
      );

      model.rotation.x = THREE.MathUtils.lerp(
        model.rotation.x,
        targetRotationX,
        t
      );

      model.rotation.z = THREE.MathUtils.lerp(
        model.rotation.z,
        targetRotationZ,
        t
      );

      // Animate scale
      const currentScale = model.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, t);
      model.scale.setScalar(newScale);

      // Re-render during animation
      renderer.render(scene, camera);

      // Keep animating until all values are close enough
      if (
        model.position.distanceTo(targetPosition) > 0.001 ||
        Math.abs(model.rotation.y - targetRotationY) > 0.001 ||
        Math.abs(currentScale - targetScale) > 0.001
      ) {
        requestAnimationFrame(step);
      }
    };

    step();
  }

  const animate = () => {
    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    // (Optional hover logic)

    renderer.render(scene, camera);
  };

  animate();
});
</script>
