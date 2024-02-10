import merge from "lodash/merge";
import testing = require("./testing");
import dev = require("./dev");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

let envConfig = {};

switch (process.env.NODE_ENV) {
  case "test":
    envConfig = testing.default;
    break;
  default:
    envConfig = dev.default;
}

export default merge(
  {
    port: 8000,
    secrets: {
      jwt: process.env.JWT_SECRET,
      dbUrl: process.env.DATABASE_URL,
    },
  },
  envConfig,
);
