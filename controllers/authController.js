const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware de autenticación
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decoded = jwt.verify(token, "secreto");
    const user = await User.findOneOrFail({
      where: { id: decoded.id },
    });
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === "EntityNotFoundError") {
      res.status(401).json({ message: "No está autorizado" });
    } else {
      errorHandler(res, error);
    }
  }
};

// Middleware para permitir solo a los usuarios con isAdmin = true
const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "No está autorizado para acceder a esta ruta" });
  }
  next();
};

module.exports = {
  // Ruta protegida que requiere autenticación
  getProtectedData: async (req, res) => {
    try {
      res.status(200).json({
        message: "¡Esta ruta solo es accesible para usuarios autenticados!",
        user: req.user,
      });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Ruta protegida que requiere autenticación y permiso de administrador
  getAdminData: async (req, res) => {
    try {
      res.status(200).json({
        message:
          "¡Esta ruta solo es accesible para usuarios autenticados con isAdmin = true!",
        user: req.user,
      });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Middleware para proteger la ruta y permitir solo a los usuarios con isAdmin = true
  adminRoute: [authMiddleware, adminMiddleware],
};
