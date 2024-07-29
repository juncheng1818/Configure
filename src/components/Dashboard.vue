<template>
    <div id="dashboard" @mousedown="addComponent" ref="dashboard_ref">
        <component v-for="item in componentArr" :is="item.componentName" :top="item.top" :left="item.left" ref="component_ref"></component>
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
const componentArr = reactive([])

const addComponent = (event) => {
    
    let iconName = iconChoice.getIconName()
    if (iconName) {
        const rect = dashboard_ref.value.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        componentArr.push(
            {
                componentName: defineAsyncComponent(() => import(`../components/normal/${iconName}.vue`)),
                top: `${y}px`,
                left: `${x}px`
            }
        )
        iconChoice.clearIconName()
        leftIconList.clearIconFalse()
        message.success('组件添加成功')
    } else {
        message.warning('请选择组件')
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