<template>
  <div ref="sceneContainer" class="three-container"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const sceneContainer = ref(null);
const bookModels = [];
const router = useRouter();

onMounted(async () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    65,
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

  const res = await fetch("/data/books.json");
  const books = await res.json();

  const loader = new GLTFLoader();

  books.forEach((book, index) => {
    loader.load(book.model, (gltf) => {
      const model = gltf.scene;

      model.rotation.set(0, 0, 0);
      model.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.center();
          child.geometry?.computeBoundingBox();
        }
      });

      // SXCALING
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const targetHeight = 1.7;
      const scaleFactor = targetHeight / size.y;
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // model.rotation.y = Math.PI / 9;

      // Reposition at bottom y
      const scaledBox = new THREE.Box3().setFromObject(model);
      const minY = scaledBox.min.y;
      model.position.y = -minY;

      // X position (books sliding in and xhere they end uyp)
      const spacing = 0.05;
      const totalWidth = (books.length - 1) * spacing;
      const targetX = index * spacing - totalWidth / 1.8;

      // Start position for slide animation
      model.position.x = 5;

      // Glide speed for animaton
      model.userData = {
        ...model.userData,
        targetX,
        id: book.id,
        glideSpeed: 0.02 + Math.random() * 0.09,
      };

      model.cursor = "pointer";
      model.onClick = () => {
        const { x, y, z } = model.position;
        const ry = model.rotation.y;
        const scale = model.scale.x;
        router.push({
          path: `/BookDetail/${book.id}`,
          query: {
            x,
            y,
            z,
            ry,
            scale,
          },
        });
      };

      model.targetScale = 1;
      bookModels.push(model);
      scene.add(model);
      console.log("Loaded model for:", book.title, "with id:", book.id);
    });
  });

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  });

  window.addEventListener("click", () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      let clicked = intersects[0].object;
      while (clicked.parent && clicked.parent.type !== "Scene") {
        clicked = clicked.parent;
      }
      if (clicked.userData?.id) {
        clicked.onClick();
      }
    }
  });

  let hoveredModel = null;
  let lastHoverChange = 0;
  const hoverCooldown = 100;

  const animate = () => {
    requestAnimationFrame(animate);

    //SEt up raycaster for book & mouse dedection and enlarge on gover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    document.body.style.cursor = hoveredModel ? "pointer" : "default";

    let newHovered = null;

    for (let i = 0; i < intersects.length; i++) {
      let obj = intersects[i].object;

      // Walk up to find the top-level model in bookModels
      while (obj.parent && obj.parent.type !== "Scene") {
        obj = obj.parent;
      }

      // Check if this top-level object is one of your books
      if (bookModels.includes(obj)) {
        newHovered = obj;
        break;
      }
    }

    const now = performance.now();

    if (
      newHovered !== hoveredModel &&
      newHovered !== null &&
      now - lastHoverChange > hoverCooldown
    ) {
      hoveredModel = newHovered;
      lastHoverChange = now;

      bookModels.forEach((model) => {
        model.targetScale = model === hoveredModel ? 1.3 : 1.0;
      });
    }

    if (
      newHovered === null &&
      hoveredModel !== null &&
      now - lastHoverChange > hoverCooldown
    ) {
      hoveredModel = null;

      bookModels.forEach((model) => {
        model.targetScale = 1.0;
      });
    }

    const time = performance.now() * 0.001;

    bookModels.forEach((model, index) => {
      const currentScale = model.scale.x;
      const newScale = THREE.MathUtils.lerp(
        currentScale,
        model.targetScale,
        0.1
      );
      model.scale.setScalar(newScale);

      model.position.x = THREE.MathUtils.lerp(
        model.position.x,
        model.userData.targetX,
        0.2
      );

      // floating animation
      const floatStrength = 0.00002;
      const floatSpeed = 1;
      model.position.y += Math.sin(time * floatSpeed + index) * floatStrength;
    });

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
