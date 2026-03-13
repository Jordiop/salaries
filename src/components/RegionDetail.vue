<template>
  <div class="card" style="padding:20px;">
    <div v-if="!region" style="color:var(--muted);font-size:13px;text-align:center;padding:36px 0;line-height:1.7;">
      Pasa el cursor sobre el mapa<br>
      <span style="font-size:11px;opacity:0.6;">o haz clic en una comunidad</span>
    </div>
    <template v-else>
      <div class="region-pill mb-4">{{ region }}</div>
      <div v-if="d" style="display:flex;flex-direction:column;gap:10px;">
        <BarRow label="P10"     :value="d.p10"   :pct="pct(d.p10)"   color="var(--p10)" :fmt="fmt" />
        <BarRow label="P25"     :value="d.p25"   :pct="pct(d.p25)"   color="var(--p25)" :fmt="fmt" />
        <BarRow label="Mediana" :value="d.p50"   :pct="pct(d.p50)"   color="var(--p50)" :fmt="fmt" />
        <BarRow label="P75"     :value="d.p75"   :pct="pct(d.p75)"   color="var(--p75)" :fmt="fmt" />
        <BarRow label="P90"     :value="d.p90"   :pct="pct(d.p90)"   color="var(--p90)" :fmt="fmt" />
        <div style="height:1px;background:var(--border);margin:4px 0;"></div>
        <div class="bar-row">
          <div class="bar-label">Media</div>
          <div class="bar-track" style="border:1px dashed var(--border);">
            <div class="bar-fill" :style="{ width: pct(d.media) + '%', background: 'var(--accent2)', opacity: 0.7 }"></div>
          </div>
          <div class="bar-value">{{ fmt(d.media) }}</div>
        </div>
      </div>
      <div v-else style="color:var(--muted);font-size:12px;margin-top:8px;">Sin datos para este año/sexo</div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSalary } from '@/composables/useSalary.js'
import BarRow from './BarRow.vue'

const props = defineProps({ region: String, sex: String, year: String })
const { getData, fmt, getMaxP90 } = useSalary()

const d = computed(() => props.region ? getData(props.sex, props.region, props.year) : null)

function pct(val) {
  if (!val) return 0
  return Math.min(100, Math.round((val / getMaxP90(props.sex, props.year)) * 100))
}
</script>
