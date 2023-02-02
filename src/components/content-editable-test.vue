<template>
  <div class="container">
    <div
      class="text-area"
    >
      <h1 contenteditable="true">
        <div>The biggest text</div>
      </h1>
      <h2 contenteditable="true">
        <div>Some bigger text</div>
      </h2>
      <div
        class="regular-area"
        contenteditable="true">Regular text</div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.container {
  position: relative;
  padding: 50px;
  height: 100vw;
}
.text-area {
    border: 1px solid black;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

div:focus-visible, h1:focus-visible, h2:focus-visible {
    outline: none;
}

.regular-area {
    flex: 1;
}
</style>
