<template>
  <DialogRoot :open="open" @update:open="onUpdate">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-40 bg-black/50" />
      <DialogContent
        class="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none dark:bg-slate-800"
      >
        <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">Share to Mastodon</DialogTitle>
        <DialogDescription class="mt-[10px] mb-5 text-sm text-subtitle">
          Enter your instance to open its share page.
        </DialogDescription>
        <form @submit.prevent="onShare">
          <fieldset class="mb-[15px] flex items-center gap-5">
            <input
              v-model="instance"
              type="text"
              placeholder="mastodon.social"
              aria-label="Your Mastodon instance"
              class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-button dark:border-gray-600 dark:bg-slate-900 dark:text-white"
            />
          </fieldset>
          <div class="mt-[25px] flex justify-end space-x-2">
            <DialogClose as-child>
              <button type="button" class="rounded-md px-4 py-2 text-sm font-medium">Cancel</button>
            </DialogClose>
            <button
              type="submit"
              class="rounded-md bg-button px-4 py-2 text-sm font-medium text-white hover:bg-button-hover"
            >
              Share
            </button>
          </div>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
  } from 'reka-ui'

  const props = withDefaults(defineProps<{ open: boolean; url: string; title: string; host?: string }>(), {
    host: 'mastodon.social',
  })
  const emit = defineEmits<{ 'update:open': [boolean]; shared: [] }>()

  const instance = ref('')

  const onShare = () => {
    const host = (instance.value || props.host)
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
    if (!host) return

    const shareUrl = `https://${host}/share?text=${encodeURIComponent(`${props.title} ${props.url}`)}`
    const opened = window.open(shareUrl, '_blank')
    if (opened) opened.opener = null
    else window.location.assign(shareUrl)

    onUpdate(false)
    emit('shared')
  }

  const onUpdate = (value: boolean) => {
    instance.value = ''
    emit('update:open', value)
  }
</script>
