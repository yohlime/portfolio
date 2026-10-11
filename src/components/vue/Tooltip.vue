<template>
  <TooltipProvider :delay-duration="150">
    <TooltipRoot>
      <TooltipTrigger as="span" class="flex items-center gap-1">
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          side="top"
          :side-offset="6"
          class="z-50 select-none rounded-md bg-slate-900 px-2.5 py-1 text-xs text-white shadow-md dark:bg-slate-700"
        >
          {{ content }}
          <TooltipArrow class="fill-slate-900 dark:fill-slate-700" :width="10" :height="5" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<script setup lang="ts">
  import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'

  defineProps<{ content: string }>()
</script>
