import React from "react";
import logo from "../../assets/logo_picsart.svg";

const Header = () => {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo au centre */}
        <a className="w-1/3 flex justify-center" href="/">
            <img src={logo} alt="PicsArt Logo" className="h-12" />
        </a>

        {/* Icône utilisateur à droite */}
        <div className="w-1/3 flex justify-center">
          <button className="p-2 rounded-full ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 18.75a8.25 8.25 0 0115 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
