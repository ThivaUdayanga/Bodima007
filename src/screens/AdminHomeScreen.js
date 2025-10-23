import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { logOut } from '../services/AuthService';

const PRIMARY = '#1f4582';
const BTN = {
  height: 56,
  borderRadius: 12,
  backgroundColor: PRIMARY,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 10,
};

export default function AdminDashboard({ navigation }) {
  const onLogout = async () => {
    try {
      await logOut();
      navigation.replace('Login');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Top bar */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logout} onPress={onLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <TouchableOpacity
          style={BTN}
          onPress={() => navigation.navigate('ManageUsers')}
        >
          <Text style={styles.btnText}>Manage Users</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
  },
  logout: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutText: {
    color: PRIMARY,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    padding: 20,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
