<template>
  <div class="bar-row" :class="{ 'you-row': isYou }">
    <div class="bar-label">{{ label }}</div>
    <div class="bar-track">
      <div class="bar-fill" :style="{ width: pct + '%', background: isYou ? undefined : color }"></div>
    </div>
    <div class="bar-value">{{ fmt(value) }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: Number,
  pct: Number,
  color: { type: String, default: 'var(--muted)' },
  fmt: Function,
  isYou: { type: Boolean, default: false },
})
</script>
