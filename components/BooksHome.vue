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
      const targetHeight = 1.75;
      const scaleFactor = targetHeight / size.y;
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // model.rotation.y = Math.PI / 9;

      // Reposition at bottom y
      const scaledBox = new THREE.Box3().setFromObject(model);
      const minY = scaledBox.min.y;
      model.position.y = -minY;

      // X position
      const spacing = 0.1;
      const totalWidth = (books.length - 1) * spacing;
      model.position.x = index * spacing - totalWidth / 1.8;

      model.userData = { id: book.id };
      model.cursor = "pointer";
      model.onClick = () => {
        router.push({ path: `/BookDetail/${book.id}` });
      };

      model.targetScale = 1;
      bookModels.push(model);
      scene.add(model);
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

    bookModels.forEach((model) => {
      const isHovered = model === newHovered;
      model.targetScale = isHovered ? 1.3 : 1.0;

      const currentScale = model.scale.x;
      const newScale = THREE.MathUtils.lerp(
        currentScale,
        model.targetScale,
        0.1
      );
      model.scale.setScalar(newScale);
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
