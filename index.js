const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@project.bl7auak.mongodb.net/`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("taskBridgeDB");
    const tasksCollection = database.collection("tasks");
    const usersCollection = database.collection("users");

    console.log("MongoDB connected successfully!");

    // Test route
    app.get("/", (req, res) => {
      res.send("TaskBridge server is running!");
    });

    // Get all tasks
    app.get("/tasks", async (req, res) => {
      const result = await tasksCollection.find().toArray();
      res.send(result);
    });

    // Get single task
    app.get('/tasks/:id', async(req,res)=>{
      const id = req.params.id;
       const query = { _id: new ObjectId(id) };
       const result = await tasksCollection.findOne(query);
       res.send(result);
    })

    // Add a new task
    app.post("/tasks", async (req,res)=>{
      const task = req.body;
      console.log(task);
      const result = await tasksCollection.insertOne(task);
      console.log(result);
      
      
    })

    

  }
  finally{
    // await client.close();
  }
}

run().catch(console.dir);



if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;
