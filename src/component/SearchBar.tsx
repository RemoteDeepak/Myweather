import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import useDebounce from "../component/useDebounce";

interface SearchBarProps {
  onSearch: (lat: number, lon: number) => void;
  onRecentSelect?: (city: string) => void; // Optional callback for recent search tap
}

const API_KEY = "7611977903f76a70cf334f32295de0b7";

export default function SearchBar({ onSearch, onRecentSelect }: SearchBarProps) {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  const debouncedText = useDebounce(text, 500);

  useEffect(() => {
    if (!debouncedText.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${debouncedText}&limit=5&appid=${API_KEY}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Suggestion fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedText]);

  const handleSelectSuggestion = (item: any) => {
    const label = `${item.name}${item.state ? ", " + item.state : ""}, ${item.country}`;
    setText(label);
    setSuggestions([]);
    setSearching(false);
    Keyboard.dismiss();

    // Update recent searches (max 5, no duplicates)
    setRecent((prev) => [label, ...prev.filter((c) => c !== label)].slice(0, 5));

    onSearch(item.lat, item.lon);
  };

  // Location permission and fetch
  const fetchCurrentLocationWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required to get current weather.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Update input text to "Current Location" or clear
      setText("Current Location");
      setSuggestions([]);
      setSearching(false);
      Keyboard.dismiss();

      onSearch(latitude, longitude);
    } catch (error) {
      Alert.alert("Error", "Failed to get current location.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={20} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Search for a city"
            value={text}
            onChangeText={(val) => {
              setText(val);
              setSearching(true);
            }}
            style={styles.input}
            returnKeyType="search"
          />
        </View>

        <TouchableOpacity
          onPress={fetchCurrentLocationWeather}
          style={styles.locationButton}
          accessibilityLabel="Use current location"
        >
          <Ionicons name="location-sharp" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={styles.loading} color="#333" />}

      {/* Recent Searches */}
      {recent.length > 0 && !text && (
        <View style={styles.recentContainer}>
          <Text style={styles.recentLabel}>Recent Searches:</Text>
          {recent.map((city, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setText(city);
                setSearching(false);
                Keyboard.dismiss();
                onRecentSelect?.(city);
              }}
            >
              <Text style={styles.recentItem}>{city}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Suggestions List */}
      {suggestions.length > 0 ? (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectSuggestion(item)}
              style={styles.suggestionItem}
            >
              <Text style={styles.suggestionText}>
                {item.name}
                {item.state ? `, ${item.state}` : ""}, {item.country}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionBox}
        />
      ) : (
        searching &&
        !loading &&
        debouncedText.trim().length > 0 && (
          <Text style={styles.noResult}>No results found</Text>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  locationButton: {
    marginLeft: 12,
    padding: 6,
  },
  loading: {
    marginTop: 10,
  },
  suggestionBox: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 200,
    overflow: "hidden",
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
  },
  noResult: {
    marginTop: 10,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  recentContainer: {
    marginTop: 10,
  },
  recentLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  recentItem: {
    fontSize: 16,
    paddingVertical: 4,
    color: "#555",
  },
});
