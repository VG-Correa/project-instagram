import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AuthProvider } from '@/contexts/AuthContext';
import { PostsProvider } from '@/contexts/PostsContext';
import { UsersProvider } from '@/contexts/UsersContext';
import { FeedbackProvider } from '@/contexts/FeedbackContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/types';

// Importar páginas (serão criadas em seguida)
import LoginScreen from '@/pages/Login/LoginScreen';
import RegisterScreen from '@/pages/Register/RegisterScreen';
import HomeScreen from '@/pages/Home/HomeScreen';
import ProfileScreen from '@/pages/Profile/ProfileScreen';
import GalleryScreen from '@/pages/Gallery/GalleryScreen';
import { FeedbackModal } from '@/components/common/FeedbackModal';
import UserProfileScreen from '@/pages/Profile/UserProfileScreen';
import PostDetailScreen from '@/pages/Home/PostDetailScreen';
import FriendsScreen from '@/pages/Friends/FriendsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <FeedbackProvider>
      <UsersProvider>
        <AuthProvider>
          <PostsProvider>
            <NavigationContainer>
              <View style={styles.container}>
                <Stack.Navigator 
                  initialRouteName="Login"
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                  <Stack.Screen name="UserProfile" component={UserProfileScreen} />
                  <Stack.Screen name="Gallery" component={GalleryScreen} />
                  <Stack.Screen name="PostDetail" component={PostDetailScreen} />
                  <Stack.Screen name="Friends" component={FriendsScreen} />
                </Stack.Navigator>
                <FeedbackModal />
                <StatusBar style="auto" />
              </View>
            </NavigationContainer>
          </PostsProvider>
        </AuthProvider>
      </UsersProvider>
    </FeedbackProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
