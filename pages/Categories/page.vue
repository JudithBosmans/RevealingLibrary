<template>
  <h1 class="categories categoriesTitle">Categorieën</h1>
  <p class="categories categoriesDescription">
    Om je te helpen snel het juiste boek te vinden, hebben we onze collectie
    onderverdeeld in overzichtelijke categorieën. Blader door de verschillende
    thema’s en laat je verrassen door onze aanbevelingen.
  </p>

  <div :class="styles.category">
    <div :class="styles.categoryItems">
      <img src="/public/assets/singleLogoAnis/Comp1.gif" />
      <p>kunst</p>
    </div>
    <div :class="styles.categoryItems">
      <img src="/public/assets/singleLogoAnis/Comp2.gif" />
      <p>(grafisch) ontwerp</p>
    </div>
    <div :class="styles.categoryItems">
      <img src="/public/assets/singleLogoAnis/Comp3.gif" />
      <p>interieur vormgeving</p>
    </div>
    <div :class="styles.categoryItems">
      <img src="/public/assets/singleLogoAnis/Comp4.gif" />
      <p>fotografie</p>
    </div>
    <div :class="styles.categoryItems">
      <img src="/public/assets/singleLogoAnis/Comp5.gif" />
      <p>film</p>
    </div>
  </div>
</template>

<script setup>
import styles from "./index.module.scss";
</script>
