<script setup>
import Container from './views/container.vue'
import { NMessageProvider } from 'naive-ui'
</script>

<template>
  <n-message-provider>
    <Container />
  </n-message-provider>
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
