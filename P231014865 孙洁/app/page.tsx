import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center p-6 zootopia-card">
      <div className="mb-8">
        <Image 
          src="/images/合照.jpg" 
          alt="疯狂动物城合照" 
          width={500} 
          height={300} 
          className="rounded-xl mx-auto shadow-lg"
        />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 zootopia-title">
        《Web前端开发》课程练习
      </h1>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-700">
        穿梭知识链接，共筑未来界面
      </h2>
      <div className="flex justify-center gap-4 mb-8">
        <Image 
          src="/images/狐狸.png" 
          alt="尼克" 
          width={120} 
          height={120} 
          className="rounded-full border-4 border-orange-400"
        />
      </div>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
        欢迎来到疯狂动物城！这里展示了我在 Next.js、React 和 Tailwind CSS 方面的学习成果。
        请使用导航栏浏览我的作品集，或与 QAnything 智能问答机器人进行互动。
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
        <Link href="/portfolio" className="zootopia-entry-card">
            <Image 
              src="/images/狐狸.png" 
              alt="作品集" 
              width={100} 
              height={100} 
              className="mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-slate-800">我的作品集</h3>
            <p className="text-slate-600 mt-2">查看我的课程项目和练习</p>
        </Link>
        <Link href="/qanything" className="zootopia-entry-card">
            <Image 
              src="/images/judy-dancing.gif" 
              alt="AI 对话" 
              width={100} 
              height={100} 
              unoptimized
              className="mx-auto mb-4 rounded-lg"
            />
            <h3 className="text-2xl font-bold text-slate-800">AI 智能对话</h3>
            <p className="text-slate-600 mt-2">与智能兔子朱迪聊聊天</p>
        </Link>
      </div>
    </div>
  );
}
