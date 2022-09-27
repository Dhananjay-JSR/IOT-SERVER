import { Sequelize, DataTypes } from "sequelize";
import { logger } from "./logger";
const sequelize = new Sequelize("iot", "root", "", {
    logging: (msg) => logger.warn(msg),
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    timezone: "+05:30",
  });

export default sequelize
  