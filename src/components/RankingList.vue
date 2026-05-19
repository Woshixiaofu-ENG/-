<template>
  <view class="ranking-container">
    <view class="ranking-header">
      <view class="header-left">
        <text class="title">行情榜单</text>
        <text class="subtitle">TOP 20</text>
      </view>
      <view class="header-right" @click="goToRanking">
        <text>查看完整榜单</text>
        <text class="arrow">→</text>
      </view>
    </view>

    <view class="ranking-table">
      <view class="table-header">
        <text class="col-rank">排名</text>
        <text class="col-name">藏品名称</text>
        <text class="col-volume">24h交易额</text>
        <text class="col-count">24h交易量</text>
        <text class="col-circulation">流通数量</text>
      </view>

      <view 
        class="table-row" 
        v-for="item in displayList" 
        :key="item.id"
        @click="goToDetail(item)"
      >
        <view class="col-rank">
          <view class="rank-badge" :class="getRankClass(item.rank)">
            {{ item.rank }}
          </view>
        </view>
        <view class="col-name">
          <text class="name-text">{{ item.name }}</text>
        </view>
        <view class="col-volume">
          <text :class="getChangeClass(item.change)">{{ item.volume24h }}</text>
        </view>
        <view class="col-count">{{ item.count24h }}</view>
        <view class="col-circulation">{{ item.circulation }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { rankingList } from '@/data/mockData'
import type { CollectionItem } from '@/data/types'

const displayList = computed(() => rankingList.slice(0, 10))

const getRankClass = (rank: number) => {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return ''
}

const getChangeClass = (change?: string) => {
  if (!change) return ''
  return change.startsWith('+') ? 'positive' : 'negative'
}

const goToRanking = () => {
  uni.navigateTo({ url: '/pages/ranking/ranking' })
}

const goToDetail = (item: CollectionItem) => {
  uni.navigateTo({ url: `/pages/detail/detail?id=${item.id}` })
}
</script>

<style lang="scss" scoped>
.ranking-container {
  background: #fff;
  border-radius: 16rpx;
  margin: 20rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f1f5f9;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}

.title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e293b;
}

.subtitle {
  font-size: 24rpx;
  color: #94a3b8;
  background: #f1f5f9;
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

.ranking-table {
  overflow: hidden;
}

.table-header {
  display: flex;
  padding: 16rpx 12rpx;
  background: #f8fafc;
  border-radius: 8rpx;
  margin-bottom: 8rpx;
}

.table-row {
  display: flex;
  align-items: center;
  padding: 20rpx 12rpx;
  border-bottom: 1rpx solid #f1f5f9;
  transition: background 0.2s;

  &:active {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
}

.col-rank {
  width: 60rpx;
  text-align: center;
}

.rank-badge {
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  border-radius: 50%;
  font-size: 22rpx;
  font-weight: 600;
  background: #e2e8f0;
  color: #64748b;
  display: inline-block;

  &.gold {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #fff;
  }

  &.silver {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    color: #fff;
  }

  &.bronze {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    color: #fff;
  }
}

.col-name {
  flex: 1;
  padding: 0 12rpx;
}

.name-text {
  font-size: 26rpx;
  color: #1e293b;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-volume {
  width: 140rpx;
  text-align: right;
  font-size: 26rpx;
  font-weight: 500;
  color: #1e293b;

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }
}

.col-count, .col-circulation {
  width: 100rpx;
  text-align: right;
  font-size: 26rpx;
  color: #64748b;
}
</style>
