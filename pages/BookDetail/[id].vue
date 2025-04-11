<template>
  <div v-if="book">
    <h1>{{ book.title }}</h1>
    <p>{{ book.author_creator }}</p>
    <p>{{ book.description }}</p>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();
const book = ref(null);

onMounted(async () => {
  const res = await fetch("/data/books.json");
  const books = await res.json();
  book.value = books.find((b) => b.id === route.params.id);
});
</script>
