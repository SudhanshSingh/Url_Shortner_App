const UrlModel = require("../models/urlModel.js");
const ShortId = require("shortid");
const redis= require("redis");
const validUrl = require("valid-url");
const { promisify } = require("util");
const urlModel = require("../models/urlModel.js");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const redisClient = redis.createClient(
  14359,
  "redis-14359.c301.ap-south-1-1.ec2.cloud.redislabs.com",
  {no_ready_check:true}
);
redisClient.auth('3ciByhnROZ8lLQ9mgysqAgNSWLPpV2eH',function(err){
  if(err)throw err;
});


redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

//connect to the server

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const createUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;
    const baseUrl = "http://localhost:3000";
    if (Object.keys(req.body).length != 0) {
      if (!isValid(longUrl))
        return res
          .status(400)
          .send({ status: false, message: "Please enter longUrl" });
      if (
        !/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(
          longUrl
        )
      )
        return res
          .status(400)
          .send({ status: false, message: "Please enter valid url" });
      if (!validUrl.isUri(longUrl)) {
        return res.status(400).send({ status: false, message: "Invalid  LongUrl" });
      }
      let cachedUrlData = await GET_ASYNC(`${longUrl}`); // templet string
      if (cachedUrlData) {
        return res
          .status(200)
          .send({
            status: true,
            message: "This Url is already shorten",
            data: cachedUrlData,
          });
      } else {
        const urlId = ShortId.generate();
        const urlShort = "/" + urlId;
        req.body.shortUrl = urlShort;
        req.body.urlCode = urlId;

        const urlCreated = await UrlModel.create(req.body);
        let urlDetails = {
          longUrl: urlCreated.longUrl,
          shortUrl: urlCreated.shortUrl,
          urlCode: urlCreated.urlCode,
        };
        await SET_ASYNC(`${longUrl}`, urlDetails.shortUrl);
        res.status(201).send({ status: true,message:"url is shorted" ,data: urlDetails });
      }

      //     await SET_ASYNC(`${longUrl}`, (urlCreated.shortUrl));
      //     res.status(201).send({ status: true, data: urlCreated });
      // }
    } else {
      return res
        .status(400)
        .send({
          status: false,
          message:
            "Requested body cannot remain empty please provide some data",
        });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


//------------------- --get Urls------------------------------------

const myUrls= async function(req,res){
  try{
  let data= await urlModel.find().sort({createdAt:-1})
  // console.log("data",data)
  return res.status(200).send({status:true,message:'Your Urls',data:data})
}catch(err){
  return res.status(500).send({status:false,message:err.message})
}
}



const getUrl = async (req, res) => {
  try {
    const urlCode = req.params.urlCode;
    if (!ShortId.isValid(urlCode))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid urlCode" });

    let cachedUrlData = await GET_ASYNC(`${req.params.urlCode}`);
    if (cachedUrlData) {
      return res.status(302).redirect(cachedUrlData);
    } else {
      let requredUrl = await UrlModel.findOne({ urlCode: urlCode });
      if (!requredUrl)
        return res
          .status(404)
          .send({ status: false, message: "No such url present" });
      await SET_ASYNC(`${req.params.urlCode}`, requredUrl.longUrl);

      return res.status(302).redirect(requredUrl.longUrl);
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};



module.exports.createUrl = createUrl;
module.exports.getUrl = getUrl;
module.exports.myUrls = myUrls;
