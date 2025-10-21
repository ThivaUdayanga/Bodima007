// src/screens/MapPickerScreen.js
import React, { useState, useRef } from 'react';
import {
  SafeAreaView, View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#1f4582';
const RADIUS = 10;

// Use your Google "web" key for Geocoding fetches
const GEOCODING_KEY = 'AIzaSyDjVz6XalIw2CEAAFCLa_zVlPpbCphlvZU';

export default function MapPickerScreen({ navigation, route }) {
  // Optional defaults passed from CreatePostScreen
  const initialAddr = route.params?.locationText || '';
  const initialCoords = route.params?.coords || { lat: 6.9271, lng: 79.8612 }; // Colombo as a default

  const mapRef = useRef(null);
  const [address, setAddress] = useState(initialAddr);
  const [region, setRegion] = useState({
    latitude: initialCoords.lat,
    longitude: initialCoords.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [marker, setMarker] = useState({
    latitude: initialCoords.lat,
    longitude: initialCoords.lng,
  });
  const [busy, setBusy] = useState(false);

  const searchAddress = async () => {
    if (!address.trim()) {
      Alert.alert('Address', 'Please enter an address to search.');
      return;
    }
    try {
      setBusy(true);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address.trim()
      )}&key=${GEOCODING_KEY}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.status !== 'OK' || !json.results?.length) {
        Alert.alert('Not found', 'Could not find that address.');
        setBusy(false);
        return;
      }

      const loc = json.results[0].geometry.location; // { lat, lng }
      const formatted = json.results[0].formatted_address;

      setAddress(formatted);
      const newRegion = {
        latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      setMarker({ latitude: loc.lat, longitude: loc.lng });

      // animate map
      mapRef.current?.animateToRegion(newRegion, 600);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to search address.');
    } finally {
      setBusy(false);
    }
  };

  const useMyLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission', 'Location permission is required.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setRegion((r) => ({ ...r, latitude: lat, longitude: lng }));
      setMarker({ latitude: lat, longitude: lng });
      mapRef.current?.animateToRegion({ ...region, latitude: lat, longitude: lng }, 600);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Could not get your current location.');
    }
  };

  const confirm = () => {
    // Use the marker position as final
    const locationText = address || 'Dropped pin';
    const coords = { lat: marker.latitude, lng: marker.longitude };

    // Pass back to CreatePostScreen and merge params
    navigation.navigate({
      name: 'CreatePost',
      params: { locationText, coords },
      merge: true,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Top search bar */}
        <View style={styles.searchRow}>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Search address"
            placeholderTextColor="#9aa3af"
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={searchAddress} style={[styles.squareBtn, { marginLeft: 8 }]}>
            <Ionicons name="search" size={18} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity onPress={useMyLocation} style={[styles.squareBtn, { marginLeft: 8 }]}>
            <Ionicons name="locate" size={18} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Map */}
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={region}
          onRegionChangeComplete={(r) => setRegion(r)}
        >
          <Marker
            coordinate={marker}
            draggable
            onDragEnd={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setMarker({ latitude, longitude });
            }}
          />
        </MapView>

        {/* Confirm */}
        <View style={styles.footer}>
          <TouchableOpacity disabled={busy} onPress={confirm} style={[styles.cta, busy && { opacity: 0.6 }]}>
            <Text style={styles.ctaText}>{busy ? 'Please wait…' : 'Confirm location'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    backgroundColor: '#f7f8fa',
    paddingHorizontal: 12,
  },
  squareBtn: {
    width: 48, height: 48,
    borderRadius: 10, borderWidth: 1, borderColor: '#c7d2fe',
    backgroundColor: '#f7f8fa',
    alignItems: 'center', justifyContent: 'center',
  },
  footer: { padding: 12, backgroundColor: '#fff' },
  cta: {
    height: 52, borderRadius: RADIUS, backgroundColor: PRIMARY,
    alignItems: 'center', justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
