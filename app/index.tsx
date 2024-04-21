import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { User, getUserDB } from "@/helpers/userStorage";
import { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useIsFocused } from "@react-navigation/native";

export default function HomeScreen() {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUsers = async () => {
      const userDB = await getUserDB();
      const activeUsers = userDB.filter((user) => user.active);
      setActiveUsers(activeUsers);
    };

    fetchUsers();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Users</Text>
      {activeUsers.map((user) => (
        <Text key={user.id} style={styles.user}>
          {user.name}
        </Text>
      ))}
      <Link href="/profile/0" asChild>
        <Pressable>
          {({ pressed }) => (
            <FontAwesome
              name="plus"
              size={25}
              style={[
                styles.addUser,
                { marginRight: 15, opacity: pressed ? 0.5 : 1 },
              ]}
            />
          )}
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  user: {
    fontSize: 18,
    marginBottom: 5,
  },
  addUser: {
    fontSize: 18,
    marginBottom: 5,
  },
});
