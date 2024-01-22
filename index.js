const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors(
//     {
//     origin: [
//         'http://localhost:5173',
       
//     ],
//     credentials: true
// }
));
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8wwrvjl.mongodb.net/?retryWrites=true&w=majority`;

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
        const blogCollection = client.db('blogUser').collection('blogs');
        const wishListCollection = client.db('blogUser').collection('wishList');
        const commentCollection = client.db('blogUser').collection('comments');


        app.post('/blogs', async (req, res) => {
            const blog = req.body;
            console.log(blog);
            const result = await blogCollection.insertOne(blog);
            res.send(result);
        });

        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            console.log(query)
            // const options = {
            //     // Include only the `title` and `imdb` fields in the returned document
            //     projection: { title: 1,  image: 1 ,longDescription: 1},
            // };

            const result = await blogCollection.findOne(query);
            console.log(result)
            res.send(result);
        })

        app.put('/blogs/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedBlog = req.body
      
            const blog = {
              $set: {
                image: updatedBlog.updatedImage,
                title: updatedBlog.updatedTitle,
                category: updatedBlog.updatedCategory,
                shortDescription: updatedBlog.updatedShortDescription,
                longDescription: updatedBlog.updatedLongDescription,
      
              }
            }
      
            const result = await blogCollection.updateOne(filter, blog, options)
            res.send(result)
          })
      

        app.post('/wishList', async (req, res) => {
            const wishListedBlog = req.body;
            console.log(wishListedBlog);
            const result = await wishListCollection.insertOne(wishListedBlog);
            res.send(result);
        });

        app.get('/wishList', async (req, res) => {

            console.log(req.query.email)
            let query = {}
            if(req.query?.email){
                query = {email : req.query.email}
            }
            const cursor = wishListCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        // app.get('/wishList/:id', async (req, res) => {
            
        //         const id = req.params.id;
        //         const query = { _id: new ObjectId(id) }
        //         console.log(query)
        //         const options = {
        //             projection: { title: 1, image: 1 },
        //         };
        
        //         const result = await wishListCollection.findOne(query,options);
                
        //         console.log(result)
        
        // });
        

        app.delete('/wishList/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await wishListCollection.deleteOne(query);
            res.send(result);
        })


        app.post('/comments', async (req, res) => {
            const comment = req.body;
            console.log(comment);
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        });

        app.get('/comments', async (req, res) => {
            
            let query = {};
            if (req.query?.blogId) {
                query = { blogId: req.query.blogId };
            }
            const cursor = commentCollection.find(query)
            const result = await cursor.toArray();
            res.send(result);
        });
            

        // app.get('/comments/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     console.log(query)
        //     // const options = {
        //     //     // Include only the `title` and `imdb` fields in the returned document
        //     //     projection: { title: 1,  image: 1 ,longDescription: 1},
        //     // };

        //     const result = await commentCollection.findOne(query);
        //     console.log(result)
        //     res.send(result);
        // })

   



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
    res.send('assignment 11 is running')
})

app.listen(port, () => {
    console.log(` assignment 11 Server is running on port ${port}`)
})