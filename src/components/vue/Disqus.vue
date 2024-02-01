<template>
  <div ref="disqus" id="disqus_thread"></div>
</template>

<script setup lang="ts">
  import { useStore } from '@nanostores/vue'
  import { onMounted, ref, watch } from 'vue'

  import { $theme } from '@/stores/style'

  const disqus = ref<HTMLDivElement>()
  const theme = useStore($theme)

  const reloadDisqus = () => {
    //@ts-ignore
    if (window.DISQUS) {
      // Get the Disqus thread
      var disqusThread = document.getElementById('disqus_thread')

      // Check if the Disqus thread exists
      if (disqusThread) {
        // Call the reload method
        //@ts-ignore
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = location.pathname
            this.page.url = location.href
          },
        })
      }
    }
  }

  watch(theme, () => {
    reloadDisqus()
  })

  onMounted(() => {
    var disqus_config = function () {
      //@ts-ignore
      this.page.url = location.href
      //@ts-ignore
      this.page.identifier = location.pathname
    }
    ;(function () {
      // DON'T EDIT BELOW THIS LINE
      var d = document,
        s = d.createElement('script')
      s.src = 'https://yohli-me.disqus.com/embed.js'
      s.setAttribute('data-timestamp', Date.now().toString())
      ;(d.head || d.body).appendChild(s)
    })()
  })
</script>
