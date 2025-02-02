const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const DEFAULT_PORT = process.env.PORT || 3000;

const courseRouter = require("./routers/course-router");
const questionRouter = require("./routers/question-router");
const defaultRouter = require("./routers/default-router");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use(courseRouter);
app.use(questionRouter);
app.use(defaultRouter);

mongoose
  .connect("mongodb://admin:password@localhost:27042/course-catalog", {
    authSource: "admin",
  })
  .then(() => {
    console.log("MongoDB started!");

    const server = app.listen(DEFAULT_PORT, () => {
      console.log(`API running on port ${DEFAULT_PORT} ...`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `Port ${DEFAULT_PORT} is already in use. Finding a new port...`
        );
        const dynamicServer = app.listen(0, () => {
          const newPort = dynamicServer.address().port;
          console.log(`API now running on port ${newPort} ...`);
        });
      } else {
        console.error("Server error:", err);
      }
    });

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Closing MongoDB connection...");
      await mongoose.connection.close();
      console.log("MongoDB connection closed. Exiting...");
      process.exit(0);
    });
  })
  .catch((error) => console.log("MongoDB connection error:", error));
