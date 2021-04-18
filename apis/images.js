// image upload service module

var express = require("express");
const cloudinary = require('cloudinary');
var db = require("../db/beyond");

var router = express.Router();

db.open();

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

router
  .post('/upload/:data_type/:id', (req, res) => {
    const data_type = req.params.data_type;
    const id = req.params.id;
    const values = Object.values(req.files);
    const options = {
      public_id: `${data_type}_${id}`
    };
    const promises = values.map(image => cloudinary.v2.uploader.upload(image.path, options));
    
    Promise
      .all(promises)
      .then(results => res.json(results))
      .catch((err) => res.status(400).json(err));
  });

function close() {
  db.close();
}

module.exports = router;
module.exports.close = close;
