// beyond service module

var express = require("express");
// var uuid = require('uuid');
var db = require("../db/beyond");

var router = express.Router();

db.open();

router
  .get("/test", function(req, res) {
    res.send({ message: "Becky is hot!" });
  })
  .post("/login", function(req, res) {
    function gotUser(user) {
      if (user === null) {
        res.send({ message: "User Not Found" });
      } else {
        res.send(user);
      }
    }
    db.getUserByLogin(gotUser, req.body.email, req.body.password);
  })
  .post('/register', function (req, res) {
    function gotUser(user) {
      if (user.error != null) {
        res.send({ error: user.error });
      }
      else if (user.message == null) {
        res.send({ error: "A user with this email already exists.  You may need to reset your password."})
      }
      else {
        function respond(response) {
          res.send({message: response.message});
        };
        db.register(respond, req.body);
      }
    };
  
    db.getUserByEmail(gotUser, req.body.email);
  })
  .post("/getObjectCount/:data_type", function(req, res) {
    function respond(response) {
      res.send(response);
    }
    db.getObjectCount(respond, req.params.data_type, req.body.filter);
  })
  .post("/getObjects/:data_type", function(req, res) {
    function respond(objects) {
      res.send({objects});
    }
    db.getObjects(respond, req.params.data_type, req.body.filter, req.body.skip, req.body.take);
  })
  .get("/getObject/:data_type/:object_id", function(req, res) {
    function respond(objects) {
      res.send({objects});
    }
    db.getObject(respond, req.params.data_type, req.params.object_id);
  })
  .get("/getUserObjects/:data_type/:userID", function(req, res) {
    function respond(objects) {
      res.send({objects});
    }
    db.getUserObjects(respond, req.params.data_type, req.params.userID);
  })
  .post("/createObject", function(req, res) {
    function respond(id) {
      res.send({ id });
    }
    db.createObject(respond, req.body.data_type, req.body.obj);
  })
  .patch("/updateObject", function(req, res) {
    function respond(message) {
      res.send(message);
    }
    db.updateObject(respond, req.body.data_type, req.body.obj);
  })
  .delete("/deleteObject", function(req, res) {
    function respond(message) {
      res.send(message);
    }

    db.deleteObject(respond, req.body.data_type, req.body.object_id);
  })
  
  // .post("/createPlayer", function(req, res) {
  //   // if (req.session.userID == undefined) {
  //   //   res.send({ error: "Session lost.  Please log in again." });
  //   // } else {
  //     function respond(playerID) {
  //       res.send({ playerID });
  //     }
  //     // const player = req.body.player;
  //     // player.CreateDT = new Date();
  //     // player.EditDT = new Date();
  //     // player.EditUserID = req.session.userID;
  //     // db.createPlayer(respond, req.session.userID, req.body.player);
  //     db.createPlayer(respond, req.body.player);
  //   // }
  // })
  // .delete("/deletePlayer", function(req, res) {
  //   // if (req.session.userID == undefined) {
  //   //   res.send({ error: "Session lost.  Please log in again." });
  //   // } 
  //   // else {
  //     function respond(message) {
  //       res.send(message);
  //     }

  //     // db.deletePlayer(respond, req.session.userID, req.body.playerID);
  //     db.deletePlayer(respond, req.body.playerID);
  //   // }
  // })
  // .patch("/updatePlayer", function(req, res) {
  //   // if (req.session.userID == undefined) {
  //   //   res.send({ error: "Session lost.  Please log in again." });
  //   // } else {
  //     function gotPlayer(oldPlayer) {
  //       function respond(message) {
  //         res.send(message);
  //       }

  //       const player = {...oldPlayer,...req.body.player};
  //       // player.EditDT = new Date();
  //       // player.EditUserID = req.session.userID;
  //       // db.updatePlayer(respond, req.session.userID, player);
  //       db.updatePlayer(respond, player);
  //     }
  //     // db.getPlayer(gotPlayer, req.session.userID, req.body.player._id);
  //     db.getPlayer(gotPlayer, req.body.player._id);
  //   // }
  // })
  ;

function close() {
  db.close();
}

module.exports = router;
module.exports.close = close;
