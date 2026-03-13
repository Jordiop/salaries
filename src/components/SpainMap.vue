<template>
  <div class="card" style="overflow:visible;">
    <div style="padding:16px 20px 8px;">
      <div style="font-size:11px;color:var(--muted);">Mediana salarial · {{ year }}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:3px;">
        Hover para ver datos · clic para fijar región
      </div>
    </div>
    <div ref="mapEl" style="width:100%;height:440px;display:block;"></div>
    <div style="padding:0 20px 16px;display:flex;align-items:center;gap:10px;">
      <span style="font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);">Bajo</span>
      <div style="flex:1;height:5px;border-radius:3px;background:linear-gradient(to right,#ff4444,#ffd166,#06d6a0,#118ab2);"></div>
      <span style="font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);">Alto</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Highcharts from 'highcharts/highmaps'
import mapGeoJson from '@highcharts/map-collection/countries/es/es-all.geo.json'
import { useSalary } from '@/composables/useSalary.js'

const props = defineProps({
  sex: String,
  year: String,
  selectedRegion: String,
})
const emit = defineEmits(['hover', 'select'])

const { buildMapData, fmt } = useSalary()
const mapEl = ref(null)
let chart = null

function tooltipHTML(p) {
  if (!p.ccaa) return ''
  return `<div style="font-family:'DM Sans',sans-serif;min-width:200px;">
    <div style="font-weight:600;font-size:14px;margin-bottom:10px;color:#e8ff47;">${p.ccaa}</div>
    <table style="font-family:'DM Mono',monospace;font-size:11px;border-collapse:collapse;width:100%;">
      <tr><td style="color:#6b6b80;padding:2px 16px 2px 0;">P10</td><td style="color:#ff4444;text-align:right;">${fmt(p.p10)}</td></tr>
      <tr><td style="color:#6b6b80;padding:2px 16px 2px 0;">P25</td><td style="color:#ff8c42;text-align:right;">${fmt(p.p25)}</td></tr>
      <tr><td style="color:#6b6b80;padding:2px 16px 2px 0;">Mediana</td><td style="color:#ffd166;text-align:right;">${fmt(p.p50)}</td></tr>
      <tr><td style="color:#6b6b80;padding:2px 16px 2px 0;">P75</td><td style="color:#06d6a0;text-align:right;">${fmt(p.p75)}</td></tr>
      <tr><td style="color:#6b6b80;padding:2px 16px 2px 0;">P90</td><td style="color:#118ab2;text-align:right;">${fmt(p.p90)}</td></tr>
      <tr><td colspan="2" style="border-top:1px solid #2a2a35;padding-top:3px;"></td></tr>
      <tr><td style="color:#6b6b80;padding:2px 16px 2px 0;">Media</td><td style="color:#f0f0f5;text-align:right;">${fmt(p.media)}</td></tr>
    </table>
  </div>`
}

function buildChart() {
  if (!mapEl.value) return
  const data = buildMapData(props.sex, props.year)
  const vals = data.map(d => d.value).filter(Boolean)

  chart = Highcharts.mapChart(mapEl.value, {
    chart: {
      backgroundColor: 'transparent',
      margin: [4, 0, 4, 0],
      spacing: [0, 0, 0, 0],
      type: 'map',
    },
    title: { text: null },
    credits: { enabled: false },
    legend: { enabled: false },
    mapNavigation: { enabled: false },
    colorAxis: {
      min: Math.min(...vals),
      max: Math.max(...vals),
      stops: [[0, '#ff4444'], [0.33, '#ffd166'], [0.66, '#06d6a0'], [1, '#118ab2']],
      labels: { enabled: false },
    },
    tooltip: {
      useHTML: true,
      backgroundColor: '#141418',
      borderColor: '#2a2a35',
      borderRadius: 10,
      padding: 14,
      shadow: false,
      outside: true,
      style: { color: '#f0f0f5' },
      formatter() { return tooltipHTML(this.point) },
    },
    series: [{
      type: 'map',
      mapData: mapGeoJson,
      data,
      joinBy: 'hc-key',
      borderColor: '#141418',
      borderWidth: 0.5,
      nullColor: '#1c1c22',
      states: {
        hover: { borderColor: '#e8ff47', borderWidth: 1.5, brightness: 0.06 },
        select: { borderColor: '#e8ff47', borderWidth: 2, color: null },
      },
      allowPointSelect: true,
      cursor: 'pointer',
      point: {
        events: {
          mouseOver() { if (this.ccaa) emit('hover', this.ccaa) },
          mouseOut()  { emit('hover', null) },
          click()     { if (this.ccaa) emit('select', this.ccaa) },
        },
      },
    }],
  })
}

function updateMap() {
  if (!chart) return
  const data = buildMapData(props.sex, props.year)
  const vals = data.map(d => d.value).filter(Boolean)
  chart.colorAxis[0].update({ min: Math.min(...vals), max: Math.max(...vals) }, false)
  chart.series[0].setData(data, true, { duration: 400 })
}

onMounted(() => setTimeout(buildChart, 100))
onBeforeUnmount(() => { chart?.destroy(); chart = null })
watch([() => props.sex, () => props.year], updateMap)
</script>
