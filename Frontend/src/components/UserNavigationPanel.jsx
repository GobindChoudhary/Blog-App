import { Link } from "react-router-dom";
import AnimationWrapper from "../common/AnimationWrapper";
import { useContext } from "react";
import { userContext } from "../App";
import { removeFromSession } from "../common/Session";
const userNavigationPanel = () => {
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
      className="absolute right-0"
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>
        <Link
          className="flex gap-2 link md:hidden pl-8 py-4"
          to={`/user/${username}`}
        >
          profile
        </Link>
        <Link
          className="flex gap-2 link md:hidden pl-8 py-4"
          to={`/dashboard/`}
        >
          Dashboard
        </Link>
        <Link
          className="flex gap-2 link md:hidden pl-8 py-4"
          to={`/settings/edit-profile`}
        >
          Setting
        </Link>

        <span className="absolute border-t border-grey w-[100%]"></span>

        <button
          className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
          onClick={handleSignOut}
        >
          <h1 className="font-bold text-xl mb-1">Sign Out</h1>
          <p className="text-dark-grey">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default userNavigationPanel;
