const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const keys = require('./config/keys');

// const AWS = require('aws-sdk');
// AWS.config.update({ region: 'us-east-1' });

const app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(fileUpload());

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', keys.origin);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

mongoose.Promise = Promise;

mongoose.set('useCreateIndex', true)
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

// const db = mongoose.connection;
// db.on("error", (error) => {
//     console.log("Mongoose Error: ", error);
// });
// db.once("open", () => {
//     console.log("Database Connection Success");
// });

app.use(require('./routes'));
// require('./routes');

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
};

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
