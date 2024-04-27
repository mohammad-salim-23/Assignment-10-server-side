const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
  
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASS}@cluster0.ipsrkdy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(process.env.DB_USERS)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const craftCollection = client.db('craftDB').collection('craft');

    app.post('/craft',async(req,res)=>{
        const newCraft = req.body;
        const result = await craftCollection.insertOne(newCraft);
        res.send(result);
    })
    
    app.get('/craft',async(req,res)=>{
        const cursor = craftCollection.find();
        const result = await cursor.toArray();
        res.send(result);

    })

    app.get('/craft/:id',async(req,res)=>{
          const id = req.params.id;
          const query = {_id: new ObjectId(id)};
          const result = await craftCollection.findOne(query);
          res.send(result);
    })
    
    app.put('/craft/:id',async(req,res)=>{
        const id = req.params.id;
        const filter = {_id:new ObjectId(id)};
        const options = {upseert:true};
        const updateCraft = req.body;

        const craft={
            $set:{
                name:updateCraft.name,
                time:updateCraft.time,
                subcategory:updateCraft.subcategory,
                rating : updateCraft.rating,
                price:updateCraft.price,
                details: updateCraft.details,
                photo: updateCraft.photo,
                email:updateCraft.email,
                stock:updateCraft.stock,
                userName :updateCraft.stock,

            }
        }
        const result = await craftCollection.updateOne(filter,craft,options);
        res.send(result);
    })
    // user craft
    app.get('/myCraft/:email',async(req,res)=>{
        const cursor =  craftCollection.find({email:req.params.email})
        const result =await cursor.toArray()
        console.log(result);
        res.send(result)
    })
    
    app.delete('/craft/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)};
        const result = await craftCollection.deleteOne(query);
        res.send(result);
    })

    // Send a ping to confirm a successful connection

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //  await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("server is running");
})
app.listen(port,()=>{
    console.log(`server is running on port:${port}`)
})

