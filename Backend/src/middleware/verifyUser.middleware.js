import jwt from "jsonwebtoken";
const verifyUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (accessToken == null) {
    return res.status(401).json({
      error: "Unautherised Access",
    });
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: "Invalid Access token",
      });
    }
    req.user = user.id;
    next();
  });
};

export default verifyUser;
