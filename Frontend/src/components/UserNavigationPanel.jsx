import { Link } from "react-router-dom";
import AnimationWrapper from "../common/AnimationWrapper";
import { useContext } from "react";
import { userContext } from "../App";
import { removeFromSession } from "../common/Session";

const UserNavigationPanel = () => {
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(userContext);

  const handleSignOut = () => {
    removeFromSession("user");
    setUserAuth({ accessToken: null });
  };

  return (
    <AnimationWrapper
      className="absolute right-0 top-full z-50"
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white border border-grey w-60 shadow-md rounded-md">
        {/* Write option (mobile only) */}
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>

        {/* These links should stay visible on all screens */}
        <Link className="flex gap-2 link pl-8 py-4" to={`/user/${username}`}>
          Profile
        </Link>
        <Link className="flex gap-2 link pl-8 py-4" to="/dashboard/blogs">
          Dashboard
        </Link>
        <Link
          className="flex gap-2 link pl-8 py-4"
          to="/settings/edit-profile"
        >
          Settings
        </Link>

        <span className="block border-t border-grey"></span>

        <button
          className="text-left p-4 hover:bg-grey w-full pl-8"
          onClick={handleSignOut}
        >
          <h1 className="font-bold text-xl mb-1">Sign Out</h1>
          <p className="text-dark-grey">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
