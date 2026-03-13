<template>
  <div class="card">
    <div style="padding:16px 20px 8px;">
      <div style="font-size:11px;color:var(--muted);">Ranking · Mediana {{ year }}</div>
    </div>
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:1px solid var(--border);">
            <th v-for="col in cols" :key="col.key"
              :style="{
                padding: '6px 16px',
                textAlign: col.right ? 'right' : 'left',
                fontFamily: '\'DM Mono\',monospace',
                fontSize: '10px',
                color: 'var(--muted)',
                fontWeight: 400,
                letterSpacing: '0.1em',
              }">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in rows" :key="row.ccaa"
            @click="emit('select', row.ccaa)"
            :style="{
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer',
              background: selectedRegion === row.ccaa ? 'rgba(232,255,71,0.05)' : 'transparent',
            }"
            @mouseenter="e => e.currentTarget.style.background = selectedRegion === row.ccaa ? 'rgba(232,255,71,0.08)' : 'rgba(255,255,255,0.02)'"
            @mouseleave="e => e.currentTarget.style.background = selectedRegion === row.ccaa ? 'rgba(232,255,71,0.05)' : 'transparent'"
          >
            <td style="padding:8px 16px;font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">{{ i + 1 }}</td>
            <td
              style="padding:8px 16px;font-size:13px;font-weight:500;"
              :style="{ color: selectedRegion === row.ccaa ? 'var(--accent)' : 'var(--text)' }"
            >{{ row.ccaa }}</td>
            <td style="padding:8px 16px;font-family:'DM Mono',monospace;font-size:11px;text-align:right;color:var(--p10);">{{ fmt(row.p10) }}</td>
            <td style="padding:8px 16px;font-family:'DM Mono',monospace;font-size:11px;text-align:right;color:var(--p50);">{{ fmt(row.p50) }}</td>
            <td style="padding:8px 16px;font-family:'DM Mono',monospace;font-size:11px;text-align:right;color:var(--p90);">{{ fmt(row.p90) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSalary } from '@/composables/useSalary.js'

const props = defineProps({ sex: String, year: String, selectedRegion: String })
const emit = defineEmits(['select'])
const { getRankingRows, fmt } = useSalary()

const cols = [
  { key: 'rank',    label: '#' },
  { key: 'ccaa',   label: 'Comunidad' },
  { key: 'p10',    label: 'P10',    right: true },
  { key: 'p50',    label: 'Mediana',right: true },
  { key: 'p90',    label: 'P90',    right: true },
]

const rows = computed(() => getRankingRows(props.sex, props.year))
</script>
