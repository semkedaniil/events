import { Sequelize } from "sequelize";

const { DB_URL } = process.env;

if (!DB_URL) {
  throw new Error(
    "Отсутствует название базы данных. Введите в .env DB_NAME=`Ваше название`"
  );
}

// if (!DB_USER) {
//   throw new Error(
//     "Отсутствует имя пользователя. Введите в .env DB_USER=`Имя пользователя`"
//   );
// }
//
// if (!Number(DB_PORT)) {
//   throw new Error(
//     "Порт базы данных не является числом. Введите в .env DB_PORT=`Числовое значение`"
//   );
// }

export const db = new Sequelize(DB_URL);
