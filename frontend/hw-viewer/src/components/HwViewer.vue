<template>
  <div>
    <div class="columns is-centered">
      <div class="column is-two-thirds is-mobile">
        <div class="card">
          <header class="card-header">
            <div class="card-title">
              Live hardware monitor
            </div>
          </header>
          <div class="content">
            <div class="grid">
              <div class="device">
                <div class="tag is-medium header-tag">Device Information</div>
                <div class="info">
                  <div class="box">Device name: {{ hwData.device }}</div>
                  <div class="box">Device manufacturer: {{ hwData.deviceManufacturer }}</div>
                </div>
              </div>
              <div class="device">
                <div class="tag is-medium header-tag">Memory</div>
                <div class="info">
                  <div class="box">Total memory: {{ hwData.totalMemory }}</div>
                  <div class="box">Free memory: {{ hwData.freeMemory }}</div>
                  <div class="box">Used memory: {{ hwData.usedMemory }}</div>
                </div>
              </div>
              <div class="device">
                <div class="tag is-medium header-tag">Network</div>
                <div class="info">
                  <div class="box">Total received: {{ hwData.networks[0].totalReceived }}</div>
                  <div class="box">Total transferred: {{ hwData.networks[0].totalTransferred }}</div>
                </div>
              </div>
              <div class="device">
                <div class="tag is-medium header-tag">CPU</div>
                <div class="info">
                  <div class="box">CPU model: {{ hwData.cpuModel }}</div>
                  <div class="box">CPU manufacturer: {{ hwData.cpuManufacturer }}</div>
                  <div class="box">CPU cores: {{ hwData.cpuCores }}</div>
                  <div class="box">CPU load: {{ hwData.cpuLoad }}</div>
                </div>
              </div>
            </div>
            <!-- <h1>Hardware data: {{ hwData }}</h1> -->
          </div>
        </div>
      </div>
    </div>
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
  hwData = {};
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
    // console.log("Created component");
    socket.on("hwdata", data => {
      this.hwData = data;
      // console.log(data);
    })
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-header{
  background-color: #f5f5f5;
  padding: 10px 0 10px 0;
}

.card-title {
  width: 100%;
  text-align: center;
  font-weight: 500;
  font-size: 40px;
}

.content {
  padding: 20px 0 10px 0;
  text-align: left;
}

.header-tag {
  background-color: #f5f5f5;
  font-weight: 600;
  font-size: 20px !important;
}

.info > p {
  font-weight: 500;
  font-size: 20px;
}

.box {
  padding: 2px 2px 2px 5px;
  margin: 5px 0 5px 0;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.device {
  width: 50%;
  text-align: center;
}

</style>
