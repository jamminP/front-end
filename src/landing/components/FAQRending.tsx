import { useState } from "react";
import { FAQs } from "../data/FAQList";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function FAQRending() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full mt-20">
      <div className="relative w-full max-w-screen-xl mx-auto px-40 py-10 mt-7 rounded-lg">
        <h2 className="text-4xl font-bold mb-10">
          궁금증을 <br /> 해결해드리겠습니다.
        </h2>

        <div className="bg-white rounded-lg shadow-md divide w-[90%]">
          {FAQs.map((faq) => (
            <div key={faq.id} className="px-8 py-6">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="flex items-center justify-between w-full text-left font-bold"
              >
                <span className="flex-1 text-gray-800 text-base">
                  {faq.question}
                </span>
                {openId === faq.id ? (
                  <FaChevronUp className="text-gray-400 flex-shrink-0" />
                ) : (
                  <FaChevronDown className="text-gray-400 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 text-gray-600 text-sm max-w-[90ch]">
                      {faq.answer}
                    </div>
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

export default FAQRending;
