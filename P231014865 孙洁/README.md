# 课程期末作业

本项目是一个基于 Next.js 的 Web 应用，旨在展示课程所学的 HTML, CSS, JavaScript, React 及 Next.js 知识。应用集成了个人以往课程练习展示、WakaTime API 编码时长统计以及 QAnything 大语言模型问答服务。

## 项目特点

- **作品集展示**: 以独立的路由和组件化方式，整合展示本学期所有课程练习。
- **WakaTime 集成**: 调用 WakaTime API，在页脚实时显示个人总编码时长，并使用环境变量安全管理 API Key。
- **QAnything 大模型 (进阶路径)**: 自行开发前端交互界面，直接调用 QAnything API，实现一个定制化的智能问答机器人。
- **疯狂动物城主题设计**: 采用毛玻璃风格（Glassmorphism）设计，融合疯狂动物城角色元素，打造生动有趣的用户界面。首页使用半透明卡片、背景模糊效果和动态悬停动画，为作品集和AI对话入口提供视觉吸引力。

## 技术栈

- [Next.js](https://nextjs.org/) – React 框架
- [React](https://reactjs.org/) – UI 库
- [TypeScript](https://www.typescriptlang.org/) – 类型化 JavaScript
- [Tailwind CSS](https://tailwindcss.com/) – CSS 框架
- [WakaTime API](https://wakatime.com/developers) – 编码活动跟踪
- [QAnything API](https://qanything.ai/) – 大语言模型服务

## 项目结构

```
/final-project
├── app/
│   ├── components/       # 共享组件 (如 Header, Footer)
│   ├── portfolio/        # 作品集页面及子路由
│   │   └── page.tsx
│   ├── qanything/        # QAnything 问答页面
│   │   └── page.tsx
│   ├── api/              # 后端 API 路由 (用于代理对外部API的请求)
│   ├── layout.tsx        # 全局布局
│   └── page.tsx          # 应用首页
├── lib/                  # 辅助函数 (例如, API 请求逻辑)
│   ├── wakatime.ts
│   └── qanything.ts
├── public/               # 静态资源
├── .env.local            # 环境变量 (存储 API Keys)
├── README.md             # 项目说明文件
└── ...                   # 其他 Next.js 配置文件
```

## QAnything 集成路径与实现

**选择路径**: 进阶路径 (Advanced Path)

**原因**:
选择进阶路径是为了更深入地挑战自我，全面实践前端开发的各项技能。通过自行设计和开发与 QAnything API 交互的前端界面，可以更好地掌握 API 对接、前端状态管理、异步操作、错误处理以及 UI/UX 设计。这不仅能满足作业的最高要求，也是一个将所学知识融会贯通的绝佳机会。

**实现细节**:
- **前端界面**: 在 `/app/qanything` 路径下，使用 React 和 Tailwind CSS 构建一个用户友好的聊天界面，包括输入框、发送按钮、以及展示问答历史的区域。
- **API 调用**: 将在后端 API 路由 (`/app/api/qanything`) 中处理对 QAnything API 的请求。这样做可以隐藏 API Key，避免其暴露在客户端，提高安全性。
- **状态管理**: 使用 React Hooks (如 `useState`, `useEffect`) 来管理用户输入、加载状态、API 返回的答案以及可能的错误信息。
- **高级特性**: (可选) 后续可能实现流式输出，以提升用户体验。

## 毛玻璃风格（Glassmorphism）实现

为了呼应疯狂动物城的活泼主题，本项目采用了现代化的毛玻璃设计风格，主要体现在首页的入口卡片设计上：

**技术实现**:
- **背景模糊**: 使用 CSS 的 `backdrop-filter: blur()` 属性，为半透明元素背后的内容添加模糊效果。
- **半透明效果**: 通过 Tailwind CSS 的透明度类（如 `bg-white/60`）实现背景的半透明效果。
- **柔和边框**: 使用 `border-white/30` 添加微妙的白色边框，增强立体感。
- **阴影效果**: 采用 `shadow-lg` 为卡片增加阴影，提升层次感。
- **交互动画**: 利用 `transition-all`、`duration-300` 和 `scale-105` 等类，实现鼠标悬停时的平滑放大效果。

**样式代码片段**:
```css
.zootopia-entry-card {
  @apply bg-white/60 backdrop-blur-lg rounded-2xl p-6 text-center shadow-lg border border-white/30;
  @apply transition-all duration-300 ease-in-out;
}

.zootopia-entry-card:hover {
  @apply bg-white/80 scale-105 shadow-xl;
}
```

**角色融合**:
- 作品集入口使用尼克（狐狸）形象，象征机智和创造力
- AI对话入口使用朱迪（兔子）形象，代表好奇心和探索精神

## WakaTime API 集成方法

1.  从 [WakaTime Settings](https://wakatime.com/settings/api-key) 获取个人 API Key。
2.  将 API Key 存储在 `.env.local` 文件的 `WAKATIME_API_KEY` 变量中。
3.  创建一个服务器端函数或 API 路由，用于获取 WakaTime 数据，避免在客户端暴露 API Key。
4.  在全局 Footer 组件中调用该函数，获取并展示总编码时长。

## 本地开发指南

1.  **克隆仓库**
    ```bash
    git clone [你的仓库URL]
    cd final-project
    ```

2.  **安装依赖**
    ```bash

    npm install
    ```

3.  **设置环境变量**
    复制 `.env.example` (如果提供) 或手动创建 `.env.local` 文件，并填入您的 API 密钥：
    ```
    WAKATIME_API_KEY="YOUR_WAKATIME_API_KEY"
    QANYTHING_API_KEY="YOUR_QANYTHING_API_KEY"
    ```

4.  **运行开发服务器**
    ```bash
    npm run dev
    ```

    在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看。

## 运行截图

链接：https://pan.baidu.com/s/1l9ueTiy-hQ6ZiWnmE86gXQ 

### 1. 首页毛玻璃风格入口卡片
https://pan.baidu.com/s/1l9ueTiy-hQ6ZiWnmE86gXQ 

![Homepage Entry Cards](https://via.placeholder.com/600x400.png?text=Zootopia+Theme+Homepage+Cards)

### 2. QAnything 运行截图


![QAnything Screenshot](https://via.placeholder.com/600x400.png?text=QAnything+Interface+Screenshot)

### 2. WakaTime API 集成与展示截图
*https://pan.baidu.com/s/1k2qemns9hzEXklZqPbg6oA 

![WakaTime Screenshot](https://via.placeholder.com/600x100.png?text=WakaTime+Footer+Screenshot)

### 3. Next.js 组织课程练习作业的运行截图
https://pan.baidu.com/s/1yvTY1jl76hQdY0BvbCWR_g 

![Portfolio Screenshot](https://via.placeholder.com/600x400.png?text=Portfolio+Page+Screenshot)

## GitHub 仓库管理

本项目所有代码和文档均通过 Git 进行版本控制，并托管在公共 GitHub 仓库中。Commit 信息遵循清晰、有意义的原则，以保持良好的开发历史记录。
