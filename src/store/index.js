import { defineStore } from "pinia";

import { RectangleLandscape20Regular, Square20Regular } from '@vicons/fluent'

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
                    ],
                }
            ]

        }
    },
    actions: {
        getIconList() {
            return this.iconList
        },

        changeIcon(title,name) {
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

        clearIconFalse(){
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