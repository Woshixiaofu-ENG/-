<template>
  <view class="page-container">
    <view class="calendar-header">
      <view class="month-nav">
        <view class="nav-btn" @click="prevMonth">
          <text>←</text>
        </view>
        <text class="current-month">2026年5月</text>
        <view class="nav-btn" @click="nextMonth">
          <text>→</text>
        </view>
      </view>
    </view>

    <view class="calendar-grid">
      <view class="weekday-row">
        <text class="weekday" v-for="day in weekdays" :key="day">{{ day }}</text>
      </view>
      <view class="dates-grid">
        <view 
          class="date-cell" 
          v-for="(date, index) in calendarDates" 
          :key="index"
          :class="{ 
            'other-month': date.otherMonth,
            'today': date.isToday,
            'has-event': date.hasEvent,
            'selected': date.date === selectedDate
          }"
          @click="selectDate(date)"
        >
          <text class="date-num">{{ date.day }}</text>
          <view class="event-dots" v-if="date.hasEvent">
            <view class="dot" v-for="i in date.eventCount" :key="i"></view>
          </view>
        </view>
      </view>
    </view>

    <view class="events-section">
      <view class="section-header">
        <text class="section-title">📅 {{ selectedDateText }}的活动</text>
      </view>
      <view class="events-list" v-if="selectedEvents.length > 0">
        <view class="event-card" v-for="event in selectedEvents" :key="event.id">
          <view class="event-time">
            <text class="time-icon">🕐</text>
            <text class="time-text">{{ event.time }}</text>
          </view>
          <view class="event-content">
            <text class="event-title">{{ event.title }}</text>
            <view class="event-tags">
              <view class="tag" :class="event.type">
                {{ getTypeText(event.type) }}
              </view>
              <view class="tag" :class="'status-' + event.status">
                {{ getStatusText(event.status) }}
              </view>
            </view>
          </view>
          <view class="event-action">
            <view class="action-btn" @click="handleEventClick(event)">
              <text>查看</text>
            </view>
          </view>
        </view>
      </view>
      <view class="empty-state" v-else>
        <text class="empty-icon">📭</text>
        <text class="empty-text">当天暂无活动</text>
      </view>
    </view>

    <view class="legend-section">
      <view class="legend-header">
        <text class="legend-title">图例说明</text>
      </view>
      <view class="legend-items">
        <view class="legend-item">
          <view class="legend-dot sale"></view>
          <text class="legend-text">发售</text>
        </view>
        <view class="legend-item">
          <view class="legend-dot auction"></view>
          <text class="legend-text">竞拍</text>
        </view>
        <view class="legend-item">
          <view class="legend-dot airdrop"></view>
          <text class="legend-text">空投</text>
        </view>
        <view class="legend-item">
          <view class="legend-dot event"></view>
          <text class="legend-text">活动</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { calendarEvents } from '@/data/mockData'

const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const selectedDate = ref('2026-05-20')

