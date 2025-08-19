import { useState } from 'react';
import { FAQs } from '../data/FAQList';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQLanding() {
  const [openId, setOpenId] = useState<number | null>(null);
  const toggleFAQ = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <div className="w-full mt-5">
      <div className="relative w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12 lg:px-12 py-8 md:py-10 rounded-lg">
        <h2 className="text-4xl font-bold mb-8 leading-tight">
          <span className="block">궁금증을</span>
          <span className="block">해결해드리겠습니다.</span>
        </h2>

        <div className="bg-white rounded-lg shadow-md w-full divide-y divide-gray-200">
          {FAQs.map((faq) => (
            <div key={faq.id} className="px-6 md:px-8 py-6">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="flex items-center justify-between w-full text-left font-bold"
              >
                <span className="flex-1 text-gray-800 text-base">{faq.question}</span>
                {openId === faq.id ? (
                  <FaChevronUp className="text-gray-400 flex-shrink-0" />
                ) : (
                  <FaChevronDown className="text-gray-400 flex-shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    key={`content-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 text-gray-600 text-sm max-w-[90ch]">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
