<template>
  <div v-if="containsBattery">
    <div>Battery status:</div>
    <div v-if="batteryLevel != null">Battery level: {{ batteryLevel * 100 }}%</div>
    <div v-if="secondsToDischarge != null">To discharge charge: {{ secondsToDischarge }} seconds</div>
    <div v-if="secondsToFullCharge != null">To full charge: {{ secondsToFullCharge }} seconds</div>
    <div v-if="isCharging != null">Currently the device is{{ isCharging ? '' : ' not' }} charging</div>
  </div>
  <div v-else>no battery data</div>
  <div v-if="error">ERROR {{ error }}</div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue'

interface BatteryManager {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
  addEventListener (eventName: string, cb: (event: Event) => void): void
  removeEventListener (eventName: string, cb: (event: Event) => void): void
}

interface BatteryNavigator extends Navigator {
  getBattery? (): Promise<BatteryManager>
}

let battery: BatteryManager | undefined

const containsBattery = ref(false)
const batteryLevel = ref<number>()
const secondsToDischarge = ref<number>()
const secondsToFullCharge = ref<number>()
const isCharging = ref<boolean>()

const error = ref()

function onChargingChange () {
  isCharging.value = battery?.charging
}

function onBatteryLevelChange () {
  batteryLevel.value = battery?.level
}

function onChargingTimeChange () {
  secondsToFullCharge.value = battery?.chargingTime
}

function onDischargingTimeChange () {
  secondsToDischarge.value = battery?.dischargingTime
}

const batteryNavigator = navigator as BatteryNavigator

if (batteryNavigator.getBattery) {
  batteryNavigator.getBattery().then(batteryManager => {
    containsBattery.value = true
    battery = batteryManager

    onChargingChange()
    onBatteryLevelChange()
    onChargingTimeChange()
    onDischargingTimeChange()

    battery.addEventListener("chargingchange", onChargingChange)
    battery.addEventListener("levelchange", onBatteryLevelChange)
    battery.addEventListener("chargingtimechange", onChargingTimeChange)
    battery.addEventListener("dischargingtimechange", onDischargingTimeChange)
  }).catch(err => {
    error.value = err
  })
}

onBeforeUnmount(() => {
  if (battery) {
    battery.removeEventListener("chargingchange", onChargingChange)
    battery.removeEventListener("levelchange", onBatteryLevelChange)
    battery.removeEventListener("chargingtimechange", onChargingTimeChange)
    battery.removeEventListener("dischargingtimechange", onDischargingTimeChange)
  }
})
</script>

<style scoped>

</style>
