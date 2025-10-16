// src/screens/UserHomeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const PRIMARY = '#1f4582';
const RADIUS = 10;

export default function UserHomeScreen({ navigation }) {
  const [q, setQ] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* App bar */}
      <View style={styles.topBar}>
        {/* Left add icon */}
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => {
            // navigation.navigate('PostProperty')
          }}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.appTitle}>Bodima</Text>

        {/* Right options icon (optional) */}
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => {
            // navigation.navigate('Filters')
          }}
        >
          <Ionicons name="options-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search field */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search Location"
            placeholderTextColor="#9aa3af"
            style={{ marginLeft: 8, flex: 1 }}
            returnKeyType="search"
            onSubmitEditing={() => {
              // handle search
            }}
          />
        </View>

        {/* Optional filter button */}
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialIcons name="filter-list" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Content area (empty for now) */}
      <View style={styles.emptyArea}>
        <Text style={styles.emptyText}>Start by searching or adding a post.</Text>
      </View>

      {/* Bottom navigation bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={22} color={PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={22} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={22} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 30,
  },
  circleBtn: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: '#365a95',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: RADIUS,
    paddingHorizontal: 12,
    height: 44,
    alignItems: 'center',
  },
  filterBtn: {
    marginLeft: 8,
    height: 44,
    width: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  emptyArea: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#6b7280',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navItem: {
    padding: 8,
  },
});
