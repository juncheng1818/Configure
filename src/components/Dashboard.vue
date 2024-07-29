<template>
    <div id="dashboard" @click="dashboardClick" ref="dashboard_ref">
        <component :is="Rectangle" :top="top" :left="left"></component>
    </div>
</template>

<script setup lang="js">

import { ref } from 'vue'
import { iconChoiceStore } from '../store'
const iconChoice = iconChoiceStore()

import Rectangle from './normal/Rectangle.vue'

const top = ref('10px')
const left = ref('10px')

const dashboard_ref = ref(null)

const dashboardClick = (event) => {
    const rect = dashboard_ref.value.getBoundingClientRect();
    // 计算相对位置
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // 更新相对点击坐标
    // console.log(`Relative X: ${x}, Relative Y: ${y}`);
}

</script>

<style scoped lang="scss">
#dashboard {
    height: 100%;
    flex: 1;
    position: relative;
}
</style>