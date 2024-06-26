const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('baby-care');
        const flashCollection = db.collection('flash-sale');
        const productsCollection = db.collection('products');


        // ==============================================================
        // WRITE YOUR CODE HERE

        app.get("/flash-sale", async (req, res) => {
            const result = await flashCollection.find().toArray();
            res.send(result);
        });

        // Route for fetching products (with or without category)
        app.get('/products', async (req, res) => {
            const { category, brand } = req.query;

            try {
                let result;

                // Create an empty query object
                let query = {};

                // If both category and brand are provided, filter products by both
                if (category && brand) {
                    query = { category, brand };
                }
                // If only category is provided, filter products by category
                else if (category) {
                    query = { category };
                }
                // If only brand is provided, filter products by brand
                else if (brand) {
                    query = { brand };
                }

                // Fetch products from MongoDB collection based on the query
                result = await productsCollection.find(query).toArray();

                res.json(result);
            } catch (error) {
                console.error('Error fetching products:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.get("/products/:id", async (req, res) => {
            const { id } = req.params
            const filter = { _id: new ObjectId(id) }
            const result = await productsCollection.findOne(filter)
            res.send(result);
        });



        

       

        //==============================================================


        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } finally {
    }
}

run().catch(console.dir);

// Test route
app.get('/', (req, res) => {
    const serverStatus = {
        message: 'Server is running smoothly',
        timestamp: new Date()
    };
    res.json(serverStatus);
});