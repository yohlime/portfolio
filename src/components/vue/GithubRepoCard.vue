<template>
  <a
    :href="data.url"
    target="_blank"
    class="flex flex-col h-40 justify-between cursor-pointer bg-white dark:bg-slate-900 p-6 rounded-md shadow-md hover:shadow-lg dark:hover:shadow-md dark:hover:shadow-white dark:hover:bg-button-hover transition-shadow duration-300 ease-in"
  >
    <div class="flex flex-col">
      <div class="flex items-center mb-1 gap-1 text-black dark:text-white text-2xl font-bold">
        <div class="i-codicon-repo"></div>
        <p class="whitespace-nowrap text-ellipsis overflow-hidden">{{ data.name }}</p>
      </div>
      <p class="text-xl line-clamp-2 overflow-hidden text-subtitle">{{ data.description }}</p>
    </div>
    <div class="flex justify-between text-xs text-200 text-subtitle">
      <div class="flex flex-grow gap-2">
        <span v-if="data.primaryLanguage" class="flex items-center gap-1">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: data.primaryLanguage.color }" />
          <p>{{ data.primaryLanguage.name }}</p>
        </span>
        <span class="flex items-center gap-0.5">
          <i class="i-codicon-repo-forked"></i>
          <p>{{ data.forkCount }}</p>
        </span>
        <span class="flex items-center gap-0.5">
          <i class="i-codicon-star-full"></i>
          <p>{{ data.stargazers.totalCount }}</p>
        </span>
      </div>
      <div>
        <p>{{ data.diskUsage }}</p>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
  import type { GHRepo } from '@/types/github'

  defineProps<{ data: GHRepo }>()
</script>
