const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const cors=require('cors')
const app = express();

app.use(bodyParser.json());
// console.log(process.env.PORT)
// console.log(process.env.Mongo_String)
mongoose.connect("mongodb+srv://Sudhanshu_09:5JQhJtJ5mUWQIBwo@cluster0.kt4fu.mongodb.net/urlShortner", {
  useNewUrlParser: true
})
  .then(() => console.log("MongoDb is connected"))
  .catch(err => console.log(err))

app.use(cors())
app.use('/', router);


app.listen(process.env.PORT ||4000, function () {
  console.log('Express app running on port ' + (process.env.PORT ||4000 ));
});
