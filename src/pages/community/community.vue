<template>
  <view class="community-container">
    <view class="header-section">
      <text class="page-title">💬 藏友动态</text>
    </view>

    <view class="tab-bar">
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'following' }"
        @click="activeTab = 'following'"
      >
        <text class="tab-icon">👥</text>
        <text class="tab-label">关注</text>
        <view class="tab-badge" v-if="followingCount > 0">{{ followingCount }}</view>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'hot' }"
        @click="activeTab = 'hot'"
      >
        <text class="tab-icon">🔥</text>
        <text class="tab-label">热门</text>
        <view class="tab-badge hot" v-if="hotCount > 0">{{ hotCount }}</view>
      </view>
    </view>

    <scroll-view scroll-y class="dynamic-list" @scrolltolower="loadMore">
      <view class="dynamic-feed">
        <view 
          class="dynamic-card" 
          v-for="(dynamic, index) in currentDynamics" 
          :key="dynamic.id"
          @click="expandDynamic(dynamic)"
        >
          <view class="card-header">
            <view class="user-info" @click.stop="showUserCard(dynamic.user)">
              <view class="user-avatar" :style="{ background: dynamic.user.avatarBg }">
                <text>{{ dynamic.user.avatar }}</text>
              </view>
              <view class="user-detail">
                <view class="user-name-row">
                  <text class="user-name">{{ dynamic.user.name }}</text>
                  <view class="user-level">Lv.{{ dynamic.user.level }}</view>
                  <view class="follow-btn" 
                    v-if="!dynamic.user.isFollowing"
                    @click.stop="toggleFollow(dynamic.user)"
                  >
                    + 关注
                  </view>
                  <view class="following-tag" v-else @click.stop="toggleFollow(dynamic.user)">
                    ✓ 已关注
                  </view>
                </view>
                <text class="dynamic-time">{{ dynamic.timeAgo }}</text>
              </view>
            </view>
            <view class="more-btn" @click.stop="showMoreOptions(dynamic)">
              <text>⋮</text>
            </view>
          </view>

          <view class="card-content">
            <view class="dynamic-title">{{ dynamic.title }}</view>
            <view class="dynamic-collection" v-if="dynamic.collection">
              <view class="collection-visual">
                <text class="collection-icon">{{ dynamic.collection.icon }}</text>
                <view class="collection-rank" v-if="dynamic.collection.rank">
                  #{{ dynamic.collection.rank }}
                </view>
              </view>
              <view class="collection-info">
                <text class="collection-name">{{ dynamic.collection.name }}</text>
                <view class="collection-meta">
                  <text class="collection-price">{{ dynamic.collection.price }}</text>
                  <text class="collection-artist">{{ dynamic.collection.artist }}</text>
                </view>
              </view>
            </view>
            <view class="dynamic-description" v-if="dynamic.description">
              {{ dynamic.description }}
            </view>
          </view>

          <view class="card-footer">
            <view class="interaction-item" @click.stop="toggleLike(dynamic)">
              <view class="like-btn" :class="{ liked: dynamic.isLiked }">
                <text class="heart-icon">{{ dynamic.isLiked ? '❤️' : '🤍' }}</text>
                <text class="interaction-count">{{ dynamic.likes }}</text>
              </view>
            </view>
            <view class="interaction-item" @click.stop="openComments(dynamic)">
              <text class="comment-icon">💬</text>
              <text class="interaction-count">{{ dynamic.comments }}</text>
            </view>
            <view class="interaction-item" @click.stop="shareDynamic(dynamic)">
              <text class="share-icon">↗️</text>
              <text class="interaction-count">分享</text>
            </view>
          </view>

          <view class="comment-section" v-if="dynamic.showComments">
            <view class="comment-input-bar">
              <input 
                class="comment-input" 
                :placeholder="'评论 '+ dynamic.user.name +'...'"
                v-model="commentText[dynamic.id]"
                @confirm="submitComment(dynamic)"
              />
              <view class="send-btn" @click="submitComment(dynamic)">
                <text>发送</text>
              </view>
            </view>
            <view class="comment-list">
              <view class="comment-item" v-for="(comment, cIndex) in dynamic.commentList" :key="cIndex">
                <view class="comment-user-avatar">
                  <text>{{ comment.avatar }}</text>
                </view>
                <view class="comment-content">
                  <view class="comment-header">
                    <text class="comment-user-name">{{ comment.name }}</text>
                    <text class="comment-time">{{ comment.time }}</text>
                  </view>
                  <text class="comment-text">{{ comment.content }}</text>
                  <view class="comment-actions">
                    <text class="reply-btn" @click="replyToComment(dynamic, comment)">回复</text>
                    <text class="like-count" v-if="comment.likes > 0">👍 {{ comment.likes }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="load-more" v-if="hasMore">
          <text @click="loadMore">加载更多</text>
        </view>

        <view class="empty-state" v-if="currentDynamics.length === 0">
          <text class="empty-icon">😢</text>
          <text class="empty-text">{{ activeTab === 'following' ? '还没有关注任何人' : '暂无热门动态' }}</text>
          <view class="empty-action" v-if="activeTab === 'following'" @click="activeTab = 'hot'">
            <text>去看看热门动态 →</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="user-card-modal" v-if="showUserModal" @click="closeUserModal">
      <view class="user-card" @click.stop="() => {}">
        <view class="card-close" @click="closeUserModal">×</view>
        <view class="user-card-header">
          <view class="user-card-avatar" :style="{ background: selectedUser?.avatarBg }">
            <text>{{ selectedUser?.avatar }}</text>
          </view>
          <view class="user-card-info">
            <text class="user-card-name">{{ selectedUser?.name }}</text>
            <view class="user-card-level">Lv.{{ selectedUser?.level }}</view>
          </view>
        </view>
        <view class="user-card-stats">
          <view class="stat-item">
            <text class="stat-value">{{ selectedUser?.collections || 0 }}</text>
            <text class="stat-label">收藏</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ selectedUser?.followers || 0 }}</text>
            <text class="stat-label">粉丝</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ selectedUser?.following || 0 }}</text>
            <text class="stat-label">关注</text>
          </view>
        </view>
        <view class="user-card-actions">
          <view class="action-btn primary" @click="toggleFollow(selectedUser)">
            {{ selectedUser?.isFollowing ? '取消关注' : '+ 关注' }}
          </view>
          <view class="action-btn secondary">
            查看主页
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'following' | 'hot'>('hot')
const showUserModal = ref(false)
const selectedUser = ref<any>(null)
const commentText = ref<Record<string, string>>({})
const hasMore = ref(true)
const followingCount = ref(3)
const hotCount = ref(12)

