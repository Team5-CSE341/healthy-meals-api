const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let _client;
let _db;

const initDb = async () => {
  if (_db) {
    console.log('Db is already initialized!');
    return _db;
  }

  if (!uri) {
    throw new Error('Missing MONGODB_URI in environment variables');
  }

  if (!dbName) {
    throw new Error('Missing DB_NAME in environment variables');
  }

  _client = new MongoClient(uri);
  await _client.connect();
  _db = _client.db(dbName);

  console.log('Database connected');
  return _db;
};

const getDb = () => {
  if (!_db) {
    throw new Error('Database not initialized.');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb
};