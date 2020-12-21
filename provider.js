import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('database.db');

export const MyContext = React.createContext({
	historique: {},
	update: (user)=>{},
	reset: () => {}

});

export const Provider = (props)=>{

	useEffect(() => {
		console.log("hey")
    	db.transaction(tx => {
      		tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, pseudo TEXT, compteur INT)'
      	)});
      	//fetchData();
  	}, []);

	const [data, setData] = useState({ai:0, hum:0, tie:0});

  	const fetchData = () => {
	    db.transaction(tx => {
	      // sending 4 arguments in executeSql
	      tx.executeSql("SELECT compteur FROM users ", null, // passing sql query and parameters:null
	        // success callback which sends two things Transaction object and ResultSet Object
	        (txObj, resultSet) => {
	          resultSet.rows._array.map(row => {
	            if (row.pseudo == 'ai'){
	              data.ai=row.compteur;
	              setData(data);
	            }else if (row.pseudo == 'hum'){
	              data.hum=row.compteur;
	              setData(data);
	            }else {
	              data.tie=row.compteur;
	              setData(data);
	            }
	          })
	        },
	        // failure callback which sends two things Transaction object and Error
	        (txObj, error) => console.log('Error ', error)
	      ) // end executeSQL
	    }) // end transaction
  	}

  	const updateCompteur = (user)=>{
	    db.transaction(tx => {
	      // sending 4 arguments in executeSql
	      tx.executeSql('UPDATE users SET compteur = compteur + 1 WHERE pseudo = ?', [user], // passing sql query and parameters:null
	        // success callback which sends two things Transaction object and ResultSet Object
	        (txObj, resultSet) => {
	          
	            if (user == 'ai'){
	              data.ai=data.ai+1;
	              setData(data);
	            }else if (user == 'hum'){
	              data.hum=data.hum+1;
	              setData(data);
	            }else {
	              data.tie=data.tie+1;
	              setData(data);
	            }
	          
	        },
	        // failure callback which sends two things Transaction object and Error
	        (txObj, error) => console.log('Error ', error)
	      ) // end executeSQL
	    }) // end trans
  	}

  	const resetCompteur = ()=>{
	    db.transaction(tx => {
	      // sending 4 arguments in executeSql
	      tx.executeSql('delete from users', null, // passing sql query and parameters:null
	        // success callback which sends two things Transaction object and ResultSet Object
	        (txObj, resultSet) => setData({ai:0, hum:0, tie:0}),
	        // failure callback which sends two things Transaction object and Error
	        (txObj, error) => console.log('Error ', error)
	      ) // end executeSQL
	    }) // end trans
  	}

  	
 	return (
	  	<MyContext.Provider 
		   value={{
		    historique: data,
		    update: updateCompteur,
		    reset: resetCompteur
		   }}
		  >
		   {props.children}
	  	</MyContext.Provider>
	);

}
