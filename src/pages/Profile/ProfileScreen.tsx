import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Post } from '@/core/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostsContext';
import * as ImagePicker from 'expo-image-picker';
import { useUsers } from '@/contexts/UsersContext';
import { useFeedback } from '@/contexts/FeedbackContext';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { user, logout } = useAuth();
  const { getUserPosts } = usePosts();
  const { updateUser } = useUsers();
  const { showFeedback } = useFeedback();

  const userId = route.params?.userId || user?.id;
  const userPosts = userId ? getUserPosts(userId) : [];
  const isCurrentUser = userId === user?.id;
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    cover: user?.cover || '',
  });

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setForm({
      username: user?.username || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
      cover: user?.cover || '',
    });
  };
  const handleSave = () => {
    if (!form.username) {
      showFeedback('warning', 'O nome de usuário é obrigatório');
      return;
    }
    updateUser(userId as string, form);
    setEditing(false);
    showFeedback('success', 'Perfil atualizado!');
  };
  const pickImage = async (field: 'avatar' | 'cover') => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setForm(f => ({ ...f, [field]: result.assets[0].uri }));
    }
  };

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
      {/* Capa do perfil */}
      <TouchableOpacity disabled={!isCurrentUser || !editing} onPress={() => pickImage('cover')}>
        <Image
          source={{ uri: form.cover || 'https://via.placeholder.com/400x120?text=Capa' }}
          style={styles.cover}
        />
        {isCurrentUser && editing && <Text style={styles.editPhotoText}>Editar capa</Text>}
      </TouchableOpacity>
      <View style={styles.profileInfo}>
        <TouchableOpacity disabled={!isCurrentUser || !editing} onPress={() => pickImage('avatar')}>
          <Image
            source={{ uri: form.avatar || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          {isCurrentUser && editing && <Text style={styles.editPhotoText}>Editar foto</Text>}
        </TouchableOpacity>
        <View style={styles.userInfo}>
          {editing ? (
            <>
              <Text style={styles.label}>Nome de usuário</Text>
              <TextInput
                style={styles.input}
                value={form.username}
                onChangeText={v => setForm(f => ({ ...f, username: v }))}
              />
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={styles.input}
                value={form.bio}
                onChangeText={v => setForm(f => ({ ...f, bio: v }))}
                multiline
              />
            </>
          ) : (
            <>
              <Text style={styles.username}>{form.username || 'Usuário'}</Text>
              <Text style={styles.bio}>{form.bio || 'Sem bio ainda'}</Text>
            </>
          )}
        </View>
      </View>
      {isCurrentUser && (
        <View style={styles.editButtons}>
          {editing ? (
            <>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Editar perfil</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  cover: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
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
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  editButton: {
    backgroundColor: '#0095f6',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    color: '#262626',
  },
  editPhotoText: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#000',
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 12,
  },
});

export default ProfileScreen;