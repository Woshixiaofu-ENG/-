<template>
  <view class="page-container">
    <view class="custom-navbar">
      <text class="navbar-title">寄售市场</text>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索藏品名称或ID" 
          v-model="searchKeyword"
          @confirm="handleSearch"
        />
      </view>
      <view class="search-btn" @click="handleSearch">
        <text>搜索</text>
      </view>
    </view>

    <view class="filter-tabs">
      <scroll-view scroll-x class="tabs-scroll">
        <view class="tabs-inner">
          <view 
            class="tab-item" 
            :class="{ active: activeTab === tab.key }" 
            v-for="tab in tabs" 
            :key="tab.key"
            @click="activeTab = tab.key"
          >
            <text>{{ tab.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="market-table">
      <view class="table-header">
        <text class="col-rank">序号</text>
        <text class="col-name">藏品名称</text>
        <view class="col-right">
          <text class="col-item" :class="{ active: sortKey === 'volume' }" @click="sortBy('volume')">
            {{ activeTab === 'yesterday' ? '昨日交易额' : '7天交易额' }}
            <text class="sort-icon">{{ sortKey === 'volume' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}</text>
          </text>
          <text class="col-item" :class="{ active: sortKey === 'count' }" @click="sortBy('count')">
            {{ activeTab === 'yesterday' ? '昨日交易量' : '7天交易量' }}
            <text class="sort-icon">{{ sortKey === 'count' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}</text>
          </text>
        </view>
      </view>

      <view class="table-body">
        <view 
          class="table-row" 
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
          <view class="col-right">
            <text class="col-item volume">{{ activeTab === 'yesterday' ? item.yesterdayVolume : item.weekVolume }}</text>
            <text class="col-item count">{{ activeTab === 'yesterday' ? item.yesterdayCount : item.weekCount }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="risk-warning">
      <text class="warning-icon">⚠️</text>
      <text class="warning-text">数据仅供参考，不构成投资建议</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { marketList } from '@/data/mockData'
import type { MarketItem } from '@/data/types'

const searchKeyword = ref('')
const activeTab = ref('yesterday')
const sortKey = ref('volume')
const sortOrder = ref<'asc' | 'desc'>('desc')

const tabs = [
  { key: 'yesterday', label: '昨日数据' },
  { key: 'week', label: '7天数据' },
  { key: 'month', label: '30天数据' }
]

const filteredList = computed(() => {
  if (!searchKeyword.value) return marketList
  const keyword = searchKeyword.value.toLowerCase()
  return marketList.filter(item => 
    item.name.toLowerCase().includes(keyword) || 
    item.id.includes(keyword)
  )
})

const sortedList = computed(() => {
  const list = [...filteredList.value]
  return list.sort((a, b) => {
    let valA: number, valB: number
    
    if (sortKey.value === 'volume') {
      const volumeA = activeTab.value === 'yesterday' ? a.yesterdayVolume : a.weekVolume || '0'
      const volumeB = activeTab.value === 'yesterday' ? b.yesterdayVolume : b.weekVolume || '0'
      valA = parseFloat(volumeA.replace(/[¥,万]/g, '')) * (volumeA.includes('万') ? 10000 : 1)
      valB = parseFloat(volumeB.replace(/[¥,万]/g, '')) * (volumeB.includes('万') ? 10000 : 1)
    } else {
      valA = activeTab.value === 'yesterday' ? a.yesterdayCount : (a.weekCount || 0)
      valB = activeTab.value === 'yesterday' ? b.yesterdayCount : (b.weekCount || 0)
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

const sortBy = (key: 'volume' | 'count') => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
}

const handleSearch = () => {
  uni.showToast({ title: `搜索: ${searchKeyword.value}`, icon: 'none' })
}

const goToDetail = (item: MarketItem) => {
  uni.navigateTo({ url: `/pages/detail/detail?id=${item.id}` })
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
  padding: 80rpx 32rpx 32rpx;
}

.navbar-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
}

.search-bar {
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 12rpx;
  padding: 0 20rpx;
}

.search-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  height: 72rpx;
  font-size: 28rpx;
}

.search-btn {
  background: #1e88e5;
  color: #fff;
  padding: 0 32rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.filter-tabs {
  background: #fff;
  margin: 0 20rpx;
  border-radius: 16rpx;
  padding: 16rpx 0;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.tabs-scroll {
  white-space: nowrap;
}

.tabs-inner {
  display: inline-flex;
  gap: 24rpx;
  padding: 0 24rpx;
}

.tab-item {
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

.market-table {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.table-header {
  display: flex;
  align-items: center;
  padding: 20rpx 16rpx;
  background: #f8fafc;
  border-bottom: 1rpx solid #e2e8f0;
}

.col-rank {
  width: 60rpx;
  text-align: center;
  font-size: 24rpx;
  color: #64748b;
}

.col-name {
  flex: 1;
  font-size: 24rpx;
  color: #64748b;
}

.col-right {
  display: flex;
  gap: 24rpx;
}

.col-item {
  font-size: 24rpx;
  color: #64748b;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
  transition: all 0.2s;

  &.active {
    background: #dbeafe;
    color: #2563eb;
  }
}

.sort-icon {
  font-size: 20rpx;
  margin-left: 4rpx;
}

.table-body {
  max-height: 800rpx;
  overflow-y: auto;
}

.table-row {
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

.name-text {
  font-size: 26rpx;
  color: #1e293b;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-item.volume {
  color: #1e293b;
  font-weight: 500;
}

.col-item.count {
  color: #64748b;
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
