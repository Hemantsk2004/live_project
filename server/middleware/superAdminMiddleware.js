const superAdminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Access denied: SuperAdmin only",
    });
  }
  next();
};

module.exports = superAdminMiddleware;
