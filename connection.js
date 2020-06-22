const { MongoClient } = require('mongodb');

async function main(){
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri = "mongodb+srv://playbookRob:nq19kYQ5ACuXsku6@cluster0-ayve7.mongodb.net/baseball?retryWrites=true&w=majority";


  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Make the appropriate DB calls
      await  listDatabases(client);

      await getVideosByTopic(client, "Hitting");

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}

main().catch(console.error);

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function createVideo(client, newVideo) {
  const result = await client.db("baseball").collection("videos").insertOne(newVideo);
  console.log(`New video created with the following id: ${result.insertedId}`);
}

async function createMultipleVideos(client, newVideos) {
  const result = await client.db("baseball").collection("videos").insertMany(newVideos);

  console.log(`${result.insertedCount} new video(s) created with the following id(s):`);
  console.log(result.insertedIds);
}

async function getVideosByTopic(client, topic) {
  const cursor = client.db("baseball").collection("videos").find({ topic: topic });

  const result = await cursor.toArray();

  if (result.length > 0) {
    console.log(`${result.length} ${topic} video(s) found`)

    result.forEach(res => {
      console.log(res.title);
    });
  } else {
    console.log(`No ${topic} videos found`);
  }
}

async function renameMediaType(client) {
  const result = await client.db("baseball").collection("videos")
                      .updateMany({ mediaType: { $exists: true } },
                                  { $rename: { mediaType: "media_type" } });

  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}