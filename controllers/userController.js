const bcrypt = require("bcrypt");
const User = require("../models/user");
const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");

const updateUserSchema = Joi.object({
  userName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .pattern(new RegExp(`^[a-zA-Z]+[a-zA-Z0-9]*$`)),
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^\d{8}$/)
    .messages({
      "string.pattern.base": "El numero telefónico debe tener 8 digitos",
    })
    .required(),
  password: Joi.string()
    .pattern(new RegExp(`^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$`))
    .messages({
      "string.pattern.base":
        "La contraseña debe tener al menos 8 caracteres, una letra y un número",
    })
    .required(),
  isAdmin: Joi.boolean(),
});

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los usuarios" });
    }
  },
  updateUserbyId: async (req, res) => {
    const { id } = req.params;

    // Validar los datos de entrada usando Joi
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message:
          "Contraseña inválida. La contraseña debe contener al menos 8 caracteres, una letra y un número.",
      });
    }

    const { userName, firstName, lastName, email, phone, password, isAdmin } =
      req.body;

    // Sanitizar los datos de entrada
    const sanitizedUserName = sanitizeHtml(userName);
    const sanitizedFirstName = sanitizeHtml(firstName);
    const sanitizedLastName = sanitizeHtml(lastName);
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedPhone = sanitizeHtml(phone);
    const sanitizedPassword = sanitizeHtml(password);
    const sanitizedIsAdmin = sanitizeHtml(isAdmin);

    try {
      const user = await User.findByPk(id);
      if (user) {
        const updateUser = user.update({
          userName: sanitizedUserName,
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          email: sanitizedEmail,
          phone: sanitizedPhone,
          password: sanitizedPassword,
          isAdmin: sanitizedIsAdmin,
        });
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: `Usuario con el ID: ${id} no fue encontrado` });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el usuario" });
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (user) {
        await user.destroy();
        res.status(204).json({ message: "Usuario eliminado correctamente" });
      } else {
        res
          .status(404)
          .json({ message: `Usuario con el ID: ${id} no fue encontrado` });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el usuario" });
    }
  },
  findUserbyId: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: `Usuario con el ID: ${id} no encontrado` });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al encontrar el usuario" });
    }
  },
};
