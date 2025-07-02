import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header 
      className="text-white p-5 shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #FDB813 0%, #F58220 50%, #E94E1B 100%)',
        borderBottom: '4px solid #D46A14'
      }}
    >
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl hover:scale-105 transition-transform flex items-center">
          <Image 
            src="/images/狐狸.png" 
            alt="尼克" 
            width={60} 
            height={60} 
            className="rounded-full mr-3 border-2 border-white shadow-md"
          />
          <span 
            className="text-4xl"
            style={{ fontFamily: "'Waltograph', 'Comic Sans MS', fantasy", textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}
          >
            疯狂动物城
          </span>
        </Link>
        <div className="space-x-8">
          <Link href="/portfolio" className="font-bold text-xl" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
            爪子印作品展
          </Link>
          <Link href="/qanything" className="font-bold text-xl" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
            朱迪警官问答
          </Link>
        </div>
      </nav>
    </header>
  );
} 