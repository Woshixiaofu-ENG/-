<template>
  <view class="page-container">
    <view class="detail-header">
      <view class="back-btn" @click="goBack">
        <text>←</text>
      </view>
      <text class="header-title">藏品详情</text>
      <view class="share-btn" @click="share">
        <text>↗</text>
      </view>
    </view>

    <view class="cover-section">
      <view class="cover-image">
        <text class="image-icon">🖼️</text>
      </view>
      <view class="cover-info">
        <text class="cover-name">忒PANDA-Z世代</text>
        <text class="cover-id">藏品编号: #0001</text>
      </view>
    </view>

    <view class="price-section">
      <view class="current-price">
        <text class="price-label">当前价格</text>
        <text class="price-value">¥2,500</text>
        <text class="price-change positive">+12.5%</text>
      </view>
      <view class="price-meta">
        <view class="meta-item">
          <text class="meta-label">24h最高价</text>
          <text class="meta-value">¥2,800</text>
        </view>
        <view class="meta-item">
          <text class="meta-label">24h最低价</text>
          <text class="meta-value">¥2,200</text>
        </view>
        <view class="meta-item">
          <text class="meta-label">24h成交量</text>
          <text class="meta-value">12件</text>
        </view>
        <view class="meta-item">
          <text class="meta-label">流通数量</text>
          <text class="meta-value">1,774件</text>
        </view>
      </view>
    </view>

    <view class="stats-section">
      <view class="section-header">
        <text class="section-title">📊 交易数据</text>
      </view>
      <view class="stats-content">
        <view class="stat-row">
          <text class="stat-label">寄售数量</text>
          <text class="stat-value">128件</text>
        </view>
        <view class="stat-row">
          <text class="stat-label">成交均价</text>
          <text class="stat-value">¥2,350</text>
        </view>
        <view class="stat-row">
          <text class="stat-label">溢价率</text>
          <text class="stat-value positive">+1769.08%</text>
        </view>
        <view class="stat-row">
          <text class="stat-label">持有者</text>
          <text class="stat-value">1,245人</text>
        </view>
      </view>
    </view>

    <view class="chart-section">
      <view class="section-header">
        <text class="section-title">📈 价格走势</text>
        <view class="chart-tabs">
          <text 
            class="chart-tab" 
            :class="{ active: chartTab === 'day' }"
            @click="chartTab = 'day'"
          >今日</text>
          <text 
            class="chart-tab" 
            :class="{ active: chartTab === 'week' }"
            @click="chartTab = 'week'"
          >周K</text>
          <text 
            class="chart-tab" 
            :class="{ active: chartTab === 'month' }"
            @click="chartTab = 'month'"
          >月K</text>
        </view>
      </view>
      <view class="chart-content">
        <view class="mini-chart">
          <view class="chart-bar" v-for="(height, index) in chartData" :key="index" :style="{ height: height + '%' }"></view>
        </view>
        <view class="chart-labels">
          <text class="chart-label">09:00</text>
          <text class="chart-label">12:00</text>
          <text class="chart-label">15:00</text>
          <text class="chart-label">18:00</text>
          <text class="chart-label">21:00</text>
        </view>
      </view>
    </view>

    <view class="info-section">
      <view class="section-header">
        <text class="section-title">📝 藏品信息</text>
      </view>
      <view class="info-content">
        <view class="info-row">
          <text class="info-label">发行方</text>
          <text class="info-value">中传新文创平台</text>
        </view>
        <view class="info-row">
          <text class="info-label">发行时间</text>
          <text class="info-value">2026-05-01 10:00</text>
        </view>
        <view class="info-row">
          <text class="info-label">发行数量</text>
          <text class="info-value">2,000件</text>
        </view>
        <view class="info-row">
          <text class="info-label">发行价格</text>
          <text class="info-value">¥138</text>
        </view>
        <view class="info-row">
          <text class="info-label">所属系列</text>
          <text class="info-value">忒PANDA系列</text>
        </view>
      </view>
    </view>

    <view class="footer-actions">
      <view class="action-btn secondary" @click="addAlert">
        <text>🔔 添加预警</text>
      </view>
      <view class="action-btn primary" @click="buyNow">
        <text>立即购买</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const chartTab = ref('day')
const chartData = [45, 52, 38, 65, 58, 72, 68, 78, 75, 82, 78, 85]

const goBack = () => {
  uni.navigateBack()
}

const share = () => {
  uni.showToast({ title: '分享功能', icon: 'none' })
}

const addAlert = () => {
  uni.showToast({ title: '已添加价格预警', icon: 'success' })
}

const buyNow = () => {
  uni.showModal({
    title: '购买确认',
    content: '确定购买"忒PANDA-Z世代"吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '购买成功', icon: 'success' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: calc(env(safe-area-inset-bottom) + 140rpx);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60rpx 24rpx 20rpx;
  background: #fff;
}

.back-btn, .share-btn {
  width: 64rpx;
  height: 64rpx;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e293b;
}

.cover-section {
  background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
  padding: 32rpx;
  display: flex;
  gap: 20rpx;
}

.cover-image {
  width: 160rpx;
  height: 160rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-icon {
  font-size: 64rpx;
}

.cover-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cover-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8rpx;
}

.cover-id {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.price-section {
  background: #fff;
  margin: -20rpx 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.current-price {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.price-label {
  font-size: 26rpx;
  color: #64748b;
}

.price-value {
  font-size: 48rpx;
  font-weight: 700;
  color: #1e293b;
}

.price-change {
  font-size: 26rpx;
  font-weight: 500;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;

  &.positive {
    color: #10b981;
    background: #d1fae5;
  }

  &.negative {
    color: #ef4444;
    background: #fee2e2;
  }
}

.price-meta {
  display: flex;
  justify-content: space-between;
}

.meta-item {
  text-align: center;
}

.meta-label {
  display: block;
  font-size: 22rpx;
  color: #64748b;
  margin-bottom: 4rpx;
}

.meta-value {
  font-size: 26rpx;
  font-weight: 500;
  color: #1e293b;
}

.stats-section {
  background: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1e293b;
}

.stats-content {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.stat-row {
  width: calc(50% - 8rpx);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx;
  background: #f8fafc;
  border-radius: 12rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #64748b;
}

.stat-value {
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

.chart-section {
  background: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.chart-tabs {
  display: flex;
  gap: 12rpx;
}

.chart-tab {
  font-size: 24rpx;
  color: #64748b;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  background: #f1f5f9;

  &.active {
    background: #1e88e5;
    color: #fff;
  }
}

.chart-content {
  padding-top: 20rpx;
}

.mini-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200rpx;
}

.chart-bar {
  width: calc(8.33% - 4rpx);
  background: linear-gradient(180deg, #1e88e5 0%, #42a5f5 100%);
  border-radius: 4rpx 4rpx 0 0;
  min-height: 8rpx;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12rpx;
}

.chart-label {
  font-size: 20rpx;
  color: #94a3b8;
}

.info-section {
  background: #fff;
  margin: 0 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-size: 26rpx;
  color: #64748b;
}

.info-value {
  font-size: 26rpx;
  font-weight: 500;
  color: #1e293b;
}

.footer-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.action-btn {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: 500;

  &.secondary {
    background: #f1f5f9;
    color: #64748b;
  }

  &.primary {
    background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
    color: #fff;
  }
}
</style>
