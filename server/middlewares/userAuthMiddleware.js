import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    
    // Stop execution after sending a response
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode && tokenDecode.id) {
      req.body.userId = tokenDecode.id; // Attach the user ID to the request
      return next(); // Proceed to the next middleware
    } else {
      // Stop execution after sending a response
      return res.status(401).json({
        success: false,
        message: "User not authenticated, login again",
      });
    }
  } catch (error) {
    // Stop execution after sending a response
    return res.status(500).json({
      success: false,
      message: "User not authenticated",
      error: error.message || error,
    });
  }
};

export default userAuth;
