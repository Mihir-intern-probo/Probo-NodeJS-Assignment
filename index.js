const express = require("express");
const routes = require('./routes/userRoutes')
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
dotenv.config();


app.use("/api/routes", routes);


// --------------------------error handling------------------------------
app.use(notFound);
app.use(errorHandler);


app.listen(process.env.PORT, () => {
    console.log(`Server Running at port ${process.env.PORT}`)
  })