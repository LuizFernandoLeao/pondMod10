import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, Provider as PaperProvider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      setNotifications(prevNotifications => [notification, ...prevNotifications]);
    });

    return () => subscription.remove();
  }, []);

  const renderItem = ({ item }) => (
    <List.Item
      title={item.request.content.title}
      description={item.request.content.body}
    />
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.request.identifier}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
