import { defineStore } from "pinia";

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
                            'name': 'rect',
                            'icon': 'icon-juxing',
                            'choice': false
                        },
                        {
                            'name': 'circle',
                            'icon': 'icon-xingzhuang-tuoyuanxing',
                            'choice': false
                        },
                        {
                            'name': 'oval',
                            'icon':'icon-tuoyuanxing',
                            'choice': false
                        },
                        {
                            'name': 'arrow',
                            'icon': 'icon-jiang-right',
                            'choice': false
                        },
                        {
                            'name': 'star',
                            'icon': 'icon-wujiaoxing_kong',
                            'choice': false
                        },
                        {
                            'name': 'triangle',
                            'icon': 'icon-xingzhuang-sanjiaoxing',
                            'choice': false
                        },
                        {
                            'name': 'trapezoid',
                            'icon': 'icon-tixing-01',
                            'choice': false
                        },
                        {
                            'name': 'pentagon',
                            'icon': 'icon-wubianxing',
                            'choice': false
                        },
                        {
                            'name': 'hexagon',
                            'icon': 'icon-hexagon',
                            'choice': false
                        },
                        {
                            'name': 'wedge',
                            'icon': 'icon-shanxing',
                            'choice': false
                        },

                        //环形
                        {
                            'name': 'ring',
                            'icon': 'icon-huanxingtu',
                            'choice': false
                        },

                        //扇环形
                        {
                            'name': 'arc',
                            'icon': 'icon-a-chengshishejixiangmutubiao_huaban1fuben196',
                            'choice': false
                        },

                        //文字
                        {
                            'name': 'simpleText',
                            'icon': 'icon-wenzi',
                            'choice': false
                        }
                    ],
                },
                {
                    title: '图表',
                    normalIcon: [
                        {
                            'name': 'pie',
                            'icon': 'icon-chart-pie',
                            'choice': false
                        },
                        {
                            'name': 'line',
                            'icon': 'icon-zhexiantu',
                            'choice': false
                        },
                        {
                            'name': 'bar',
                            'icon': 'icon-barchart',
                            'choice': false
                        },
                        {
                            'name': 'gauge',
                            'icon': 'icon-Gauge',
                            'choice': false
                        },
                    ],
                },
                {
                    title: '连线',
                    normalIcon: [
                        {
                            'name': 'connect-line',
                            'icon': 'icon-map-connect-full',
                            'choice': false
                        },
                    ],
                },
                {
                    title: '时间',
                    normalIcon: [
                        {
                            'name': 'clockText',
                            'icon': 'icon-dianzishizhong',
                            'choice': false
                        },
                    ],
                },
                {
                    title: '采暖系统',
                    normalIcon: [
                        {
                            'name': 'heatingSystemPump',
                            'icon': 'icon-shuibeng',
                            'choice': false
                        },
                        {
                            'name': 'heatingSystemWaterTreatment',
                            'icon': 'icon-shuichuliyi',
                            'choice': false
                        },
                        {
                            'name': 'heatingSystemWaterPressureSensor',
                            'icon': 'icon-huaban',
                            'choice': false
                        },
                        {
                            'name': 'heatingSystemWaterTemperatrueSensor',
                            'icon': 'icon-wenduchuanganqi',
                            'choice': false
                        },
                        {
                            'name': 'heatingSystemAirCondition',
                            'icon': 'icon-kongtiao',
                            'choice': false
                        },
                        {
                            'name': 'heatingSystemElectricBoiler',
                            'icon': 'icon-dianguolu_huaban',
                            'choice': false
                        },
                    ],
                },
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
            title: '',
        }
    },

    getters: {

    },

    actions: {
        setIconName(title,name) {
            this.name = name
            this.title = title
        },

        getIconName() {
            return this.name
        },

        getIconTitle() {
            return this.title
        },

        clearIconName() {
            this.name = ''
        }
    }
})