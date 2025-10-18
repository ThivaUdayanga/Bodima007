// src/screens/UserHomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, FlatList,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import PostCard from '../components/PostCard';
import { collection, onSnapshot, query as fsQuery, orderBy, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth, userFavouritesCol, userFavouriteDoc } from '../services/firebase';

const PRIMARY = '#1f4582';
const RADIUS = 10;

export default function UserHomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [favIds, setFavIds] = useState(new Set()); // Set of post IDs

  // Posts for feed
  useEffect(() => {
    const qPosts = fsQuery(collection(db, 'Posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(qPosts, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // Favourites of current user (IDs)
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const unsub = onSnapshot(userFavouritesCol(uid), (snap) => {
      const ids = new Set(snap.docs.map(d => d.id));
      setFavIds(ids);
    });
    return unsub;
  }, []);

  // Toggle favourite (persist)
  const toggleFav = async (postId) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return alert('Please log in to save favourites.');
    const ref = userFavouriteDoc(uid, postId);
    if (favIds.has(postId)) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { createdAt: new Date() });
    }
  };

  // Optional simple search by location
  const filtered = posts.filter(p =>
    (p.location || '').toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 96 }}
        ListHeaderComponent={
          <>
            {/* App bar */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => navigation.navigate('CreatePost')}
              >
                <Ionicons name="add" size={22} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.appTitle}>Bodima</Text>
              <View style={{ width: 30 }} />
            </View>

            {/* Search */}
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color="#6b7280" />
                <TextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Search Location"
                  placeholderTextColor="#9aa3af"
                  style={{ marginLeft: 8, flex: 1 }}
                  returnKeyType="search"
                />
              </View>
              <TouchableOpacity style={styles.filterBtn}>
                <MaterialIcons name="filter-list" size={20} color="#111827" />
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            variant="feed"
            isFavorite={favIds.has(item.id)}
            onToggleFavorite={toggleFav}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyArea}>
            <Text style={styles.emptyText}>Start by searching or adding a post.</Text>
          </View>
        }
      />

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Home')}>
          <Ionicons name="home" size={22} color={PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Favourite')}>
          <Ionicons name="heart-outline" size={22} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Profile')}>
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
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  circleBtn: {
    height: 30, width: 30, borderRadius: 15, backgroundColor: '#365a95',
    alignItems: 'center', justifyContent: 'center',
  },
  appTitle: { color: '#fff', fontWeight: '700', fontSize: 16, flex: 1, textAlign: 'center' },
  searchRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 10, alignItems: 'center' },
  searchBox: {
    flex: 1, flexDirection: 'row', backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db', borderWidth: 1, borderRadius: RADIUS, paddingHorizontal: 12,
    height: 44, alignItems: 'center',
  },
  filterBtn: {
    marginLeft: 8, height: 44, width: 44, borderRadius: 10, borderWidth: 1,
    borderColor: '#d1d5db', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  emptyArea: { padding: 16, alignItems: 'center', justifyContent: 'center', minHeight: 180 },
  emptyText: { color: '#6b7280' },
  bottomNav: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 56,
    borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#fff',
    flexDirection: 'row', paddingHorizontal: 28, alignItems: 'center', justifyContent: 'space-between',
  },
  navItem: { padding: 8 },
});
