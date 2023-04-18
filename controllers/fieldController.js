const Field = require("../models/field");
const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");

// Obtener todos los fields
exports.getFields = async (req, res) => {
  try {
    const fields = await Field.findAll();
    res.json(fields);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener los fields" });
  }
};

// Obtener un field por ID
exports.getFieldById = async (req, res) => {
  const { id } = req.params;
  try {
    const field = await Field.findByPk(id);
    if (!field) {
      return res.status(404).json({ message: "Field no encontrado" });
    }
    res.json(field);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el field" });
  }
};

// Crear un nuevo field
exports.createField = async (req, res) => {
  const { fieldName, description, pricePerHour, image, fieldAveragePlayers } =
    req.body;
  
  // Validar los datos de entrada
  const schema = Joi.object({
    fieldName: Joi.string().min(3).max(30).required(),
    description: Joi.string().max(200).required(),
    pricePerHour: Joi.number().positive().precision(2).required(),
    image: Joi.string().allow(null, ''),
    fieldAveragePlayers: Joi.string().allow(null, ''),
  });
  
  try {
    const validatedData = await schema.validateAsync({
      fieldName,
      description,
      pricePerHour,
      image,
      fieldAveragePlayers
    });
    
    // Limpiar la descripción del field
    const cleanDescription = sanitizeHtml(validatedData.description);
    
    // Crear el field
    const newField = await Field.create({
      fieldName: validatedData.fieldName,
      description: cleanDescription,
      pricePerHour: validatedData.pricePerHour,
      image: validatedData.image,
      fieldAveragePlayers: validatedData.fieldAveragePlayers,
    });

    res.status(201).json({ message: "Field creado", field: newField });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el field" });
  }
};

// Actualizar un field existente
exports.updateField = async (req, res) => {
  try {
    // Validar datos de entrada con Joi
    const schema = Joi.object({
      fieldName: Joi.string().max(30),
      description: Joi.string().max(200),
      pricePerHour: Joi.number().positive(),
      image: Joi.string(),
      fieldAveragePlayers: Joi.string(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const field = await Field.findByPk(id);

    if (!field) {
      return res.status(404).json({ message: "Cancha no encontrada" });
    }

    // Sanitizar datos de entrada con sanitize-html
    const sanitizedFieldName = sanitizeHtml(req.body.fieldName, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const sanitizedDescription = sanitizeHtml(req.body.description, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const sanitizedImage = sanitizeHtml(req.body.image, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const sanitizedFieldAveragePlayers = sanitizeHtml(
      req.body.fieldAveragePlayers,
      { allowedTags: [], allowedAttributes: {} }
    );

    // Actualizar campo en la base de datos
    const updatedField = await field.update({
      fieldName: sanitizedFieldName || field.fieldName,
      description: sanitizedDescription || field.description,
      pricePerHour: req.body.pricePerHour || field.pricePerHour,
      image: sanitizedImage || field.image,
      fieldAveragePlayers:
        sanitizedFieldAveragePlayers || field.fieldAveragePlayers,
    });

    return res.json(updatedField);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};



// Controlador para eliminar una cancha
exports.deleteField = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscamos la cancha a eliminar
    const field = await Field.findByPk(id);

    // Si no existe, retornamos un error
    if (!field) {
      return res.status(404).json({ msg: "La cancha no existe" });
    }

    // Eliminamos la cancha
    await field.destroy();

    res.json({ msg: "Cancha eliminada exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
