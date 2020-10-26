const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // environment variables
const cors = require('cors');

// add configuration file
dotenv.config({ path: './config.env' })
const app = express();

// allow cross-origin requests
app.use(cors());

// connect to DB
const dbURL = process.env.DATABASE
  .replace('<USERNAME>', process.env.USERNAME)
  .replace('<PASSWORD>', process.env.PASSWORD)
  
mongoose.connect(dbURL, { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
});
mongoose.connection.once('open', () => {
  console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('listening to requests on port 4000');
});