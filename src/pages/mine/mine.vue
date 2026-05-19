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
          <text class="user-id">ID: 88888888</text>
        </view>
        <view class="settings-btn" @click="goToSettings">
          <text>⚙️</text>
        </view>
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
  { icon: '💬', label: '社区讨论', url: '' },
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

const handleMenuClick = (item: { label: string }) => {
  uni.showToast({ title: item.label, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
}

.custom-navbar {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  padding: 80rpx 32rpx 32rpx;
}

.navbar-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
}

.user-section {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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

.user-id {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
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

.portfolio-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
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
  color: #1e293b;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #8b5cf6;
  font-size: 26rpx;
}

.arrow {
  font-size: 24rpx;
}

.portfolio-stats {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  border-top: 1rpx solid #f1f5f9;
}

.stat-item {
  text-align: center;

  &.profit {
    border-left: 1rpx solid #f1f5f9;
    border-right: 1rpx solid #f1f5f9;
    padding: 0 48rpx;
  }
}

.stat-value {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #1e293b;
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
  color: #64748b;
}

.holdings-list {
  background: #fff;
  margin: 0 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.holding-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  border-bottom: 1rpx solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
}

.holding-image {
  width: 80rpx;
  height: 80rpx;
  background: #f8fafc;
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
  color: #1e293b;
  margin-bottom: 8rpx;
}

.holding-meta {
  display: flex;
  gap: 20rpx;
}

.meta-item {
  font-size: 22rpx;
  color: #64748b;
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
  background: #fff;
  margin: 20rpx;
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
  background: #f8fafc;
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
    background: #dbeafe;
  }

  &.sell {
    background: #d1fae5;
  }

  &.auction {
    background: #fef3c7;
  }

  &.consignment {
    background: #fce7f3;
  }
}

.transaction-info {
  flex: 1;
}

.transaction-name {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4rpx;
}

.transaction-time {
  font-size: 22rpx;
  color: #64748b;
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
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx;
  border-bottom: 1rpx solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #f8fafc;
  }
}

.menu-icon {
  font-size: 32rpx;
}

.menu-label {
  flex: 1;
  font-size: 28rpx;
  color: #1e293b;
}

.menu-arrow {
  font-size: 24rpx;
  color: #94a3b8;
}

.risk-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 24rpx;
  margin: 20rpx;
  background: #fffbeb;
  border-radius: 12rpx;
}

.warning-icon {
  font-size: 24rpx;
}

.warning-text {
  font-size: 24rpx;
  color: #92400e;
  text-align: center;
}
</style>
