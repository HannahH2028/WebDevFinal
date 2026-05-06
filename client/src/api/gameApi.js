// Axios API layer
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});


export const createGame = async (playerName = 'Player') => {
  const { data } = await API.post('/games', { playerName });
  return data;
};

export const getGame = async (id) => {
  const { data } = await API.get(`/games/${id}`);
  return data;
};

export const flipCoin = async (id) => {
  const { data } = await API.put(`/games/${id}/flip`);
  return data;
};

export const purchaseUpgrade = async (id, upgradeKey) => {
  const { data } = await API.put(`/games/${id}/upgrade`, { upgradeKey });
  return data;
};

export const deleteGame = async (id) => {
  const { data } = await API.delete(`/games/${id}`);
  return data;
};

export const getUpgrades = async () => {
  const { data } = await API.get('/upgrades');
  return data;
};

export const getLeaderboard = async () => {
  const { data } = await API.get('/leaderboard');
  return data;
};

export const submitToLeaderboard = async (entry) => {
  const { data } = await API.post('/leaderboard', entry);
  return data;
};
