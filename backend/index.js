require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db'); 
connectToMongo(); 

const app = express();

app.use(cors()); // Allow all origins by default
app.use(express.json());



app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
