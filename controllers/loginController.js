const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const Joi = require("joi");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "Demasiados intentos de inicio de sesión, intente nuevamente en 15 minutos",
});

// Definir el esquema de validación con Joi
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports = {
  login: async (req, res) => {
    try {
      limiter(req, res, async () => {
        // Validar los datos de entrada usando Joi
        const { error } = loginSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = req.body;

        // Buscar el email en la base de datos
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
          return res.status(404).json({ message: "Email no existe" });
        }

        // Comprobar si la contraseña es correcta
        const isValidPass = await bcrypt.compare(password, user.password);
        if (!isValidPass) {
          return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar un token
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          "secreto", // Clave secreta para firmar el token
          { expiresIn: "1h" } // Duración del token
        );

        // Devolver el token en la respuesta
        return res.status(200).json({ token: token });
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error en la función de rate limiting" });
    }
  },
};
