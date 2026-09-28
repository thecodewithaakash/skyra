import app from "./app/app.js";
import connectDB from "./config/db.config.js";

await connectDB();

app.listen(3000, () =>
  console.log(`server is listening at http://localhost:3000`),
);
