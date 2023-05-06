import { db } from "../database/db";
import { DataTypes } from "sequelize";

const User = db.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true },
  birthday: { type: DataTypes.STRING  , unique: false },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING, unique: true },
  confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const Event = db.define("event", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  isPrivate: { type: DataTypes.BOOLEAN, defaultValue: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
});

const DateRange = db.define("dateRange", {
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: true },
});

const Location = db.define("location", {
  longitude: { type: DataTypes.DOUBLE, allowNull: false },
  latitude: { type: DataTypes.DOUBLE, allowNull: false },
});

const Tag = db.define("tag", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const Subscription = db.define("subscription", {
  subscriptionDate: { type: DataTypes.DATE, allowNull: false },
});

const Mark = db.define("mark", {
  isLiked: { type: DataTypes.BOOLEAN, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
});

User.hasMany(Event);
Event.belongsTo(User);

Event.hasOne(DateRange);
DateRange.belongsTo(Event);

Event.hasOne(Location);
Location.belongsTo(Event);

Event.hasMany(Tag);
Tag.belongsTo(Event);

Event.hasMany(Subscription);
Subscription.belongsTo(Event);

Event.hasMany(Mark);
Mark.belongsTo(Event);

export { User, Event, Mark, Location, Tag, DateRange };
