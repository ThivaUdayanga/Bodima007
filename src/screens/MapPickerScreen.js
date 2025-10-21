// src/screens/MapPickerScreen.js
import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#1f4582';
const RADIUS = 10;

// 🔑 Put your Google "Web" API key here (Geocoding API must be enabled)
const GEOCODING_KEY = 'AIzaSyDjVz6XalIw2CEAAFCLa_zVlPpbCphlvZU';

// Center over Sri Lanka initially
const INITIAL_REGION = {
  latitude: 7.8731,
  longitude: 80.7718,
  latitudeDelta: 3.5,
  longitudeDelta: 3.5,
};

export default function MapPickerScreen({ navigation }) {
  const mapRef = useRef(null);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState(INITIAL_REGION);
  const [marker, setMarker] = useState(null); // { latitude, longitude } | null
  const [busy, setBusy] = useState(false);

  const onPressSearch = async () => {
    const q = query.trim();
    if (!q) {
      Alert.alert('Search', 'Please type an address first.');
      return;
    }
    try {
      setBusy(true);
      // Call Google Geocoding
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        q
      )}&key=${GEOCODING_KEY}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.status !== 'OK' || !json.results?.length) {
        Alert.alert('Not found', 'Could not find that address.');
        return;
      }

      const result = json.results[0];
      const { lat, lng } = result.geometry.location;

      // Update map + marker
      const nextRegion = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(nextRegion);
      setMarker({ latitude: lat, longitude: lng });

      // Animate camera
      mapRef.current?.animateToRegion(nextRegion, 600);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to search address.');
    } finally {
      setBusy(false);
    }
  };

  const onPressMyLocation = () => {
    Alert.alert('Get current location', 'Hook this up to expo-location if you want GPS.');
  };

  const onConfirm = () => {
    Alert.alert('Confirm location', 'Hook this up to return coords back to CreatePostScreen.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Map</Text>
        <View style={{ width: 64 }} />
      </View>

      {/* Controls under the app bar */}
      <View style={styles.controlsRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search address"
            placeholderTextColor="#9aa3af"
            style={{ flex: 1, marginLeft: 8 }}
            returnKeyType="search"
            onSubmitEditing={onPressSearch}
          />
        </View>

        <TouchableOpacity
          disabled={busy}
          onPress={onPressSearch}
          style={[styles.squareBtn, { marginLeft: 8, opacity: busy ? 0.6 : 1 }]}
        >
          <Ionicons name="search" size={18} color="#111827" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressMyLocation} style={[styles.squareBtn, { marginLeft: 8 }]}>
          <Ionicons name="locate" size={18} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        onRegionChangeComplete={(r) => setRegion(r)}
      >
        {marker && (
          <Marker
            coordinate={marker}
            draggable
            onDragEnd={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setMarker({ latitude, longitude });
            }}
          />
        )}
      </MapView>

      {/* Confirm button at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cta} onPress={onConfirm} activeOpacity={0.85} disabled={busy}>
          <Text style={styles.ctaText}>{busy ? 'Please wait…' : 'Confirm location'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  appBar: {
    height: 56,
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backBtn: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backText: { color: '#111827', fontWeight: '600' },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f7f8fa',
    borderColor: '#c7d2fe',
    borderWidth: 1,
    borderRadius: RADIUS,
    height: 48,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  squareBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    backgroundColor: '#f7f8fa',
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    padding: 12,
    backgroundColor: '#fff',
  },
  cta: {
    height: 52,
    borderRadius: RADIUS,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});