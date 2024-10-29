<script setup>
import {ref} from 'vue'
const overviewData = ref({
    allData:[
        {
            id:1,
            name:'总销售额',
            number:'3128387'
        },
        {
            id:2,
            name:'访问总量',
            number:'183687'
        },
        {
            id:3,
            name:'总支付量',
            number:'36387'
        },
        {
            id:4,
            name:'总收藏量',
            number:'836387'
        },
        
    ],
    orderData:[
        {
            id:1,
            name:'今日订单数',
            number:'120'
        },
        {
            id:2,
            name:'累计金额',
            number:'2409'
        },
        {
            id:3,
            name:'本月订单数',
            number:'3697'
        },
        {
            id:4,
            name:'累计金额',
            number:'136387'
        },
    ]
})
const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))
</script>

<template>
    <div id="overView">
        <div class="userInfo">
            <el-avatar :src="userInfo.avatar" />
            <span class="username">{{ userInfo.name }}</span>
        </div>
        <div class="overview-list">
            <div class="overview-item" v-for="item in overviewData.allData" :key="item.id">
                <div class="title">{{item.name}}</div>
                <div class="number">{{item.number}}</div>
            </div>
        </div>
        <div class="overview-list">
            <div class="overview-item" v-for="item in overviewData.orderData" :key="item.id">
                <div class="title">{{item.name}}</div>
                <div class="number">{{item.number}}</div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
#overView{
    .userInfo{
        display: flex;
        align-items: center;
        .username{
            margin-left: 10px;
        }
    }
    .overview-list{
        display: flex;
        justify-content: center;
        margin-top: 40px;
        .overview-item{
            width: 22%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: var(--el-box-shadow-light);
            border-radius: 10px;
            padding: 20px;
            .title{
                font-weight: 600;
                margin-bottom: 10px;
            }
            .number{
                font-size: 18px;
            }
        }
    }
}
</style>