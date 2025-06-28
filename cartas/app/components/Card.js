import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ card }) => {
  const { rank, suit } = card;

  const suitSymbols = {
    S: '♠',
    H: '♥',
    D: '♦',
    C: '♣',
  };

  const suitColors = {
    S: '#000',
    H: '#f00',
    D: '#f00',
    C: '#000',
  };

  return (
    <View style={styles.card}>
      <Text style={[styles.rank, { color: suitColors[suit] }]}>{rank}</Text>
      <Text style={[styles.suit, { color: suitColors[suit] }]}>{suitSymbols[suit]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 80,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  rank: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  suit: {
    fontSize: 24,
  },
});

export default Card;
