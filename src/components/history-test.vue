<template>
  <div class="history-test">
    <div>Currently you are on {{ historyState.current }} ({{ historyState.replaced ? '' : 'not ' }}replaced)</div>
    <button
      :disabled="historyState.position <= 0"
      @click="back"
    >Back {{ historyState.back }}</button>
    <button
      :disabled="historyState.position >= historyLength - 1"
      @click="forward"
    >Forward {{ historyState.forward }}</button>
    <input
      v-model="gotoIndex"
      type="number"
      :min="-historyState.position"
      :max="historyLength - historyState.position - 1"
    >
    <button
      :disabled="gotoIndex === 0"
      @click="goTo"
    >Go to</button>
  </div>
</template>

<script lang="ts" setup>
interface HistoryState {
  back: string | null
  current: string | null
  forward: string | null
  position: number
  replaced: boolean
  scroll: { x: number; y: number } | null
}

import { computed, onUnmounted, ref } from 'vue'

const historyState = ref<HistoryState>(window.history.state)
const gotoIndex = ref(0)

const historyLength = computed(() => window.history.length)

function back () {
  window.history.back()
}

function forward () {
  window.history.forward()
}

function handlePopState (event: PopStateEvent) {
  historyState.value = event.state
}

function goTo () {
  window.history.go(gotoIndex.value)
}

onUnmounted(() => {
  removeEventListener('popstate', handlePopState)
})

addEventListener('popstate', handlePopState)
</script>

<style scoped>
.history-test {
    margin-bottom: 24px;
}
</style>
