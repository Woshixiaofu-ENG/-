<template>
  <view class="page-container">
    <view class="custom-navbar">
      <text class="navbar-title">我的</text>
    </view>

    <view class="user-section">
      <view class="user-info">
        <view class="avatar">
          <text class="avatar-icon">👤</text>
        </view>
        <view class="user-detail">
          <text class="user-name">数藏爱好者</text>
          <text class="user-level">Lv.12 · EXP: 8,500</text>
        </view>
        <view class="settings-btn" @click="goToSettings">
          <text>⚙️</text>
        </view>
      </view>
      <view class="exp-bar">
        <view class="exp-progress" :style="{ width: '85%' }"></view>
      </view>
    </view>

    <view class="portfolio-section">
      <view class="portfolio-header">
        <text class="portfolio-title">我的持仓</text>
        <view class="view-all" @click="viewAllHoldings">
          <text>查看全部</text>
          <text class="arrow">→</text>
        </view>
      </view>
      <view class="portfolio-stats">
        <view class="stat-item">
          <text class="stat-value">{{ userPortfolio.totalAssets }}</text>
          <text class="stat-label">总资产</text>
        </view>
        <view class="stat-item profit">
          <text class="stat-value">{{ userPortfolio.profit }}</text>
          <text class="stat-label">累计收益</text>
        </view>
        <view class="stat-item">
          <text class="stat-value" :class="profitClass">{{ userPortfolio.profitRate }}</text>
          <text class="stat-label">收益率</text>
        </view>
      </view>
    </view>

    <view class="holdings-list">
      <view class="holding-item" v-for="item in userPortfolio.holdings" :key="item.id">
        <view class="holding-image">
          <text class="image-icon">🖼️</text>
        </view>
        <view class="holding-info">
          <text class="holding-name">{{ item.name }}</text>
          <view class="holding-meta">
            <text class="meta-item">持有: {{ item.quantity }}个</text>
            <text class="meta-item">成本: {{ item.avgCost }}</text>
          </view>
        </view>
        <view class="holding-profit">
          <text class="profit-value" :class="getProfitClass(item.profitRate)">{{ item.profit }}</text>
          <text class="profit-rate" :class="getProfitClass(item.profitRate)">{{ item.profitRate }}</text>
        </view>
      </view>
    </view>

    <view class="transaction-section">
      <view class="section-header">
        <text class="section-title">📋 交易记录</text>
        <view class="view-all" @click="viewAllTransactions">
          <text>查看全部</text>
          <text class="arrow">→</text>
        </view>
      </view>
      <view class="transaction-list">
        <view class="transaction-item" v-for="item in transactionRecords" :key="item.id">
          <view class="transaction-type" :class="item.type">
            {{ getTypeIcon(item.type) }}
          </view>
          <view class="transaction-info">
            <text class="transaction-name">{{ item.name }}</text>
            <text class="transaction-time">{{ item.time }}</text>
          </view>
          <view class="transaction-amount">
            <text class="amount-value" :class="item.type === 'buy' ? 'negative' : 'positive'">
              {{ item.type === 'buy' ? '-' : '+' }}{{ item.price }}
            </text>
            <text class="amount-status" :class="item.status">{{ getStatusText(item.status) }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" v-for="(item, index) in menuItems" :key="index" @click="handleMenuClick(item)">
        <text class="menu-icon">{{ item.icon }}</text>
        <text class="menu-label">{{ item.label }}</text>
        <text class="menu-arrow">→</text>
      </view>
    </view>

    <view class="risk-warning">
      <text class="warning-icon">⚠️</text>
      <text class="warning-text">投资有风险，入市需谨慎</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { userPortfolio, transactionRecords } from '@/data/mockData'

const profitClass = computed(() => {
  return userPortfolio.profitRate.startsWith('+') ? 'positive' : 'negative'
})

const menuItems = [
  { icon: '🔔', label: '价格预警', url: '/pages/mine/mine?tab=alert' },
  { icon: '📊', label: '数据分析', url: '/pages/stats/monthly' },
  { icon: '💬', label: '社区讨论', url: '/pages/community/community' },
  { icon: '⚙️', label: '数据管理', url: '/pages/admin/admin' },
  { icon: '📖', label: '帮助中心', url: '' },
  { icon: '⭐', label: '收藏夹', url: '' },
  { icon: '📝', label: '意见反馈', url: '' }
]

const getTypeIcon = (type: string) => {
  const map: Record<string, string> = {
    buy: '🛒',
    sell: '💰',
    auction: '🏆',
    consignment: '📦'
  }
  return map[type] || '📄'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    completed: '已完成',
    pending: '处理中',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getProfitClass = (rate: string) => {
  return rate.startsWith('+') ? 'positive' : 'negative'
}

const goToSettings = () => {
  uni.showToast({ title: '设置', icon: 'none' })
}

const viewAllHoldings = () => {
  uni.showToast({ title: '查看全部持仓', icon: 'none' })
}

const viewAllTransactions = () => {
  uni.showToast({ title: '查看全部交易', icon: 'none' })
}

const handleMenuClick = (item: { label: string, url?: string }) => {
  if (item.url) {
    uni.navigateTo({ url: item.url, fail: () => {
      uni.showToast({ title: item.label, icon: 'none' })
    }})
  } else {
    uni.showToast({ title: item.label, icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
  padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
}

.custom-navbar {
  background: transparent;
  padding: 80rpx 32rpx 32rpx;
}

.navbar-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
}

.user-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32rpx;
  margin-top: -20rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20rpx rgba(102, 126, 234, 0.5);
}

.avatar-icon {
  font-size: 48rpx;
}

.user-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.user-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
}

.user-level {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.settings-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.exp-bar {
  height: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4rpx;
  margin-top: 20rpx;
  overflow: hidden;
}

.exp-progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #10b981 100%);
  border-radius: 4rpx;
  transition: width 0.5s ease;
}

.portfolio-section {
  background: rgba(255, 255, 255, 0.05);
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.portfolio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.portfolio-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #667eea;
  font-size: 26rpx;
}

.arrow {
  font-size: 24rpx;
}

.portfolio-stats {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  text-align: center;

  &.profit {
    border-left: 1rpx solid rgba(255, 255, 255, 0.1);
    border-right: 1rpx solid rgba(255, 255, 255, 0.1);
    padding: 0 48rpx;
  }
}

.stat-value {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8rpx;

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

.holdings-list {
  background: rgba(255, 255, 255, 0.05);
  margin: 0 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.holding-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.holding-image {
  width: 80rpx;
  height: 80rpx;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-icon {
  font-size: 36rpx;
}

.holding-info {
  flex: 1;
}

.holding-name {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
  margin-bottom: 8rpx;
}

.holding-meta {
  display: flex;
  gap: 20rpx;
}

.meta-item {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
}

.holding-profit {
  text-align: right;
}

.profit-value {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 4rpx;

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }
}

.profit-rate {
  font-size: 22rpx;

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }
}

.transaction-section {
  background: rgba(255, 255, 255, 0.05);
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
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
  color: #fff;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12rpx;
}

.transaction-type {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;

  &.buy {
    background: rgba(59, 130, 246, 0.2);
  }

  &.sell {
    background: rgba(16, 185, 129, 0.2);
  }

  &.auction {
    background: rgba(245, 158, 11, 0.2);
  }

  &.consignment {
    background: rgba(236, 72, 153, 0.2);
  }
}

.transaction-info {
  flex: 1;
}

.transaction-name {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
  margin-bottom: 4rpx;
}

.transaction-time {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.transaction-amount {
  text-align: right;
}

.amount-value {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 4rpx;

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }
}

.amount-status {
  font-size: 22rpx;

  &.completed {
    color: #10b981;
  }

  &.pending {
    color: #f59e0b;
  }

  &.cancelled {
    color: #9ca3af;
  }
}

.menu-section {
  background: rgba(255, 255, 255, 0.05);
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
}

.menu-icon {
  font-size: 32rpx;
}

.menu-label {
  flex: 1;
  font-size: 28rpx;
  color: #fff;
}

.menu-arrow {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.risk-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 24rpx;
  margin: 20rpx;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 12rpx;
  border: 1rpx solid rgba(245, 158, 11, 0.3);
}

.warning-icon {
  font-size: 24rpx;
}

.warning-text {
  font-size: 24rpx;
  color: #fbbf24;
  text-align: center;
}
</style>
