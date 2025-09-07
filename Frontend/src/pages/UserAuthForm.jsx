import { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/InputBox";
import googleIcon from "../img/google.png";
import AnimationWrapper from "../common/AnimationWrapper";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/Session";
import { userContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

  let {
    userAuth: { accessToken },
    setUserAuth,
  } = useContext(userContext);

  const userAuthThroughServer = (ServerRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "auth" + ServerRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        if (response) {
          // Server responded with an error
          toast.error(response.data.error);
        } else {
          // No response from server (network error, server down, etc.)
          toast.error("Network error. Please try again later.");
        } 
      });
  };

  function handleSubmit(e) {
    e.preventDefault();

    const ServerRoute = type === "sign-in" ? "/signin" : "/signup";
    // form Data
    const form = new FormData(formElement);

    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    const { fullname, email, password } = formData;

    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be 3 letters long");
      }
    }

    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "password should be 6 to 20 character long with a numeric, 1 lowercase and 1 uppercase"
      );
    }

    userAuthThroughServer(ServerRoute, formData);
  }

  const hangleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let ServerRoute = "/google-auth";
        let formData = {
          accessToken: user.accessToken,
        };
        userAuthThroughServer(ServerRoute, formData);
      })
      .catch((err) => {
        toast.error("troble login through google");
        return console.log(err);
      });
  };

  return accessToken ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center ">
        <Toaster />
        <form
          id="formElement"
          className="w-[80%] max-w-[400px]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "welcome back" : "Join us today"}
          </h1>
          {type == "sign-up" ? (
            <InputBox
              type="text"
              placeholder="First Name"
              name="fullname"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}
          <InputBox
            type="email"
            placeholder="Email"
            name="email"
            icon="fi-rr-envelope"
          />
          <InputBox
            type="password"
            placeholder="Password"
            name="password"
            icon="fi-rr-key"
          />

          <button className="btn-dark center mt-14" type="submit">
            {type.replace("-", " ")}
          </button>
          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={hangleGoogleAuth}
          >
            <img src={googleIcon} className="w-5" alt="" />
            continue with google
          </button>

          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center ">
              {" "}
              Don't have an account ?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center ">
              {" "}
              Aready a member ?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
