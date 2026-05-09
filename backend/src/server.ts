import { createServer } from "http";
import app from "./app";
import { env } from "./config/env";

const httpServer = createServer(app);

httpServer.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
