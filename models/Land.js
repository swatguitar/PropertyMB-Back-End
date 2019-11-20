const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
  "land",
  {
    ID_Lands: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    ColorType: {
      type: Sequelize.STRING
    },
    AnnounceTH: {
      type: Sequelize.STRING
    },
    CodeDeed: {
      type: Sequelize.STRING
    },
    TypeCode: {
      type: Sequelize.STRING
    },
    CodeProperty: {
      type: Sequelize.STRING
    },
    SellPrice: {
      type: Sequelize.STRING
    },
    Costestimate: {
      type: Sequelize.STRING
    },
    CostestimateB: {
      type: Sequelize.STRING
    },
    MarketPrice: {
      type: Sequelize.STRING
    },
    PriceWA: {
      type: Sequelize.STRING
    },
    LandR: {
      type: Sequelize.STRING
    },
    LandG: {
      type: Sequelize.STRING
    },
    LandWA: {
      type: Sequelize.STRING
    },
    Land: {
      type: Sequelize.STRING
    },
    Deed: {
      type: Sequelize.STRING
    },
    RoadType: {
      type: Sequelize.STRING
    },
    RoadWide: {
      type: Sequelize.STRING
    },
    GroundLevel: {
      type: Sequelize.STRING
    },
    GroundValue: {
      type: Sequelize.STRING
    },
    MoreDetails: {
      type: Sequelize.STRING
    },
    Latitude: {
      type: Sequelize.STRING
    },
    Longitude: {
      type: Sequelize.STRING
    },
    AsseStatus: {
      type: Sequelize.STRING
    },
    ObservationPoint: {
      type: Sequelize.STRING
    },
    Location: {
      type: Sequelize.STRING
    },
    LProvince: {
      type: Sequelize.STRING
    },
    LAmphur: {
      type: Sequelize.STRING
    },
    LDistrict: {
      type: Sequelize.STRING
    },
    LZipCode: {
      type: Sequelize.STRING
    },
    ContactUo: {
      type: Sequelize.TINYINT
    },
    ContactSo: {
      type: Sequelize.STRING
    },
    ContactUt: {
      type: Sequelize.TINYINT
    },
    ContactSt: {
      type: Sequelize.STRING
    },
    ContactU: {
      type: Sequelize.TINYINT
    },
    ContactS: {
      type: Sequelize.STRING
    },
    Place: {
      type: Sequelize.STRING
    },
    Blind: {
      type: Sequelize.TINYINT
    },
    Neareducation: {
      type: Sequelize.TINYINT
    },
    Cenmarket: {
      type: Sequelize.TINYINT
    },
    Market: {
      type: Sequelize.TINYINT
    },
    River: {
      type: Sequelize.TINYINT
    },
    Mainroad: {
      type: Sequelize.TINYINT
    },
    Insoi: {
      type: Sequelize.TINYINT
    },
    Letc: {
      type: Sequelize.STRING
    },
    WxD: {
      type: Sequelize.STRING
    },
    LandAge: {
      type: Sequelize.STRING
    },
    PPStatus: {
      type: Sequelize.STRING
    },
    ImageEX: {
      type: Sequelize.STRING
    },
    Owner: {
      type: Sequelize.STRING
    },
    Created: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  },
  {
    timestamps: false
  }
);
