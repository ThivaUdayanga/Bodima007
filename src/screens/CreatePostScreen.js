import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../services/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const PRIMARY = '#1f4582';
const RADIUS = 10;

const CLOUD_NAME = 'dpdqogegn';
const UPLOAD_PRESET = 'unsigned_post';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

async function uploadToCloudinary(uri) {
  // Ensure the file has a proper mime and filename
  const data = new FormData();
  data.append('file', {
    uri,
    type: 'image/jpeg',
    name: `post_${Date.now()}.jpg`,
  });
  data.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: data,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || 'Image upload failed');
  }
  return json.secure_url; // HTTPS URL
}

export default function CreatePostScreen({ navigation }) {
  const [type, setType] = useState('For Boys');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [space, setSpace] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([null, null, null]); // up to 3

  const pickImage = async (index) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('We need photo library permission to pick images.');
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.85,
  });
  if (!result.canceled) {
    const uri = result.assets[0].uri;
    setImages((prev) => {
      const next = [...prev];
      next[index] = uri;
      return next;
    });
  }
};

const onCreatePost = async () => {
  // basic validation
  if (!price || !contact || !space || !location) {
    alert('Please fill all required fields (price, contact, space, location).');
    return;
  }

  try {
    const uid = auth?.currentUser?.uid || null;

    // 1) Upload selected images to Cloudinary
    const chosen = images.filter(Boolean); // remove nulls
    const urls = await Promise.all(chosen.map((u) => uploadToCloudinary(u)));

    // 2) Save a single doc in Firestore (collection "Posts")
    await addDoc(collection(db, 'Posts'), {
      type,
      price,
      contact,
      space,
      location,
      description,
      images: urls,
      ownerId: uid,
      createdAt: serverTimestamp(),
    });

    alert('Post created!');
    // navigation.replace('Home') or goBack
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* App bar */}
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Create a post</Text>
          <View style={{ width: 18 }} />
        </View>

        {/* Form */}
        <View style={styles.body}>
          {/* Type */}
          <View style={[styles.input, { paddingHorizontal: 0, overflow: 'hidden' }]}>
            <Picker selectedValue={type} onValueChange={setType}>
              <Picker.Item label="For Boys" value="For Boys" />
              <Picker.Item label="For Girls" value="For Girls" />
              <Picker.Item label="Family" value="Family" />
              <Picker.Item label="Couple" value="Couple" />
            </Picker>
          </View>

          {/* Price */}
          <TextInput
            style={styles.input}
            placeholder="Price for month (LKR)"
            placeholderTextColor="#9aa3af"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          {/* Contact */}
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            placeholderTextColor="#9aa3af"
            keyboardType="phone-pad"
            value={contact}
            onChangeText={setContact}
          />

          {/* Space */}
          <TextInput
            style={styles.input}
            placeholder="Person/Space"
            placeholderTextColor="#9aa3af"
            value={space}
            onChangeText={setSpace}
          />

          {/* Location */}
          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="#9aa3af"
            value={location}
            onChangeText={setLocation}
          />

          {/* Description */}
          <TextInput
            style={[styles.input, { height: 96, textAlignVertical: 'top' }]}
            placeholder="Description"
            placeholderTextColor="#9aa3af"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {/* Image pickers */}
          <View style={styles.imageRow}>
            {[0, 1, 2].map((i) => (
              <TouchableOpacity
                key={i}
                onPress={() => pickImage(i)}
                style={styles.imageBox}
                activeOpacity={0.8}
              >
                {images[i] ? (
                  <Image source={{ uri: images[i] }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                ) : (
                  <Ionicons name="camera" size={24} color="#6b7280" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.cta} onPress={onCreatePost} activeOpacity={0.85}>
            <Text style={styles.ctaText}>Create Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appBar: {
    height: 74,
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  appBarTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    marginRight: 30, // to visually center with back icon
  },
  body: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 52,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    backgroundColor: '#f7f8fa',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  imageBox: {
    height: 130,
    width: '31%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    height: 52,
    borderRadius: RADIUS,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
