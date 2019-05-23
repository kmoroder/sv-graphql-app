<template>
  <div id="app">
    <User />
    <Repos />
  </div>
</template>

<script>
import User from "./components/User.vue";
import Repos from "./components/Repos.vue";

export default {
  name: "app",
  components: {
    User,
    Repos
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
