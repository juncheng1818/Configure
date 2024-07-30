import { defineStore } from "pinia";

import {
    RectangleLandscape20Regular,
    Square20Regular,
    Star20Regular
} from '@vicons/fluent'

export const dashboardComponentStore = defineStore('dashboardComponent', {
    state: () => {
        return {
            componentList: [

            ],
            selectComponent: null
        }
    },
    actions: {

        // 删除组件
        deleteComponentList(id) {
            this.componentList = this.componentList.filter(item => item.id !== id)
        },

        // 添加组件
        addComponentList(component) {
            this.componentList.push(component)
        },

        //获取全部组件
        getComponentList() {
            return this.componentList
        },

        //修改选中的组件
        updateComponentList(id,componentStyle) {
            this.componentList = this.componentList.map(item => {
                if (item.id === id) {
                    item = Object.assign(item,  componentStyle )
                }
                return item
            })
        },

        //显示重置8个点位
        showResizable(id) {
            this.componentList = this.componentList.map(item => {
                item.resizable = false
                if (item.id === id) {
                    item.resizable = !item.resizable
                }
                return item
            })
        },

        //清除8个点位
        claerResizable() {
            this.componentList = this.componentList.map(item => {
                item.resizable = false
                return item
            })
        }
    }
})

export const leftIconListStore = defineStore('leftIconList', {
    state: () => {
        return {
            iconList: [
                {
                    title: '常用',
                    normalIcon: [
                        {
                            'name': 'Rectangle',
                            'icon': RectangleLandscape20Regular,
                            'choice': false
                        },
                        {
                            'name': 'Square',
                            'icon': Square20Regular,
                            'choice': false
                        },
                        {
                            'name': 'Star',
                            'icon': Star20Regular,
                            'choice': false
                        },
                    ],
                }
            ]

        }
    },
    actions: {
        getIconList() {
            return this.iconList
        },

        changeIcon(title, name) {
            this.iconList = this.iconList.map(item => {
                if (item.title === title) {
                    item.normalIcon = item.normalIcon.map(item => {
                        if (item.name === name) {
                            item.choice = !item.choice
                        }
                        return item
                    })
                }
                return item
            })
        },

        clearIconFalse() {
            this.iconList = this.iconList.map(item => {
                item.normalIcon = item.normalIcon.map(item => {
                    item.choice = false
                    return item
                })
                return item
            })
        }
    }
})


//  左侧列表选择的图标
export const iconChoiceStore = defineStore('iconChoice', {
    state: () => {
        return {
            name: '',
        }
    },

    getters: {

    },

    actions: {
        setIconName(name) {
            this.name = name
        },

        getIconName() {
            return this.name
        },

        clearIconName() {
            this.name = ''
        }
    }
})