import AsyncStorage from "@react-native-async-storage/async-storage";

export type Article = {
  id: number;
  name: string;
  order: number;
  read: boolean;
  creationDate: Date;
  readDate: Date;
};

export type User = {
  id: number;
  name: string;
  password: string;
  creationDate: Date;
  updateDate: Date;
  active: boolean;
  articles: Article[];
};

export type PartialUser = {
  name?: string;
  password?: string;
  articles: Article[];
};

const USER_DB_KEY = "user_db";

export const getUserDB = async (): Promise<User[]> => {
  try {
    const userDBString = await AsyncStorage.getItem(USER_DB_KEY);
    return userDBString ? JSON.parse(userDBString) : [];
  } catch (error) {
    console.error("Error getting user DB:", error);
    return [];
  }
};

export const updateUserDB = async (userDB: User[]) => {
  try {
    await AsyncStorage.setItem(USER_DB_KEY, JSON.stringify(userDB));
  } catch (error) {
    console.error("Error updating user DB:", error);
  }
};
