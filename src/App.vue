<script setup lang="ts">
import WalletsPage from './components/WalletsPage.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-between bg-[#FAFAFC]">
    <Header />
    <WalletsPage/>
    <Footer />
  </div>
</template>

