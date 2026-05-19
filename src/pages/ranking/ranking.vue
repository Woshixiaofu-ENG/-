<template>
  <view class="page-container">
    <view class="filter-bar">
      <view class="filter-tabs">
        <view 
          class="filter-tab" 
          :class="{ active: activeTab === 'volume' }"
          @click="activeTab = 'volume'"
        >
          <text>交易额</text>
        </view>
        <view 
          class="filter-tab" 
          :class="{ active: activeTab === 'count' }"
          @click="activeTab = 'count'"
        >
          <text>交易量</text>
        </view>
        <view 
          class="filter-tab" 
          :class="{ active: activeTab === 'circulation' }"
          @click="activeTab = 'circulation'"
        >
          <text>流通量</text>
        </view>
      </view>
      <view class="sort-btn" @click="toggleSort">
        <text>{{ sortOrder === 'desc' ? '↓ 降序' : '↑ 升序' }}</text>
      </view>
    </view>

    <view class="ranking-list">
      <view class="list-header">
        <text class="col-rank">排名</text>
        <text class="col-name">藏品名称</text>
        <text class="col-volume">24h交易额</text>
        <text class="col-count">24h交易量</text>
        <text class="col-circulation">流通数量</text>
      </view>

      <view 
        class="list-row" 
        v-for="item in sortedList" 
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
          <text>{{ item.volume24h }}</text>
        </view>
        <view class="col-count">{{ item.count24h }}</view>
        <view class="col-circulation">{{ item.circulation }}</view>
      </view>
    </view>

    <view class="load-more" v-if="hasMore">
      <view class="load-btn" @click="loadMore">
        <text>加载更多</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { rankingList } from '@/data/mockData'
import type { CollectionItem } from '@/data/types'

const activeTab = ref('volume')
const sortOrder = ref<'asc' | 'desc'>('desc')
const hasMore = ref(false)

const sortedList = computed(() => {
  const list = [...rankingList]
  return list.sort((a, b) => {
    let valA: number, valB: number
    
    if (activeTab.value === 'volume') {
      valA = a.volume24hNum
      valB = b.volume24hNum
    } else if (activeTab.value === 'count') {
      valA = a.count24h
      valB = b.count24h
    } else {
      valA = a.circulation
      valB = b.circulation
    }
    
    return sortOrder.value === 'asc' ? valA - valB : valB - valA
  })
})

const getRankClass = (rank: number) => {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return ''
}

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

const goToDetail = (item: CollectionItem) => {
  uni.navigateTo({ url: `/pages/detail/detail?id=${item.id}` })
}

const loadMore = () => {
  uni.showToast({ title: '已加载全部', icon: 'none' })
  hasMore.value = false
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 20rpx 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.filter-tabs {
  display: flex;
  gap: 16rpx;
}

.filter-tab {
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #64748b;
  background: #f1f5f9;
  transition: all 0.2s;

  &.active {
    background: #1e88e5;
    color: #fff;
  }
}

.sort-btn {
  font-size: 26rpx;
  color: #64748b;
  padding: 12rpx 20rpx;
  background: #f1f5f9;
  border-radius: 8rpx;
}

.ranking-list {
  background: #fff;
  margin: 0 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.list-header {
  display: flex;
  padding: 20rpx 16rpx;
  background: #f8fafc;
  border-bottom: 1rpx solid #e2e8f0;
}

.list-row {
  display: flex;
  align-items: center;
  padding: 20rpx 16rpx;
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
  font-size: 24rpx;
  color: #64748b;
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
  font-size: 24rpx;
  color: #64748b;
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
}

.col-count, .col-circulation {
  width: 100rpx;
  text-align: right;
  font-size: 26rpx;
  color: #64748b;
}

.load-more {
  padding: 40rpx;
  text-align: center;
}

.load-btn {
  display: inline-block;
  padding: 20rpx 48rpx;
  background: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
  color: #64748b;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}
</style>
