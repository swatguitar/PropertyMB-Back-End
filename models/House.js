const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
  "propertys",
  {
    ID_Property: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    PropertyType: {
      type: Sequelize.STRING
    },
    AnnounceTH: {
      type: Sequelize.STRING
    },
    CodeDeed: {
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
    BathRoom: {
      type: Sequelize.STRING
    },
    BedRoom: {
      type: Sequelize.STRING
    },
    CarPark: {
      type: Sequelize.STRING
    },
    HouseArea: {
      type: Sequelize.STRING
    },
    Floor: {
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
    LandU: {
      type: Sequelize.STRING
    },
    HomeCondition: {
      type: Sequelize.STRING
    },
    BuildingAge: {
      type: Sequelize.STRING
    },
    BuildFD: {
      type: Sequelize.STRING
    },
    BuildFM: {
      type: Sequelize.STRING
    },
    BuildFY: {
      type: Sequelize.STRING
    },
    Directions: {
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
    airconditioner: {
      type: Sequelize.TINYINT
    },
    afan: {
      type: Sequelize.TINYINT
    },
    AirPurifier: {
      type: Sequelize.TINYINT
    },
    Waterheater: {
      type: Sequelize.TINYINT
    },
    WIFI: {
      type: Sequelize.TINYINT
    },
    TV: {
      type: Sequelize.TINYINT
    },
    refrigerator: {
      type: Sequelize.TINYINT
    },
    microwave: {
      type: Sequelize.TINYINT
    },
    gasstove: {
      type: Sequelize.TINYINT
    },
    wardrobe: {
      type: Sequelize.TINYINT
    },  
    TCset: {
      type: Sequelize.TINYINT
    },
    sofa: {
      type: Sequelize.TINYINT
    },
    shelves: {
      type: Sequelize.TINYINT
    },
    CCTV: {
      type: Sequelize.TINYINT
    },
    Securityguard: {
      type: Sequelize.TINYINT
    },
    pool: {
      type: Sequelize.TINYINT
    },
    Fitness: {
      type: Sequelize.TINYINT
    },
    Publicarea: {
      type: Sequelize.TINYINT
    },
    ShuttleBus: {
      type: Sequelize.TINYINT
    }, 
    WVmachine: {
      type: Sequelize.TINYINT
    },
    CWmachine: {
      type: Sequelize.TINYINT
    },
    Elevator: {
      type: Sequelize.TINYINT
    },
    Lobby: {
      type: Sequelize.TINYINT
    },
    ATM: {
      type: Sequelize.TINYINT
    },
    BeautySalon: {
      type: Sequelize.TINYINT
    },
    Balcony: {
      type: Sequelize.TINYINT
    },
    EventR: {
      type: Sequelize.TINYINT
    },
    MeetingR: {
      type: Sequelize.TINYINT
    },
    LivingR: {
      type: Sequelize.TINYINT
    },
    Hairsalon: {
      type: Sequelize.TINYINT
    },
    Laundry: {
      type: Sequelize.TINYINT
    },
    Store: {
      type: Sequelize.TINYINT
    },
    Supermarket: {
      type: Sequelize.TINYINT
    },
    CStore: {
      type: Sequelize.TINYINT
    },
    MFee: {
      type: Sequelize.STRING
    },
    Kitchen: {
      type: Sequelize.TINYINT
    },
    LandAge: {
      type: Sequelize.STRING
    },
    PPStatus: {
      type: Sequelize.STRING
    },
    ImageEX : {
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
