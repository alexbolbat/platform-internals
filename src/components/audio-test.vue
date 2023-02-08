<template>
  <div v-if="drumsLoaded">
    <label for="loop-interval">Loop interval</label>
    <input
      v-model="loopInterval"
      id="loop-interval"
    >
    <div v-for="(path, index) in drumPaths">
      <input
        v-for="interval in intervalsCount"
        type="checkbox"
        :checked="getIsIntervalChecked(index, interval - 1)"
        @change="setIntervalChecked(index, interval - 1, $event.target.checked)"
      >
      {{ drumsNames[index] }}
    </div>
    <button
      v-if="!isDrumsPlaying"
      @click="playDrums"
    >Play</button>
    <button
      v-if="isDrumsPlaying"
      @click="stopDrums"
    >Stop</button>
  </div>
  <button
    @click="loadDrums"
    v-else
  >Load Drums</button>
  <br>
  <div v-if="isTrackLoading">Loading...</div>
  <button
    v-else-if="!isDrawing"
    @click="startTrack"
  >Start track</button>
  <button
    v-else="isDrawing"
    @click="stopTrack"
  >Stop track</button>
  <div>
    <canvas ref="canvas"/>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const drumPaths = [
  '/sounds/drums/acoustic-punchy-snare.wav',
  '/sounds/drums/clean-punchy-acoustic-snare_C_major.wav',
  '/sounds/drums/dry-acoustic-snare_100bpm_C.wav',
  '/sounds/drums/pantera-far-beyond-driven-snare_G_minor.wav',
  '/sounds/drums/punchy-snare.wav'
]

const trackPaths = [
  '/sounds/lifelike-126735.mp3'
]

let audioContext: AudioContext
const intervalsCount = 8
const drums: AudioBuffer[] = []
let loopIntervalId = 0
let currentTrack: AudioBufferSourceNode | null = null

const drumsLoaded = ref(false)
const loopInterval = ref(1)
const isDrumsPlaying = ref(false)
const isDrawing = ref(false)
const isTrackLoading = ref(false)

const canvas = ref<HTMLCanvasElement>()

const drumsNames = computed(() => drumPaths.map(path => {
  const parts = path.split('/')
  return parts[parts.length - 1].split('.')[0]
}))

const checkedIntervals = ref<number[]>([])

function getIsIntervalChecked (drumIndex: number, intervalIndex: number) {
  return (checkedIntervals.value[drumIndex] ?? 0) & (1 << intervalIndex)
}

function setIntervalChecked (drumIndex: number, intervalIndex: number, isChecked: boolean) {
  const current = checkedIntervals.value[drumIndex] ?? 0
  const value = 1 << intervalIndex
  checkedIntervals.value[drumIndex] = isChecked ? current | value : current & ~value
}

function playDrums () {
  isDrumsPlaying.value = true

  loopIntervalId = setInterval(() => {
    checkedIntervals.value.forEach((intervals, drumIndex) => {
      for (let i = 0; i < intervalsCount; i++) {
        if (getIsIntervalChecked(drumIndex, i)) {
          playSound(drums[drumIndex], loopInterval.value / 8 * i)
        }
      }
    })
  }, loopInterval.value * 1000)
}

function stopDrums () {
  isDrumsPlaying.value = false

  clearInterval(loopIntervalId)
}

function playSound (audioBuffer: AudioBuffer, delay: number) {
  const bufferSource = audioContext.createBufferSource()
  bufferSource.buffer = audioBuffer
  bufferSource.connect(audioContext.destination)
  bufferSource.start(audioContext.currentTime + delay)

  return bufferSource
}

async function fetchAudio (path: string): Promise<AudioBuffer> {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  const response = await fetch(path)
  const arrayBuffer = await response.arrayBuffer()
  return await audioContext.decodeAudioData(arrayBuffer)
}

async function loadDrums () {
  const all = await Promise.all(drumPaths.map(fetchAudio))
  drums.push(...all)
  checkedIntervals.value = new Array(drums.length).fill(0)
  drumsLoaded.value = true
}

async function startTrack () {
  isDrawing.value = true

  isTrackLoading.value = true
  const audioBuffer = await fetchAudio(trackPaths[0])
  isTrackLoading.value = false

  if (!isDrawing) {
    return
  }
  currentTrack = playSound(audioBuffer, 0)

  const analyser = audioContext.createAnalyser()
  currentTrack.connect(analyser)
  analyser.fftSize = 128
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  draw(analyser, dataArray)
}

function stopTrack () {
  isDrawing.value = false
  currentTrack?.stop()
}

function draw (analyser: AnalyserNode, dataArray: Uint8Array) {
  if (!canvas.value) {
    return
  }
  const canvasCtx = canvas.value.getContext('2d')
  if (!canvasCtx) {
    return
  }

  const canvasWidth = canvas.value.width
  const canvasHeight = canvas.value.height
  let x = 0;
  let barWidth = canvasWidth / analyser.frequencyBinCount
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  analyser.getByteFrequencyData(dataArray);

  for (let i = 0; i < analyser.frequencyBinCount; i++) {
    const barHeight = canvasHeight / 255 * dataArray[i]
    const r = Math.min(255, dataArray[i] * 2)
    const g = Math.min(255, (255 - dataArray[i]) * 2)
    canvasCtx.fillStyle = `rgb(${r}, ${g}, 0)`
    canvasCtx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight)
    x += barWidth;
  }

  if (isDrawing.value) {
    requestAnimationFrame(() => draw(analyser, dataArray))
  }
}

onBeforeUnmount(() => {
  stopDrums()
  stopTrack()
})
</script>

<style scoped>

</style>
