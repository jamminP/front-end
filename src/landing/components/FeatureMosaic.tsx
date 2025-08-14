import { Link } from 'react-router-dom';
import { mosaicFeatureData } from '../data/featureMosaic.data';

export default function FeatureMosaic() {
  const [main, side1, side2] = mosaicFeatureData;

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-10">
        <div className="md:flex md:gap-6">
          <div className="md:basis-7/12 md:shrink-0">
            <BigCard item={main} />
          </div>
          <div className="mt-6 md:mt-0 md:basis-5/12 flex flex-col gap-6">
            <SideCard item={side1} />
            <SideCard item={side2} />
          </div>
        </div>
      </div>
    </section>
  );
}

function BigCard({ item }: { item: any }) {
  return (
    <Link
      to={item.cta.to}
      className="block rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="aspect-[16/10] w-full overflow-hidden">
        <img src={item.image} alt={item.imageAlt} className="h-full w-full object-cover" />
      </div>
      <div className="p-5 md:p-7">
        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 leading-snug">
          {item.title}
        </h2>
        <p className="mt-2 text-neutral-600">{item.subtitle || item.description}</p>
      </div>
    </Link>
  );
}

function SideCard({ item }: { item: any }) {
  return (
    <Link
      to={item.cta.to}
      className="flex items-start gap-4 rounded-2xl border border-neutral-200 p-4 hover:shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="shrink-0 w-24 aspect-square rounded-xl overflow-hidden bg-[#F6FAFF]">
        <img src={item.image} alt={item.imageAlt} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] md:text-[16px] font-semibold text-neutral-900 leading-snug line-clamp-2">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
          {item.subtitle || item.description}
        </p>
      </div>
    </Link>
  );
}
