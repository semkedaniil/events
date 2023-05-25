import {DataTypes} from "sequelize";

import {db as database} from "../database/db";

const User = database.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, unique: true},
    birthday: {type: DataTypes.STRING, unique: false},
    email: {type: DataTypes.STRING, unique: true},
    avatar: {type: DataTypes.STRING, allowNull: true},
    password: {type: DataTypes.STRING, unique: true},
    confirmed: {type: DataTypes.BOOLEAN, defaultValue: false},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
});

const Event = database.define("event", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    isPrivate: {type: DataTypes.BOOLEAN, defaultValue: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    startDate: {type: DataTypes.DATE, allowNull: false},
    endDate: {type: DataTypes.DATE, allowNull: true},
});

const Location = database.define("location", {
    longitude: {type: DataTypes.DOUBLE, allowNull: false},
    latitude: {type: DataTypes.DOUBLE, allowNull: false},
}, {omitNull: true});

const Images = database.define("images", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    url: {type: DataTypes.STRING, allowNull: false},
});


const Tag = database.define("tag", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
});

const Subscription = database.define("subscription", {
    subscriptionDate: {type: DataTypes.DATE, allowNull: false},
});

const Mark = database.define("mark", {
    isLiked: {type: DataTypes.BOOLEAN, allowNull: true},
    date: {type: DataTypes.DATE, allowNull: true},
});

User.hasMany(Event);
Event.belongsTo(User);

Event.hasOne(Location);
Location.belongsTo(Event);

Event.hasMany(Tag);
Tag.belongsTo(Event);

Event.hasMany(Images);
Images.belongsTo(Event);

User.hasMany(Subscription);
Subscription.belongsTo(User);

Event.hasMany(Subscription);
Subscription.belongsTo(Event);

Event.hasMany(Mark);
Mark.belongsTo(Event);

User.hasMany(Mark);
Mark.belongsTo(User);

export {User, Event, Mark, Location, Tag, Images, Subscription};
