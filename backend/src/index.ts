import app from "./app"; // Remove the .js extension
import { connectToDatabase } from "./db/connection"; // Remove the .js extension

// Server Configuration
const PORT = process.env.PORT || 5000;

// Connect to the database and start the server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} and connected to the database 🤟`);
    });
  })
  .catch((err) => console.error("Failed to connect to the database", err));
