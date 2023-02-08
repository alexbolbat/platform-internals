<template>
  <canvas
    ref="canvasEl"
    :width="canvasWidth"
    :height="(navigationEntries.length * 9 + resourceEntries.length * 5) * rowHeight"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const rowHeight = 12
const canvasWidth = 800

const navigationEntries = performance.getEntriesByType('navigation')
const resourceEntries = performance.getEntriesByType('resource')

const canvasEl = ref<HTMLCanvasElement>()

function draw() {
  const canvas = canvasEl.value
  if (!canvas) {
    return
  }

  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  let row = 0

  const duration = navigationEntries[navigationEntries.length - 1]?.duration ?? 0

  if (duration === 0) {
    requestAnimationFrame(draw)
    return
  }

  const secondsTotal = Math.ceil(duration / 1000)
  const totalWidth = canvasWidth - 200

  context.beginPath()
  context.strokeStyle = 'lightGray'
  for (let i = 0; i <= secondsTotal; i++) {
    const x = totalWidth / secondsTotal * i
    const height = canvas.height
    context.moveTo(x, 0)
    context.lineTo(x, height)
  }
  context.closePath()
  context.stroke()

  const drawItem = (startTime: number, color: string, text: string, endTime?: number) => {
    const x = totalWidth / secondsTotal * (startTime / 1000)
    const y = row * rowHeight
    const width = endTime
      ? Math.max(totalWidth / secondsTotal * (endTime / 1000) - x, 1)
      : 1

    context.fillStyle = color
    context.fillRect(x, y, width, rowHeight)
    context.font = '12px Arial'
    context.fillStyle = 'black'
    context.fillText(text, x + width + 2, y + 10)

    row++
  }

  navigationEntries.forEach(entry => {
    const pnt = entry as PerformanceNavigationTiming
    drawItem(pnt.startTime, 'blue', 'Start')
    drawItem(pnt.domainLookupStart, 'blue', 'Domain lookup', pnt.domainLookupEnd)
    drawItem(pnt.connectStart, 'blue', 'Connect', pnt.connectEnd)
    drawItem(pnt.requestStart, 'blue', 'Request start')
    drawItem(pnt.requestStart, 'blue', 'Response', pnt.responseEnd)
    drawItem(pnt.unloadEventStart, 'blue', 'Unload', pnt.unloadEventEnd)
    drawItem(pnt.domInteractive, 'blue', 'DOM interactive')
    drawItem(pnt.domContentLoadedEventStart, 'blue', 'DOM content loaded event', pnt.domContentLoadedEventEnd)
    drawItem(pnt.domComplete, 'blue', 'DOM complete')
  })

  resourceEntries.forEach(entry => {
    context.beginPath()
    context.strokeStyle = 'lightGray'
    context.moveTo(0, row * rowHeight)
    context.lineTo(canvasWidth, row * rowHeight)
    context.closePath()
    context.stroke()

    const prt = entry as PerformanceResourceTiming
    drawItem(prt.startTime, 'orange', `${prt.initiatorType} ${prt.name}`)
    drawItem(prt.domainLookupStart, 'orange', 'Domain lookup', prt.domainLookupEnd)
    drawItem(prt.connectStart, 'orange', 'Connect', prt.connectEnd)
    drawItem(prt.requestStart, 'orange', 'Request start')
    drawItem(prt.requestStart, 'orange', 'Response', prt.responseEnd)
  })
}

onMounted(() => {
  requestAnimationFrame(draw)
})

console.log(navigationEntries)
console.log(resourceEntries)
</script>

<style scoped>

</style>
