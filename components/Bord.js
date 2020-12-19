import React , { useState, useEffect } from 'react'
import { Button, StyleSheet,Image, ImageBackground, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import { Feather , MaterialIcons } from '@expo/vector-icons'; 
import Emoji from 'react-native-emoji';
import { Overlay } from 'react-native-elements';




const Bord = () => {

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
  	
  	const toggleOverlay = () => {
    	setVisible(!visible);
  	};

    useEffect(() => {
    	if (playerTurn=="ai") {
    		aiMove(moveLeft(gameState));
    	}
  	}, [playerTurn, gameState]);

    const findBestMove = (bord)=>{
    	let bestVal = Number.NEGATIVE_INFINITY;
  		let bestMove;

  		for (let i = 0; i < 3; i++) {
  			for (let j = 0; j < 3; j++) {
  				if (bord[i][j] == 0) {
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
  		
    	//console.log("BEST MOVE! ", bestMove);
  		return bestMove;
    }


  	const computeMiniMax = (bord, depth, isMax ) =>{

  		let lengthBord = moveLeft(bord);

  		let score = evaluate(bord, depth, isMax);

  		if(!moveLeft(bord).length) {
  			return 0;
  		}

  		if (score === 10) return score;

  		if (score === -10) return score;

  		
  		
  		let best;

  		if(isMax){
  			best = Number.NEGATIVE_INFINITY;
  			let availables = moveLeft(bord);

  			for (let i = 0; i < 3; i++) {
  				for (let j = 0; j < 3; j++) {
  					if(bord[i][j]===0){
  						let temp=bord.map(arr => { return arr.slice()});
  				
  			    		temp[i][j]=-1;
  			    		let score = computeMiniMax(temp, depth + 1, false)
  			    		best = Math.max(best, score);
  					}
  				}
  			}

  			return best;
  			
  		}
  		else{
  			best = Number.POSITIVE_INFINITY;
  			let availables = moveLeft(bord);

  			for (let i = 0; i < 3; i++) {
  				for (let j = 0; j < 3; j++) {
  					if(bord[i][j]===0){
  						let temp=bord.map(arr => { return arr.slice()});
  				
  			    		temp[i][j]=1;
  			    		let score = computeMiniMax(temp, depth + 1, true)
  			    		best = Math.min(best, score);
  					}
  				}
  			}

  			return best;
  		}

  	}

  	const equal3 = (a, b, c) =>  (a!==0 && a==b && b==c);

  	const evaluate = (cells, depth, isMax) => {

  		// Check lines
  		let rows = equal3(cells[0][0],cells[0][1],cells[0][2]) || equal3(cells[1][0],cells[1][1],cells[1][2]) || equal3(cells[2][0],cells[2][1],cells[2][2]);
	  	
	  	// Check columns
	  	let cols = equal3(cells[0][0],cells[1][0],cells[2][0]) || equal3(cells[0][1],cells[1][1],cells[2][1]) || equal3(cells[0][2],cells[1][2],cells[2][2]);
  		
  		// Check Diagonals
  		let diags = equal3(cells[0][0],cells[1][1],cells[2][2]) || equal3(cells[0][2], cells[1][1],cells[2][0]);
	  	
	  	if(rows || cols || diags){
		  	if (isMax) {
		  		return -10;
		  	}
		  	return 10;
	  	}

	  	else{
	  		if(isMax) return 0.2-depth;
	  		else 0.2+depth;
	  	}
	  	
	  	//return 0.2 - depth;
	}

  	const aiMove = (availableMoves) => {

    	if (availableMoves.length >= 8) {
    		let randomNumber = Math.floor(Math.random()*availableMoves.length);

    		let [row, col] = availableMoves[randomNumber];
    	
    		gameState[row][col]=-1;
			setPlayerTurn("human");
			setGameState(gameState);

			return;
    	}
  		if (availableMoves.length) {
  			let [row, col] =findBestMove(gameState);
    	
    		gameState[row][col]=-1;
			setPlayerTurn("human");
			setGameState(gameState);
			if(checkWinner(gameState, row, col)){
				setGameOver(true);
				setEmoji('');
				setMessage('You\'ve lost the game!');
				setAiWin(true);
				toggleOverlay();
				setTimeout(() => 
					{
						setVisible(false);
						setTie(false);
						setAiWin(false);
						setHostWin(false);
					}
				, 3000);
			}
			if(!checkWinner(gameState, row, col) && !moveLeft(gameState).length ){
				setGameOver(true);
				setEmoji('');
				setMessage('');
				setTie(true)
				toggleOverlay();
				setTimeout(() => 
				{
					setVisible(false);
					setTie(false);
					setAiWin(false);
					setHostWin(false);
				}
				, 3000);
			}	

  		}
    		
  	};

  	const moveLeft = (bord) => {
  		let moves = [];
  		bord.forEach((row, indexRow)=>{
  			row.forEach( (cell,indexCol) => {
  				if(cell==0) moves.push([indexRow, indexCol])
  			});
  		});

  		return moves;
  	}

    const checkWinner = (cells, row, col) => {
    	let winner = false;
    	const value = playerTurn=="human"?3:-3
    	//check the row
    	winner = cells[row][0]+cells[row][1]+cells[row][2]==value? true: false;
    	if (winner) return true;
 		
    	//check the columns
    	winner = cells[0][col]+cells[1][col]+cells[2][col]==value? true: false;
    	if (winner) return true;

    	//checko diagonals
    	winner = cells[0][0]+cells[1][1]+cells[2][2]==value? true: false;
    	if (winner) return true;
    	winner = cells[0][2]+cells[1][1]+cells[2][0]==value? true: false;
    	if (winner) return true;

    	return winner;

    }

    const initGame = ()=>{
    	let randomNumber = Math.floor(Math.random()*typePlayer.length);
    	setGameOver(false);
    	setGameState([Array(3).fill(0),Array(3).fill(0),Array(3).fill(0)]);
    	setPlayerTurn(typePlayer[randomNumber]);
    	setPlayerTurn("human");
    }
    
    const onPress = (row, col) => {
 
    	
    	if (gameState[row][col]==0) {
    		if (playerTurn=="human") {
    			gameState[row][col]=1
    			setGameState(gameState)
    			setPlayerTurn("ai");
    			if(checkWinner(gameState,row,col)){
    				setGameOver(true);
    				setEmoji('raised_hands');
    				setMessage('You are the winner!');
    				setHostWin(true)
    				toggleOverlay();
    				setTimeout(() => 
					{
						setVisible(false);
						setTie(false);
						setAiWin(false);
						setHostWin(false);
					}
				, 3000);
    			}
    			if(!checkWinner(gameState, row,col) && !moveLeft(gameState).length ){
    				setGameOver(true);
    				setEmoji('');
    				setMessage('');
    				setTie(true)
    				toggleOverlay();
    				setTimeout(() => 
					{
						setVisible(false);
						setTie(false);
						setAiWin(false);
						setHostWin(false);
					}
				, 3000);
    			}
    			
    		}
    		    			
    		
    	}


    };

    const onChangeText = (text) => setPseudo(text);
    const renderItem = (row, col) => {

    	

    	if(gameState[row][col]==1){

    		return (<MaterialIcons name="close" size={100} color="red" />);
    	}
    	else if (gameState[row][col]==-1) {
    		return (<Feather name="circle" size={100} color="white" />);
    	}
    	else{
    		return (<Text></Text>);
    	}
    };

	return (
		<View style={styles.container} disabled={true}>
			<View>
      			
      				<Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{backgroundColor:'#0843a3'}}>
        				<View>
        					{ hostWin ? <Image style={{width:'100%'}} source={require('../tenor.gif')}/> : null }
        					{ aiWin ? <Image style={{width:'100%'}} source={require('../HpP8kVn.gif')}/> : null }
        					{ tie ? <Text style={{color:'#f29c07',textAlign:"center", fontFamily:"sans-serif", fontWeight: 'bold', fontSize:23}}>Tie Game!</Text> : null }
        					
      						<View style={{flexDirection:'row'}}>
      							<Text style={{color:'#f29c07',textAlign:"center", fontFamily:"sans-serif", fontWeight: 'bold', fontSize:23}}>{message}</Text>
        						<Emoji name={emoji} style={{fontSize: 26}}/>
      						</View>
      						
        				</View>
        				
      				</Overlay>
    		</View>
			
			<View>
				<TextInput
      				style={{ borderColor: 'gray', borderWidth: 2, marginBottom:23, width:200, textAlign:'center', color:'white' }}
      				onChangeText={text => onChangeText(text)}
      				value={pseudo}
    			/>
			</View>
	        <View style={styles.row}>
	          <TouchableOpacity disabled={playerTurn=="ai" || gameOver} style={[styles.square, { borderLeftWidth: 0, borderTopWidth:0, borderWidth:2 } ]} onPress={() => onPress(0,0)}>
	          	{renderItem(0,0)}
	          </TouchableOpacity>
	          <TouchableOpacity disabled={playerTurn=="ai" || gameOver} style={[styles.square, { borderTopWidth:0, borderWidth:2 } ]} onPress={() => onPress(0,1)}>
	          	{renderItem(0,1)}
	          </TouchableOpacity>
	          <TouchableOpacity disabled={playerTurn=="ai" || gameOver} style={[styles.square, { borderTopWidth:0, borderRightWidth:0, borderWidth:2 } ]} onPress={() => onPress(0,2)}>
	          	{renderItem(0,2)}
	          </TouchableOpacity>
	        </View>

	        <View style={styles.row}>
	          <TouchableOpacity disabled={playerTurn=="ai" || gameOver} style={[styles.square, {borderLeftWidth: 0, borderWidth:2 } ]} onPress={() => onPress(1,0)}>
	          	{renderItem(1,0)}
	          </TouchableOpacity>
	          <TouchableOpacity disabled={playerTurn=="ai" || gameOver} style={[styles.square, {borderWidth:2 } ]} onPress={() => onPress(1,1)}>
	          	{renderItem(1,1)}
	          </TouchableOpacity>
	          <TouchableOpacity disabled={playerTurn=="ai" || gameOver} style={[styles.square, {borderRightWidth:0, borderWidth:2 } ]} onPress={() => onPress(1,2)}>
	          	{renderItem(1,2)}
	          </TouchableOpacity>
	        </View>

	        <View style={styles.row}>
	          <TouchableOpacity disabled={playerTurn=="ai" || gameOver} style={[styles.square, {borderLeftWidth: 0, borderBottomWidth:0, borderWidth:2 } ]} onPress={() => onPress(2,0)}>
	          	{renderItem(2,0)}
	          </TouchableOpacity>
	          <TouchableOpacity disabled={playerTurn=="ai" || gameOver} style={[styles.square, {borderBottomWidth:0, borderWidth:2 } ]} onPress={() => onPress(2,1)}>
	          	{renderItem(2,1)}
	          </TouchableOpacity>
	          <TouchableOpacity disabled={playerTurn=="ai" || gameOver} style={[styles.square, {borderBottomWidth:0, borderRightWidth:0, borderWidth:2 } ]} onPress={() => onPress(2,2)}>
	          	{renderItem(2,2)}
	          </TouchableOpacity>
	        </View>
	        <View style={styles.btn}>
	        	<Button
		        	
	  				onPress={initGame}
	  				title="New Game"
	  				color="#841584"
	  				accessibilityLabel="Learn more about this purple button"
				/>
	        </View>
	        
      	</View>

	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row:{
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',

  },
  square:{
  	width:100,
    height:100,
    backgroundColor: '#dfdce6',
  },
  btn:{
  	marginTop:10,
  }
});


export default Bord;