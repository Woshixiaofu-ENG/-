<template>
  <view class="admin-container">
    <view class="header-section">
      <text class="page-title">⚙️ 数据管理后台</text>
    </view>

    <view class="tabs-bar">
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'collections' }"
        @click="activeTab = 'collections'"
      >
        藏品管理
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'users' }"
        @click="activeTab = 'users'"
      >
        用户管理
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'settings' }"
        @click="activeTab = 'settings'"
      >
        系统设置
      </view>
    </view>

    <scroll-view scroll-y class="content-area">
      <!-- 藏品管理 -->
      <view v-if="activeTab === 'collections'" class="collections-management">
        <view class="action-buttons">
          <view class="btn btn-primary" @click="showAddModal = true">
            ➕ 添加藏品
          </view>
          <view class="btn btn-secondary" @click="refreshData">
            🔄 刷新数据
          </view>
        </view>

        <view class="collections-list">
          <view 
            class="collection-item"
            v-for="collection in collections" 
            :key="collection.id"
          >
            <view class="collection-icon">{{ collection.icon }}</view>
            <view class="collection-info">
              <view class="collection-name">{{ collection.name }}</view>
              <view class="collection-meta">
                <text class="artist">{{ collection.artist }}</text>
                <text class="price">{{ collection.price }}</text>
              </view>
            </view>
            <view class="collection-actions">
              <view class="action-btn edit" @click="editCollection(collection)">
                ✏️
              </view>
              <view class="action-btn delete" @click="deleteCollection(collection.id)">
                🗑️
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 用户管理 -->
      <view v-if="activeTab === 'users'" class="users-management">
        <view class="stats-cards">
          <view class="stat-card">
            <text class="stat-value">{{ collections.length }}</text>
            <text class="stat-label">藏品总数</text>
          </view>
          <view class="stat-card">
            <text class="stat-value">2,340</text>
            <text class="stat-label">用户数</text>
          </view>
          <view class="stat-card">
            <text class="stat-value">567</text>
            <text class="stat-label">今日活跃</text>
          </view>
        </view>
      </view>

      <!-- 系统设置 -->
      <view v-if="activeTab === 'settings'" class="settings-management">
        <view class="settings-group">
          <text class="group-title">数据源配置</text>
          
          <view class="setting-item">
            <view class="setting-label">当前数据源</view>
            <view class="setting-value">模拟数据 (Mock)</view>
          </view>

          <view class="setting-item">
            <view class="setting-label">数据缓存时长</view>
            <view class="setting-value">5 分钟</view>
          </view>

          <view class="setting-item">
            <view class="setting-label">缓存状态</view>
            <view class="setting-value">
              {{ cacheSize }} 条记录
            </view>
          </view>
        </view>

        <view class="settings-group">
          <text class="group-title">系统操作</text>
          
          <view class="setting-item">
            <view class="setting-label">清理缓存</view>
            <view class="btn btn-small" @click="clearCache">
              立即清理
            </view>
          </view>

          <view class="setting-item">
            <view class="setting-label">数据导出</view>
            <view class="btn btn-small" @click="exportData">
              导出JSON
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 添加/编辑藏品弹窗 -->
    <view class="modal" v-if="showAddModal" @click="showAddModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ editingCollection ? '编辑藏品' : '添加藏品' }}</text>
          <text class="modal-close" @click="showAddModal = false">×</text>
        </view>
        
        <view class="modal-body">
          <view class="form-item">
            <text class="form-label">藏品名称</text>
            <input 
              class="form-input" 
              v-model="formData.name" 
              placeholder="请输入藏品名称"
            />
          </view>

          <view class="form-item">
            <text class="form-label">艺术家/发行方</text>
            <input 
              class="form-input" 
              v-model="formData.artist" 
              placeholder="请输入发行方"
            />
          </view>

          <view class="form-item">
            <text class="form-label">价格</text>
            <input 
              class="form-input" 
              v-model="formData.price" 
              placeholder="¥0.00"
            />
          </view>

          <view class="form-item">
            <text class="form-label">图标</text>
            <input 
              class="form-input" 
              v-model="formData.icon" 
              placeholder="emoji图标"
            />
          </view>

          <view class="form-item">
            <text class="form-label">涨幅</text>
            <input 
              class="form-input" 
              v-model="formData.change" 
              placeholder="+5.0%"
            />
          </view>

          <view class="form-item">
            <text class="form-label">AI评分</text>
            <input 
              class="form-input" 
              v-model="formData.aiScore" 
              type="number"
              placeholder="0-100"
            />
          </view>
        </view>

        <view class="modal-footer">
          <view class="btn btn-cancel" @click="showAddModal = false">取消</view>
          <view class="btn btn-primary" @click="saveCollection">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { dataService } from '../../data/dataService';
import type { Collection } from '../../data/types';

const activeTab = ref<'collections' | 'users' | 'settings'>('collections');
const collections = ref<Collection[]>([]);
const showAddModal = ref(false);
const editingCollection = ref<Collection | null>(null);
const formData = ref({
  name: '',
  artist: '',
  price: '',
  icon: '🎨',
  change: '+0%',
  changeType: 'up' as 'up' | 'down',
  aiScore: 80
});

