import { Link } from 'react-router-dom';
import { mosaicFeatureData } from './../data/featureMosaic.data';
import type { Slide } from '../data/featureMosaic.schema';

type RowProps = { slide: Slide; reverse?: boolean };

export default function FeatureMosaic() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-screen-xl px-6 md:px-10 space-y-12 md:space-y-16">
        {mosaicFeatureData.map((s, i) => (
          <Row key={s.id} slide={s} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function Row({ slide: s, reverse }: RowProps) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <div className={reverse ? 'order-2 md:order-1' : 'order-1'}>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--main)] leading-snug">
          {s.title}
          <br className="hidden md:block" />
          <span className="text-[var(--main)]">{s.subtitle}</span>
        </h3>
        <p className="mt-3 text-zinc-600">{s.description}</p>

        <Link
          to={s.cta.to}
          className="mt-6 inline-block px-4 py-2 rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition font-semibold"
        >
          {s.cta.label}
        </Link>
      </div>

      <div className={reverse ? 'order-1 md:order-2' : 'order-2'}>
        <div className="rounded-2xl border border-zinc-100 bg-[#F6FAFF] shadow-sm">
          <div className="aspect-[4/3] w-full flex items-center justify-center">
            <img src={s.image} alt={s.imageAlt} className="h-[70%] w-auto object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}