const calendarDates = ref([
  { day: 27, otherMonth: true, hasEvent: false, eventCount: 0, date: '2026-04-27' },
  { day: 28, otherMonth: true, hasEvent: false, eventCount: 0, date: '2026-04-28' },
  { day: 29, otherMonth: true, hasEvent: false, eventCount: 0, date: '2026-04-29' },
  { day: 30, otherMonth: true, hasEvent: false, eventCount: 0, date: '2026-04-30' },
  { day: 1, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-01' },
  { day: 2, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-02' },
  { day: 3, otherMonth: false, hasEvent: true, eventCount: 1, date: '2026-05-03' },
  { day: 4, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-04' },
  { day: 5, otherMonth: false, hasEvent: true, eventCount: 2, date: '2026-05-05' },
  { day: 6, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-06' },
  { day: 7, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-07' },
  { day: 8, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-08' },
  { day: 9, otherMonth: false, hasEvent: true, eventCount: 1, date: '2026-05-09' },
  { day: 10, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-10' },
  { day: 11, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-11' },
  { day: 12, otherMonth: false, hasEvent: true, eventCount: 1, date: '2026-05-12' },
  { day: 13, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-13' },
  { day: 14, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-14' },
  { day: 15, otherMonth: false, hasEvent: true, eventCount: 2, date: '2026-05-15' },
  { day: 16, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-16' },
  { day: 17, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-17' },
  { day: 18, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-18' },
  { day: 19, otherMonth: false, hasEvent: true, eventCount: 1, date: '2026-05-19' },
  { day: 20, otherMonth: false, hasEvent: true, eventCount: 3, date: '2026-05-20', isToday: true },
  { day: 21, otherMonth: false, hasEvent: true, eventCount: 2, date: '2026-05-21' },
  { day: 22, otherMonth: false, hasEvent: true, eventCount: 1, date: '2026-05-22' },
  { day: 23, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-23' },
  { day: 24, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-24' },
  { day: 25, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-25' },
  { day: 26, otherMonth: false, hasEvent: true, eventCount: 1, date: '2026-05-26' },
  { day: 27, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-27' },
  { day: 28, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-28' },
  { day: 29, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-29' },
  { day: 30, otherMonth: false, hasEvent: false, eventCount: 0, date: '2026-05-30' },
  { day: 31, otherMonth: false, hasEvent: true, eventCount: 1, date: '2026-05-31' },
  { day: 1, otherMonth: true, hasEvent: false, eventCount: 0, date: '2026-06-01' },
  { day: 2, otherMonth: true, hasEvent: false, eventCount: 0, date: '2026-06-02' },
  { day: 3, otherMonth: true, hasEvent: false, eventCount: 0, date: '2026-06-03' },
  { day: 4, otherMonth: true, hasEvent: false, eventCount: 0, date: '2026-06-04' },
  { day: 5, otherMonth: true, hasEvent: false, eventCount: 0, date: '2026-06-05' },
  { day: 6, otherMonth: true, hasEvent: false, eventCount: 0, date: '2026-06-06' }
])

const selectedDateText = computed(() => {
  const date = new Date(selectedDate.value)
  return `${date.getMonth() + 1}月${date.getDate()}日`
})

const selectedEvents = computed(() => {
  const dayEvents = calendarEvents.find(item => item.date === selectedDate.value)
  return dayEvents?.events || []
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

const prevMonth = () => {
  uni.showToast({ title: '上月', icon: 'none' })
}

const nextMonth = () => {
  uni.showToast({ title: '下月', icon: 'none' })
}

const selectDate = (date: { date: string }) => {
  selectedDate.value = date.date
}

const handleEventClick = (event: { title: string }) => {
  uni.showToast({ title: `查看: ${event.title}`, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
}

.calendar-header {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.month-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-btn {
  width: 64rpx;
  height: 64rpx;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #64748b;
}

.current-month {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e293b;
}

.calendar-grid {
  background: #fff;
  margin: 0 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.weekday-row {
  display: flex;
  margin-bottom: 16rpx;
}

.weekday {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  color: #64748b;
  font-weight: 500;
}

.dates-grid {
  display: flex;
  flex-wrap: wrap;
}

.date-cell {
  width: calc(14.28% - 2rpx);
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  transition: all 0.2s;
  position: relative;

  &.other-month {
    .date-num {
      color: #cbd5e1;
    }
  }

  &.today {
    background: #dbeafe;
    
    .date-num {
      color: #2563eb;
      font-weight: 600;
    }
  }

  &.has-event {
    &:not(.other-month) {
      background: #fef3c7;
    }
  }

  &.selected {
    background: #1e88e5;
    
    .date-num {
      color: #fff;
    }
  }

  &:active {
    transform: scale(0.95);
  }
}

.date-num {
  font-size: 28rpx;
  color: #1e293b;
}

.event-dots {
  display: flex;
  gap: 4rpx;
  margin-top: 4rpx;
}

.dot {
  width: 8rpx;
  height: 8rpx;
  background: #f59e0b;
  border-radius: 50%;
}

.events-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1e293b;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.event-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: #f8fafc;
  border-radius: 12rpx;
}

.event-time {
  display: flex;
  align-items: center;
  gap: 8rpx;
  width: 120rpx;
}

.time-icon {
  font-size: 24rpx;
}

.time-text {
  font-size: 24rpx;
  color: #64748b;
}

.event-content {
  flex: 1;
}

.event-title {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8rpx;
}

.event-tags {
  display: flex;
  gap: 8rpx;
}

.tag {
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

  &.status-upcoming {
    background: #f1f5f9;
    color: #64748b;
  }

  &.status-ongoing {
    background: #d1fae5;
    color: #059669;
  }

  &.status-ended {
    background: #f3f4f6;
    color: #9ca3af;
  }
}

.event-action {
  margin-left: auto;
}

.action-btn {
  background: #1e88e5;
  color: #fff;
  padding: 12rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
}

.empty-icon {
  font-size: 64rpx;
  margin-bottom: 16rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #94a3b8;
}

.legend-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.legend-header {
  margin-bottom: 16rpx;
}

.legend-title {
  font-size: 26rpx;
  font-weight: 500;
  color: #64748b;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.legend-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 4rpx;

  &.sale {
    background: #dbeafe;
  }

  &.auction {
    background: #fef3c7;
  }

  &.airdrop {
    background: #d1fae5;
  }

  &.event {
    background: #fce7f3;
  }
}

.legend-text {
  font-size: 24rpx;
  color: #64748b;
}
</style>
