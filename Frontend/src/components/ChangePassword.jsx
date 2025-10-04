import { useContext, useRef } from "react";
import AnimationWrapper from "../common/AnimationWrapper";
import InputBox from "./InputBox";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { userContext } from "../App";

const ChangePassword = () => {
  const changePassworForm = useRef();
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

  let {
    userAuth: { accessToken },
  } = useContext(userContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    let form = new FormData(changePassworForm.current);

    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { currentPassword, newPassword } = formData;

    if (!currentPassword.length || !newPassword.length) {
      return toast.error("Fill all the inputs");
    }

    if (
      !passwordRegex.test(currentPassword) ||
      !passwordRegex.test(newPassword)
    ) {
      return toast.error(
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"
      );
    }

    e.target.setAttribute("disable", true);

    let loadingToast = toast.loading("Updating...");

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "change-password", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disable");
        return toast.success("Password Updated.");
      })
      .catch(({ response }) => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disable");
        return toast.error(response.data.error);
      });
  };

  return (
    <AnimationWrapper>
      <Toaster />
      <form ref={changePassworForm}>
        <h1 className="max-md:hidden text-xl text-dark-grey mb-3">
          Change Password
        </h1>

        <div className=" w-full md:max-w-[400px]">
          <InputBox
            name="currentPassword"
            type="password"
            className="Profile-edit-input"
            placeholder="Current Password"
            icon="fi-rr-unlock"
          />
          <InputBox
            name="newPassword"
            type="password"
            className="Profile-edit-input"
            placeholder="New Password"
            icon="fi-rr-unlock"
          />
          <button
            onClick={handleSubmit}
            className="btn-dark px-10"
            type="submit"
          >
            Change Password
          </button>
        </div>
      </form>
    </AnimationWrapper>
  );
};

export default ChangePassword;
