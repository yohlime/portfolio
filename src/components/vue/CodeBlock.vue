<template>
  <div class="flex justify-center">
    <VCodeBlock
      v-if="codeStr"
      :code="codeStr"
      highlightjs
      :lang="lang"
      :theme="theme"
      class="not-prose text-xs md:text-sm w-full sm:w-md md:w-lg lg:w-xl"
    />
  </div>
  <span hidden ref="rawcode"><slot></slot></span>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { VCodeBlock } from '@wdns/vue-code-block'
  import { computed, ref, withDefaults } from 'vue'

  import { $theme } from '@/stores/style'

  withDefaults(defineProps<{ lang?: string }>(), { lang: 'javascript' })

  const lightTheme = 'atom-one-light'
  const darkTheme = 'atom-one-dark'

  const themeMode = useStore($theme)

  const rawcode = ref<HTMLSpanElement>()

  const codeStr = computed(() => rawcode.value?.textContent)

  const theme = computed(() => (themeMode.value === 'light' ? lightTheme : darkTheme))
</script>
