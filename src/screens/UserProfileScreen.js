// src/screens/UserProfileScreen.js
import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logOut } from '../services/AuthService';
import { auth, postsCol } from '../services/firebase';
import { query, where, orderBy, onSnapshot } from 'firebase/firestore';
import PostCard from '../components/PostCard';

const PRIMARY = '#1f4582';

export default function UserProfileScreen({ navigation }) {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const q = query(postsCol, where('ownerId', '==', uid), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const onLogout = async () => {
    try {
      await logOut();
      navigation.replace('Login');
    } catch (e) {
      alert(e.message);
    }
  };

  const onEdit = (post) => {
    // navigation.navigate('EditPost', { id: post.id });
    alert('Edit: ' + post.id);
  };

  const onBoost = (post) => {
    // e.g., mark a "boost" flag in Firestore
    alert('Boost: ' + post.id);
  };

  const go = (route) => navigation.replace(route);

  return (
    <SafeAreaView style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Profile</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 96 }}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            variant="profile"               // no heart/phone; shows Edit & Boost
            onEdit={() => onEdit(item)}
            onBoost={() => onBoost(item)}
          />
        )}
        ListEmptyComponent={<View style={{ height: 80 }} />}
      />

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
  appBar: { height: 56, backgroundColor: PRIMARY, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  appBarTitle: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '700', fontSize: 16 },
  logoutBtn: { backgroundColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  logoutText: { color: '#111827', fontWeight: '600', fontSize: 12 },
  bottomNav: { height: 56, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { padding: 8 },
});
