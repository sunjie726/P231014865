'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function AssignmentPage() {
  const params = useParams();
  const assignment = params.assignment as string;

  if (!assignment) {
    return (
      <div className="text-center p-8 zootopia-card">
        <h1 className="text-2xl font-bold zootopia-title">正在加载...</h1>
      </div>
    );
  }

  const assignmentUrl = `/assignments/${decodeURIComponent(assignment)}`;
  const assignmentName = decodeURIComponent(assignment)
    .replace('.html', '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="flex flex-col h-full p-4 md:p-6 zootopia-card">
      <div className="mb-4">
        <Link href="/portfolio" className="text-orange-600 hover:underline font-bold">
          &larr; 返回爪子印作品展
        </Link>
        <h1 className="zootopia-title text-3xl font-bold mt-2">{assignmentName}</h1>
      </div>
      <iframe
        src={assignmentUrl}
        title={assignmentName}
        className="w-full flex-grow border-4 border-orange-400 rounded-lg shadow-lg"
      />
    </div>
  );
} 