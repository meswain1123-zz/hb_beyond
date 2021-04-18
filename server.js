

import path from 'path';
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import {v1 as uuidv1} from 'uuid';
import formData from 'express-form-data';
import cors from 'cors';
import { CLIENT_ORIGIN } from './config';

dotenv.config({ silent: true });

const app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(cors({ 
  origin: CLIENT_ORIGIN 
})); 

app.use(formData.parse());

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  app.use(session({
    genid: function (req) {
      return uuidv1() // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    cookie: {
      // maxAge: 900000, // 15 minutes
      maxAge: 3600000, // 1 hour
      secure: true
    },
    resave: true,
    saveUninitialized: true
  }));
} else {
  app.use(session({
    genid: function (req) {
      return uuidv1() // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    cookie: { 
      // maxAge: 900000, // 15 minutes
      maxAge: 3600000, // 1 hour
    }, // This is in milliseconds.  The example had 60000, which is 1 minute.  I'm going to make it 15 minutes.
    resave: true,
    saveUninitialized: true
  }));
}
// let myEnv = process.env;
// process.env = {};

// import userAPI from './apis/user.js';
// import worldAPI from './apis/world.js';
// import vttAPI from './apis/vtt.js';
import beyondAPI from './apis/beyond.js';
import imageAPI from './apis/images.js';

app.use(express.static(path.join(__dirname, 'client/build')));
// app.use('/api/user', userAPI);
// app.use('/api/world', worldAPI);
// app.use('/api/vtt', vttAPI);
app.post('/image-upload', (req, res) => {

  const values = Object.values(req.files);
  console.log(values);
  // const promises = values.map(image => cloudinary.uploader.upload(image.path))
  
  // Promise
  //   .all(promises)
  //   .then(results => res.json(results))
  //   .catch((err) => res.status(400).json(err))
});

app.use('/api/beyond', beyondAPI);
app.use('/api/image', imageAPI);
const port = process.env.SERVER_PORT || 4001;

const version = "0.0.1";

// API calls
app.route('/version')
  .get(function (req, res) {
    res.send({ version: version });
  });
// app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
  if (options.exit) {
    console.log('closing');
    // userAPI.close();
    // worldAPI.close();
    // vttAPI.close();
    beyondAPI.close();
    process.exit();
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
// process.on('uncaughtException', function(e){console.log(e)});
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

app.listen(port, () => console.log(`Listening on port ${port}`));

