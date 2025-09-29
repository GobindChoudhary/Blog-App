import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import { useContext, useState } from "react";
import { userContext } from "../App";
import UserNavigationPanel from "./UserNavigationPanel";
import { useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [SearchBarVisibility, setSearchBarVisibility] = useState(false);
  const [userNavVisibility, setuserNavBarVisibility] = useState();

  const handleUserNavVisibility = () => {
    setuserNavBarVisibility((currentState) => !currentState);
  };
  const handleUserNavBlur = () => {
    setTimeout(() => setuserNavBarVisibility(false), 300);
  };

  const {
    userAuth,
    userAuth: { accessToken, profile_img, new_notification_available },
    setUserAuth,
  } = useContext(userContext);

  const handleSearch = (e) => {
    let query = e.target.value;

    if (e.keyCode == 13 && query.length) {
      navigate(`/search/${query}`);
    }
  };

  useEffect(() => {
    if (accessToken) {
      axios
        .get(import.meta.env.VITE_SERVER_DOMAIN + "new-notification", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(({ data }) => {
          setUserAuth({ ...userAuth, ...data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [accessToken]);
  return (
    <>
      <nav className="navbar z-50">
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
            onKeyDown={handleSearch}
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

          {accessToken ? (
            <>
              <Link to="/dashboard/notifications">
                <button className="w-12 h-12 rounded-full bg-grey relative  hover:bg-black/10">
                  <i className="fi fi-rr-bell text-2xl block nt-1"></i>
                  {new_notification_available ? (
                    <span className="absolute z-10 top-2 right-2 bg-red w-3 h-3 rounded-full "></span>
                  ) : (
                    ""
                  )}
                </button>
              </Link>

              <div className="relative">
                <button
                  className="w-12 h-12 mt-1"
                  onClick={handleUserNavVisibility}
                  onBlur={handleUserNavBlur}
                >
                  <img
                    src={profile_img}
                    className="w-full h-full object-cover rounded-full"
                    alt=""
                  />
                </button>
                {userNavVisibility ? <UserNavigationPanel /> : ""}
              </div>
            </>
          ) : (
            <>
              {/* Signin link */}
              <Link to="/signin" className="btn-dark py-2">
                Sign In
              </Link>
              {/* SingUp link */}
              <Link to="/signup" className="btn-light py-2 hidden md:block">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
