import app from "./app";
import { logger } from "./lib/logger";
import { ensureDefaultCategories } from "./lib/ensureDefaults";
import { initMailer } from "./lib/mailer";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start() {
  try {
    initMailer();
    await ensureDefaultCategories();
  } catch (err) {
    logger.error({ err }, "Failed to provision defaults / schema");
    process.exit(1);
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
}

start();