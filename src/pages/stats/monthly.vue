<template>
  <view class="page-container">
    <view class="section-header">
      <text class="section-title">📊 每月统计</text>
    </view>

    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">月度交易额趋势</text>
      </view>
      <view class="chart-content">
        <view class="bar-chart">
          <view class="bar-item" v-for="(item, index) in monthlyStats.labels" :key="index">
            <view class="bar-wrapper">
              <view 
                class="bar" 
                :style="{ height: getBarHeight(monthlyStats.sales[index]) + '%' }"
              ></view>
            </view>
            <text class="bar-label">{{ item }}</text>
            <text class="bar-value">{{ monthlyStats.sales[index] }}万</text>
          </view>
        </view>
      </view>
    </view>

    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">月度交易量趋势</text>
      </view>
      <view class="chart-content">
        <view class="bar-chart">
          <view class="bar-item" v-for="(item, index) in monthlyStats.labels" :key="index">
            <view class="bar-wrapper">
              <view 
                class="bar volume" 
                :style="{ height: getBarHeight(monthlyStats.volumes[index]) + '%' }"
              ></view>
            </view>
            <text class="bar-label">{{ item }}</text>
            <text class="bar-value">{{ monthlyStats.volumes[index] }}万</text>
          </view>
        </view>
      </view>
    </view>

    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">持仓人数增长</text>
      </view>
      <view class="chart-content">
        <view class="line-chart">
          <view class="line-container">
            <view class="grid-lines">
              <view class="grid-line" v-for="i in 5" :key="i"></view>
            </view>
            <view class="line-path">
              <view 
                class="point" 
                v-for="(item, index) in monthlyStats.holders" 
                :key="index"
                :style="{ 
                  left: ((index / (monthlyStats.holders.length - 1)) * 100) + '%', 
                  bottom: getLineHeight(item) + '%' 
                }"
              ></view>
              <svg class="line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline 
                  :points="linePoints" 
                  fill="none" 
                  stroke="#1e88e5" 
                  stroke-width="0.5"
                />
              </svg>
            </view>
          </view>
          <view class="line-labels">
            <text class="line-label" v-for="(item, index) in monthlyStats.labels" :key="index">
              {{ item }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="summary-card">
      <view class="summary-header">
        <text class="summary-title">📈 数据总结</text>
      </view>
      <view class="summary-content">
        <view class="summary-item">
          <text class="summary-label">本月交易额</text>
          <text class="summary-value">¥{{ monthlyStats.sales[4] }}万</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">环比增长</text>
          <text class="summary-value positive">+{{ getGrowthRate(monthlyStats.sales[4], monthlyStats.sales[3]) }}%</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">本月交易量</text>
          <text class="summary-value">{{ monthlyStats.volumes[4] }}万</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">持仓人数</text>
          <text class="summary-value">{{ formatNumber(monthlyStats.holders[4]) }}人</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { monthlyStats } from '@/data/mockData'

const maxSales = Math.max(...monthlyStats.sales)
const maxVolumes = Math.max(...monthlyStats.volumes)
const maxHolders = Math.max(...monthlyStats.holders)

const getBarHeight = (value: number) => {
  return (value / maxSales) * 80
}

const getLineHeight = (value: number) => {
  return (value / maxHolders) * 80
}

const linePoints = computed(() => {
  return monthlyStats.holders.map((item, index) => {
    const x = (index / (monthlyStats.holders.length - 1)) * 100
    const y = 100 - getLineHeight(item)
    return `${x},${y}`
  }).join(' ')
})

const getGrowthRate = (current: number, previous: number) => {
  return ((current - previous) / previous * 100).toFixed(1)
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20rpx;
}

.section-header {
  padding: 20rpx 0;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e293b;
}

.chart-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.chart-header {
  margin-bottom: 20rpx;
}

.chart-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1e293b;
}

.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 300rpx;
  padding-top: 40rpx;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(20% - 12rpx);
}

.bar-wrapper {
  width: 100%;
  height: 240rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar {
  width: 48rpx;
  background: linear-gradient(180deg, #1e88e5 0%, #42a5f5 100%);
  border-radius: 8rpx 8rpx 0 0;
  min-height: 8rpx;
  transition: height 0.5s ease;

  &.volume {
    background: linear-gradient(180deg, #8b5cf6 0%, #a78bfa 100%);
  }
}

.bar-label {
  font-size: 22rpx;
  color: #64748b;
  margin-top: 12rpx;
}

.bar-value {
  font-size: 22rpx;
  color: #1e293b;
  font-weight: 500;
  margin-top: 4rpx;
}

.line-chart {
  height: 300rpx;
}

.line-container {
  position: relative;
  height: 240rpx;
  border-bottom: 1rpx solid #e2e8f0;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-line {
  height: 1rpx;
  background: #f1f5f9;
}

.line-path {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.line-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.point {
  position: absolute;
  width: 16rpx;
  height: 16rpx;
  background: #1e88e5;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  border: 4rpx solid #fff;
  box-shadow: 0 2rpx 8rpx rgba(30, 136, 229, 0.4);
}

.line-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12rpx;
}

.line-label {
  font-size: 22rpx;
  color: #64748b;
}

.summary-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.summary-header {
  margin-bottom: 20rpx;
}

.summary-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1e293b;
}

.summary-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.summary-item {
  width: calc(50% - 10rpx);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx;
  background: #f8fafc;
  border-radius: 12rpx;
}

.summary-label {
  font-size: 26rpx;
  color: #64748b;
}

.summary-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #1e293b;

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }
}
</style>
