import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('database.db');

export const MyContext = React.createContext({
  historique: {},
  update: () => {},
  reset: () => {},
});

export const Provider = (props) => {
  const [data, setData] = useState({ ai: 0, hum: 0, tie: 0 });

  const loadScores = () => {
    try {
      const rows = db.getAllSync('SELECT pseudo, compteur FROM users');
      const nextData = { ai: 0, hum: 0, tie: 0 };

      rows.forEach((row) => {
        if (row.pseudo === 'ai') {
          nextData.ai = row.compteur;
        } else if (row.pseudo === 'hum') {
          nextData.hum = row.compteur;
        } else if (row.pseudo === 'tie') {
          nextData.tie = row.compteur;
        }
      });

      setData(nextData);
    } catch (error) {
      console.log('Error loading scores', error);
    }
  };

  useEffect(() => {
    try {
      db.execSync('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, pseudo TEXT UNIQUE, compteur INTEGER DEFAULT 0)');
      ['ai', 'hum', 'tie'].forEach((pseudo) => {
        db.runSync('INSERT OR IGNORE INTO users (pseudo, compteur) VALUES (?, ?)', [pseudo, 0]);
      });
      loadScores();
    } catch (error) {
      console.log('Error initializing database', error);
    }
  }, []);

  const updateCompteur = (user) => {
    try {
      db.runSync('UPDATE users SET compteur = compteur + 1 WHERE pseudo = ?', [user]);
      setData((current) => ({
        ...current,
        [user]: (current[user] || 0) + 1,
      }));
    } catch (error) {
      console.log('Error updating score', error);
    }
  };

  const resetCompteur = () => {
    try {
      db.runSync('UPDATE users SET compteur = 0');
      setData({ ai: 0, hum: 0, tie: 0 });
    } catch (error) {
      console.log('Error resetting scores', error);
    }
  };

  return (
    <MyContext.Provider
      value={{
        historique: data,
        update: updateCompteur,
        reset: resetCompteur,
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};
