const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/database");


const Field = sequelize.define(
  "Field",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    fieldName: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    pricePerHour: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: {
        notZeroOrNegative(value){
            if(value<=0){
                throw new Error("El precio por hora debe ser mayor que cero");
            }
        }
      }
    },
    image:{
        type: DataTypes.BLOB,
        allowNull: true,
        validate:{
            isBase64: true
        }
    },
    fieldAveragePlayers:{
        type: DataTypes.STRING,
        allowNull: true
    }
  },
  {
    tableName: "fields",
  }
);
Field.sync()

module.exports = Field;