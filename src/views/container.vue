<template>
    <div id="container">
        <TopMenu />
        <div class="content">
            <LeftMenu />
            <Dashboard />
        </div>
    </div>
</template>

<script setup lang="js">
import LeftMenu from '../components/LeftMenu.vue';
import Dashboard from '../components/Dashboard.vue';
import TopMenu from '../components/TopMenu.vue';
</script>

<style scoped lang="scss">

#container{
    width: 100%;
    height: 100%;
}

.content{
    height: calc(100% - 50px);
    width: 100%;
    display: flex;
}

</style>