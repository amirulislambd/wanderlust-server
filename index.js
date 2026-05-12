require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    const db = client.db("wanderlust");
    const destinationCollection = db.collection("destinations");

    app.get("/destination", async (req, res) => {
      const result = await destinationCollection.find().toArray();
      res.json(result);
    });

    app.get("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.patch("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      const updated = await destinationCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData },
      );
      res.send(updated);
      console.log(updated);
    });

    app.post("/destination", async (req, res) => {
      const destinationData = req.body;
      console.log(destinationData);
      const result = await destinationCollection.insertOne(destinationData);
      res.send(result);
    });

    app.delete('/destination/:id',async(req, res)=>{
        const {id}=req.params
        const result = await destinationCollection.deleteOne({_id: new ObjectId(id)})
        res.send(result)
    })

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close()
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bissmillahir Rahmanir Rahim");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
