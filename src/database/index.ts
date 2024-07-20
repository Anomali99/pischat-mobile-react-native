import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

enablePromise(true);

interface User {
  user_uuid: string;
  username: string;
  name: string;
}

const getDBConnection = async (): Promise<SQLiteDatabase> => {
  return openDatabase({name: 'user.db', location: 'default'});
};

const createTable = async (): Promise<void> => {
  const db = await getDBConnection();
  const query = `CREATE TABLE IF NOT EXISTS user(
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      user_uuid TEXT NOT NULL,
                      username TEXT NOT NULL,
                      name TEXT NOT NULL
                    );`;

  await db.executeSql(query);
};

const getUser = async (): Promise<User | null> => {
  try {
    const db = await getDBConnection();
    const result = await db.executeSql(
      `SELECT user_uuid, username, name FROM user LIMIT 1`,
    );
    return result[0].rows.item(0) as User;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get user');
  }
};

const addUser = async (user: User): Promise<void> => {
  try {
    const db = await deleteUser();
    const insertQuery = `INSERT INTO user (user_uuid, username, name) VALUES (?, ?, ?)`;
    await db.executeSql(insertQuery, [
      user.user_uuid,
      user.username,
      user.name,
    ]);
  } catch (error) {
    console.error(error);
    throw Error('Failed to add user');
  }
};

const deleteUser = async (): Promise<SQLiteDatabase> => {
  try {
    const db = await getDBConnection();
    const deleteQuery = `DELETE FROM user`;
    await db.executeSql(deleteQuery);
    return db;
  } catch (error) {
    console.error(error);
    throw Error('Failed to delete users');
  }
};

export {createTable, addUser, getUser, deleteUser};
