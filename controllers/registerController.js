const bcrypt = require("bcrypt");
const Joi = require("joi");
const User = require("../models/user");

module.exports = {
  register: async (req, res) => {
    const { userName, firstName, lastName, email, phone, password, isAdmin } =
      req.body;

    // Definir el esquema de validación con Joi
    const schema = Joi.object({
      userName: Joi.string().alphanum().min(3).max(30).required(),
      firstName: Joi.string().alphanum().min(3).max(30).required(),
      lastName: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string()
        .regex(/^\d{8}$/)
        .messages({
          "string.pattern.base": "El numero telefónico debe tener 8 digitos",
        })
        .required(),
      password: Joi.string()
        .pattern(
          new RegExp(`^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$`)
        )
        .messages({
          "string.pattern.base":
            "La contraseña debe tener al menos 8 caracteres, una letra y un número",
        })
        .required(),
      isAdmin: Joi.boolean().optional(),
    });

    // Validar los datos de la petición
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      // Comprobar si el usuario existe con email, user o phone
      const userExist = await User.findOne({ where: { userName: userName } });
      const emailExist = await User.findOne({ where: { email: email } });
      const numberExist = await User.findOne({ where: { phone: phone } });
      if (userExist || emailExist || numberExist) {
        return res
          .status(409)
          .json({ message: "El usuario, correo o telefono ya fue registrado" });
      } else {
        // Encriptar contraseña antes de guardarla
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await User.create({
          userName,
          firstName,
          lastName,
          email,
          phone,
          password: hashedPassword,
          isAdmin,
        });
        res.status(201).json(user);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ message: errorMessages });
      }
      if (error.name === "SequelizeUniqueConstraintError") {
        let errorMessages = error.errors.map((err) => err.message);
        return res.status(409).json({ message: errorMessages });
      }
      res.status(500).json({ message: "El usuario no pudo ser creado" });
    }
  },
};
