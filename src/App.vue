<template>
  <div id="app">
    <div class="sidebar">
      <User/>
    </div>
    <div class="main">
      <Repos/>
    </div>
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
html,
body {
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  height: 100%;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
.sidebar {
  width: 15%;
  height: 100%;
  background-color: #eee;
  float: left;
}
.main {
  width: 80%;
  height: 100%;
  float: left;
  padding: 1em;
  overflow: auto;
}
.selected {
  background-color: red;
}
</style>
