import express from "express";
import { createMovie, deleteMovie, getMovieFormData, listMovies, updateMovie } from "../movies/movieService.js";
import { isValidObjectId } from "../db/mongo.js";

const router = express.Router();

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { movies } = await listMovies();
    res.render("movies/index", { title: "Movies", movies });
  })
);

router.get(
  "/new",
  asyncHandler(async (req, res) => {
    const { genres } = await getMovieFormData();
    res.render("movies/new", { title: "Create movie", movie: null, genres });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    await createMovie(req.body);
    res.redirect("/movies");
  })
);

router.get(
  "/edit/:id",
  asyncHandler(async (req, res) => {
    const { movie, genres } = await getMovieFormData(req.params.id);

    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    res.render("movies/edit", { title: "Edit movie", movie, genres });
  })
);

router.post(
  "/edit/:id",
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid movie id");
    }

    await updateMovie(req.params.id, req.body);
    res.redirect("/movies");
  })
);

router.post(
  "/delete/:id",
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid movie id");
    }

    await deleteMovie(req.params.id);
    res.redirect("/movies");
  })
);

export default router;