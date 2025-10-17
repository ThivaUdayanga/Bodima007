import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#1f4582';

export default function UserFavouriteScreen({ navigation }) {
  const go = (route) => navigation.replace(route); // or navigation.navigate

  return (
    <SafeAreaView style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Favourite</Text>
        <View style={{ width: 70 }} />{/* spacer to mirror Profile's logout width */}
      </View>

      {/* Screen body (empty per mockup) */}
      <View style={{ flex: 1, backgroundColor: '#fff' }} />

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => go('Home')}>
          <Ionicons name="home-outline" size={22} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => go('Favourite')}>
          <Ionicons name="heart" size={22} color={PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => go('Profile')}>
          <Ionicons name="person-outline" size={22} color="#6b7280" />
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
