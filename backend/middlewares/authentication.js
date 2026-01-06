import jwt from "jsonwebtoken";

export const authentication = (req, res, next) => {
  const token = req.cookies?.jwt || req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Something went wrong', error)
    res.status(401).json({ message: " Invalid token or expired token" });
  }
};


export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('req.user:', req.user);  // ← Check this
    console.log('req.user.role:', req.user?.role);  // ← Check this
    console.log('allowedRoles:', allowedRoles);  // ← Check this
    
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
};


