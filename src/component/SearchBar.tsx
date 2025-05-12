import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

interface SearchBarProps {
  onSearch: (text: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter city"
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <Button title="Search" onPress={() => onSearch(text)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    marginRight: 10,
    padding: 8,
  },
});
