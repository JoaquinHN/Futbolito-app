const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Reservation = sequelize.define(
  "Reservation",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "fields",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    paymentImage: {
      type: DataTypes.STRING, // o DataTypes.TEXT si quieres permitir imágenes más grandes
      allowNull: false,
    },
  },
  {
    tableName: "reservations",
  }
);

module.exports = Reservation;
