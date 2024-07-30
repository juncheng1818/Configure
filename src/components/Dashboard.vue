<template>
    <div id="dashboard" @mousedown.stop="addComponent" ref="dashboard_ref">
        <component v-for="item in dashboardComponent.getComponentList()" :is="item.componentName" :transform="item.transform" :resizable="item.resizable" :id="item.id" :top="item.top" :left="item.left" ref="component_ref"></component>
    </div>
</template>

<script setup lang="js">

import { ref, defineAsyncComponent, shallowRef ,reactive} from 'vue'

const component_ref = ref(null)

import { useMessage } from 'naive-ui'
const message = useMessage()

import { iconChoiceStore, leftIconListStore } from '../store'
const iconChoice = iconChoiceStore()
const leftIconList = leftIconListStore()

const dashboard_ref = ref(null)

import { dashboardComponentStore } from '../store' 
const dashboardComponent = dashboardComponentStore()

const addComponent = (event) => {
    dashboardComponent.claerResizable()
    let iconName = iconChoice.getIconName()
    if (iconName) {
        const rect = dashboard_ref.value.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        dashboardComponent.addComponentList({
            id: new Date().getTime().toString(),
            componentName: defineAsyncComponent(() => import(`../components/normal/${iconName}.vue`)),
            top: `${y}px`,
            left: `${x}px`,
            resizable: false,
            transform:'rotate(0deg)'
        })
        iconChoice.clearIconName()
        leftIconList.clearIconFalse()
        message.success('组件添加成功')
    } else {
        // message.warning('请选择组件')
    }
}

</script>

<style scoped lang="scss">
#dashboard {
    height: 100%;
    flex: 1;
    position: relative;
}
</style>