<template>
    <div v-if="visible" :style="menuStyle" class="context-menu">
        <ul>
            <li @click="menuAction('action1')">Action 1</li>
            <li @click="menuAction('action2')">Action 2</li>
            <li @click="menuAction('characteristic')">属性</li>
        </ul>
    </div>
</template>

<script setup lang="js">
import { ref, reactive } from 'vue';

const visible = ref(false);
const menuStyle = reactive({
    position: 'absolute',
    top: '0px',
    left: '0px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
});

const showMenu = (x, y) => {
    menuStyle.top = `${y}px`;
    menuStyle.left = `${x}px`;
    visible.value = true;
};

const hideMenu = () => {
    visible.value = false;
};

const menuAction = (action) => {
    console.log(`Action selected: ${action}`);
    if(action === 'characteristic'){
        console.log('show characteristic');
    }
    hideMenu();
};

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