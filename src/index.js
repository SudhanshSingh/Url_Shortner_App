const express = require('express');
const dotenv = require('dotenv')
dotenv.config({path:"./.env"})
const bodyParser = require('body-parser');
const path=require("path")
const router = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const cors=require('cors')
const app = express();

app.use(bodyParser.json());
// console.log(process.env.PORT)
// console.log(process.env.Mongo_String)
//"mongodb+srv://Sudhanshu_09:5JQhJtJ5mUWQIBwo@cluster0.kt4fu.mongodb.net/urlShortner"

app.use(cors())
app.use(express.static(path.resolve(process.env.PUBLIC_DIR)))
app.use('/',router);
// console.log(path.resolve(process.env.PUBLIC_DIR))
mongoose.connect(process.env.MONGO_STRING)
  .then(() => console.log("MongoDb is connected"))
  .catch(err => console.log(err))

app.listen(process.env.PORT ||5000, function () {
  console.log('Express app running on port ' + (process.env.PORT ||5000 ));
});
