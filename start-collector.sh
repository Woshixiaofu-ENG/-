#!/bin/bash
echo "=============================================="
echo "  🚀 CyberVerse 数藏宇宙 - 数据采集服务"
echo "=============================================="
echo ""

# 检查是否在正确的目录
if [ ! -d "data-collector" ]; then
  echo "❌ 错误: 请在项目根目录运行此脚本"
  exit 1
fi

cd data-collector

# 检查是否有.env文件
if [ ! -f ".env" ]; then
  echo "📝 第一次运行，正在复制环境配置..."
  cp .env.example .env
  echo "✅ 环境配置文件已创建"
  echo ""
fi

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
  echo "📦 正在安装依赖..."
  npm install
  echo "✅ 依赖安装完成"
  echo ""
fi

# 创建数据目录
if [ ! -d "data" ]; then
  mkdir -p data
fi

echo "🔧 启动数据采集服务..."
echo ""
npm run dev