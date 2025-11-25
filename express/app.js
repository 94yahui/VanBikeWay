import express from "express";
import router from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))

app.use("/api",router);

const server = app.listen(3000,()=> console.log("Listening on port 3000!"));
