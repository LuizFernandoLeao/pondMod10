import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Button, Provider as PaperProvider } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Avatar.Text size={100} label={user ? user.email[0].toUpperCase() : 'U'} />
        <Text style={styles.name}>{user ? user.email : 'User Name'}</Text>
        <Button mode="contained" onPress={handleLogout} style={styles.button}>
          Logout
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  name: {
    fontSize: 24,
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});

export default ProfileScreen;
