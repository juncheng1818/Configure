<template>
    <div class="top-menu">
        <div>
            组态画板
        </div>
        <div style="display: flex;justify-content: flex-end;">
            123456
        </div>
    </div>
</template>

<script setup lang="js">

import { ref } from 'vue'

import { NButton, NInput, useMessage, NFlex, NGi, NGrid } from 'naive-ui'
const message = useMessage()

import emitter from '../mitt';

const width = ref(null)
const height = ref(null)

function changeWidthAndHeight() {
    // emitter.emit('changeWidthAndHeight',{ width: width.value, height: height.value } )
}

</script>

<style lang="scss" scoped>
.top-menu {
    height: 50px;
    width: calc(100vw - 20px);
    background-color: #ffffff90;
    line-height: 50px;
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    padding: 0 10px;

    div {
        display: flex;
        gap: 10px;
        flex: 1;
    }
}
</style>