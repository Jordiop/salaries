<template>
  <div class="card" style="padding:20px;">
    <div style="font-size:11px;color:var(--muted);">Evolución histórica</div>
    <div style="font-size:11px;color:var(--muted);margin-top:3px;margin-bottom:10px;">
      {{ region }} · 2008–2023
    </div>
    <div ref="chartEl" style="width:100%;height:180px;"></div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;">
      <span
        v-for="item in legend" :key="item.label"
        style="display:flex;align-items:center;gap:5px;font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);"
      >
        <span :style="{ width:'14px', height: item.thick ? '2.5px' : '2px', background: item.color, display:'inline-block', borderRadius:'1px' }"></span>
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Highcharts from 'highcharts'
import { useSalary } from '@/composables/useSalary.js'

const props = defineProps({ region: String, sex: String })
const { getTrendSeries } = useSalary()
const chartEl = ref(null)
let chart = null

const legend = [
  { label: 'P10',    color: '#ff4444' },
  { label: 'P25',    color: '#ff8c42' },
  { label: 'Mediana',color: '#ffd166', thick: true },
  { label: 'P75',    color: '#06d6a0' },
  { label: 'P90',    color: '#118ab2' },
]

function buildChart() {
  const s = getTrendSeries(props.sex, props.region)
  if (!s || !chartEl.value) return
  if (chart) { chart.destroy(); chart = null }

  chart = Highcharts.chart(chartEl.value, {
    chart: {
      backgroundColor: 'transparent',
      type: 'line',
      margin: [8, 8, 28, 52],
      animation: { duration: 400 },
    },
    title: { text: null },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      type: 'linear',
      tickInterval: 3,
      labels: { style: { color: '#6b6b80', fontSize: '10px', fontFamily: "'DM Mono',monospace" } },
      lineColor: '#2a2a35',
      tickColor: '#2a2a35',
      gridLineColor: 'transparent',
    },
    yAxis: {
      title: { text: null },
      labels: {
        style: { color: '#6b6b80', fontSize: '10px', fontFamily: "'DM Mono',monospace" },
        formatter() { return (this.value / 1000).toFixed(0) + 'k' },
      },
      gridLineColor: '#1c1c22',
    },
    tooltip: {
      backgroundColor: '#141418',
      borderColor: '#2a2a35',
      style: { color: '#f0f0f5', fontFamily: "'DM Mono',monospace", fontSize: '11px' },
      shared: true,
      outside: true,
      formatter() {
        const fN = n => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
        const colors = ['#ff4444', '#ff8c42', '#ffd166', '#06d6a0', '#118ab2']
        const labels = ['P10', 'P25', 'Mediana', 'P75', 'P90']
        let out = `<b style="font-family:'DM Sans';font-size:12px;">${this.x}</b><br/>`
        this.points.forEach((p, i) => {
          out += `<span style="color:${colors[i]}">●</span> ${labels[i]}: <b>${fN(p.y)}</b><br/>`
        })
        return out
      },
    },
    plotOptions: { line: { marker: { enabled: false }, lineWidth: 1.5 } },
    series: [
      { name: 'P10',    data: s.p10, color: '#ff4444' },
      { name: 'P25',    data: s.p25, color: '#ff8c42' },
      { name: 'P50',    data: s.p50, color: '#ffd166', lineWidth: 2.5 },
      { name: 'P75',    data: s.p75, color: '#06d6a0' },
      { name: 'P90',    data: s.p90, color: '#118ab2' },
    ],
  })
}

onMounted(() => setTimeout(buildChart, 50))
onBeforeUnmount(() => { chart?.destroy(); chart = null })
watch([() => props.region, () => props.sex], () => setTimeout(buildChart, 50))
</script>
