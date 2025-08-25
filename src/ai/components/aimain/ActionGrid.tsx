import { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function ActionGrid({ title, subtitle, children }: Props) {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="text-gray-600 mt-2 text-xl">{subtitle}</p>}

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}
