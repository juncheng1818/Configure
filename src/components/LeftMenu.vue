<template>
    <div id="leftMenu">
        <NTabs type="segment" animated>
            <n-tab-pane name="chap1" tab="组件">
                <n-collapse :default-expanded-names="['常用']">
                    <n-collapse-item :title="item.title + '（' + item.normalIcon.length + '）'" :name="item.title"
                        v-for="item in iconList" :key="item">
                        <svg v-for="iconItem in item.normalIcon" :key="iconItem.name"
                            :style="{ 'background-color': iconItem.choice ? '#ddd' : '', 'padding': '0 8px' }"
                            class="icon" aria-hidden="true" @click="iconClick(item.title, iconItem.name)">
                            <use :title="iconItem.name" v-bind:xlink:href="`#${iconItem.icon}`"></use>
                        </svg>
                    </n-collapse-item>
                </n-collapse>
            </n-tab-pane>
            <n-tab-pane name="chap2" tab="我的组件">
            </n-tab-pane>
        </NTabs>
    </div>
</template>

<script setup lang="js">

import { ref, shallowRef } from 'vue'
import { NButton, NTabs, NTabPane, NCollapse, NCollapseItem, NIcon } from 'naive-ui'

import { leftIconListStore, iconChoiceStore } from '../store'
const leftIconList = leftIconListStore()
const iconList = leftIconList.getIconList()

const iconChoice = iconChoiceStore()

const iconClick = (title, data) => {
    leftIconList.clearIconFalse()
    leftIconList.changeIcon(title, data)
    iconChoice.setIconName(title, data)
}

</script>

<style scoped lang="scss">
#leftMenu {
    height: calc(100vh - 51px);
    width: 240px;
    padding: 15px;
    border-top: 1px solid #dddddd80;
    background-color: #00000010;
    flex-shrink: 0;
}

.icon {
    height: 30px;
    width: 30px;
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #ddd;
    }
}
</style>