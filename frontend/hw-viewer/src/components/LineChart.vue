<script lang="ts">
import { Component, Prop} from "vue-property-decorator";
import Vue from 'vue'
import { Line, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins

@Component({
  extends: Line,
  mixins: [reactiveProp]
})
export default class LineChart extends Vue {
  @Prop() chartData!: any;
  @Prop() options!: any;

  public renderChart!: (chartData: any, options: any) => void

  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>