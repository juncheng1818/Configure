<template>
    <div class="top-menu">
        <n-grid x-gap="10" :cols="6">
            <n-gi>
                <n-input placeholder="宽度" type="number" v-model:value="width"></n-input>
            </n-gi>
            <n-gi>
                <n-input placeholder="高度" type="number" v-model:value="height"></n-input>
            </n-gi>
            <n-gi>
                <n-button @click="changeWidthAndHeight()" type="primary">确认</n-button>
            </n-gi>
        </n-grid>
        <n-grid x-gap="10" :cols="2">
            <n-gi :offset="1" style="display: flex;justify-content: flex-end" >
                <n-button @click="save()" type="primary">保存</n-button>
                <n-button @click="upload()" type="primary">上传</n-button>
                <n-button @click="preview()" type="primary">预览</n-button>
            </n-gi>
        </n-grid>
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

function save() {
    message.info('保存到本地')
    // emitter.emit('save')
}

function upload() {
    message.info('上传服务器')
    // emitter.emit('upload')
}

function preview() {
    emitter.emit('preview')
}

</script>

<style lang="scss" scoped>
.top-menu {
    height: 50px;
    width: calc(100vw - 20px);
    background-color: #00000010;
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