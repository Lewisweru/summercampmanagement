import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/camp-manager";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectToDb() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    return client.db("camp-manager");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export const db = client.db("camp-manager");

// Helper function to sync Firebase user with MongoDB
export async function syncUserToMongoDB(firebaseUser: any, additionalData: any = {}) {
  const users = db.collection('users');
  
  const userData = {
    firebaseUid: firebaseUser.uid,
    email: firebaseUser.email,
    ...additionalData,
    updatedAt: new Date(),
  };

  await users.updateOne(
    { firebaseUid: firebaseUser.uid },
    { $set: userData },
    { upsert: true }
  );

  return await users.findOne({ firebaseUid: firebaseUser.uid });
}