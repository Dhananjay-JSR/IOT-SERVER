const { DataTypes } = require('sequelize');
import sequelize from "../DB_connection";
import moment from "moment";

const XNG1037 = sequelize.define("XNG1037", {
    vid: {
      type: DataTypes.STRING,
      defaultValue: "XNG1037",
    },
    id: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    created: {
      type: DataTypes.DATE,
      primaryKey: true,
    },
    inserted: {
      type: DataTypes.DATE,
      defaultValue: moment().format("YYYY-MM-DD hh:mm:ss"),
    },
    cell_1: {
      type: DataTypes.FLOAT,
    },
    cell_2: {
      type: DataTypes.FLOAT,
    },
    cell_3: {
      type: DataTypes.FLOAT,
    },
    cell_4: {
      type: DataTypes.FLOAT,
    },
    cell_5: {
      type: DataTypes.FLOAT,
    },
    cell_6: {
      type: DataTypes.FLOAT,
    },
    cell_7: {
      type: DataTypes.FLOAT,
    },
    cell_8: {
      type: DataTypes.FLOAT,
    },
    cell_9: {
      type: DataTypes.FLOAT,
    },
    cell_10: {
      type: DataTypes.FLOAT,
    },
    cell_11: {
      type: DataTypes.FLOAT,
    },
    cell_12: {
      type: DataTypes.FLOAT,
    },
    cell_13: {
      type: DataTypes.FLOAT,
    },
    cell_14: {
      type: DataTypes.FLOAT,
    },
    avg_cell: {
      type: DataTypes.FLOAT,
    },
    pack_voltage: {
      type: DataTypes.FLOAT,
    },
    current: {
      type: DataTypes.FLOAT,
    },
    battery_percent: {
      type: DataTypes.FLOAT,
    },
  });

export default XNG1037