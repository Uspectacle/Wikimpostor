import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";

import { Text, View } from "@/components/Themed";
import {
  PartialUser,
  User,
  getUserDB,
  updateUserDB,
} from "@/helpers/userStorage";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const saveUser = async (user: PartialUser) => {
  const userDB = await getUserDB();
  const lastId = userDB.reduce(
    (biggestUserId, user) =>
      biggestUserId > user.id ? biggestUserId : user.id,
    0
  );

  updateUserDB([
    ...userDB,
    {
      id: lastId + 1,
      name: user.name || "",
      password: user.password || "",
      creationDate: new Date(),
      updateDate: new Date(),
      active: true,
      articles: user.articles,
    },
  ]);
};

const updateUser = async (updatedUser: User) => {
  const userDB = await getUserDB();

  updateUserDB(
    userDB.map((user) =>
      user.id === updatedUser.id
        ? { ...updatedUser, updateDate: new Date(), active: true }
        : user
    )
  );
};

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isFocused = useIsFocused();

  const [user, setUser] = useState<User | null>(null);
  const [updatedUser, setUpdatedUser] = useState<PartialUser | User | null>(
    null
  );
  const [errorName, setErrorName] = useState<string | null>(null);
  const [sameNameUser, setSameNameUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);

      const userDB = await getUserDB();
      const foundUser = userDB.find((user) => user.id === userId);

      setUser(foundUser || null);
      setUpdatedUser(foundUser || { articles: [] });
    };

    fetchUserDetails();
  }, [id, isFocused]);

  useEffect(() => {
    const onUpdateName = (userDB: User[]) => {
      if (updatedUser === null) {
        setSameNameUser(null);
        setErrorName(null);
        return;
      }

      if (!updatedUser.name) {
        setSameNameUser(null);
        setErrorName("The username is mandatory.\nPlease enter a username");
        return;
      }

      const existingUser = userDB.find(
        ({ id, name }) =>
          name === updatedUser.name &&
          !("id" in updatedUser && id === updatedUser.id)
      );

      if (existingUser) {
        setSameNameUser(existingUser);
        setErrorName(
          `This username is already taken.\nPlease enter an other username\nor login as ${existingUser.name}`
        );
        return;
      }

      setSameNameUser(null);
      setErrorName(null);
    };

    const onUpdateUser = async () => {
      const userDB = await getUserDB();
      onUpdateName(userDB);
    };

    onUpdateUser();
  }, [updatedUser]);

  if (updatedUser === null) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{user ? "Edit User" : "Create User"}</Text>
        {JSON.stringify(user) === JSON.stringify(updatedUser) ||
          (user ? (
            <Pressable onPress={() => setUpdatedUser(user || {})}>
              <Text style={styles.cancelButton}>Cancel edition</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => router.push("/")}>
              <Text style={styles.cancelButton}>Cancel creation</Text>
            </Pressable>
          ))}
      </View>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, !!errorName && styles.labelError]}>
              Username
            </Text>
            <TextInput
              style={[styles.input, !!errorName && styles.hasError]}
              value={updatedUser?.name || ""}
              placeholder={user?.name ? "Enter new name" : "Enter a name"}
              onChangeText={(text) =>
                setUpdatedUser({
                  ...updatedUser,
                  name: text.trim(),
                })
              }
            />
            {!!errorName && (
              <View style={styles.errorContainer}>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  color="red"
                  style={styles.errorIcon}
                />
                <Text style={styles.error}>{errorName}</Text>
                {!!sameNameUser && (
                  <Pressable
                    onPress={() => router.push(`/login/${sameNameUser.id}`)}
                  >
                    <Text style={styles.closeButton}>Close Profile</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {user && JSON.stringify(user) === JSON.stringify(updatedUser) ? (
          <Pressable onPress={() => router.push("/")}>
            <Text style={styles.closeButton}>Close Profile</Text>
          </Pressable>
        ) : (
          <Pressable
            disabled={!!errorName}
            onPress={async () => {
              "id" in updatedUser
                ? updateUser(updatedUser)
                : saveUser(updatedUser);
              router.push("/");
            }}
          >
            <Text
              style={[styles.closeButton, !!errorName && styles.disabledButton]}
            >
              {user ? "Save & Close Profile" : "Create & Close Profile"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width,
    borderBottomWidth: 1,
    borderColor: "black",
    padding: 10,
  },
  mainContainer: {
    flex: 1,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    width,
    paddingVertical: 10,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    width,
    padding: 10,
    borderTopWidth: 1,
    borderColor: "black",
  },
  inputContainer: {
    margin: 10,
    width: (width * 80) / 100,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  label: {
    fontSize: 10,
    margin: 5,
  },
  labelError: {
    color: "red",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    fontSize: 12,
  },
  hasError: {
    borderColor: "red",
    borderWidth: 2,
  },
  errorContainer: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  errorIcon: {
    marginRight: 10,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "red",
    color: "white",
    textAlign: "center",
    borderRadius: 10,
  },
  disabledButton: { backgroundColor: "grey" },

  closeButton: {
    padding: 10,
    backgroundColor: "green",
    color: "white",
    textAlign: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
