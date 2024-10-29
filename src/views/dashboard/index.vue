<script setup>
import BarChar from '../../components/barChar.vue';
import PieChart from '../../components/pieChar.vue';
import LineChart from '../../components/linkChar.vue';
import AdminOverView from '../../components/adminOverView.vue';
</script>

<template>
    <div class="wrap">
        <AdminOverView class="item"/>
        <PieChart class="item" />
        <BarChar class="item" />
        <LineChart class="item" />
    </div>
</template>

<style scoped lang="less">
.wrap{
    display: flex;
    flex-wrap: wrap;
    box-shadow: var(--el-box-shadow-light);
    .item{
        width: 46.6%;
        height: calc((100vh - 100px) / 2);
        min-height: 360px;
        padding: 20px;
        border: 1px solid #c5ccd9;
    }
}
</style>