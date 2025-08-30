import { Link } from "react-router-dom";
import logo from "../img/logo.png";
import { useState } from "react";
const Navbar = () => {
  const [SearchBarVisibility, setSearchBarVisibility] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="flex-none w-10 ">
        <img src={logo} className="w-full" alt="" />
      </Link>
      {/* Search bar */}
      <div
        className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-gray-300 py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:opacity-100 md:pointer-events-auto ${
          SearchBarVisibility ? "show" : "hide"
        }`}
      >
        <input
          type="text"
          placeholder="search"
          className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%]  md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
        />
        <i className="fi-rr-search absolute right-[10%] md:left-5 top-1/2  -translate-y-1/2 text-xl text-dark-grey md:pointer-events-none"></i>
      </div>
      <div className="flex items-center gap-3 md:gap-6  ml-auto">
        {/* Search bar toggle button */}
        <button
          className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center "
          onClick={() =>
            setSearchBarVisibility((currentState) => !currentState)
          }
        >
          <i className="fi-rr-search text-xl text-dark-grey"></i>
        </button>
        {/* editor link */}
        <Link to="/editor" className="hidden md:flex gap-2 link">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>
        {/* Signin link */}
        <Link to="/signin" className="btn-dark py-2">
          Sign In
        </Link>
        {/* SingUp link */}
        <Link to="/signup" className="btn-light py-2 hidden md:block">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
