<template>
    <v-chart class="chart" :option="option" autoresize />
  </template>
  
  <script setup>
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { LineChart } from 'echarts/charts';
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent
  } from 'echarts/components';
  import VChart from 'vue-echarts';
  import { ref } from 'vue';
  
  use([
    CanvasRenderer,
    LineChart,
    TitleComponent,
    TooltipComponent,
    GridComponent
  ]);
  
  
  const option = ref({
    title: {
      text: '订单报表',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
        }
    ]
        });
  </script>
  
  <style scoped lang="less">
  .chart {
    height: 100vh;
  }
  </style>
  