import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || "moviestream";

const client = new MongoClient(uri);

const genresSeed = [
  { name: "Action" },
  { name: "Comedy" },
  { name: "Drama" },
  { name: "Sci-Fi" },
  { name: "Animation" }
];

const movieTemplates = [
  {
    title: "Galaxy Strike",
    genres: [0, 3],
    actors: [
      { name: "Ana Torres", character: "Captain Vega" },
      { name: "Luis Vega", character: "Commander Ray" }
    ],
    listPrice: 12.99
  },
  {
    title: "The Last Ticket",
    genres: [1, 2],
    actors: [
      { name: "Marta Ruiz", character: "Clara" },
      { name: "Diego León", character: "Tomás" }
    ],
    listPrice: 9.99
  },
  {
    title: "Neon Harbor",
    genres: [0, 2, 3],
    actors: [
      { name: "Sofía Pérez", character: "Iris" },
      { name: "Javier Mora", character: "Nolan" }
    ],
    listPrice: 14.5
  },
  {
    title: "Family Code",
    genres: [1, 4],
    actors: [
      { name: "Carla Flores", character: "Luna" },
      { name: "Pablo Díaz", character: "Milo" }
    ],
    listPrice: 8.75
  },
  {
    title: "After the Storm",
    genres: [2],
    actors: [
      { name: "Elena Cruz", character: "Valeria" },
      { name: "Raúl Navarro", character: "Héctor" }
    ],
    listPrice: 11.25
  }
];

const usersSeed = [
  { firstName: "Ana", lastName: "López", email: "ana.lopez@example.com", demographics: { age: 20, education: "University", incomeLevel: "Low" }, survey: { rating: 4, wouldRecommend: true } },
  { firstName: "Bruno", lastName: "Castillo", email: "bruno.castillo@example.com", demographics: { age: 23, education: "University", incomeLevel: "Medium" }, survey: { rating: 5, wouldRecommend: true } },
  { firstName: "Carla", lastName: "Mendoza", email: "carla.mendoza@example.com", demographics: { age: 25, education: "College", incomeLevel: "Medium" }, survey: { rating: 3, wouldRecommend: false } },
  { firstName: "David", lastName: "Silva", email: "david.silva@example.com", demographics: { age: 28, education: "Graduate", incomeLevel: "High" }, survey: { rating: 5, wouldRecommend: true } },
  { firstName: "Elena", lastName: "Ríos", email: "elena.rios@example.com", demographics: { age: 21, education: "University", incomeLevel: "Low" }, survey: { rating: 4, wouldRecommend: true } },
  { firstName: "Fabián", lastName: "Núñez", email: "fabian.nunez@example.com", demographics: { age: 30, education: "College", incomeLevel: "Medium" }, survey: { rating: 2, wouldRecommend: false } },
  { firstName: "Gabriela", lastName: "Ortega", email: "gabriela.ortega@example.com", demographics: { age: 24, education: "University", incomeLevel: "Medium" }, survey: { rating: 4, wouldRecommend: true } },
  { firstName: "Hugo", lastName: "Paz", email: "hugo.paz@example.com", demographics: { age: 27, education: "Graduate", incomeLevel: "High" }, survey: { rating: 5, wouldRecommend: true } },
  { firstName: "Ivana", lastName: "Reyes", email: "ivana.reyes@example.com", demographics: { age: 22, education: "University", incomeLevel: "Low" }, survey: { rating: 3, wouldRecommend: true } },
  { firstName: "Jorge", lastName: "Vargas", email: "jorge.vargas@example.com", demographics: { age: 29, education: "College", incomeLevel: "High" }, survey: { rating: 4, wouldRecommend: true } },
  { firstName: "Karla", lastName: "Luna", email: "karla.luna@example.com", demographics: { age: 19, education: "High School", incomeLevel: "Low" }, survey: { rating: 5, wouldRecommend: true } },
  { firstName: "Leo", lastName: "Cano", email: "leo.cano@example.com", demographics: { age: 26, education: "University", incomeLevel: "Medium" }, survey: { rating: 4, wouldRecommend: true } },
  { firstName: "Mónica", lastName: "Castro", email: "monica.castro@example.com", demographics: { age: 31, education: "Graduate", incomeLevel: "High" }, survey: { rating: 2, wouldRecommend: false } },
  { firstName: "Nicolás", lastName: "Herrera", email: "nicolas.herrera@example.com", demographics: { age: 27, education: "University", incomeLevel: "Medium" }, survey: { rating: 4, wouldRecommend: true } },
  { firstName: "Olivia", lastName: "Santos", email: "olivia.santos@example.com", demographics: { age: 23, education: "College", incomeLevel: "Medium" }, survey: { rating: 5, wouldRecommend: true } }
]

function buildMovies(genreIds) {
  return Array.from({ length: 20 }, (_, index) => {
    const template = movieTemplates[index % movieTemplates.length];
    const offset = index + 1;

    return {
      title: `${template.title} ${offset}`,
      genres: template.genres.map((genreIndex) => genreIds[genreIndex]),
      actors: template.actors,
      listPrice: Number((template.listPrice + index * 0.25).toFixed(2)),
      createdAt: new Date(Date.now() - offset * 86400000)
    };
  });
}

function buildInteractions(userIds, movieIds) {
  const devices = ["web", "mobile", "tablet"];

  return Array.from({ length: 30 }, (_, index) => ({
    userId: userIds[index % userIds.length],
    movieId: movieIds[index % movieIds.length],
    watchedAt: new Date(Date.now() - index * 43200000),
    rating: (index % 5) + 1,
    device: devices[index % devices.length]
  }));
}

async function seed() {
  try {
    await client.connect();

    const db = client.db(dbName);
    const genresCollection = db.collection("genres");
    const moviesCollection = db.collection("movies");
    const usersCollection = db.collection("users");
    const interactionsCollection = db.collection("interactions");

    await Promise.all([
      interactionsCollection.deleteMany({}),
      moviesCollection.deleteMany({}),
      usersCollection.deleteMany({}),
      genresCollection.deleteMany({})
    ]);

    const genresResult = await genresCollection.insertMany(genresSeed);
    const genreIds = Object.values(genresResult.insertedIds);

    const moviesResult = await moviesCollection.insertMany(buildMovies(genreIds));
    const movieIds = Object.values(moviesResult.insertedIds);

    const usersResult = await usersCollection.insertMany(usersSeed);
    const userIds = Object.values(usersResult.insertedIds);

    const interactions = buildInteractions(userIds, movieIds).map((interaction) => ({
      ...interaction,
      userId: new ObjectId(interaction.userId),
      movieId: new ObjectId(interaction.movieId)
    }));

    await interactionsCollection.insertMany(interactions);

    console.log("Seed completed successfully.");
    console.log(`Genres: ${genreIds.length}`);
    console.log(`Movies: ${movieIds.length}`);
    console.log(`Users: ${userIds.length}`);
    console.log(`Interactions: ${interactions.length}`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seed();