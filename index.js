const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

// MongoDb Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kin6o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

async function run() {
  try {
    await client.connect();
    console.log("database connected ty array ");
    const database = client.db("array_apartments");
    const apartmentCollection = database.collection("apartments");
    const bookingCollection = database.collection("bookings");
    const usersCollection = database.collection("users");

    const membersCollection = database.collection("members");

    // ADD PACKAGES
    app.post("/addEvent", async (req, res) => {
      console.log(req.body);
      const result = await apartmentCollection.insertOne(req.body);
      console.log(result);
    });

    // ADD Boookings
    app.post("/addNewBooking", async (req, res) => {
      console.log(req.body);
      const result = await bookingCollection.insertOne(req.body);
      console.log(result);
    });

    // ADD Members
    app.post("/addMember", async (req, res) => {
      console.log(req.body);
      const result = await membersCollection.insertOne(req.body);
      res.send(result);
    });

    // Searched Packages
    app.get("/searchPackages", async (req, res) => {
      console.log(req.query.search);
      const result = await apartmentCollection
        .find({
          title: { $regex: req.query.search },
        })
        .toArray();
      res.send(result);
      console.log(result);
    });

    // Get ALL Members
    app.get("/allMembers", async (req, res) => {
      const result = await membersCollection.find({}).toArray();
      res.send(result);
    });

    // Get ALL Packages
    app.get("/allPackages", async (req, res) => {
      const result = await apartmentCollection.find({}).toArray();
      res.send(result);
    });

    // GET all Bookings
    app.get("/allBookings", async (req, res) => {
      const result = await bookingCollection.find({}).toArray();
      res.send(result);
    });

    // Delete Package
    app.delete("/deletePackage/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await apartmentCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
    // Delete Booking
    app.delete("/deleteBooking/:id", async (req, res) => {
      const result = await bookingCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    // Single Package Details
    app.get("/packageDetails/:id", async (req, res) => {
      // console.log(req.params.id);
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await apartmentCollection.findOne(query);
      res.json(result);
    });

    // My Bookings
    app.get("/myBookings/:email", async (req, res) => {
      // console.log(req.params);
      const result = await bookingCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
      // console.log(result);
    });
    // My Booking details
    app.post("/myBookings/:email", async (req, res) => {
      const result = await bookingCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
      // console.log(result);
    });

    // Update status
    app.put("/updateStatus/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await bookingCollection.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: { status: "Approved" } }
      );
      res.send(result);
    });

    // Users area
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };

      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Fellow Travellers server is running ");
});

app.listen(port, () => {
  console.log("Server is Running at port ", port);
});
