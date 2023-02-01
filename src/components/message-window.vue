<template>
  <template v-if="receivedText.length">
    <div>I've received some text:</div>
    <div v-for="text in receivedText">{{ text }}</div>
  </template>
  <textarea
    v-model="textToSend"
  />
  <button
    :disabled="!textToSend"
    @click="sendText"
  >Send back</button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Message } from '../constants/post-message'

let source: MessageEventSource | null = null

const receivedText = ref<string[]>([])
const textToSend = ref('')

function onMessage (event: MessageEvent) {
  const data = event.data as Message
  if (data.type === 'init') {
    console.log('init',event.source )
    source = event.source
  } else if (data.type === 'text' && data.text) {
    receivedText.value.push(data.text)
  }
}

function sendText (): void {
  if (source) {
    const data: Message = {
      type: 'text',
      text: textToSend.value
    }
    source.postMessage(data)
    textToSend.value = ''
  }
}

window.addEventListener('message', onMessage)
</script>

<style scoped>

</style>
