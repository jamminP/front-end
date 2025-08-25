import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, type Variants, type Transition } from 'framer-motion';
import CommunityTab from './components/CommunityTab';
import SidebarRanking from './components/SidebarRanking';
import CreatePostButton from './components/CreatePostButton';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }

    (mql as any).addListener?.(onChange);
    return () => (mql as any).removeListener?.(onChange);
  }, [query]);

  return matches;
}

const easeOutCubic: NonNullable<Transition['ease']> = [0.16, 1, 0.3, 1];
const easeInCubic: NonNullable<Transition['ease']> = [0.4, 0, 1, 1];

const asideVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.22, ease: easeOutCubic } },
  exit: { opacity: 0, x: -16, transition: { duration: 0.16, ease: easeInCubic } },
};

const CommunityLayout = () => {
  const location = useLocation();
  const category: 'free' | 'share' | 'study' = location.pathname.includes('/share')
    ? 'share'
    : location.pathname.includes('/study')
      ? 'study'
      : 'free';

  const isLg = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="w-full">
      <nav className="sticky inset-x-0 z-30 bg-white top-14 md:top-20">
        <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <CommunityTab category={category} />
        </div>
      </nav>

      <div className="mx-auto mt-16 md:mt-22 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,720px)] gap-8 lg:max-w-[1100px] lg:mx-auto">
          <AnimatePresence mode="wait">
            {isLg && (
              <motion.aside
                key={`sidebar-${isLg}`}
                variants={asideVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="order-1 lg:order-1 w-[320px] sticky self-start"
                style={{ top: 'calc(var(--site-header-h, 70px) + 56px)' }}
              >
                <SidebarRanking />
              </motion.aside>
            )}
          </AnimatePresence>

          <main className="order-2 lg:order-2 w-full relative">
            <Outlet />

            <CreatePostButton
              category={category}
              to="/community/create"
              className="
                hidden lg:flex items-center justify-center
                absolute right-0 translate-x-14 top-8 -translate-y-1/2
                h-12 w-12 rounded-full
              "
            />
          </main>
        </div>
      </div>

      <CreatePostButton
        category={category}
        to="/community/create"
        className="lg:hidden fixed right-6 bottom-18 z-40 h-14 w-14 rounded-full"
      />
    </div>
  );
};

export default CommunityLayout;
