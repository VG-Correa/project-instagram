import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useUsers } from '@/contexts/UsersContext';
import { useAuth } from '@/contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, User } from '@/core/types';
import { useNavigation } from '@react-navigation/native';

const FriendsScreen: React.FC = () => {
  const { users, addFriend, removeFriend, getUserById } = useUsers();
  const { user, setUser } = useAuth() as any; // setUser não está no tipo, mas existe no contexto
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState('');

  if (!user) return null;

  // Filtra usuários (exceto o próprio)
  const filteredUsers = users.filter(
    u => u.id !== user.id && (
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
  );

  const isFriend = (otherId: string) => user.friends.includes(otherId);

  const handleToggleFriend = (otherId: string) => {
    if (isFriend(otherId)) {
      removeFriend(user.id, otherId);
      removeFriend(otherId, user.id);
    } else {
      addFriend(user.id, otherId);
      addFriend(otherId, user.id);
    }
    // Atualiza o usuário logado após a alteração
    const updated = getUserById(user.id);
    if (updated && setUser) setUser(updated);
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.userRow}>
      <TouchableOpacity style={styles.userInfo} onPress={() => navigation.navigate('UserProfile', { userId: item.id })}>
        <Image source={{ uri: item.avatar || 'https://via.placeholder.com/40' }} style={styles.avatar} />
        <Text style={styles.username}>{item.username}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.friendButton, isFriend(item.id) ? styles.removeBtn : styles.addBtn]}
        onPress={() => handleToggleFriend(item.id)}
      >
        <Text style={styles.friendButtonText}>{isFriend(item.id) ? 'Remover' : 'Adicionar'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Amigos</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar perfis..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum perfil encontrado.</Text>}
        contentContainerStyle={filteredUsers.length === 0 ? styles.emptyContainer : undefined}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  username: {
    fontSize: 16,
    color: '#262626',
    fontWeight: '500',
  },
  friendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: '#0095f6',
  },
  removeBtn: {
    backgroundColor: '#f44336',
  },
  friendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#8e8e93',
    marginTop: 40,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default FriendsScreen;
