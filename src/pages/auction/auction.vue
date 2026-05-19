<template>
  <view class="page-container">
    <view class="custom-navbar">
      <text class="navbar-title">竞拍中心</text>
    </view>

    <view class="auction-stats">
      <view class="stat-card">
        <text class="stat-value">{{ auctionStats.todayAuction }}</text>
        <text class="stat-label">今日竞拍</text>
      </view>
      <view class="stat-card highlight">
        <text class="stat-value">{{ auctionStats.totalBids }}</text>
        <text class="stat-label">今日总出价</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">3</text>
        <text class="stat-label">热门拍品</text>
      </view>
    </view>

    <view class="hot-auction">
      <view class="section-header">
        <text class="section-title">🔥 热门竞拍</text>
        <view class="more-btn" @click="viewAllAuction">
          <text>查看全部</text>
          <text class="arrow">→</text>
        </view>
      </view>
      
      <view class="auction-list">
        <view class="auction-item" v-for="item in auctionStats.hotItems" :key="item.id">
          <view class="auction-info">
            <text class="auction-name">{{ item.name }}</text>
            <view class="auction-meta">
              <text class="meta-item">出价次数: {{ item.bids }}次</text>
              <text class="meta-item">结束时间: {{ formatEndTime(item.endTime) }}</text>
            </view>
          </view>
          <view class="auction-price">
            <text class="price-label">当前出价</text>
            <text class="price-value">{{ item.currentBid }}</text>
          </view>
          <view class="auction-btn" @click="bidNow(item)">
            <text>立即出价</text>
          </view>
        </view>
      </view>
    </view>

    <view class="auction-calendar">
      <view class="section-header">
        <text class="section-title">📅 竞拍日历</text>
      </view>
      <view class="calendar-list">
        <view class="calendar-item" v-for="(item, index) in calendarItems" :key="index">
          <view class="calendar-date">
            <text class="date-day">{{ item.day }}</text>
            <text class="date-week">{{ item.week }}</text>
          </view>
          <view class="calendar-events">
            <view class="event-dot" v-for="i in item.count" :key="i"></view>
          </view>
          <text class="event-count">{{ item.count }}场</text>
        </view>
      </view>
    </view>

    <view class="auction-rules">
      <view class="section-header">
        <text class="section-title">📋 竞拍规则</text>
      </view>
      <view class="rules-content">
        <view class="rule-item">
          <text class="rule-num">1</text>
          <text class="rule-text">竞拍前请确保账户余额充足</text>
        </view>
        <view class="rule-item">
          <text class="rule-num">2</text>
          <text class="rule-text">出价后系统将冻结相应金额</text>
        </view>
        <view class="rule-item">
          <text class="rule-num">3</text>
          <text class="rule-text">竞拍结束后自动划转藏品</text>
        </view>
        <view class="rule-item">
          <text class="rule-num">4</text>
          <text class="rule-text">出价失败资金将自动解冻</text>
        </view>
      </view>
    </view>

    <view class="risk-warning">
      <text class="warning-icon">⚠️</text>
      <text class="warning-text">竞拍有风险，请谨慎参与</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { auctionStats } from '@/data/mockData'

const calendarItems = ref([
  { day: '19', week: '周一', count: 3 },
  { day: '20', week: '周二', count: 5 },
  { day: '21', week: '周三', count: 4 },
  { day: '22', week: '周四', count: 2 },
  { day: '23', week: '周五', count: 6 },
  { day: '24', week: '周六', count: 8 },
  { day: '25', week: '周日', count: 4 }
])

const formatEndTime = (time: string) => {
  return time.split(' ')[1]
}

const viewAllAuction = () => {
  uni.showToast({ title: '查看全部竞拍', icon: 'none' })
}

const bidNow = (item: { name: string }) => {
  uni.showModal({
    title: '出价确认',
    content: `确定要对"${item.name}"进行出价吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '出价成功', icon: 'success' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
}

.custom-navbar {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  padding: 80rpx 32rpx 32rpx;
}

.navbar-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
}

.auction-stats {
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
  margin: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.stat-card {
  flex: 1;
  text-align: center;
  padding: 20rpx 16rpx;
  background: #f8fafc;
  border-radius: 12rpx;

  &.highlight {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  }
}

.stat-value {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #64748b;
}

.hot-auction {
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

.more-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #f59e0b;
  font-size: 26rpx;
}

.arrow {
  font-size: 24rpx;
}

.auction-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.auction-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: #f8fafc;
  border-radius: 12rpx;
}

.auction-info {
  flex: 1;
}

.auction-name {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8rpx;
}

.auction-meta {
  display: flex;
  gap: 20rpx;
}

.meta-item {
  font-size: 22rpx;
  color: #64748b;
}

.auction-price {
  text-align: right;
  margin-right: 16rpx;
}

.price-label {
  display: block;
  font-size: 22rpx;
  color: #64748b;
  margin-bottom: 4rpx;
}

.price-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #f59e0b;
}

.auction-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #fff;
  padding: 16rpx 24rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
  font-weight: 500;
}

.auction-calendar {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.calendar-list {
  display: flex;
  justify-content: space-between;
}

.calendar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.calendar-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80rpx;
  height: 80rpx;
  background: #f8fafc;
  border-radius: 12rpx;
  justify-content: center;
}

.date-day {
  font-size: 28rpx;
  font-weight: 600;
  color: #1e293b;
}

.date-week {
  font-size: 20rpx;
  color: #64748b;
}

.calendar-events {
  display: flex;
  gap: 4rpx;
  margin-top: 4rpx;
}

.event-dot {
  width: 12rpx;
  height: 12rpx;
  background: #f59e0b;
  border-radius: 50%;
}

.event-count {
  font-size: 22rpx;
  color: #64748b;
}

.auction-rules {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.rules-content {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.rule-item {
  width: calc(50% - 8rpx);
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx;
  background: #f8fafc;
  border-radius: 10rpx;
}

.rule-num {
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  text-align: center;
  background: #f59e0b;
  color: #fff;
  border-radius: 50%;
  font-size: 22rpx;
  font-weight: 600;
}

.rule-text {
  font-size: 24rpx;
  color: #475569;
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
