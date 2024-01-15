process.on("uncaughtException", (err) => {
  console.error("Uncaught error", err);
  process.exit(1);
});

process.on("uncaughtRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", promise, "reason:", reason);
  process.exit(1);
});
