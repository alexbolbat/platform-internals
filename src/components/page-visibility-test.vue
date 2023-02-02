<template>
  <div v-if="hiddenTime">
    The page was inactive for about {{ formattedHiddenTime }}
  </div>
  <div v-else>
    Minimize or switch the page and get back to see something very exiting
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'

let hideTime = 0

const hiddenTime = ref(0)

const formattedHiddenTime = computed(() => {
  const seconds = Math.trunc(hiddenTime.value / 1000)
  const minutes = Math.trunc(seconds / 60)
  const hours = Math.trunc(minutes / 60)

  return (hours > 0 ? hours + ' hours ' : '') +
    (minutes > 0 ? minutes % 60 + ' minutes ' : '') +
    (seconds > 0 ? seconds % 60 + ' seconds ' : '')
})

function onVisibilityChange () {
  if (document.visibilityState === 'hidden') {
    hideTime = new Date().getTime()
  } else if (document.visibilityState === 'visible' && hideTime > 0) {
    hiddenTime.value = new Date().getTime() - hideTime
    hideTime = 0
  }
}

document.addEventListener('visibilitychange', onVisibilityChange)

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<style scoped>

</style>
