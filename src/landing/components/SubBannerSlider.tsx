import { shortcutCards } from "../data/bannerBottons";

export default function SubBannerSlider() {
  return (
    <div className="w-full bg-[#F1F6F9] mt-20">
      <div className="relative w-full max-w-screen-xl mx-auto px-40 py-10 mt-7 rounded-lg">
        <div className="flex gap-10 max-w-2xl">
          {shortcutCards.map(
            ({ title, icon: Icon, link, description }, index) => (
              <div
                key={index}
                className="flex-1 bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mt-2">
                  <Icon size={28} className="text-indigo-500" />
                  <h3 className="text-lg font-bold">{title}</h3>
                </div>
                <p className="text-base font-medium text-gray-500 mt-6">
                  {description}
                </p>
                <a
                  href={link}
                  className="text-center mt-14 inline-block px-4 py-2 border border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white transition"
                >
                  바로가기
                </a>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
