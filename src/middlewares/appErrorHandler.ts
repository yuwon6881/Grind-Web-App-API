process.on("uncaughtException", (error) => {
  console.error("Uncaught error", error);
  process.exit(1);
});

process.on("uncaughtRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", promise, "reason:", reason);
  process.exit(1);
});