const cacheSize = computed(() => {
  // 模拟缓存大小
  return 24;
});

onMounted(async () => {
  await loadCollections();
});

async function loadCollections() {
  collections.value = await dataService.getHotCollections();
}

function refreshData() {
  dataService.refreshData();
  loadCollections();
  uni.showToast({ title: '数据已刷新', icon: 'success' });
}

function editCollection(collection: Collection) {
  editingCollection.value = collection;
  formData.value = {
    name: collection.name,
    artist: collection.artist,
    price: collection.price,
    icon: collection.icon,
    change: collection.change,
    changeType: collection.changeType,
    aiScore: collection.aiScore || 80
  };
  showAddModal.value = true;
}

function deleteCollection(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个藏品吗？',
    success: (res) => {
      if (res.confirm) {
        collections.value = collections.value.filter(c => c.id !== id);
        uni.showToast({ title: '删除成功', icon: 'success' });
      }
    }
  });
}

function saveCollection() {
  if (!formData.value.name || !formData.value.artist) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' });
    return;
  }

  if (editingCollection.value) {
    const index = collections.value.findIndex(c => c.id === editingCollection.value!.id);
    if (index > -1) {
      collections.value[index] = {
        ...collections.value[index],
        ...formData.value,
        priceNum: parseFloat(formData.value.price.replace(/[^0-9.]/g, '')) || 0
      };
    }
  } else {
    const newCollection: Collection = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData.value,
      description: '',
      priceNum: parseFloat(formData.value.price.replace(/[^0-9.]/g, '')) || 0,
      tags: [],
      volume: '¥0',
      volumeNum: 0
    };
    collections.value.unshift(newCollection);
  }

  showAddModal.value = false;
  editingCollection.value = null;
  resetForm();
  uni.showToast({ title: '保存成功', icon: 'success' });
}

function resetForm() {
  formData.value = {
    name: '',
    artist: '',
    price: '',
    icon: '🎨',
    change: '+0%',
    changeType: 'up',
    aiScore: 80
  };
}

function clearCache() {
  dataService.clearCache();
  uni.showToast({ title: '缓存已清理', icon: 'success' });
}

function exportData() {
  const data = {
    collections: collections.value,
    exportTime: new Date().toISOString()
  };
  const jsonStr = JSON.stringify(data, null, 2);
  uni.showToast({ title: '导出功能开发中', icon: 'none' });
  console.log('Export Data:', jsonStr);
}
</script>

<style lang="scss" scoped>
.admin-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%);
  padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
}

.header-section {
  padding: 80rpx 32rpx 20rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.tabs-bar {
  display: flex;
  gap: 12rpx;
  padding: 20rpx 32rpx;
}

.tab-item {
  padding: 16rpx 32rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 40rpx;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s;

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-weight: 500;
  }
}

.content-area {
  height: calc(100vh - 280rpx);
  padding: 0 32rpx;
}

.action-buttons {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.btn {
  padding: 20rpx 32rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s;

  &.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
  }

  &.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
    border: 1rpx solid rgba(255, 255, 255, 0.1);
  }

  &.btn-small {
    padding: 12rpx 24rpx;
    font-size: 24rpx;
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
  }

  &.btn-cancel {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    border: 1rpx solid rgba(255, 255, 255, 0.1);
  }
}

.collections-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.collection-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: rgba(255, 255, 255, 0.05);
  padding: 24rpx;
  border-radius: 16rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.collection-icon {
  width: 80rpx;
  height: 80rpx;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  flex-shrink: 0;
}

.collection-info {
  flex: 1;
}

.collection-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
  margin-bottom: 8rpx;
}

.collection-meta {
  display: flex;
  gap: 16rpx;
}

.artist {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.price {
  font-size: 24rpx;
  font-weight: 600;
  color: #10b981;
}

.collection-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  width: 56rpx;
  height: 56rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;

  &.edit {
    background: rgba(66, 153, 225, 0.2);
  }

  &.delete {
    background: rgba(239, 68, 68, 0.2);
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16rpx;
  padding: 32rpx 16rpx;
  text-align: center;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.stat-value {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.settings-group {
  margin-bottom: 40rpx;
}

.group-title {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20rpx;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 24rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.setting-label {
  font-size: 28rpx;
  color: #fff;
}

.setting-value {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 300;
  display: flex;
  align-items: flex-end;
}

.modal-content {
  width: 100%;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 32rpx 32rpx 0 0;
  max-height: 80vh;
  padding: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
}

.modal-close {
  font-size: 48rpx;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1;
}

.modal-body {
  padding: 32rpx;
  overflow-y: auto;
  max-height: 60vh;
}

.form-item {
  margin-bottom: 24rpx;
}

.form-label {
  display: block;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12rpx;
}

.form-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #fff;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.modal-footer {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx 40rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);

  .btn {
    flex: 1;
  }
}
</style>
