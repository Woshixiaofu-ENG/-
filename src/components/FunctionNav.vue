<template>
  <view class="function-nav">
    <view class="nav-item" v-for="(item, index) in navItems" :key="index" @click="handleClick(item)">
      <view class="nav-icon" :style="{ background: item.bgColor }">
        <text class="icon-text">{{ item.icon }}</text>
      </view>
      <text class="nav-label">{{ item.label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const navItems = [
  { label: '每月统计', icon: '📊', bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', url: '/pages/stats/monthly' },
  { label: '每周统计', icon: '📈', bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', url: '/pages/stats/weekly' },
  { label: '中传日历', icon: '📅', bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', url: '/pages/calendar/calendar' },
  { label: '竞拍统计', icon: '🏆', bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', url: '/pages/auction/auction' },
  { label: '我的持仓', icon: '💰', bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', url: '/pages/mine/mine' },
  { label: '预警设置', icon: '🔔', bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', url: '/pages/mine/mine?tab=alert' }
]

const handleClick = (item: { url: string }) => {
  uni.navigateTo({ url: item.url })
}
</script>

<style lang="scss" scoped>
.function-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  padding: 24rpx 20rpx;
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.nav-item {
  width: calc(33.33% - 14rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 0;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.95);
  }
}

.nav-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 40rpx;
}

.nav-label {
  font-size: 24rpx;
  color: #475569;
}
</style>
