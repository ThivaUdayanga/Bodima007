import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logOut } from '../services/AuthService';

const PRIMARY = '#1f4582';

export default function UserProfileScreen({ navigation }) {
  const go = (route) => navigation.replace(route); // or navigation.navigate

  const onLogout = async () => {
    try {
      await logOut();
      navigation.replace('Login');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App bar with Logout */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Profile</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Screen body (empty per mockup) */}
      <View style={{ flex: 1, backgroundColor: '#fff' }} />

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => go('Home')}>
          <Ionicons name="home-outline" size={22} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => go('Favourite')}>
          <Ionicons name="heart-outline" size={22} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => go('Profile')}>
          <Ionicons name="person" size={22} color={PRIMARY} />
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
    paddingHorizontal: 16,
  },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logoutText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 12,
  },
  bottomNav: {
    height: 56,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: { padding: 8 },
});
