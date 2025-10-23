// src/screens/MapPickerScreen.js
import React, { useRef, useState } from 'react';
import {
  SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#1f4582';
const RADIUS = 10;

// ✅ Your Google "Web" API key (Geocoding API must be enabled)
const GEOCODING_KEY = 'AIzaSyDjVz6XalIw2CEAAFCLa_zVlPpbCphlvZU';

const INITIAL_REGION = {
  latitude: 7.8731,
  longitude: 80.7718,
  latitudeDelta: 3.5,
  longitudeDelta: 3.5,
};

export default function MapPickerScreen({ navigation, route }) {
  const mapRef = useRef(null);

  const initialAddr = route?.params?.locationText || '';
  const initialCoords = route?.params?.coords || null;

  const [query, setQuery] = useState(initialAddr);
  const [marker, setMarker] = useState(
    initialCoords ? { latitude: initialCoords.lat, longitude: initialCoords.lng } : null
  );
  const [busy, setBusy] = useState(false);

  const onPressSearch = async () => {
    const q = query.trim();
    if (!q) return Alert.alert('Search', 'Please type an address first.');
    try {
      setBusy(true);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${GEOCODING_KEY}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.status !== 'OK' || !json.results?.length) {
        return Alert.alert('Not found', 'Could not find that address.');
      }
      const best = json.results[0];
      const { lat, lng } = best.geometry.location;

      setQuery(best.formatted_address);
      const next = { latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 };
      setMarker({ latitude: lat, longitude: lng });
      mapRef.current?.animateToRegion(next, 600);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to search address.');
    } finally {
      setBusy(false);
    }
  };

  const onPressMyLocation = async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) return Alert.alert('Location', 'Turn on GPS/Location Services.');

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Permission', 'Location permission is required.');

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = pos.coords;

      // optional: reverse geocode for human-readable address
      try {
        const r = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GEOCODING_KEY}`
        );
        const j = await r.json();
        if (j.status === 'OK' && j.results?.length) setQuery(j.results[0].formatted_address);
      } catch {}

      setMarker({ latitude, longitude });
      mapRef.current?.animateToRegion(
        { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 },
        600
      );
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Could not get your current location.');
    }
  };

  const onConfirm = () => {
    if (!marker) {
      return Alert.alert('Select location', 'Search or tap “My location” first, then Confirm.');
    }
    navigation.navigate({
      name: 'CreatePost',
      params: {
        locationText: query || 'Dropped pin',
        coords: { lat: marker.latitude, lng: marker.longitude },
      },
      merge: true,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* App bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Map</Text>
        <View style={{ width: 64 }} />
      </View>

      {/* Controls */}
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
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={
          marker
            ? { ...marker, latitudeDelta: 0.01, longitudeDelta: 0.01 }
            : INITIAL_REGION
        }
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

      {/* Confirm */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cta} onPress={onConfirm} activeOpacity={0.85} disabled={busy}>
          <Text style={styles.ctaText}>{busy ? 'Please wait…' : 'Confirm location'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appBar: { height: 56, backgroundColor: PRIMARY, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  backBtn: { backgroundColor: '#e5e7eb', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  backText: { color: '#111827', fontWeight: '600' },
  title: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '700', fontSize: 16 },

  controlsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff' },
  searchBox: { flex: 1, flexDirection: 'row', backgroundColor: '#f7f8fa', borderColor: '#c7d2fe', borderWidth: 1, borderRadius: RADIUS, height: 48, alignItems: 'center', paddingHorizontal: 12 },
  squareBtn: { width: 48, height: 48, borderRadius: 10, borderWidth: 1, borderColor: '#c7d2fe', backgroundColor: '#f7f8fa', alignItems: 'center', justifyContent: 'center' },

  footer: { padding: 12, backgroundColor: '#fff' },
  cta: { height: 52, borderRadius: 10, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
