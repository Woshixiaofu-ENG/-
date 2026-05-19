<template>
  <view class="stats-card">
    <view class="stats-item" v-for="(item, index) in statsList" :key="index" @click="handleClick(item)">
      <view class="stats-label">{{ item.label }}</view>
      <view class="stats-value" :class="{ 'positive': item.positive, 'negative': item.negative }">
        {{ item.value }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { collectionStats } from '@/data/mockData'

const props = defineProps<{
  type?: 'full' | 'compact'
}>()

const statsList = computed(() => {
  const fullList = [
    { label: '寄售藏品总数', value: collectionStats.consignmentTotal, key: 'consignment' },
    { label: '链上藏品总数', value: collectionStats.chainTotal, key: 'chain' },
    { label: '寄售率', value: collectionStats.consignmentRate, key: 'rate' },
    { label: '发售总额', value: collectionStats.salesTotal, key: 'sales' },
    { label: '链上总值', value: collectionStats.chainValue, key: 'value' },
    { label: '溢价率', value: collectionStats.premiumRate, key: 'premium', positive: true },
    { label: '持仓人数', value: collectionStats.holderCount, key: 'holders' }
  ]
  return props.type === 'compact' ? fullList.slice(0, 6) : fullList
})

const handleClick = (item: { key: string }) => {
  uni.showToast({ title: `查看${item.key}详情`, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.stats-card {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  margin: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.stats-item {
  width: calc(33.33% - 12rpx);
  padding: 20rpx 16rpx;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12rpx;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:active {
    transform: scale(0.98);
    box-shadow: inset 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  }
}

.stats-label {
  font-size: 22rpx;
  color: #64748b;
  margin-bottom: 8rpx;
}

.stats-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e293b;

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }
}
</style>
