import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Post } from '@/core/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostsContext';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { getUserPosts } = usePosts();
  
  const userId = route.params?.userId || user?.id;
  const userPosts = userId ? getUserPosts(userId) : [];

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postThumbnail}
      onPress={() => navigation.navigate('Gallery', { userId })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.thumbnailImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Gallery', { userId })}>
          <Text style={styles.galleryButton}>📷</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <Image
          source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.username || 'Usuário'}</Text>
          <Text style={styles.bio}>{user?.bio || 'Sem bio ainda'}</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userPosts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Seguindo</Text>
        </View>
      </View>

      <View style={styles.gallerySection}>
        <Text style={styles.sectionTitle}>Galeria</Text>
        <FlatList
          data={userPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.galleryGrid}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  backButton: {
    fontSize: 16,
    color: '#0095f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
  },
  galleryButton: {
    fontSize: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: '#8e8e93',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
  },
  statLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 2,
  },
  gallerySection: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 15,
  },
  galleryGrid: {
    paddingBottom: 20,
  },
  postThumbnail: {
    flex: 1,
    margin: 1,
    aspectRatio: 1,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});

export default ProfileScreen; 