import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import moviesRouter from "./routes/movies.routes.js";
import usersRouter from "./routes/users.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", { title: "MovieStream" });
});

app.use("/movies", moviesRouter);
app.use("/users", usersRouter);

app.use((req, res) => {
  res.status(404).render("error", { title: "Not found", message: "Ruta no encontrada" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render("error", { title: "Error", message: "Ocurrió un error interno" });
});

export default app;