import { FaSquareGithub } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-[#1B3043] text-white py-6 mt-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-1 text-sm leading-relaxed ">
          <p className="font-bold text-base">© 2025 Evi. All rights reserved.</p>
          <p>
            <span className="font-bold">Front-End:</span> 김은빈, 박재민, 이재은
          </p>
          <p>
            <span className="font-bold">Back-End:</span> 김희수, 유승협, 이종찬
          </p>
        </div>

        <div className="mt-2 md:mt-0 flex">
          <p className="font-bold text-base mr-2">GitHub Repository </p>
          <a
            href="https://github.com/OZ11-OneTurnOneKill"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors duration-200 text-3xl"
          >
            <FaSquareGithub />
          </a>
        </div>
      </div>
    </footer>
  );
}
