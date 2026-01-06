const superAdminMiddleware = (req, res, next) => {
  // ✅ Defensive check
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Access denied: SuperAdmin only",
    });
  }

  next();
};

module.exports = superAdminMiddleware;
