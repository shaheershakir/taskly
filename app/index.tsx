import {
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  View,
  Text,
} from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { theme } from "../theme";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
};

export default function App() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);
  const [value, setValue] = useState("");

  const handlleSubmit = () => {
    if (value) {
      const newShoppingList = [
        { id: new Date().toTimeString(), name: value },
        ...shoppingList,
      ];
      setShoppingList(newShoppingList);
      setValue("");
    }
  };
  const handdleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);
    setShoppingList(newShoppingList);
  };
  return (
    <FlatList
      data={shoppingList}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>Your Shopping List is Empty</Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          placeholder="Eg. Coffee"
          style={styles.textInput}
          value={value}
          onChangeText={setValue}
          returnKeyType="done"
          onSubmitEditing={handlleSubmit}
        />
      }
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          onDelete={() => handdleDelete(item.id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  textInput: {
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 50,
    backgroundColor: theme.colorWhite,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
});
