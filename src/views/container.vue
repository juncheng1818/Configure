<template>
    <div id="container">
        <LeftMenu />
        <Dashboard />
    </div>
</template>

<script setup lang="js">
import LeftMenu from '../components/LeftMenu.vue';
import Dashboard from '../components/Dashboard.vue';
import { ref } from 'vue'



</script>

<style scoped lang="scss">

#container{
    width: 100%;
    height: 100vh;
    display: flex;
}
</style>