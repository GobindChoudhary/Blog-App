import { useState } from "react";

const InputBox = ({ type, placeholder, name, icon }) => {
  const [passwordVisibility, setpasswordVisibility] = useState(false);
  return (
    <div className="relative w-[100%] mb-4">
      <input
        type={
          type == "password" ? (passwordVisibility ? "text" : "password") : type
        }
        placeholder={placeholder}
        name={name}
        className="input-box"
      />
      <i className={`fi ${icon} input-icon`}></i>

      {type == "password" ? (
        <i
          className={`fi ${
            passwordVisibility ? "fi-rr-eye-crossed" : "fi-rr-eye"
          } input-icon left-[auto] right-4 cursor-pointer`}
          onClick={() => setpasswordVisibility((currentValue) => !currentValue)}
        ></i>
      ) : (
        ""
      )}
    </div>
  );
};

export default InputBox;
