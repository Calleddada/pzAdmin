<template>
    <v-chart class="chart" :option="option" autoresize />
  </template>
  
  <script setup>
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { BarChart } from 'echarts/charts';
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent
  } from 'echarts/components';
  import VChart from 'vue-echarts';
  import { ref } from 'vue';
  
  use([
    CanvasRenderer,
    BarChart,
    TitleComponent,
    TooltipComponent,
    GridComponent
  ]);
  
  
  const option = ref({
    title: {
      text: '业绩报表',
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
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
        }
    ]
    });
  </script>
  
  <style scoped lang="less">
  .chart {
    height: 100vh;
  }
  </style>
  