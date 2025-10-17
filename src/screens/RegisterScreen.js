// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { signUp } from '../services/AuthService';

const PRIMARY = '#1f4582';
const RADIUS = 10;

export default function RegisterScreen({ navigation }) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail]       = useState('');
  const [mobile, setMobile]     = useState('');
  const [nic, setNic]           = useState('');
  const [password, setPassword] = useState('');
  const [rpassword, setRPassword] = useState('');
  const [role, setRole]         = useState('User'); // "User" | "Admin"

  const onRegister = async () => {
    alert('Registering ...'); 
  try {
    if (!firstname || !lastname || !email || !password || !rpassword) {
      return alert('Please fill all required fields');
    }
    if (password !== rpassword) {
      return alert('Passwords do not match');
    }

    await signUp({
      email: email.trim(),
      password,
      firstName: firstname,
      lastName: lastname,
      role,
      mobile,
      nic,
    });

    alert('Account created. Please login.');
    navigation.replace('Login');
  } catch (e) {
    console.log(e);
    alert(e.message);
  }
};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Top blue banner with logo */}
        <View style={styles.banner}>
          <Image
            source={require('../../assets/favicon.png')}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.title}>Register</Text>

          <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor="#9aa3af"
            value={firstname}
            onChangeText={setFirstname}
          />

          <TextInput
            style={styles.input}
            placeholder="Last name"
            placeholderTextColor="#9aa3af"
            value={lastname}
            onChangeText={setLastname}
          />

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#9aa3af"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor="#9aa3af"
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
          />

          <TextInput
            style={styles.input}
            placeholder="NIC/ Passport"
            placeholderTextColor="#9aa3af"
            value={nic}
            onChangeText={setNic}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9aa3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Re enter Password"
            placeholderTextColor="#9aa3af"
            secureTextEntry
            value={rpassword}
            onChangeText={setRPassword}
          />

          {/* Role dropdown */}
          <View style={[styles.input, { paddingHorizontal: 0, overflow: 'hidden' }]}>
            <Picker selectedValue={role} onValueChange={setRole}>
              <Picker.Item label="User" value="User" />
              <Picker.Item label="Admin" value="Admin" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.cta} onPress={onRegister} activeOpacity={0.8}>
            <Text style={styles.ctaText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.replace('Login')}
            style={{ marginTop: 14, alignSelf: 'center' }}
          >
            <Text style={styles.linkText}>
              Already I have an account. <Text style={{ fontWeight: '700' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
    paddingBottom: 24,
  },
  logo: {
    height: 56,
    width: 120,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  input: {
    height: 52,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    backgroundColor: '#f7f8fa',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  cta: {
    height: 52,
    borderRadius: RADIUS,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  linkText: {
    color: '#6b7280',
  },
});
