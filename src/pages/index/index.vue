<template>
  <view class="page-container">
    <view class="custom-navbar">
      <view class="navbar-content">
        <text class="navbar-title">数藏助手</text>
        <text class="navbar-subtitle">中传新文创藏品平台数据仓库</text>
      </view>
      <view class="refresh-btn" @click="handleRefresh">
        <text>🔄</text>
      </view>
    </view>

    <view class="content-area">
      <StatsCard />
      <view class="update-info">
        <text class="update-icon">⏰</text>
        <text class="update-text">更新时间: {{ collectionStats.updateTime }}</text>
        <text class="update-hint">点击卡片查看数据变化趋势</text>
      </view>

      <FunctionNav />
      <RankingList />

      <view class="calendar-section">
        <view class="section-header">
          <view class="header-left">
            <text class="section-title">📅 中传日历</text>
            <text class="section-badge">今日预告</text>
          </view>
          <view class="header-right" @click="goToCalendar">
            <text>完整日历</text>
            <text class="arrow">→</text>
          </view>
        </view>
        <view class="calendar-events">
          <view class="event-item" v-for="event in todayEvents" :key="event.id">
            <view class="event-time">{{ event.time }}</view>
            <view class="event-content">
              <text class="event-title">{{ event.title }}</text>
              <view class="event-type" :class="event.type">
                {{ getTypeText(event.type) }}
              </view>
            </view>
            <view class="event-status" :class="event.status">
              {{ getStatusText(event.status) }}
            </view>
          </view>
        </view>
      </view>

      <view class="risk-warning">
        <text class="warning-icon">⚠️</text>
        <text class="warning-text">各项数据均源自公开信息，不提供任何投资建议</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatsCard from '@/components/StatsCard.vue'
import RankingList from '@/components/RankingList.vue'
import FunctionNav from '@/components/FunctionNav.vue'
import { collectionStats, calendarEvents } from '@/data/mockData'

const todayEvents = computed(() => {
  const today = '2026-05-20'
  const todayData = calendarEvents.find(item => item.date === today)
  return todayData?.events || []
})

const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    sale: '发售',
    auction: '竞拍',
    airdrop: '空投',
    event: '活动'
  }
  return map[type] || type
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    upcoming: '即将开始',
    ongoing: '进行中',
    ended: '已结束'
  }
  return map[status] || status
}

const handleRefresh = () => {
  uni.showLoading({ title: '刷新中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '刷新成功', icon: 'success' })
  }, 1000)
}

const goToCalendar = () => {
  uni.navigateTo({ url: '/pages/calendar/calendar' })
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
}

.custom-navbar {
  background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
  padding: 80rpx 32rpx 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.navbar-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.navbar-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
}

.navbar-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.refresh-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.content-area {
  padding-top: -20rpx;
}

.update-info {
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.update-icon {
  font-size: 24rpx;
}

.update-text {
  font-size: 24rpx;
  color: #64748b;
}

.update-hint {
  font-size: 22rpx;
  color: #94a3b8;
  margin-left: auto;
}

.calendar-section {
  background: #fff;
  border-radius: 16rpx;
  margin: 20rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1e293b;
}

.section-badge {
  font-size: 22rpx;
  color: #3b82f6;
  background: #dbeafe;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #3b82f6;
  font-size: 26rpx;
}

.arrow {
  font-size: 24rpx;
}

.calendar-events {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background: #f8fafc;
  border-radius: 12rpx;
}

.event-time {
  font-size: 24rpx;
  color: #64748b;
  width: 100rpx;
}

.event-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.event-title {
  font-size: 26rpx;
  color: #1e293b;
}

.event-type {
  font-size: 20rpx;
  padding: 4rpx 10rpx;
  border-radius: 4rpx;

  &.sale {
    background: #dbeafe;
    color: #2563eb;
  }

  &.auction {
    background: #fef3c7;
    color: #d97706;
  }

  &.airdrop {
    background: #d1fae5;
    color: #059669;
  }

  &.event {
    background: #fce7f3;
    color: #be185d;
  }
}

.event-status {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;

  &.upcoming {
    background: #f1f5f9;
    color: #64748b;
  }

  &.ongoing {
    background: #d1fae5;
    color: #059669;
  }

  &.ended {
    background: #f3f4f6;
    color: #9ca3af;
  }
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
