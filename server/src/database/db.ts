import { Sequelize } from "sequelize";

const { DB_NAME, DB_PORT, DB_USER, DB_URL, DB_PASSWORD, DB_HOST } = process.env;

if (!DB_NAME) {
  throw new Error(
    "Отсутствует название базы данных. Введите в .env DB_NAME=`Ваше название`"
  );
}

if (!DB_USER) {
  throw new Error(
    "Отсутствует имя пользователя. Введите в .env DB_USER=`Имя пользователя`"
  );
}

if (!Number(DB_PORT)) {
  throw new Error(
    "Порт базы данных не является числом. Введите в .env DB_PORT=`Числовое значение`"
  );
}

let sequelize;

if (DB_URL) {
  sequelize = new Sequelize(DB_URL);
} else {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    dialect: "postgres",
    host: DB_HOST,
    port: Number(DB_PORT),
  });
}
export const db = sequelize;
