<template>
  <button class="border border-2 p-2 rounded-md" @click="handleToggle">
    <div :class="[theme === 'dark' ? 'i-fa6-solid-sun' : 'i-fa6-solid-moon']"></div>
  </button>
</template>

<script setup lang="ts">
  import { useVModel } from '@nanostores/vue'
  import { onMounted } from 'vue'

  import { $theme } from '@/stores/style'

  const theme = useVModel($theme)

  const toggleTheme = () => {
    if (
      theme.value === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleToggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    toggleTheme()
  }

  onMounted(() => {
    toggleTheme()
  })
</script>
