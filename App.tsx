import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  // Pressable,
  Alert,
} from "react-native";
import { theme } from "./theme";

export default function App() {
  const handdleDelete = () => {
    Alert.alert(
      "Are you sure you want to delete this?",
      "It will be gone for good",
      [
        {
          text: "Yes",
          onPress: () => console.log("Ok, deleting"),
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Text style={styles.textColor}>Coffee</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handdleDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#1a759f",
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textColor: {
    fontSize: 18,
    fontWeight: "200",
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
