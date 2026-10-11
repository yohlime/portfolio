<template>
  <DropdownMenuItem
    v-for="link in links"
    :key="link.label"
    :aria-label="link.label"
    :title="link.label"
    class="flex w-9 h-9 items-center justify-center rounded-md text-white outline-none focus:ring-2 focus:ring-button focus:ring-offset-1"
    :class="link.bg"
    @select="onSelect(link)"
  >
    <span :class="[link.icon, 'w-1/2 h-1/2']" aria-hidden="true" />
  </DropdownMenuItem>
  <DropdownMenuItem
    aria-label="Copy link"
    title="Copy link"
    class="flex w-9 h-9 items-center justify-center rounded-md text-white outline-none transition-colors focus:ring-2 focus:ring-button focus:ring-offset-1"
    :class="copied ? 'bg-green-600' : 'bg-slate-500 hover:bg-slate-600'"
    @select="copyLink"
  >
    <span class="i-fa6-solid-link w-1/2 h-1/2" aria-hidden="true" />
  </DropdownMenuItem>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  import { DropdownMenuItem } from 'reka-ui'

  interface ShareLink {
    label: string
    href: string
    icon: string
    bg: string
    isFediverse?: boolean
  }

  const props = defineProps<{ url: string; title: string }>()
  const emit = defineEmits<{ fedi: [] }>()

  const copied = ref(false)

  const encodedTitle = computed(() => encodeURIComponent(props.title))
  const encodedUrl = computed(() => encodeURIComponent(props.url))
  const encodedText = computed(() => encodeURIComponent(`${props.title} ${props.url}`))

  const links = computed<ShareLink[]>(() => [
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle.value}&url=${encodedUrl.value}`,
      icon: 'i-fa6-brands-x-twitter',
      bg: 'bg-black',
    },
    {
      label: 'Share on Bluesky',
      href: `https://bsky.app/intent/compose?text=${encodedText.value}`,
      icon: 'i-fa6-brands-bluesky',
      bg: 'bg-[#0285ff]',
    },
    {
      label: 'Share on Mastodon',
      href: `https://hachyderm.io/share?text=${encodedText.value}`,
      icon: 'i-fa6-brands-mastodon',
      bg: 'bg-[#6364ff]',
      isFediverse: true,
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}`,
      icon: 'i-fa6-brands-linkedin-in',
      bg: 'bg-[#0a66c2]',
    },
    {
      label: 'Share on Reddit',
      href: `https://www.reddit.com/submit?url=${encodedUrl.value}&title=${encodedTitle.value}`,
      icon: 'i-fa6-brands-reddit',
      bg: 'bg-[#ff4500]',
    },
    {
      label: 'Share on Hacker News',
      href: `https://news.ycombinator.com/submitlink?u=${encodedUrl.value}&t=${encodedTitle.value}`,
      icon: 'i-fa6-brands-hacker-news',
      bg: 'bg-[#ff6600]',
    },
  ])

  const onSelect = (link: ShareLink) => {
    if (link.isFediverse) {
      emit('fedi')
      return
    }
    const opened = window.open(link.href, '_blank')
    if (opened) opened.opener = null
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(props.url)
      copied.value = true
      setTimeout(() => (copied.value = false), 1500)
    } catch {
      window.prompt('Copy this link:', props.url)
    }
  }
</script>
