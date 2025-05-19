import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import * as Location from "expo-location";
import SearchBar from "../src/component/SearchBar";
import WeatherInfo from "../src/component/WeatherInfo";
import ErrorMessage from "../src/component/ErrorMessage";

const API_KEY = "7611977903f76a70cf334f32295de0b7";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch weather by coordinates
  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError(data.message || "Location not found");
      } else {
        setWeatherData(data);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Get current location
  const loadWeatherByLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      fetchWeather(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      setError("Could not fetch location");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherByLocation(); // auto fetch on mount
  }, []);

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
