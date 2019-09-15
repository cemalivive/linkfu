<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
export default {
  name: "app",
  components: {
    Header
  }
};
</script>
<style>
@import "./assets/css/bootstrap.min.css";
@import "./assets/css/custom.css";
</style>
