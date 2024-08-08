<template>
    <div v-if="visible" :style="menuStyle" class="context-menu">
        <ul>
            <li @click="menuAction('delete')">删除</li>
            <li @click="menuAction('characteristic')">属性</li>
        </ul>
    </div>

    <Drawer ref="drawer_ref" @update-css="updateCss"/>
</template>

<script setup lang="js">
import { ref, reactive ,defineEmits ,defineProps} from 'vue';
import Drawer from './Drawer.vue';

import { dashboardComponentStore } from '../store/index.js'
const dashboardComponent = dashboardComponentStore()

import {useDialog} from 'naive-ui'
const dialog = useDialog()

const drawer_ref = ref(null);
const visible = ref(false);
const menuStyle = reactive({
    position: 'absolute',
    top: '0px',
    left: '0px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
});

const props = defineProps({
    id: {
        type: String
    }
})

const cssList = ref({});

const showMenu = (x, y,css) => {
    menuStyle.top = `${y}px`;
    menuStyle.left = `${x}px`;
    visible.value = true;
    cssList.value = {...css}
};

const hideMenu = () => {
    visible.value = false;
};

const menuAction = (action) => {
    if(action === 'delete'){
        //删除，利用pinia，调用store中的方法
        dialog.warning({
          title: '警告',
          content: '你确定？',
          positiveText: '确定',
          negativeText: '不确定',
          onPositiveClick: () => {
            emit('delete-component');
            // dashboardComponent.deleteComponentList(props.id);
          },
          onNegativeClick: () => {
          }
        })
    }
    if (action === 'characteristic') {
        drawer_ref.value.showDrawer(cssList.value);
    }
    hideMenu();
};

const emit = defineEmits(['update-css','delete-component']);

const updateCss = (css) => {
    emit('update-css', css);
}

document.addEventListener('click', hideMenu);
defineExpose({ showMenu, hideMenu });
</script>

<style scoped lang="scss">
.context-menu {
    width: 80px;
    position: absolute;
    z-index: 1000;
    text-align: center;
}

.context-menu ul {
    list-style-type: none;
    margin: 0;
    padding: 5px 0;
}

.context-menu ul li {
    padding: 5px 10px;
    cursor: pointer;
}

.context-menu ul li:hover {
    background-color: #eee;
}
</style>