import React from "react";
import { Text, StyleSheet } from "react-native";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
});
