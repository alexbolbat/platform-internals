<template>
  <div v-if="currentPosition">
    Last update: {{ formatTime(currentPosition.timestamp) }}
    <div>
      Coordinates: {{ currentPosition.coords.latitude }}, {{ currentPosition.coords.longitude }} (
      +/- {{ currentPosition.coords.accuracy }} meters)
    </div>
    <div>Altitude: {{
        currentPosition.coords.altitude !== null
        ? `${currentPosition.coords.altitude} (+/- ${currentPosition.coords.altitudeAccuracy})`
        : 'no data'
      }}

    </div>
    <div>Heading: {{ currentPosition.coords.heading ?? 'no data' }}</div>
    <div>Speed: {{ currentPosition.coords.speed ?? 'no data' }}</div>
  </div>
  <div v-if="currentError">
    {{ errorMessage }}<br>The browser is saying: {{ currentError.message }}
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const currentPosition = ref<GeolocationPosition | null>(null)
const currentError = ref<GeolocationPositionError | null>(null)

const errorMessage = computed(() => {
  if (!currentError.value) {
    return ''
  }
  if (currentError.value.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
    return 'Your position currently is not available for some reason'
  }
  if (currentError.value.code === GeolocationPositionError.PERMISSION_DENIED) {
    return 'It seems you should have allowed the browser to provide your position'
  }
  if (currentError.value.code === GeolocationPositionError.TIMEOUT) {
    return 'I was waiting for a while but did not get your position'
  }
  return 'Something wrong is going on'
})

function handleGeolocationUpdate (position: GeolocationPosition) {
  if (currentError.value) {
    currentError.value = null
  }
  currentPosition.value = position
}

function handleGeolocationError (error: GeolocationPositionError) {
  currentError.value = error
}

function formatTime (ms: number) {
  return new Date(ms).toLocaleString('en')
}

const watchId = navigator.geolocation.watchPosition(handleGeolocationUpdate, handleGeolocationError)

onBeforeUnmount(() => {
  navigator.geolocation.clearWatch(watchId)
})
</script>

<style scoped>

</style>
