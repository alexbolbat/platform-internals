<template>
  <div>
    only latin letters, numbers, spaces please
    <br>
    <input
      v-model="inputText"
      type="text"
    >
  </div>
  <button
    @mousedown="playInputText"
  >Vibrate as Morse code</button>
  <h1>{{ timingsOutput }}</h1>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import morseCode from '../constants/morse-code'

const dit = 100

const inputText = ref('')
const timingsOutput = ref('')

function playInputText () {
  const symbols = inputText.value.split('')
  const timings = symbols.reduce(
    (code, key) => {
      if (key === ' ') {
        code[code.length - 1] = dit * 7
      }

      const symbol = key.toLowerCase() as keyof typeof morseCode
      if (!morseCode[symbol]) {
        return code
      }

      return code.concat(
        morseCode[symbol].reduce(
          (timings, dotDash, index, dotDashes) => {
            timings.push(dotDash ? dit * 3 : dit)
            timings.push(index === dotDashes.length - 1 ? dit * 3 : dit)
            return timings
          },
          [] as number[]
        )
      )
    },
    [] as number[]
  )

  timingsOutput.value = timings.map((num, i) =>
    i % 2
    ? (num === 700 ? '   ' : num === 300 ? ' ' : '')
    : (num === 300 ? '-' : '.')
  ).join('')

  navigator.vibrate(timings)
}
</script>

<style scoped>
</style>
