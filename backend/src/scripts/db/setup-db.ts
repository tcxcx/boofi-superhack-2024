import { setupDatabase } from "../../lib/migrations";

(async () => {
  await setupDatabase();
  console.log("Database setup successfully.");
})();
