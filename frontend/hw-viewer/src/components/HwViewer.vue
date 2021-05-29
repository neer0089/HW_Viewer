<template>
  <div class="small">
    <h1>Hardware data: {{ cpuLoad }}</h1>
    <!-- <LineChart :chartData="data" :options="options"/> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import LineChart from "./LineChart.vue";
import {io} from 'socket.io-client';

let socket = io("http://localhost:3000");

@Component({
  components: {
    LineChart
  }
})
export default class HwViewer extends Vue {
  socket: any;
  hwData = {};
  cpuLoad = 0;
  data: any = null;
  dataForChart: number[] = [];

  options = {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Percentage CPU used'
        }
      }]
    }     
  }

  setData(fetchedData: number[]) {
    this.data = {
      datasets: [
        {
          label: "CPU Load",
          backgroundColor: "#1A73E8",
          data: fetchedData
        }
      ]
    }
  }

  created() {
    console.log("Created component");
    socket.on("hwdata", data => {
      console.log(data);
    })
  }

  getRealtimeData() {
    socket.on("hwdata", fetchedData => {
      // this.cpuLoad = fetchedData;
      console.log(fetchedData);
      // this.cpuLoad = fetchedData.cpuLoad;
      // let dataForChart: number[] = [];
      // this.dataForChart.push(fetchedData.cpuLoad)
      // // let dataChart: number = fetchedData.cpuLoad;
      // this.setData(dataForChart);
    })
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.small {
  max-width: 600px;
  height: 400px;
  margin: 150px auto;
}
</style>
