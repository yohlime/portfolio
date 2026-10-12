<template>
  <ProgressRoot
    v-show="visible"
    :model-value="value"
    :max="100"
    aria-label="Loading page"
    class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
  >
    <ProgressIndicator
      class="h-full bg-button transition-[width] duration-200 ease-out"
      :style="{ width: `${value}%` }"
    />
  </ProgressRoot>
</template>

<script setup lang="ts">
  import { ProgressIndicator, ProgressRoot } from 'reka-ui'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const value = ref(0)
  const visible = ref(false)

  let trickle: ReturnType<typeof setInterval> | undefined
  let hideTimer: ReturnType<typeof setTimeout> | undefined
  let safety: ReturnType<typeof setTimeout> | undefined

  function clearTimers() {
    clearInterval(trickle)
    clearTimeout(hideTimer)
    clearTimeout(safety)
  }

  function start() {
    clearTimers()
    visible.value = true
    value.value = 8
    // Creep toward 90% while the navigation is in flight.
    trickle = setInterval(() => {
      value.value = Math.min(90, value.value + Math.max(0.5, (90 - value.value) * 0.12))
    }, 180)
    // Never let the bar hang if a lifecycle event is missed.
    safety = setTimeout(finish, 10000)
  }

  function bump(to: number) {
    if (visible.value) value.value = Math.max(value.value, to)
  }

  function finish() {
    if (!visible.value) return
    clearInterval(trickle)
    clearTimeout(safety)
    value.value = 100
    hideTimer = setTimeout(() => {
      visible.value = false
      value.value = 0
    }, 220)
  }

  const onStart = () => start()
  const onAfterPreparation = () => bump(80)
  const onBeforeSwap = () => bump(90)
  const onFinish = () => finish()

  onMounted(() => {
    document.addEventListener('astro:before-preparation', onStart)
    document.addEventListener('astro:after-preparation', onAfterPreparation)
    document.addEventListener('astro:before-swap', onBeforeSwap)
    document.addEventListener('astro:after-swap', onFinish)
    document.addEventListener('astro:page-load', onFinish)
  })

  onBeforeUnmount(() => {
    clearTimers()
    document.removeEventListener('astro:before-preparation', onStart)
    document.removeEventListener('astro:after-preparation', onAfterPreparation)
    document.removeEventListener('astro:before-swap', onBeforeSwap)
    document.removeEventListener('astro:after-swap', onFinish)
    document.removeEventListener('astro:page-load', onFinish)
  })
</script>
