import { DataTypes } from "sequelize";

import { db as database } from "../database/db";

const User = database.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true },
  birthday: { type: DataTypes.STRING  , unique: false },
  email: { type: DataTypes.STRING, unique: true },
  avatar: { type: DataTypes.STRING, allowNull: true },
  password: { type: DataTypes.STRING, unique: true },
  confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const Event = database.define("event", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  isPrivate: { type: DataTypes.BOOLEAN, defaultValue: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
});

const DateRange = database.define("dateRange", {
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: true },
});

const Location = database.define("location", {
  longitude: { type: DataTypes.DOUBLE, allowNull: false },
  latitude: { type: DataTypes.DOUBLE, allowNull: false },
});

const Tag = database.define("tag", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const Subscription = database.define("subscription", {
  subscriptionDate: { type: DataTypes.DATE, allowNull: false },
});

const Mark = database.define("mark", {
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
