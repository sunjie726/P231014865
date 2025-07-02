'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Image from 'next/image';

// 定义消息源信息的接口
interface Source {
  fileId: string;
  fileName: string;
  content: string;
  score: string;
}

// 定义聊天消息的角色和内容
interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinkContent?: string; // 可选的思考过程内容
  sources?: Source[]; // 可选的消息源信息
}

/**
 * 处理API返回的消息内容，提取<response>标签中的内容
 */
function processApiResponse(text: string): string {
  // 如果包含<response>标签，则只显示<response>标签内的内容
  if (text.includes('<response>')) {
    const responseMatch = text.match(/<response>([\s\S]*?)<\/response>/);
    if (responseMatch && responseMatch[1]) {
      return responseMatch[1].trim();
    }
  }
  
  // 如果包含<think>标签但没有<response>标签，则过滤掉<think>标签内容
  if (text.includes('<think>')) {
    return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  }
  
  // 如果没有任何标签，则返回原始文本
  return text;
}

/**
 * 加载动画组件
 */
function LoadingIndicator() {
  return (
    <div className="flex justify-center items-center py-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
}

/**
 * 消息源信息组件
 */
function SourceInfo({ sources }: { sources: Source[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!sources || sources.length === 0) return null;
  
  return (
    <div className="mt-2 text-xs">
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="text-orange-600 hover:underline flex items-center"
      >
        <span>{isExpanded ? '隐藏来源' : '查看来源'}</span>
        <svg 
          className={`w-4 h-4 ml-1 transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isExpanded && (
        <div className="mt-2 p-2 bg-orange-50 rounded-md text-gray-800">
          {sources.map((source, index) => (
            <div key={index} className="mb-2 pb-2 border-b border-orange-200 last:border-b-0">
              <div className="font-semibold text-orange-800">文件: {source.fileName}</div>
              <div className="mt-1 whitespace-pre-wrap">{source.content}</div>
              <div className="mt-1 text-orange-600">相关度: {parseFloat(source.score).toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QAnythingPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: question };
    
    // 构建历史记录 (使用上一次的 messages 状态)
    const historyMessages = messages.reduce((acc: { question: string; response: string }[], msg, index) => {
      if (msg.role === 'user' && messages[index + 1]?.role === 'assistant') {
        acc.push({ question: msg.content, response: messages[index + 1].content });
      }
      return acc;
    }, []);

    // 添加用户消息和助手的空"占位"消息
    const assistantPlaceholder: Message = { role: 'assistant', content: '', thinkContent: '' };
    setMessages([...messages, userMessage, assistantPlaceholder]);
    setQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/qanything', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question,
          history: historyMessages.slice(-2),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('API request failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line.startsWith('data:')) {
            const jsonStr = line.substring(5).trim();
            if (jsonStr) {
              try {
                const parsed = JSON.parse(jsonStr);
                
                if (parsed.result?.response) {
                  fullResponseText += parsed.result.response;
                }
                
                const sources = parsed.result?.source;

                // --- 全新的、更健壮的解析逻辑 ---
                const thinkMatch = fullResponseText.match(/<think>([\s\S]*?)<\/think>/);
                const responseMatch = fullResponseText.match(/<response>([\s\S]*?)<\/response>/);

                const thinkContent = thinkMatch ? thinkMatch[1].trim() : '';
                let content = '';

                if (responseMatch) {
                  content = responseMatch[1].trim();
                } else {
                  content = fullResponseText.replace(/<think>[\s\S]*?<\/think>/, '').trim();
                }

                // --- 持续更新最后一条消息（占位符） ---
                setMessages(prevMessages => {
                  const newMessages = [...prevMessages];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = content;
                    lastMessage.thinkContent = thinkContent;
                    lastMessage.sources = sources;
                  }
                  return newMessages;
                });

              } catch (e) {
                console.error("无法解析收到的JSON:", jsonStr, e);
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content = `抱歉，请求出错了：\n${error.message}`;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="zootopia-card p-4 md:p-6 flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
      <div className="flex justify-center items-center gap-4 mb-4">
        <h1 className="zootopia-title text-3xl font-bold text-center">与朱迪警官聊聊</h1>
        <Image 
          src="/images/judy-dancing.gif" 
          alt="Judy Hopps Dancing" 
          width={120} 
          height={120} 
          unoptimized // 确保GIF动画正常播放
          className="-mt-8"
        />
      </div>
      
      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-orange-50 bg-opacity-70 rounded-lg mb-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-700 text-center">
            <div>
              <p className="text-lg font-bold">欢迎来到动物城警察局！</p>
              <p className="text-md mt-1">我是朱迪警官，有什么可以帮你调查的吗？</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow ${
                    msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
                  }`}
                >
                  {/* 显示思考过程 */}
                  {msg.thinkContent && (
                    <div className="mb-2 p-2 bg-gray-100 text-gray-600 rounded-md text-sm">
                      <h4 className="font-semibold text-gray-700">思考过程...</h4>
                      <p>{msg.thinkContent}</p>
                    </div>
                  )}
                  
                  {/* 显示回答 */}
                  {msg.content}
                  
                  {/* 显示消息源信息 */}
                  {msg.role === 'assistant' && msg.sources && <SourceInfo sources={msg.sources} />}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'assistant' && messages[messages.length - 1]?.content === '' && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-lg p-2 shadow">
                  <LoadingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 输入区域 */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="在这里输入你的案件详情..."
          className="flex-grow p-3 border-2 border-orange-300 rounded-full focus:outline-none focus:border-orange-500 text-gray-800"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !question.trim()} className="zootopia-button">
          {isLoading ? '调查中...' : '提交案件'}
        </button>
      </form>
    </div>
  );
} 