import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  // MongoDB Atlas connection options
  serverSelectionTimeoutMS: 10000, // 10 seconds
  connectTimeoutMS: 15000, // 15 seconds
  socketTimeoutMS: 45000, // 45 seconds
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export const getDatabase = async (): Promise<Db> => {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DATABASE || 'life-accessories');
};

// Database collections
export const getCollections = async () => {
  const db = await getDatabase();
  return {
    products: db.collection('products'),
    categories: db.collection('categories'),
    orders: db.collection('orders'),
    users: db.collection('users'),
    areas: db.collection('areas'),
    stockHistory: db.collection('stockHistory'),
  };
};
