<template>
  <view class="page-container">
    <view class="section-header">
      <text class="section-title">📈 每周统计</text>
    </view>

    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">本周交易额趋势</text>
      </view>
      <view class="chart-content">
        <view class="bar-chart">
          <view class="bar-item" v-for="(item, index) in weeklyStats.labels" :key="index">
            <view class="bar-wrapper">
              <view 
                class="bar" 
                :style="{ height: getBarHeight(weeklyStats.sales[index]) + '%' }"
              ></view>
            </view>
            <text class="bar-label">{{ item }}</text>
            <text class="bar-value">{{ weeklyStats.sales[index] }}万</text>
          </view>
        </view>
      </view>
    </view>

    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">本周交易量趋势</text>
      </view>
      <view class="chart-content">
        <view class="bar-chart">
          <view class="bar-item" v-for="(item, index) in weeklyStats.labels" :key="index">
            <view class="bar-wrapper">
              <view 
                class="bar volume" 
                :style="{ height: getBarHeight(weeklyStats.volumes[index]) + '%' }"
              ></view>
            </view>
            <text class="bar-label">{{ item }}</text>
            <text class="bar-value">{{ weeklyStats.volumes[index] }}万</text>
          </view>
        </view>
      </view>
    </view>

    <view class="summary-card">
      <view class="summary-header">
        <text class="summary-title">📊 本周总结</text>
      </view>
      <view class="summary-content">
        <view class="summary-item">
          <text class="summary-icon">💰</text>
          <view class="summary-info">
            <text class="summary-label">本周总交易额</text>
            <text class="summary-value">¥{{ totalSales }}万</text>
          </view>
        </view>
        <view class="summary-item">
          <text class="summary-icon">📦</text>
          <view class="summary-info">
            <text class="summary-label">本周总交易量</text>
            <text class="summary-value">{{ totalVolumes }}万</text>
          </view>
        </view>
        <view class="summary-item">
          <text class="summary-icon">📈</text>
          <view class="summary-info">
            <text class="summary-label">日均交易额</text>
            <text class="summary-value">¥{{ avgSales }}万</text>
          </view>
        </view>
        <view class="summary-item">
          <text class="summary-icon">🔥</text>
          <view class="summary-info">
            <text class="summary-label">峰值日</text>
            <text class="summary-value">{{ peakDay }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { weeklyStats } from '@/data/mockData'

const maxValue = Math.max(...weeklyStats.sales, ...weeklyStats.volumes)

const getBarHeight = (value: number) => {
  return (value / maxValue) * 80
}

const totalSales = computed(() => {
  return weeklyStats.sales.reduce((a, b) => a + b, 0)
})

const totalVolumes = computed(() => {
  return weeklyStats.volumes.reduce((a, b) => a + b, 0)
})

const avgSales = computed(() => {
  return (totalSales.value / 7).toFixed(1)
})

const peakDay = computed(() => {
  const maxIndex = weeklyStats.sales.indexOf(Math.max(...weeklyStats.sales))
  return weeklyStats.labels[maxIndex]
})
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
  width: calc(14.28% - 8rpx);
}

.bar-wrapper {
  width: 100%;
  height: 240rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar {
  width: 40rpx;
  background: linear-gradient(180deg, #1e88e5 0%, #42a5f5 100%);
  border-radius: 6rpx 6rpx 0 0;
  min-height: 8rpx;
  transition: height 0.5s ease;

  &.volume {
    background: linear-gradient(180deg, #8b5cf6 0%, #a78bfa 100%);
  }
}

.bar-label {
  font-size: 20rpx;
  color: #64748b;
  margin-top: 12rpx;
}

.bar-value {
  font-size: 20rpx;
  color: #1e293b;
  font-weight: 500;
  margin-top: 4rpx;
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
  flex-direction: column;
  gap: 16rpx;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: #f8fafc;
  border-radius: 12rpx;
}

.summary-icon {
  font-size: 36rpx;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 12rpx;
}

.summary-info {
  flex: 1;
}

.summary-label {
  display: block;
  font-size: 24rpx;
  color: #64748b;
  margin-bottom: 4rpx;
}

.summary-value {
  font-size: 30rpx;
  font-weight: 600;
  color: #1e293b;
}
</style>
