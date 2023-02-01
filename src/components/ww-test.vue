<template>
  <div>
    <button
      :disabled="isLoading"
      @click="bubbleSort"
    >Bubble sort</button>
    <button
      :disabled="isLoading"
      @click="mergeSort"
    >Merge sort</button>
    <div>
      <label for="sortArrayLength">Length of an array to sort</label>
      <br>
      <input
        v-model.number="sortArrayLength"
        id="sortArrayLength"
        type="text"
      >
    </div>
    <div>
      <label for="sortIterationsCount">Sort iterations count</label>
      <br>
      <input
        v-model.number="sortIterationsCount"
        id="sortIterationsCount"
        type="text"
      >
    </div>
  </div>
  <div v-if="bubbleSortResults">
    Bubble sort timings:
    <br>
    Random array:
    {{ formatSortResultOutput(bubbleSortResults.random) }}
    <br>
    Reverse array:
    {{ formatSortResultOutput(bubbleSortResults.reverse) }}
    <br>
    Sorted array but with a biggest first element:
    {{ formatSortResultOutput(bubbleSortResults.ascendingFirstMax) }}
    <br>
    Sorted array but with a lowest last element:
    {{ formatSortResultOutput(bubbleSortResults.ascendingLastMin) }}
  </div>
  <div v-if="mergeSortResults">
    Merge sort timings:
    <br>
    Random array:
    {{ formatSortResultOutput(mergeSortResults.random) }}
    <br>
    Reverse array:
    {{ formatSortResultOutput(mergeSortResults.reverse) }}
    <br>
    Sorted array but with a biggest first element:
    {{ formatSortResultOutput(mergeSortResults.ascendingFirstMax) }}
    <br>
    Sorted array but with a lowest last element:
    {{ formatSortResultOutput(mergeSortResults.ascendingLastMin) }}
  </div>
  <div v-if="isLoading">Loading {{ Math.trunc(progress *  100) }}%</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface SortResults {
  random: number[]
  reverse: number[]
  ascendingFirstMax: number[]
  ascendingLastMin: number[]
}

const isLoading = ref(false)
const progress = ref(0)

const sortArrayLength = ref(10000)
const sortIterationsCount = ref(5)

const bubbleSortResults = ref<SortResults | null>(null)
const mergeSortResults = ref<SortResults | null>(null)

function bubbleSort () {
  isLoading.value = true
  worker.postMessage({
    type: 'bubbleSort',
    length: sortArrayLength.value,
    iterations: sortIterationsCount.value
  })
}

function mergeSort () {
  isLoading.value = true
  worker.postMessage({
    type: 'mergeSort',
    length: sortArrayLength.value,
    iterations: sortIterationsCount.value
  })
}

const worker = new Worker('sort.js')
worker.onmessage = e => {
  const { data } = e

  if (data.type === 'progress') {
    progress.value = data.value
    return
  }

  isLoading.value = false

  if (data.type === 'bubbleSortComplete') {
    bubbleSortResults.value = {
      random: data.bubbleSortRandom,
      reverse: data.bubbleSortReverse,
      ascendingFirstMax: data.bubbleSortAscendingFirstMax,
      ascendingLastMin: data.bubbleSortAscendingLastMin
    }
  } else if (data.type === 'mergeSortComplete') {
    mergeSortResults.value = {
      random: data.mergeSortRandom,
      reverse: data.mergeSortReverse,
      ascendingFirstMax: data.mergeSortAscendingFirstMax,
      ascendingLastMin: data.mergeSortAscendingLastMin
    }
  }
}

function formatSortResultOutput (durations: number[]) {
  durations = durations.map(d => Math.trunc(d))
  const average = durations.reduce((acc, next) => acc + next) / durations.length
  return `${Math.min(...durations)} - ${Math.max(...durations)} (${Math.trunc(average)})`
}
</script>

<style scoped>
</style>
