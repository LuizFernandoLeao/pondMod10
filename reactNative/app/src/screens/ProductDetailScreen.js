import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Provider as PaperProvider } from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;

  const handleShare = async () => {
    const fileUri = FileSystem.cacheDirectory + product.name.replace(/\s/g, '_') + '.jpg';
    try {
      const res = await FileSystem.downloadAsync(product.image, fileUri);
      await Sharing.shareAsync(res.uri);
    } catch (error) {
      console.error(error);
      alert('Error sharing image');
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card>
          <Card.Cover source={{ uri: product.image }} />
          <Card.Content>
            <Title>{product.name}</Title>
            <Paragraph>{product.price}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button>Favorite</Button>
            <Button onPress={handleShare}>Share</Button>
          </Card.Actions>
        </Card>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default ProductDetailScreen;
