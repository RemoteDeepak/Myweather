import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
    description: string;
  }[];
}

export default function WeatherInfo({ data }: { data: WeatherData }) {
  const { name, main, weather } = data;
  const icon = weather[0].icon;

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{name}</Text>
      <Image
        style={styles.icon}
        source={{ uri: `https://openweathermap.org/img/wn/${icon}@4x.png` }}
      />
      <Text style={styles.temp}>{main.temp} °C</Text>
      <Text style={styles.desc}>{weather[0].description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  city: {
    fontSize: 28,
    fontWeight: "bold",
  },
  icon: {
    width: 100,
    height: 100,
  },
  temp: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },
  desc: {
    fontSize: 18,
    color: "#555",
  },
});
