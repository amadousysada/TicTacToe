import React , { useState, useEffect, useContext } from 'react'
import { Button, StyleSheet,Image, ImageBackground, Text, TextInput, TouchableOpacity, View, Alert, ProgressBarAndroid } from 'react-native'
import { Feather , MaterialIcons } from '@expo/vector-icons'; 
import Emoji from 'react-native-emoji';
import { Overlay } from 'react-native-elements';
import { MyContext } from '../provider'

const AI_DIFFICULTY = {
	easy: 'easy',
	hard: 'hard'
};

const Bord = (props) => {

	const context = useContext(MyContext);
    const [gameState, setGameState] = useState([
    	[0,0,0],
    	[0,0,0],
    	[0,0,0]

    ]);
    let typePlayer = [
    	'human',
    	'ai'
    ];
	
    const [playerTurn, setPlayerTurn] = useState("human");
    const [pseudo, setPseudo] = useState('Anonymous');
    const [visible, setVisible] = useState(false);
    const [emoji, setEmoji] = useState('raised_hands');
    const [message, setMessage] = useState('Tie !');
    const [hostWin, setHostWin] = useState(false);
    const [aiWin, setAiWin] = useState(false);
    const [tie, setTie] =  useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [difficulty, setDifficulty] = useState(AI_DIFFICULTY.easy);

  	
  	const toggleOverlay = () => {
    	setVisible(!visible);
  	};

    useEffect(() => {
    	console.log(context.historique);
    	if (playerTurn=="ai") {
    		aiMove(moveLeft(gameState));
    	}
  	}, [playerTurn, gameState]);

    const findBestMove = (bord)=>{
    	let bestVal = Number.NEGATIVE_INFINITY;
  		let bestMove;

  		for (let i = 0; i < 3; i++) {
  			for (let j = 0; j < 3; j++) {
  				if (bord[i][j] === 0) {
  					let temp=bord.map(arr => { return arr.slice()});
  					temp[i][j]=-1;
  					let score = computeMiniMax(temp, 0, false);
  					if (score > bestVal) {
				        bestVal = score;
				        bestMove = [i, j];
      				}
  				}
  			}
  		}
  		
  		return bestMove;
    }


  	const computeMiniMax = (bord, depth, isMax ) =>{

  		let score = evaluate(bord, depth, isMax);

  		if(!moveLeft(bord).length && score !==-10 && score !==10) {
  			return 0;
  		}

  		if (score === 10) return score;

  		if (score === -10) return score;

  		let best;

  		if(isMax){
  			best = Number.NEGATIVE_INFINITY;

  			for (let i = 0; i < 3; i++) {
  				for (let j = 0; j < 3; j++) {
  					if(bord[i][j]===0){
  						let temp=bord.map(arr => { return arr.slice()});
  				
  			    		temp[i][j]=-1;
  			    		let nextScore = computeMiniMax(temp, depth + 1, false)
  			    		best = Math.max(best, nextScore);
  					}
  				}
  			}

  			return best;
  			
  		}
  		else{
  			best = Number.POSITIVE_INFINITY;

  			for (let i = 0; i < 3; i++) {
  				for (let j = 0; j < 3; j++) {
  					if(bord[i][j]===0){
  						let temp=bord.map(arr => { return arr.slice()});
  				
  			    		temp[i][j]=1;
  			    		let nextScore = computeMiniMax(temp, depth + 1, true)
  			    		best = Math.min(best, nextScore);
  					}
  				}
  			}

  			return best;
  		}

  	}

  	const equal3 = (a, b, c) =>  (a!==0 && a==b && b==c);

  	const evaluate = (cells, depth, isMax) => {

  		let rows = equal3(cells[0][0],cells[0][1],cells[0][2]) || equal3(cells[1][0],cells[1][1],cells[1][2]) || equal3(cells[2][0],cells[2][1],cells[2][2]);
	  	let cols = equal3(cells[0][0],cells[1][0],cells[2][0]) || equal3(cells[0][1],cells[1][1],cells[2][1]) || equal3(cells[0][2],cells[1][2],cells[2][2]);
  		let diags = equal3(cells[0][0],cells[1][1],cells[2][2]) || equal3(cells[0][2], cells[1][1],cells[2][0]);
	  	
	  	if(rows || cols || diags){
		  	if (isMax) {
		  		return -10;
		  	}
		  	return 10;
	  	}
	}

	const getRandomMove = (availableMoves) => {
		const randomIndex = Math.floor(Math.random() * availableMoves.length);
		return availableMoves[randomIndex];
	}

	const getEasyMove = (availableMoves) => {
		if (availableMoves.length >= 9) {
			return getRandomMove(availableMoves);
		}

		if (Math.random() < 0.4) {
			return getRandomMove(availableMoves);
		}

		return findBestMove(gameState);
	}

  	const aiMove = (availableMoves) => {

		if (!availableMoves.length || gameOver) {
			return;
		}

		let move;

		if (difficulty === AI_DIFFICULTY.easy) {
			move = getEasyMove(availableMoves);
		} else {
			move = findBestMove(gameState);
		}

		if (!move) {
			move = getRandomMove(availableMoves);
		}

		let newGameState = gameState.map(arr => { return arr.slice()});
		newGameState[move[0]][move[1]] = -1;
		setGameState(newGameState);
		setPlayerTurn("human");
  	}

	const moveLeft = (cells) => {
		let moves = [];

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (cells[i][j] === 0) {
					moves.push([i, j]);
				}
			}
		}

		return moves;
	}

	const checkWinner = (cells) => {
		let rows = equal3(cells[0][0],cells[0][1],cells[0][2]) || equal3(cells[1][0],cells[1][1],cells[1][2]) || equal3(cells[2][0],cells[2][1],cells[2][2]);
		let cols = equal3(cells[0][0],cells[1][0],cells[2][0]) || equal3(cells[0][1],cells[1][1],cells[2][1]) || equal3(cells[0][2],cells[1][2],cells[2][2]);
		let diags = equal3(cells[0][0],cells[1][1],cells[2][2]) || equal3(cells[0][2], cells[1][1],cells[2][0]);

		if (rows || cols || diags) {
			return true;
		}

		return false;
	}

	useEffect(() => {
		if (checkWinner(gameState)) {
			setGameOver(true);
			setVisible(true);

			if (playerTurn === 'human') {
				setAiWin(true);
				setMessage('AI win !');
				setEmoji('robot_face');
				context.update('ai');
			} else {
				setHostWin(true);
				setMessage('You win !');
				setEmoji('tada');
				context.update('hum');
			}
		} else if (!moveLeft(gameState).length) {
			setGameOver(true);
			setTie(true);
			setVisible(true);
			setMessage('Tie !');
			setEmoji('raised_hands');
			context.update('tie');
		}
	}, [gameState]);

	const play = (row, col) => {
		if (gameState[row][col] !== 0 || playerTurn !== 'human' || gameOver) {
			return;
		}

		let newGameState = gameState.map(arr => { return arr.slice()});
		newGameState[row][col] = 1;
		setGameState(newGameState);
		setPlayerTurn('ai');
	}

	const resetGame = () => {
		setGameState([
			[0,0,0],
			[0,0,0],
			[0,0,0]
		]);
		setPlayerTurn('human');
		setVisible(false);
		setEmoji('raised_hands');
		setMessage('Tie !');
		setHostWin(false);
		setAiWin(false);
		setTie(false);
		setGameOver(false);
	}

	const renderIcon = (value) => {
		if (value === 1) {
			return <Feather name="x" size={60} color="white" />;
		}

		if (value === -1) {
			return <MaterialIcons name="radio-button-unchecked" size={60} color="white" />;
		}

		return null;
	}

	return (
		<View style={styles.content}>
			<Text style={styles.title}>Tic Tac Toe</Text>
			<View style={styles.levelContainer}>
				<Text style={styles.levelLabel}>Level:</Text>
				<TouchableOpacity
					style={[styles.levelButton, difficulty === AI_DIFFICULTY.easy && styles.levelButtonActive]}
					onPress={() => setDifficulty(AI_DIFFICULTY.easy)}>
					<Text style={styles.levelButtonText}>Easy</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.levelButton, difficulty === AI_DIFFICULTY.hard && styles.levelButtonActive]}
					onPress={() => setDifficulty(AI_DIFFICULTY.hard)}>
					<Text style={styles.levelButtonText}>Hard</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.board}>
				{gameState.map((row, rowIndex) => (
					<View key={rowIndex} style={styles.row}>
						{row.map((cell, colIndex) => (
							<TouchableOpacity key={`${rowIndex}-${colIndex}`} style={styles.cell} onPress={() => play(rowIndex, colIndex)}>
								{renderIcon(cell)}
							</TouchableOpacity>
						))}
					</View>
				))}
			</View>
			<Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
				<View style={styles.overlayContent}>
					<Emoji name={emoji} style={styles.emoji} />
					<Text style={styles.message}>{message}</Text>
					<Button title="Play again" onPress={resetGame} />
				</View>
			</Overlay>
		</View>
	)
}

const styles = StyleSheet.create({
	content: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 30,
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 20
	},
	levelContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20
	},
	levelLabel: {
		color: 'white',
		fontSize: 18,
		marginRight: 10
	},
	levelButton: {
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderRadius: 8,
		backgroundColor: 'rgba(255,255,255,0.25)',
		marginHorizontal: 4
	},
	levelButtonActive: {
		backgroundColor: 'rgba(255,255,255,0.5)'
	},
	levelButtonText: {
		color: 'white',
		fontWeight: 'bold'
	},
	board: {
		backgroundColor: 'rgba(0,0,0,0.35)',
		padding: 8,
		borderRadius: 12
	},
	row: {
		flexDirection: 'row'
	},
	cell: {
		width: 90,
		height: 90,
		borderWidth: 1,
		borderColor: 'white',
		alignItems: 'center',
		justifyContent: 'center'
	},
	overlayContent: {
		padding: 20,
		alignItems: 'center'
	},
	emoji: {
		fontSize: 50,
		marginBottom: 10
	},
	message: {
		fontSize: 22,
		marginBottom: 20
	}
});

export default Bord;
