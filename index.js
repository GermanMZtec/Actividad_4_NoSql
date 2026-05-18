import dotenv from "dotenv";
import app from "./src/app.js";
import { closeDb, connectDb } from "./src/db/mongo.js";

dotenv.config();

const port = process.env.PORT || 3000;

async function start() {
  await connectDb();

  app.listen(port, () => {
    console.log(`MovieStream running on port ${port}`);
  });
}

start().catch((error) => {
  console.error("Unable to start the server:", error);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await closeDb();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeDb();
  process.exit(0);
});