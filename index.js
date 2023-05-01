import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/postRoutes.js";
import userRouter from "./routes/userRoutes.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/posts", postRoutes);
app.use("/users",userRouter);


// mongoose
//   .connect("mongodb://localhost/memories")
//   .then((res) => console.log("Connection successfully"))
//   .catch((err) => console.log(err));
// , { useNewUrlParser: true, useUnifiedTopology: true }

const CONNECTION_URL = process.env.MONGO_URI;
const PORT = 5000;

app.get("/", async (req, res) => {
    res.send("server is running on port 8000 with protfolio");
  });

mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((err) => console.log(err.message));

  




