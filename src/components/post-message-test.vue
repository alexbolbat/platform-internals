<template>
  <button
    :disabled="popupOpened"
    @click="openWindow"
  >Open window</button>
  <template v-if="receivedText.length">
    <div>It sent me some text back:</div>
    <div v-for="text in receivedText">{{ text }}</div>
  </template>
  <div>
    <textarea
      v-model="textToSend"
    />
    <br>
    <button
      :disabled="!popupOpened || !textToSend"
      @click="sendText"
    >Send text</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Message } from '../constants/post-message'

let popup: Window | null = null

const popupOpened = ref(false)
const textToSend = ref('')
const receivedText = ref<string[]>([])

function openWindow () {
  popup = window.open(
    '/message-window', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
  if (popup) {
    popup.onload = onPopupLoad
  }

  popupOpened.value = popup !== null
}

function onPopupLoad (event: Event) {
  const window = event.target as Window
  window.onunload = onUnload

  if (popup) {
    const data: Message = { type: 'init' }
    popup.postMessage(data)
  }
}

function onUnload (event: Event) {
  const popup = event.target as Window
  popup.onload = null
  popup.onunload = null
  popupOpened.value = false
}

function sendText (): void {
  if (popup) {
    const data: Message = {
      type: 'text',
      text: textToSend.value
    }
    popup.postMessage(data)
    textToSend.value = ''
  }
}

function onMessage (event: MessageEvent) {
  const data = event.data as Message
  if (data.type === 'text' && data.text) {
    receivedText.value.push(data.text)
  }
}

window.addEventListener('message', onMessage)

</script>

<style scoped>

</style>
