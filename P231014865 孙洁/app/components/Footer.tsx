import WakaTimeStats from './WakaTimeStats';

export default function Footer() {
  return (
    <footer className="bg-orange-500 bg-opacity-80 text-white p-4 mt-auto">
      <div className="container mx-auto text-center text-gray-200">
        <p>
          <WakaTimeStats />
        </p>
        <p>&copy; {new Date().getFullYear()} 疯狂动物城课程期末作业</p>
      </div>
    </footer>
  );
} 