// src/screens/LoginScreen.js
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
import { signIn } from '../services/AuthService';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';


const PRIMARY = '#1f4582'; // deep blue from your mock
const RADIUS = 10;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
  try {
    if (!email || !password) {
      alert('Enter email and password');
      return;
    }

    const user = await signIn(email.trim(), password);

    // default role if nothing saved yet
    let role = 'User';

    // read role from Firestore: users/<uid> { role: 'Admin' | 'User' }
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists() && snap.data().role) {
        role = snap.data().role;
      }
    } catch (err) {
      console.log('Role lookup failed:', err);
    }

    if (role === 'Admin') {
      navigation.replace('AdminDashboard'); 
      alert('Logged in as Admin');
    } else if (role === 'User') {
      navigation.replace('Home');            
      alert('Logged in as User');
    }else {
      alert('Role not recognized');
    }
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
            // If the image is not there yet, you can comment Image out and
            // use a fallback:
            // defaultSource={require('../../assets/logo-white.png')}
          />
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.title}>Login</Text>

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
            placeholder="Password"
            placeholderTextColor="#9aa3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.cta} onPress={onLogin} activeOpacity={0.8}>
            <Text style={styles.ctaText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.replace('Register')}
            style={{ marginTop: 14, alignSelf: 'center' }}
          >
            <Text style={styles.linkText}>
              I don’t have an account. <Text style={{ fontWeight: '700' }}>Register</Text>
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
