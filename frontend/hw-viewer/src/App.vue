<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HwViewer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HwViewer from "./components/HwViewer.vue";

@Component({
  components: {
    HwViewer,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  text-align: center;
  margin-top: 10px;
}
</style>
