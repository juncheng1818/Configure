<template>
    <div class="top-menu">
        <n-button @click="save()" type="primary">保存</n-button>
    </div>
</template>

<script setup lang="js">

import { NButton } from 'naive-ui'
import emitter from '../mitt';
function save(){
    emitter.emit('save')
}

</script>

<style lang="scss" scoped>
    .top-menu {
        height: 50px;
        width: 100%;
        background-color: #00000020;
        text-align: center;
        line-height: 50px;
        font-size: 18px;
        font-weight: 600;
    }
</style>