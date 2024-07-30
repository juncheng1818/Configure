<script setup>
import Container from './views/container.vue'
import { NMessageProvider ,NDialogProvider} from 'naive-ui'
</script>

<template>
  <n-dialog-provider>
    <n-message-provider>
      <Container />
    </n-message-provider>
  </n-dialog-provider>
</template>

<style>
html,
body,
p {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
