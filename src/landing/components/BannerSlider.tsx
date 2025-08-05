import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { bannerSlides } from "../data/bannerSlides";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { VscDebugStart } from "react-icons/vsc";
import { CiStop1 } from "react-icons/ci";

export default function BannerSlider() {
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [progressKey, setProgressKey] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (isPlaying) {
      controls.set({ strokeDashoffset: 100 });
      controls.start({
        strokeDashoffset: 0,
        transition: { duration: 5, ease: "linear" },
      });
    }
  }, [progressKey, isPlaying, controls]);

  const togglePlay = () => {
    if (!swiperRef) return;
    if (isPlaying) {
      swiperRef.autoplay.stop();
      controls.stop();
      setIsPlaying(false);
    } else {
      swiperRef.autoplay.start();
      setIsPlaying(true);
      setProgressKey((prev) => prev + 1);
    }
  };

  return (
    <div className="relative w-full max-w-screen-xl mx-auto">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onSwiper={setSwiperRef}
        onSlideChange={(swiper) => {
          setCurrentIndex(swiper.realIndex + 1);
          setProgressKey((prev) => prev + 1);
        }}
      >
        {bannerSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="flex items-center justify-between px-40 pt-4 bg-white rounded-2xl">
              <div className="max-w-lg">
                <h2 className="text-3xl font-bold">{slide.title}</h2>
                <h3 className="text-3xl font-bold mt-3">{slide.subtitle}</h3>
                <p className="text-base font-medium text-gray-500 mt-6">
                  {slide.description}
                </p>
                <button className="mt-8 px-4 py-2 border rounded-lg border-indigo-500 text-indigo-500 text-sm hover:bg-indigo-500 hover:text-white transition">
                  {slide.buttonText}
                </button>
              </div>
              <div>
                <img
                  src={slide.image}
                  alt="slide image"
                  className="w-72 h-auto"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex gap-3 max-x-[1280px] px-40">
        <button onClick={() => swiperRef?.slidePrev()}>
          <FaAngleLeft />
        </button>

        <span className="font-bold">
          {String(currentIndex).padStart(2, "0")} /{" "}
          {String(bannerSlides.length).padStart(2, "0")}
        </span>

        <div className="relative w-6 h-6">
          <svg className="absolute top-0 left-0" viewBox="0 0 36 36">
            <path
              className="text-gray-300"
              strokeWidth="3"
              fill="none"
              stroke="currentColor"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              key={progressKey}
              className="text-indigo-500"
              strokeWidth="3"
              fill="none"
              stroke="currentColor"
              strokeDasharray="100, 100"
              strokeDashoffset="100"
              animate={controls}
              transition={{ duration: 5, ease: "linear" }}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center text-xs"
          >
            {isPlaying ? <CiStop1 /> : <VscDebugStart />}
          </button>
        </div>

        <button onClick={() => swiperRef?.slideNext()}>
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
}
