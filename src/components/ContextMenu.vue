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

const drawer_ref = ref(null);
const visible = ref(false);
const menuStyle = reactive({
    position: 'absolute',
    top: '0px',
    left: '0px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
});

const props = defineProps({
    canvasStyle: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

const showMenu = (x, y, type) => {
    menuStyle.top = `${y}px`;
    menuStyle.left = `${x}px`;
    visible.value = true;
};

const hideMenu = () => {
    visible.value = false;
};

const menuAction = (action) => {
    if(action === 'delete'){
        //删除，利用pinia，调用store中的方法
    }
    if (action === 'characteristic') {
        drawer_ref.value.showDrawer(props.canvasStyle);
    }
    hideMenu();
};

const emit = defineEmits(['update-css']);

const updateCss = (css) => {
    emit('update-css', css);

}

document.addEventListener('click', hideMenu);
defineExpose({ showMenu, hideMenu });
</script>

<style scoped lang="scss">
.context-menu {
    position: absolute;
    z-index: 1000;
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