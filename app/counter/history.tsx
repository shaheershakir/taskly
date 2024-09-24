import { Text, View, StyleSheet } from "react-native";

export default function historyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>history</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
  },
});
