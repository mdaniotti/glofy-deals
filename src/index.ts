import "dotenv/config";
import app from "./app";

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
