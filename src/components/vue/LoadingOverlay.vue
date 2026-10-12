<template>
  <Transition name="loading-overlay">
    <div
      v-if="visible"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-slate-900/70"
    >
      <ProgressRoot :model-value="null" aria-label="Loading page" class="pointer-events-none">
        <ProgressIndicator class="block h-9 w-9 animate-spin rounded-full border-2 border-button/25 border-t-button" />
      </ProgressRoot>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { ProgressIndicator, ProgressRoot } from 'reka-ui'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  // Wait a beat before showing so fast (prefetched) navigations don't flash.
  const SHOW_DELAY = 150
  // Once shown, keep it up briefly so it doesn't blink.
  const MIN_VISIBLE = 300

  const visible = ref(false)

  let showTimer: ReturnType<typeof setTimeout> | undefined
  let hideTimer: ReturnType<typeof setTimeout> | undefined
  let safety: ReturnType<typeof setTimeout> | undefined
  let shownAt = 0

  function clearTimers() {
    clearTimeout(showTimer)
    clearTimeout(hideTimer)
    clearTimeout(safety)
  }

  function start() {
    clearTimers()
    showTimer = setTimeout(() => {
      shownAt = Date.now()
      visible.value = true
    }, SHOW_DELAY)
    // Never let the overlay hang if a lifecycle event is missed.
    safety = setTimeout(finish, 10000)
  }

  function finish() {
    clearTimeout(showTimer)
    clearTimeout(safety)
    if (!visible.value) return
    const held = Date.now() - shownAt
    hideTimer = setTimeout(
      () => {
        visible.value = false
      },
      Math.max(0, MIN_VISIBLE - held),
    )
  }

  const onStart = () => start()
  const onFinish = () => finish()

  onMounted(() => {
    document.addEventListener('astro:before-preparation', onStart)
    document.addEventListener('astro:after-swap', onFinish)
    document.addEventListener('astro:page-load', onFinish)
  })

  onBeforeUnmount(() => {
    clearTimers()
    document.removeEventListener('astro:before-preparation', onStart)
    document.removeEventListener('astro:after-swap', onFinish)
    document.removeEventListener('astro:page-load', onFinish)
  })
</script>

<style>
  .loading-overlay-enter-active,
  .loading-overlay-leave-active {
    transition: opacity 150ms ease;
  }
  .loading-overlay-enter-from,
  .loading-overlay-leave-to {
    opacity: 0;
  }
</style>
