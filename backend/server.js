const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
var User = require('./routes/User');
const port = process.env.PORT || 3000;
const db = require('./config/key').mongoURI;
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10000mb' }));
app.use(cors());

mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.log(err));

app.use('/user', User);

app.listen(port, function() {
  console.log('server is running on port ' + port);
});
