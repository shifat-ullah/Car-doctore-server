const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nxcosv7.mongodb.net/?retryWrites=true&w=majority`;

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

    const servicescollection = client.db("carDoctors").collection("services");
    const bookingcollection = client.db("carDoctors").collection("booking");
  //services
app.get('/services', async(req,res)=>{
  const cursor = servicescollection.find();
  const result = await cursor.toArray()
  res.send(result)
})

app.get('/services/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const options = {
    projection: { service_id:1, title: 1, price: 1,img: 1 },
  };
  const result = await servicescollection.findOne(query, options);
  res.send(result)
})


//booking

app.post('/bookings', async(req,res)=>{
  const user = req.body;
  console.log(user)
  const result = await bookingcollection.insertOne(user);
  res.send(result)
})

app.get('/bookings', async(req,res)=>{
  let query = {};
  console.log(req.query?.email)
  if(req.query?.email){
    query={email : req.query.email}
  }
  // const result = await bookingcollection.find(query).toArray();
  const cursor = bookingcollection.find();
  const result = await cursor.toArray(query)
  console.log({result})
  res.send(result)
})


app.delete('/bookings/:id', async(req,res)=>{
  const id = req.params.id;
  const query ={_id:new ObjectId(id)};
  const result= await bookingcollection.deleteOne(query);
  res.send(result)
})


app.patch('/bookings/:id', async(req,res)=>{
  const id = req.params.id;
  const updatedata= req.body;
  const filter = {_id: new ObjectId(id)};
  console.log(updatedata);
  const updateDoc = {
    $set: {
      status: updatedata.status
    },
  };

  const result = await bookingcollection.updateOne(filter, updateDoc);
  res.send(result)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})