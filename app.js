require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./src/config");
const userRouter = require("./src/Routes/userRoutes");
const authRouter = require("./src/Routes/authRoutes");
const noteRouter = require("./src/Routes/noteRroutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", noteRouter);
app.use("/public", express.static("public"));

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection success");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Sync models");
    app.listen(port, () => {
      console.log(`Server listen on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Connection fail", error);
    process.exit(1); // Forzar la terminación del proceso en caso de error de conexión
  });
