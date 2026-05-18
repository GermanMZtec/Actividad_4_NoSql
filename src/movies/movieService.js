import { getDb, isValidObjectId, toObjectId } from "../db/mongo.js";

function normalizeGenres(rawGenres) {
  if (!rawGenres) {
    return [];
  }

  const values = Array.isArray(rawGenres) ? rawGenres : [rawGenres];

  return values.filter(Boolean).map((genreId) => toObjectId(genreId));
}

function normalizeActors(body) {
  const actors = [
    { name: body.actorName1, character: body.actorCharacter1 },
    { name: body.actorName2, character: body.actorCharacter2 },
    { name: body.actorName3, character: body.actorCharacter3 }
  ];

  return actors
    .map((actor) => ({
      name: String(actor.name || "").trim(),
      character: String(actor.character || "").trim()
    }))
    .filter((actor) => actor.name || actor.character);
}

function parsePrice(value) {
  return Number.parseFloat(value) || 0;
}

function toMovieView(movie, genreNames = []) {
  return {
    ...movie,
    _id: movie._id.toString(),
    genreIds: (movie.genres || []).map((genreId) => genreId.toString()),
    genreNames,
    actors: movie.actors || [],
    createdAtLabel: movie.createdAt ? new Date(movie.createdAt).toLocaleDateString("es-ES") : ""
  };
}

export async function listMovies() {
  const db = getDb();
  const [movies, genres] = await Promise.all([
    db.collection("movies").find({}).sort({ createdAt: -1 }).toArray(),
    db.collection("genres").find({}).sort({ name: 1 }).toArray()
  ]);

  const genreMap = new Map(genres.map((genre) => [genre._id.toString(), genre.name]));

  return {
    movies: movies.map((movie) => {
      const genreNames = (movie.genres || [])
        .map((genreId) => genreMap.get(genreId.toString()))
        .filter(Boolean);

      return toMovieView(movie, genreNames);
    }),
    genres
  };
}

export async function getMovieFormData(id) {
  const db = getDb();
  const genres = await db.collection("genres").find({}).sort({ name: 1 }).toArray();

  if (!id) {
    return { movie: null, genres };
  }

  if (!isValidObjectId(id)) {
    return { movie: null, genres };
  }

  const movie = await db.collection("movies").findOne({ _id: toObjectId(id) });

  if (!movie) {
    return { movie: null, genres };
  }

  return {
    movie: toMovieView(movie),
    genres
  };
}

export async function createMovie(body) {
  const db = getDb();

  const movieDocument = {
    title: String(body.title || "").trim(),
    genres: normalizeGenres(body.genres),
    actors: normalizeActors(body),
    listPrice: parsePrice(body.listPrice),
    createdAt: new Date()
  };

  return db.collection("movies").insertOne(movieDocument);
}

export async function updateMovie(id, body) {
  const db = getDb();

  const movieDocument = {
    title: String(body.title || "").trim(),
    genres: normalizeGenres(body.genres),
    actors: normalizeActors(body),
    listPrice: parsePrice(body.listPrice)
  };

  return db.collection("movies").updateOne({ _id: toObjectId(id) }, { $set: movieDocument });
}

export async function deleteMovie(id) {
  const db = getDb();
  return db.collection("movies").deleteOne({ _id: toObjectId(id) });
}