const followingDynamics = ref([
  {
    id: 'f1',
    user: { id: 'u1', name: '数字收藏家', avatar: '👨‍💻', level: 15, isFollowing: true, avatarBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', collections: 128, followers: 2340, following: 156 },
    title: '刚收藏了 🐼',
    collection: { name: '忒PANDA-Z世代', icon: '🐼', price: '¥2,500', artist: 'CCTV数藏', rank: 1 },
    timeAgo: '2分钟前',
    likes: 89,
    comments: 23,
    isLiked: false,
    showComments: false,
    commentList: [
      { avatar: '👩', name: '小艺', time: '1分钟前', content: '这个系列真的很好看！', likes: 12 },
      { avatar: '🧑', name: '藏友A', time: '30秒前', content: '恭喜入手！', likes: 5 }
    ]
  },
  {
    id: 'f2',
    user: { id: 'u2', name: '艺术爱好者', avatar: '👩‍🎨', level: 12, isFollowing: true, avatarBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', collections: 86, followers: 1560, following: 89 },
    title: '今日涨幅最大的藏品 🏛️',
    collection: { name: '敦煌秘境45窟', icon: '🏛️', price: '¥3,200', artist: '敦煌研究院', rank: 2 },
    timeAgo: '15分钟前',
    likes: 234,
    comments: 56,
    isLiked: true,
    showComments: false,
    commentList: []
  },
  {
    id: 'f3',
    user: { id: 'u3', name: '历史迷', avatar: '🧓', level: 18, isFollowing: true, avatarBg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', collections: 245, followers: 4560, following: 78 },
    title: '🎉 解锁成就 [青铜器收藏家]',
    description: '累计收藏青铜器系列藏品10件，获得独家称号',
    timeAgo: '30分钟前',
    likes: 567,
    comments: 89,
    isLiked: false,
    showComments: false,
    commentList: []
  }
])

const hotDynamics = ref([
  {
    id: 'h1',
    user: { id: 'h1', name: '市场分析师', avatar: '📊', level: 20, isFollowing: false, avatarBg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', collections: 312, followers: 12300, following: 234 },
    title: '🔥 今日最热藏品 TOP1',
    collection: { name: '忒PANDA-Z世代', icon: '🐼', price: '¥2,500', artist: 'CCTV数藏', rank: 1 },
    timeAgo: '5分钟前',
    likes: 2341,
    comments: 456,
    isLiked: false,
    showComments: false,
    commentList: [
      { avatar: '👨', name: '投资者', time: '3分钟前', content: '这涨幅也太猛了吧！', likes: 89 },
      { avatar: '👩', name: '收藏新手', time: '2分钟前', content: '还在观望中', likes: 45 }
    ]
  },
  {
    id: 'h2',
    user: { id: 'h2', name: '国风达人', avatar: '🏮', level: 16, isFollowing: false, avatarBg: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', collections: 189, followers: 8900, following: 145 },
    title: '刚入手 🗺️',
    collection: { name: '千里江山图', icon: '🗺️', price: '¥1,150', artist: '故宫博物院' },
    timeAgo: '10分钟前',
    likes: 1876,
    comments: 234,
    isLiked: true,
    showComments: false,
    commentList: []
  },
  {
    id: 'h3',
    user: { id: 'h3', name: '青铜器爱好者', avatar: '🏺', level: 14, isFollowing: false, avatarBg: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', collections: 98, followers: 5600, following: 67 },
    title: '收藏价值分析 📈',
    description: '红陶兽形器近期走势强劲，建议关注',
    timeAgo: '20分钟前',
    likes: 1234,
    comments: 189,
    isLiked: false,
    showComments: false,
    commentList: []
  },
  {
    id: 'h4',
    user: { id: 'h4', name: '新手小白', avatar: '🌱', level: 5, isFollowing: false, avatarBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', collections: 12, followers: 230, following: 45 },
    title: '👤 关注了 @博物馆君',
    description: '被推荐关注，很喜欢他的藏品推荐',
    timeAgo: '30分钟前',
    likes: 56,
    comments: 12,
    isLiked: false,
    showComments: false,
    commentList: []
  },
  {
    id: 'h5',
    user: { id: 'h5', name: '资深藏家', avatar: '💎', level: 25, isFollowing: false, avatarBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', collections: 567, followers: 23400, following: 89 },
    title: '成功售出 🏺',
    collection: { name: '后母戊鼎', icon: '🏺', price: '¥2,800', artist: '国家博物馆' },
    timeAgo: '45分钟前',
    likes: 3456,
    comments: 567,
    isLiked: false,
    showComments: false,
    commentList: []
  }
])

const currentDynamics = computed(() => {
  return activeTab.value === 'following' ? followingDynamics.value : hotDynamics.value
})

const toggleLike = (dynamic: any) => {
  dynamic.isLiked = !dynamic.isLiked
  dynamic.likes += dynamic.isLiked ? 1 : -1
}

const openComments = (dynamic: any) => {
  dynamic.showComments = !dynamic.showComments
}

const submitComment = (dynamic: any) => {
  const text = commentText.value[dynamic.id]
  if (!text?.trim()) return
  
  dynamic.commentList.push({
    avatar: '👤',
    name: '我',
    time: '刚刚',
    content: text.trim(),
    likes: 0
  })
  dynamic.comments++
  commentText.value[dynamic.id] = ''
  
  uni.showToast({ title: '评论成功', icon: 'success' })
}

const replyToComment = (dynamic: any, comment: any) => {
  commentText.value[dynamic.id] = `回复 @${comment.name}：`
}

const toggleFollow = (user: any) => {
  if (!user) return
  
  user.isFollowing = !user.isFollowing
  
  if (user.isFollowing) {
    followingCount.value++
    if (!followingDynamics.value.find(d => d.user.id === user.id)) {
      const hotDynamic = hotDynamics.value.find(d => d.user.id === user.id)
      if (hotDynamic) {
        followingDynamics.value.unshift({ ...hotDynamic })
      }
    }
    uni.showToast({ title: `已关注 ${user.name}`, icon: 'success' })
  } else {
    followingCount.value--
    followingDynamics.value = followingDynamics.value.filter(d => d.user.id !== user.id)
    uni.showToast({ title: `取消关注 ${user.name}`, icon: 'none' })
  }
}

const showUserCard = (user: any) => {
  selectedUser.value = user
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
  selectedUser.value = null
}

const expandDynamic = (dynamic: any) => {
  // 可以在这里添加展开详情逻辑
}

const showMoreOptions = (dynamic: any) => {
  uni.showActionSheet({
    itemList: ['举报', '不感兴趣', '分享'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.showToast({ title: '已举报', icon: 'none' })
      }
    }
  })
}

const shareDynamic = (dynamic: any) => {
  uni.showToast({ title: '分享功能', icon: 'none' })
}

const loadMore = () => {
  if (!hasMore.value) return
  uni.showToast({ title: '加载更多...', icon: 'none' })
  setTimeout(() => {
    hasMore.value = false
  }, 1000)
}
</script>

<style lang="scss" scoped>
.community-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
  padding-bottom: calc(env(safe-area-inset-bottom) + 140rpx);
}

.header-section {
  padding: 80rpx 32rpx 20rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.tab-bar {
  display: flex;
  gap: 16rpx;
  padding: 0 32rpx;
  margin-bottom: 20rpx;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 28rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 40rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: transparent;
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
  }
}

.tab-icon {
  font-size: 28rpx;
}

.tab-label {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
}

.tab-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 20rpx;
  padding: 2rpx 10rpx;
  border-radius: 20rpx;
  font-weight: 600;

  &.hot {
    background: rgba(239, 68, 68, 0.3);
  }
}

.dynamic-list {
  height: calc(100vh - 240rpx);
  padding: 0 32rpx;
}

.dynamic-feed {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 40rpx;
}

.dynamic-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.user-info {
  display: flex;
  gap: 16rpx;
  flex: 1;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  flex-shrink: 0;
}

.user-detail {
  flex: 1;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 6rpx;
}

.user-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}

.user-level {
  background: rgba(102, 126, 234, 0.3);
  color: #667eea;
  font-size: 18rpx;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  font-weight: 600;
}

.follow-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  font-weight: 500;
  margin-left: auto;
}

.following-tag {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  font-size: 20rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  font-weight: 500;
  margin-left: auto;
}

.dynamic-time {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.more-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.5);
}

.card-content {
  margin-bottom: 20rpx;
}

.dynamic-title {
  font-size: 28rpx;
  color: #fff;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.dynamic-collection {
  display: flex;
  gap: 16rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16rpx;
  padding: 16rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.collection-visual {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.collection-icon {
  font-size: 48rpx;
}

.collection-rank {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #fff;
  font-size: 18rpx;
  font-weight: 700;
  padding: 2rpx 8rpx;
  border-radius: 10rpx;
}

.collection-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
}

.collection-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #fff;
}

.collection-meta {
  display: flex;
  gap: 12rpx;
  align-items: center;
}

.collection-price {
  font-size: 24rpx;
  font-weight: 600;
  color: #10b981;
}

.collection-artist {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.dynamic-description {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.card-footer {
  display: flex;
  gap: 32rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  transition: transform 0.2s;

  &.liked {
    animation: heartBeat 0.3s ease;
  }
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.heart-icon, .comment-icon, .share-icon {
  font-size: 28rpx;
}

.interaction-count {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

.comment-section {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.comment-input-bar {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.comment-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40rpx;
  padding: 16rpx 24rpx;
  font-size: 26rpx;
  color: #fff;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.send-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 16rpx 28rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
  font-weight: 500;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.comment-item {
  display: flex;
  gap: 12rpx;
}

.comment-user-avatar {
  width: 48rpx;
  height: 48rpx;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 6rpx;
}

.comment-user-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #667eea;
}

.comment-time {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.4);
}

.comment-text {
  display: block;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin-bottom: 8rpx;
}

.comment-actions {
  display: flex;
  gap: 20rpx;
}

.reply-btn, .like-count {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.load-more {
  text-align: center;
  padding: 40rpx;
  
  text {
    font-size: 28rpx;
    color: #667eea;
    padding: 16rpx 32rpx;
    background: rgba(102, 126, 234, 0.2);
    border-radius: 40rpx;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24rpx;
}

.empty-action {
  text {
    font-size: 26rpx;
    color: #667eea;
    padding: 12rpx 24rpx;
    background: rgba(102, 126, 234, 0.2);
    border-radius: 20rpx;
  }
}

.user-card-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.user-card {
  width: 100%;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24rpx;
  padding: 32rpx;
  position: relative;
}

.card-close {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  font-size: 48rpx;
  color: rgba(255, 255, 255, 0.5);
}

.user-card-header {
  display: flex;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.user-card-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
}

.user-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
}

.user-card-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

.user-card-level {
  background: rgba(102, 126, 234, 0.3);
  color: #667eea;
  font-size: 20rpx;
  padding: 4rpx 16rpx;
  border-radius: 10rpx;
  width: fit-content;
  font-weight: 600;
}

.user-card-stats {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  margin-bottom: 24rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.user-card-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  text-align: center;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    border: 1rpx solid rgba(255, 255, 255, 0.1);
  }
}
</style>
