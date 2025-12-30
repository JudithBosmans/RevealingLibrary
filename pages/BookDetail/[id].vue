<template>
  <div v-if="book" class="bookPage">
    <div class="topSection">
      <div class="roster">
        <div class="flex flex-col">
          <h2 class="row-start-2">{{ book.title }}</h2>
          <h3 class="row-start-2">{{ book.author_creator }}</h3>
        </div>
        <div class="twoCols">
          <div class="roster">
            <div class="rosterCell row-start-3">
              <hr class="border-[1px] border-black w-[100px] mr-3" />
              <p>Taal</p>
            </div>

            <div class="rosterCell row-start-3">
              <hr class="border-[1px] border-black w-[100px] mr-3" />
              <p class="">Categorie</p>
            </div>

            <h4 class="border-[1px]bg3 row-start-4">{{ book.language }}</h4>
            <h4 class="border-[1px]bg4 row-start-4">{{ book.genre_form }}</h4>

            <div class="rosterCell row-start-5">
              <hr class="border-[1px] border-black w-[100px] mr-3" />
              <p class="">Beschikbaar</p>
            </div>

            <div class="rosterCell row-start-5">
              <hr class="border-[1px] border-black w-[100px] mr-3" />
              <p class="">Jaar publicatie</p>
            </div>

            <h4 class="border-[1px]bg7 row-start-6">
              {{ book.availabillity }}
            </h4>
            <h4 class="border-[1px]bg8 row-start-6">
              {{ book.date_of_publication }}
            </h4>

            <div class="rosterCell row-start-7">
              <hr class="border-[1px] border-black w-[100px] mr-3" />
              <p class="">Referentie nummer</p>
            </div>

            <h4 class="row-start-8">
              {{ book.reference_number }}
            </h4>
          </div>
        </div>
      </div>
    </div>

    <div class="descr descrCont">
      <div class="descrImages">
        <div v-for="(picture, index) in book.pictures" :key="index">
          <img :src="picture" alt="Book image" />
        </div>
      </div>

      <div class="descrDescription">
        <div class="rosterCell">
          <hr class="border-[1px] border-black w-[100px] mr-3" />
          <p>Omschrijving</p>
        </div>

        <div>
          <h4 class="mt-[20px]">{{ book.description }}</h4>
        </div>
      </div>
    </div>

    <div class="Related">
      <div class="rosterCell">
        <hr class="border-[1px] border-black w-[100px] mr-3" />
        <p>Gerelateerde boeken</p>
      </div>

      <div class="RelatedBooks">
        <div class="RelatedCont">
          <h1>"</h1>
          <h4>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in.
          </h4>
        </div>
        <div class="RelatedCont ml-[150px]">
          <h1>"</h1>
          <h4>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in.
          </h4>
        </div>
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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const route = useRoute();
const book = ref(null);
const sceneContainer = ref(null);

const canvasRefs = ref([]);
const relatedBooks = [
  {
    quote: "Dit is een gerelateerde quote.",
    model: "/models/5_Heubach_Friedrich_Wolfram.glb",
  },
  {
    quote: "Nog een gerelateerde quote.",
    model: "/models/5_Heubach_Friedrich_Wolfram.glb",
  },
];

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

  camera.position.set(0, 1.2, 3);

  const light = new THREE.AmbientLight(0xffffff, 2);
  scene.add(light);

  const loader = new GLTFLoader();
  let bookModel = null;

  if (book.value) {
    loader.load(book.value.model, (gltf) => {
      const model = gltf.scene;

      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);

      model.position.sub(center);

      const modelGroup = new THREE.Group();
      modelGroup.add(model);

      bookModel = modelGroup;
      scene.add(bookModel);

      const size = new THREE.Vector3();
      box.getSize(size);

      const targetHeight = 1.75;
      const scaleFactor = targetHeight / size.y;

      animateIn(bookModel, scaleFactor);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.target.set(0, 0, 0);
      controls.update();
    });
  }

  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  });

  function animateIn(model, baseScaleFactor) {
    const isMobile = window.innerWidth < 768;

    const targetPositionX = isMobile ? 0 : -2.3;
    const targetPositionY = 0.1;
    const targetPositionZ = 0;

    const targetRotationY = -1.55;
    const targetRotationX = 1.5;
    const targetRotationZ = 1.9;
    const zoomMultiplier = 1.5;

    const step = () => {
      const t = 0.05;

      // Animate position
      model.position.x = THREE.MathUtils.lerp(
        model.position.x,
        targetPositionX,
        t
      );
      model.position.y = THREE.MathUtils.lerp(
        model.position.y,
        targetPositionY,
        t
      );
      model.position.z = THREE.MathUtils.lerp(
        model.position.z,
        targetPositionZ,
        t
      );

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
      const targetScale = Math.min(baseScaleFactor * zoomMultiplier, 10);
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, t);
      model.scale.setScalar(newScale);

      renderer.render(scene, camera);

      if (
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
    renderer.render(scene, camera);
  };

  animate();

  relatedBooks.forEach((book, index) => {
    const canvasContainer = canvasRefs.value[index];
    if (!canvasContainer) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(150, 150);
    canvasContainer.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 2);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load(book.model, (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);
      const scale = 0.7 / box.getSize(new THREE.Vector3()).y;
      model.scale.setScalar(scale);
      scene.add(model);

      const animate = () => {
        requestAnimationFrame(animate);
        model.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    });
  });
});
</script>
