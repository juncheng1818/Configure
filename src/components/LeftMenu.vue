<template>
    <div id="leftMenu">
        <NTabs type="segment" animated>
            <n-tab-pane name="chap1" tab="组件">
                <n-collapse>
                    <n-collapse-item title="常用的" name="1">
                        <n-icon :style="{'cursor': 'pointer','background-color': item.choice?'#ddd':''}" @click="iconClick(item.name)"  v-for="item in normalIcon" :key="item.name" size="40" :component="item.icon">
                        </n-icon>
                    </n-collapse-item>
                    <n-collapse-item title="白银" name="2">
                        <div>很好</div>
                    </n-collapse-item>
                    <n-collapse-item title="黄金" name="3">
                        <div>真棒</div>
                    </n-collapse-item>
                </n-collapse>
            </n-tab-pane>
            <n-tab-pane name="chap2" tab="我的组件">
                wode zujian
            </n-tab-pane>
        </NTabs>
    </div>

</template>

<script setup lang="js">

import { ref ,shallowRef} from 'vue'
import { NButton, NTabs, NTabPane, NCollapse, NCollapseItem, NIcon } from 'naive-ui'

import { normalIconData } from '../data/iconData'

const normalIcon = shallowRef(normalIconData)

import { iconChoiceStore } from '../store';

const iconChoice = iconChoiceStore()

const iconClick = (data) => {
    normalIcon.value = normalIcon.value.map(item => {
        item.choice = false
        if (item.name === data) {
            item.choice = true
            iconChoice.setIconName(data)
        }
        return item
    })
}

</script>

<style scoped lang="scss">
#leftMenu {
    height: 100vh;
    width: 280px;
    padding: 15px;
    border-right: 1px solid #dddddd80;
    background-color: #fafafa;
}
</style>../data/iconData