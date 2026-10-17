import { app } from "./app";
import { config } from "./config/config";
import { prisma } from "./config/prisma";

const server = () => {
  app.listen(config.PORT, () => {
    prisma.$connect().then(() => {
      console.log(`server is running on port ${config.PORT}`);
    });
  });
};

server();
