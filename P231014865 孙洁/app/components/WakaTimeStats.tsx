'use client';

import { useState, useEffect } from 'react';

export default function WakaTimeStats() {
  const [totalTime, setTotalTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWakaTimeStats() {
      try {
        const response = await fetch('/api/wakatime');
        if (!response.ok) {
          throw new Error('获取 WakaTime 数据失败');
        }
        const data = await response.json();
        setTotalTime(data.total_time_text);
      } catch (err) {
        setError(err instanceof Error ? err.message : '发生未知错误');
      } finally {
        setIsLoading(false);
      }
    }

    fetchWakaTimeStats();
  }, []); // 空依赖数组确保该 effect 只在组件挂载时运行一次

  if (isLoading) {
    return <span>正在加载 WakaTime 数据...</span>;
  }

  if (error) {
    return <span className="text-red-500">错误: {error}</span>;
  }

  return <span>总编码时长: {totalTime || '暂无数据'}</span>;
} 