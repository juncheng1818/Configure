<template>
    <div id="leftMenu">
        <NTabs type="segment" animated>
            <n-tab-pane name="chap1" tab="组件">
                <n-collapse accordion :default-expanded-names="['常用']">
                    <n-collapse-item :title="item.title" :name="item.title" v-for="item in iconList" :key="item">
                        <n-icon :title="iconItem.name" v-for="iconItem in item.normalIcon" :style="{'cursor': 'pointer','background-color': iconItem.choice?'#ddd':'','padding':'0 8px'}" @click="iconClick(item.title,iconItem.name)" size="30" :component="iconItem.icon">
                        </n-icon>
                    </n-collapse-item>
                </n-collapse>
            </n-tab-pane>
            <n-tab-pane name="chap2" tab="我的组件">
                developing
            </n-tab-pane>
        </NTabs>
    </div>

</template>

<script setup lang="js">

import { ref ,shallowRef} from 'vue'
import { NButton, NTabs, NTabPane, NCollapse, NCollapseItem, NIcon } from 'naive-ui'

import { leftIconListStore  , iconChoiceStore} from '../store'
const leftIconList = leftIconListStore()
const iconList = leftIconList.getIconList()

const iconChoice = iconChoiceStore()

const iconClick = (title,data) => {
    leftIconList.clearIconFalse()
    leftIconList.changeIcon(title,data)
    iconChoice.setIconName(data)
}

</script>

<style scoped lang="scss">
#leftMenu {
    height: calc(100vh - 50px);
    width: 280px;
    padding: 15px;
    border-right: 1px solid #dddddd80;
    background-color: #fafafa;
}
</style>