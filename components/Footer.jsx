import React from "react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-pink-50/80 via-purple-50/80 to-blue-50/80 backdrop-blur-sm border-t border-pink-200/30">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-6 py-8 border-b border-white/20 text-gray-700">
        <div className="w-4/5">
          <div className="flex items-center space-x-3 mb-3">
            <Logo size="default" />
            <span className="text-xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Girls</span>
              <span className="text-gray-800">Who</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Give</span>
            </span>
          </div>
          <p className="text-xs text-gray-700">
            GirlsWhoGive connects donors with verified organizations to
            provide essential menstrual products to people in need. Together,
            we make dignity accessible—one donation at a time.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-800 mb-3 text-sm">Explore</h2>
            <ul className="text-xs space-y-1">
              <li>
                <a className="hover:text-pink-600 transition-colors" href="/">Home</a>
              </li>
              <li>
                <a className="hover:text-pink-600 transition-colors" href="/about">About</a>
              </li>
              <li>
                <a className="hover:text-pink-600 transition-colors" href="/connect">Connect</a>
              </li>
              <li>
                <a className="hover:text-pink-600 transition-colors" href="/donor/discover">Discover</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-800 mb-3 text-sm">Get in touch</h2>
            <div className="text-xs space-y-1 text-gray-700">
              <p>+1 (555) 123-4567</p>
              <p>support@girlswhogive.org</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-2 text-center text-xs text-gray-700">
        © {new Date().getFullYear()} GirlsWhoGive. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;