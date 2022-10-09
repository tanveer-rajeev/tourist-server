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

const CONNECTION_URL = process.env.MONGOURI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((err) => console.log(err.message));
mongoose.set("useFindAndModify", false);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
