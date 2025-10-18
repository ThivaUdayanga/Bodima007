// src/screens/UserFavouriteScreen.js
import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, userFavouritesCol } from '../services/firebase';
import { db } from '../services/firebase';
import { collection, onSnapshot, query as fsQuery, orderBy } from 'firebase/firestore';
import PostCard from '../components/PostCard';

const PRIMARY = '#1f4582';

export default function UserFavouriteScreen({ navigation }) {
  const [favIds, setFavIds] = React.useState(new Set());
  const [posts, setPosts] = React.useState([]);

  // subscribe to fav IDs
  React.useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const unsub = onSnapshot(userFavouritesCol(uid), (snap) => {
      setFavIds(new Set(snap.docs.map(d => d.id)));
    });
    return unsub;
  }, []);

  // subscribe to posts
  React.useEffect(() => {
    const q = fsQuery(collection(db, 'Posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const favPosts = posts.filter(p => favIds.has(p.id));

  const go = (route) => navigation.replace(route);

  return (
    <SafeAreaView style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Favourite</Text>
        <View style={{ width: 70 }} />
      </View>

      <FlatList
        data={favPosts}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 96 }}
        renderItem={({ item }) => (
          <PostCard post={item} variant="feed" isFavorite />
        )}
        ListEmptyComponent={
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ color: '#6b7280' }}>No favourites yet.</Text>
          </View>
        }
      />

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
  appBar: { height: 56, backgroundColor: PRIMARY, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  appBarTitle: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '700', fontSize: 16 },
  bottomNav: { height: 56, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { padding: 8 },
});
