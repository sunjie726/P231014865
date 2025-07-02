import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 定义作品类型
type Assignment = {
  filename: string;
  name: string;
};

// 辅助函数，用于将文件名转换为更易读的标题
function formatAssignmentName(filename: string): string {
  return filename
    .replace('.html', '') // 移除扩展名
    .replace(/[-_]/g, ' ') // 将连字符和下划线替换为空格
    .replace(/\b\w/g, (char) => char.toUpperCase()); // 将每个单词的首字母大写
}

export default function PortfolioPage() {
  // 在服务器端读取 public 目录下的文件
  const assignmentsDirectory = path.join(process.cwd(), 'public', 'assignments');
  let assignments: Assignment[] = [];

  try {
    const filenames = fs.readdirSync(assignmentsDirectory);
    assignments = filenames
      .filter((file) => file.endsWith('.html'))
      .map((filename) => ({
        filename,
        name: formatAssignmentName(filename),
      }));
  } catch (error) {
    console.error('无法读取作品集目录:', error);
    return (
      <div className="zootopia-card text-center p-8">
        <h1 className="zootopia-title text-3xl sm:text-4xl font-bold mb-6">爪子印作品展</h1>
        <p className="text-red-600 font-bold">加载作品列表时出错，动物城档案管理员正在紧急处理！</p>
      </div>
    );
  }

  return (
    <div className="zootopia-card p-6 md:p-8">
      <h1 className="zootopia-title text-4xl sm:text-5xl font-bold mb-8 text-center">爪子印作品展</h1>
      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <Link key={assignment.filename} href={`/portfolio/${assignment.filename}`}>
              <div className="block p-6 bg-white bg-opacity-80 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 h-full cursor-pointer border-2 border-orange-300">
                <h2 className="text-xl font-bold text-orange-700 mb-2">{assignment.name}</h2>
                <p className="text-gray-600">点击进入这个奇妙的世界</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border-4 border-dashed border-orange-300 rounded-lg">
          <p className="text-2xl text-orange-700 font-bold">
            展厅目前空空如也！
          </p>
          <p className="text-gray-600 mt-2">
            快去 `public/assignments` 目录下添加你的杰作吧！
          </p>
        </div>
      )}
    </div>
  );
} 