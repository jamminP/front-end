import { motion } from 'framer-motion';

type Props = {
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number }>;
  onClick: () => void;
};

export default function ActionCard({ title, desc, icon: Icon, onClick }: Props) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="text-left p-4 rounded-2xl border bg-white hover:shadow-sm"
    >
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border">
        <Icon size={18} />
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="text-sm text-gray-500 mt-1">{desc}</div>
      <div className="mt-4 text-sm text-[#0180F5] font-medium">시작하기 →</div>
    </motion.button>
  );
}
