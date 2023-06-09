const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sequelize = require("./config/database");
const User = require("./models/user");
const errorHandler = require("./utils/errorHandler")
const cors = require("cors")

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const registerRouter = require("./routes/register")
const loginRouter = require("./routes/login")
const fieldRouter = require("./routes/field")

const app = express();

// async function pruebaConexion() {
//   try {
//     await sequelize.authenticate();
//     console.log("Conexion establecida correctamente");
//   } catch (error) {
//     console.error("No fue posible conectar la aplicacion", error);
//   }
// }

// pruebaConexion();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");


app.use(cors())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/register",registerRouter)
app.use("/api/login",loginRouter)
app.use("/api/field",fieldRouter)

app.use(errorHandler)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
