import React from "react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <div className="flex items-center space-x-3 mb-6">
            <Logo size="large" />
            <span className="text-2xl font-bold text-gray-900">
              <span className="text-pink-600">Girls</span>Who<span className="text-pink-600">Give</span>
            </span>
          </div>
          <p className="text-sm">
            GirlsWhoGive connects donors with verified organizations to
            provide essential menstrual products to people in need. Together,
            we make dignity accessible—one donation at a time.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Explore</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="/">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="/about">About</a>
              </li>
              <li>
                <a className="hover:underline transition" href="/connect">Connect</a>
              </li>
              <li>
                <a className="hover:underline transition" href="/donor/discover">Discover</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+1 (555) 123-4567</p>
              <p>support@girlswhogive.org</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        © {new Date().getFullYear()} GirlsWhoGive. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;