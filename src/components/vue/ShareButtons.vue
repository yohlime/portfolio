<template>
  <div class="not-prose">
    <DropdownMenuRoot :modal="false">
      <DropdownMenuTrigger
        aria-label="Share this post"
        class="flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-button dark:border-gray-600 dark:text-gray-200 dark:hover:bg-slate-800"
      >
        <span class="i-fa6-solid-share-nodes" aria-hidden="true" />
        <span>Share</span>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          :side-offset="8"
          class="z-50 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-lg outline-none dark:border-gray-700 dark:bg-slate-800"
        >
          <ShareLinks :url="url" :title="title" @fedi="fediOpen = true" />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  </div>

  <ShareDialog v-model:open="fediOpen" :url="url" :title="title" />
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import { DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'

  import ShareDialog from './ShareDialog.vue'
  import ShareLinks from './ShareLinks.vue'

  defineProps<{ url: string; title: string }>()

  const fediOpen = ref(false)
</script>
