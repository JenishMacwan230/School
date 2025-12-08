import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Lazy initialization of the MongoDB client
function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, {});
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri, {});
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

// Export the client promise getter. The actual connection is only
// established when this is first called at runtime.
export default getClientPromise;

// Helper function to get database instance
export async function getDatabase(dbName?: string): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName || process.env.MONGODB_DB_NAME);
}
