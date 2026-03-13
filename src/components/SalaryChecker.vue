<template>
  <div class="card" style="padding:20px;">
    <div style="font-size:11px;color:var(--muted);margin-bottom:12px;">¿Dónde estás tú?</div>
    <div style="position:relative;margin-bottom:12px;">
      <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:15px;pointer-events:none;">€</span>
      <input type="number" v-model.number="salary" placeholder="25000" min="0" max="500000" step="100">
    </div>
    <template v-if="salary > 0 && d">
      <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:8px;">
        <span class="font-bebas" style="font-size:72px;line-height:1;color:var(--accent);">{{ percentile }}</span>
        <span class="font-bebas" style="font-size:26px;color:var(--muted);">percentil</span>
      </div>
      <p style="font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:12px;">
        Superas al <strong style="color:var(--text);">{{ percentile }}%</strong> en {{ region }}.
        Mediana: <strong style="color:var(--text);">{{ fmt(d.p50) }}</strong>.
      </p>
      <BarRow
        :label="`Tú P${percentile}`"
        :value="salary"
        :pct="pctBar"
        :fmt="fmt"
        :is-you="true"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSalary } from '@/composables/useSalary.js'
import BarRow from './BarRow.vue'

const props = defineProps({ region: String, sex: String, year: String })
const { getData, fmt, estimatePercentile, getMaxP90 } = useSalary()
const salary = ref(null)

const d          = computed(() => getData(props.sex, props.region, props.year))
const percentile = computed(() => estimatePercentile(salary.value, d.value))
const pctBar     = computed(() => {
  if (!salary.value) return 0
  return Math.min(100, Math.round((salary.value / getMaxP90(props.sex, props.year)) * 100))
})
</script>
