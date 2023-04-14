const express = require('express');
const path=require('path')
const router = express.Router();

const UrlController = require('../controllers/urlController.js');

router.post('/url/shorten', UrlController.createUrl);
router.get('/geturl', UrlController.myUrls);
//  router.get('/:urlCode', UrlController.getUrl);


// console.log(path.resolve("build","index.html"))
// router.all("*",function(req,res){
//    res.sendFile(path.resolve("build","index.html"))
//   // res.sendFile(path.resolve(__dirname,build,index.html))
// });

router.all("/*",function(req,res){
    res.status(400).send({
        status:false,msg:"The endpoint is not correct"
    });
  });

module.exports = router;