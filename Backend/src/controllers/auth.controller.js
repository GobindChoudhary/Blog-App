import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getAuth } from "firebase-admin/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountKey = JSON.parse(
  fs.readFileSync(
    path.resolve(
      __dirname,
      "../../blog-app-afce4-firebase-adminsdk-fbsvc-152a97ecf9.json"
    )
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

async function generateUsername(email) {
  let username = email.split("@")[0];

  while (true) {
    const usernameExist = await userModel.findOne({
      "personal_info.username": username,
    });

    if (usernameExist) {
      // If username exists, append a random string and check again
      username += nanoid(4);
    } else {
      // If it's unique, break the loop
      break;
    }
  }
  return username;
}

function formateDatatoSend(user) {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return {
    accessToken: accessToken,
    profile_img: user.personal_info.profile_img || "🤣",
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
    email: user.personal_info.email,
  };
}

async function registerController(req, res) {
  try {
    const { fullname, email, password } = req.body;

    // User input validation
    if (!fullname || !email || !password) {
      return res.status(403).json({
        message: "Fullname, Email and Password  is required",
      });
    }

    if (fullname.length < 3) {
      return res.status(403).json({ error: "Fullname must be 3 letters long" });
    }

    if (!emailRegex.test(email)) {
      return res.status(403).json({ error: "Email is invalid" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(403).json({
        error:
          "password should be 6 to 20 character long with a numeric, 1 lowercase and 1 uppercase",
      });
    }

    // checking user already exist or not
    const isUserAlreadyExist = await userModel.findOne({
      "personal_info.email": email,
    });

    if (isUserAlreadyExist) {
      return res.status(409).json({
        message: "user with same email already exist",
      });
    }

    // hassing password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // generating unique username
    const username = await generateUsername(email);

    //  Creating new User in Database
    const newUser = await userModel.create({
      personal_info: {
        fullname,
        email,
        password: hashPassword,
        username,
      },
    });

    // Genterating accessToken and sending to cookies
    // res.cookie("token", accessToken, {
    //   httpOnly: true, // Cookie can't be accessed via JavaScript
    //   secure: true, // Only sent over HTTPS
    //   sameSite: "strict", // Prevent CSRF
    //   maxAge: 1000 * 60 * 60 * 24 * 30, // 1 day
    // });
    // Response to user
    return res.status(201).json(formateDatatoSend(newUser));
  } catch (error) {
    console.log(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error. Please try again later.",
    });
  }
}

async function signinController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      "personal_info.email": email,
    });
    if (!user) {
      return res.status(403).json({
        error: "Email does't exist",
      });
    }
    if (user.google_auth) {
      return res.status(409).json({
        error:
          "This email is registed through google. Please Sign in through google",
      });
    }
    const match = await bcrypt.compare(password, user.personal_info.password);

    if (!match) {
      return res.status(403).json({
        error: "Incorrect password ",
      });
    }
    // Genterating accessToken and sending to cookies
    // res.cookie("token", accessToken, {
    //   httpOnly: true, // Cookie can't be accessed via JavaScript
    //   secure: true, // Only sent over HTTPS
    //   sameSite: "strict", // Prevent CSRF
    //   maxAge: 1000 * 60 * 60 * 24 * 30, // 1 day
    // });
    return res.status(200).json(formateDatatoSend(user));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function googleAuthController(req, res) {
  const { accessToken } = req.body;
  getAuth()
    .verifyIdToken(accessToken)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      picture = picture.replace("s96-c", "s384-c");
      let user = await userModel
        .findOne({ "personal_info.email": email })
        .select(
          "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });

      if (user) {
        // login
        if (!user.google_auth) {
          return res.status(403).json({
            error:
              "This email was signed up without google. Please log in with password to access the account",
          });
        }
      } else {
        // signup
        let username = await generateUsername(email);

        user = await userModel
          .create({
            personal_info: {
              fullname: name,
              email,
              username,
              profile_img: picture,
            },
            google_auth: true,
          })
          .then((u) => {
            return u;
          })
          .catch((error) => {
            return res.status(500).json(error.message);
          });
      }
      return res.status(200).json(formateDatatoSend(user));
    })
    .catch((err) => {
      return res.status(500).json({
        error:
          "Failed to authenticate you with google. Try with some other google account",
      });
    });
}

export default { googleAuthController, registerController, signinController };
