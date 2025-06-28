import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDeck, shuffleDeck, getCardValue } from '../utils/game';
import Card from '../components/Card';

const GameScreen = () => {
  const [playerCard, setPlayerCard] = useState(null);
  const [opponentCard, setOpponentCard] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [result, setResult] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [deck, setDeck] = useState([]);
  const [activeModifier, setActiveModifier] = useState(null);

  useEffect(() => {
    setupGame();
    loadModifiers();
  }, []);

  const setupGame = () => {
    const newDeck = shuffleDeck(createDeck());
    const playerCard = newDeck.pop();
    const opponentCard = newDeck.pop();
    setDeck(newDeck);
    setPlayerCard(playerCard);
    setOpponentCard(opponentCard);
    setGameOver(false);
    setResult('');
  };

  const loadModifiers = async () => {
    try {
      const savedModifier = await AsyncStorage.getItem('activeModifier');
      if (savedModifier !== null) {
        setActiveModifier(savedModifier);
      }
    } catch (e) {
      console.error('Failed to load modifier.', e);
    }
  };

  const saveModifier = async (modifier) => {
    try {
      if (modifier) {
        await AsyncStorage.setItem('activeModifier', modifier);
      } else {
        await AsyncStorage.removeItem('activeModifier');
      }
      setActiveModifier(modifier);
    } catch (e) {
      console.error('Failed to save modifier.', e);
    }
  };

  const handleGuess = (guess) => {
    const playerValue = getCardValue(playerCard);
    const opponentValue = getCardValue(opponentCard);
    let roundResult = '';

    if ((guess === 'higher' && opponentValue > playerValue) || (guess === 'lower' && opponentValue < playerValue)) {
      roundResult = 'win';
    } else if (opponentValue === playerValue) {
      roundResult = 'draw';
    } else {
      roundResult = 'lose';
    }

    let points = 1;
    if (activeModifier === 'double') {
      points = 2;
    }

    if (roundResult === 'win') {
      setPlayerScore(playerScore + points);
      setResult(`Você ganhou ${points} ponto(s)!`);
    } else if (roundResult === 'lose') {
        if(activeModifier !== 'safe'){
            setOpponentScore(opponentScore + points);
        }
      setResult(`Você perdeu ${points} ponto(s)!`);
    } else {
      setResult('Empate!');
    }

    setGameOver(true);
  };

  const nextRound = () => {
    if (deck.length < 2) {
      Alert.alert('Fim de jogo!', 'O baralho acabou.', [{ text: 'OK', onPress: () => setupGame() }]);
      return;
    }
    const newPlayerCard = deck.pop();
    const newOpponentCard = deck.pop();
    setPlayerCard(newPlayerCard);
    setOpponentCard(newOpponentCard);
    setGameOver(false);
    setResult('');
    if (activeModifier === 'double') {
        saveModifier(null); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maior ou Menor</Text>
      <View style={styles.scoresContainer}>
        <Text style={styles.score}>Você: {playerScore}</Text>
        <Text style={styles.score}>Oponente: {opponentScore}</Text>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.cardHolder}>
            <Text>Sua carta</Text>
            {playerCard && <Card card={playerCard} />}
        </View>
        <View style={styles.cardHolder}>
            <Text>Carta do Oponente</Text>
            {gameOver && opponentCard ? <Card card={opponentCard} /> : <View style={styles.hiddenCard} />}
        </View>
      </View>

      {result ? <Text style={styles.result}>{result}</Text> : null}

      {!gameOver ? (
        <View style={styles.buttonsContainer}>
          <Button title="Maior" onPress={() => handleGuess('higher')} />
          <Button title="Menor" onPress={() => handleGuess('lower')} />
        </View>
      ) : (
        <Button title="Próxima Rodada" onPress={nextRound} />
      )}

        <View style={styles.modifiersContainer}>
            <Text style={styles.modifiersTitle}>Modificadores</Text>
            <Button title="Dobro ou Nada" onPress={() => saveModifier('double')} disabled={activeModifier === 'double'} />
            <Button title="Aposta Segura" onPress={() => saveModifier('safe')} disabled={activeModifier === 'safe'} />
            <Button title="Resetar" onPress={() => saveModifier(null)} />
            {activeModifier && <Text>Modificador Ativo: {activeModifier}</Text>}
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  score: {
    fontSize: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  cardHolder: {
      alignItems: 'center'
  },
  hiddenCard: {
    width: 80,
    height: 120,
    backgroundColor: '#ccc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    margin: 5,
  },
  result: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'blue',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  modifiersContainer: {
      marginTop: 20,
      alignItems: 'center'
  },
  modifiersTitle:{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10
  }
});

export default GameScreen;
