import merge from "lodash/merge";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

let envConfig = {};

switch (process.env.NODE_ENV) {
  case "test":
    envConfig = require("./testing").default;
    break;
  default:
    envConfig = require("./dev").default;
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
