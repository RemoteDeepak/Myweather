import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import SearchBar from "../src/component/SearchBar";
import WeatherInfo from "../src/component/WeatherInfo";
import ErrorMessage from "../src/component/ErrorMessage";

const API_KEY = "7611977903f76a70cf334f32295de0b7"; // Replace with your OpenWeatherMap API key

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError("");
    setWeatherData(null);

    console.log("City:", cityName);
    console.log("API Key:", API_KEY, "| Length:", API_KEY.length);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError(data.message || "City not found");
      } else {
        setWeatherData(data);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={fetchWeather} />
      {loading && <ActivityIndicator size="large" />}
      {error ? <ErrorMessage message={error} /> : null}
      {weatherData && <WeatherInfo data={weatherData} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f0f4f7",
  },
});
