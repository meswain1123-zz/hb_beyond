// import dotenv from "dotenv";
// dotenv.config({ silent: true });
// import { MongoClient, ObjectID } from "mongodb";
// import assert from "assert";

var dotenv = require("dotenv");
dotenv.config({ silent: true });
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var assert = require("assert");
// var uuid = require('uuid');


// const dbType = process.env.DB_TYPE;
const dbName = "beyond"; // process.env.DB_NAME;
const url = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
function open() { 
  console.log('opening');
  client.connect(function(err) {
    // console.log(err);
    assert.equal(null, err);
    // fixSpells();
    // findSpells();
    // fixInvocations();
    // fixResources();
    // addItems();
    // fixItems();
    // deleteCreatures();
    // parseDoc();
  });
}
function close() {
  client.close();
}

// let fs = require('fs'),
//     PDFParser = require("pdf2json");

// function parseDoc() {
//   let pdfParser = new PDFParser();
//   console.log(pdfParser);
//   pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
//   pdfParser.on("pdfParser_dataReady", pdfData => {
//     console.log(pdfData);
//     fs.writeFile("./Volo's Guide to Monsters.json", JSON.stringify(pdfData));
//   });

//   pdfParser.loadPDF("./Source Books/Volo's Guide to Monsters.pdf");
// }

function deleteCreatures() {
  function gotCreatures(items) {
    console.log(items);
    let pos = 0;
    function respond(response) {
      console.log(response);
      pos++;
      if (pos < items.length) {
        const item2 = items[pos];
        deleteObject(respond, "creature", item2._id);
      }
    }
    const item = items[pos];
    deleteObject(respond, "creature", item._id);
  }

  getObjects(gotCreatures, "creature");
}

function addItems() {
  const items =[
    {'item':'Disguise kit','cost':'25 gp','weight':'3'},
    {'item':'Forgery kit','cost':'15 gp','weight':'5'},
    {'item':'Herbalism kit','cost':'5 gp','weight':'3'},
    {'item':'Navigator\'s tools','cost':'25 gp','weight':'2'},
    {'item':'Poisoner\'s kit','cost':'50 gp','weight':'2'},
    {'item':'Thieves\' tools','cost':'25 gp','weight':'1'},
  ];
  let pos = 0;
  function respond(response) {
    pos++;
    if (pos < items.length) {
      const item2 = items[pos];
      item2.name = item2.item;
      item2.description = "";
      item2.item_type = "Tools";
      item2.worn_type = "None";
      item2.armor_type_id = "";
      item2.base_armor_class = 10;
      item2.weapon_keyword_ids = [];
      item2.base_attack_damage_formula = "";
      item2.versatile_attack_damage_formula = "";
      item2.damage_type = "Bludgeoning";
      item2.range = 0;
      item2.range2 = 0;
      item2.stackable = false;
      item2.bundle_size = 0;
      createObject(respond, "base_item", item2);
    }
  }
  const item = items[pos];
  item.name = item.item;
  item.description = "";
  item.item_type = "Tools";
  item.worn_type = "None";
  item.armor_type_id = "";
  item.base_armor_class = 10;
  item.weapon_keyword_ids = [];
  item.base_attack_damage_formula = "";
  item.versatile_attack_damage_formula = "";
  item.damage_type = "Bludgeoning";
  item.range = 0;
  item.range2 = 0;
  item.stackable = false;
  item.bundle_size = 0;
  
  createObject(respond, "base_item", item);
}
 
function fixItems() {
  function gotItems(items) {
    // console.log(items);
    let pos = 0;
    function respond(response) {
      pos++;
      if (pos < items.length) {
        const item2 = items[pos];
        let cost2 = 0;
        const costPieces2 = item2.cost.split(" ");
        if (costPieces2.length === 2) {
          cost2 = +costPieces2[0];
          switch (costPieces2[1].toLowerCase()) {
            case "cp":
              cost2 *= 0.01;
            break;
            case "sp":
              cost2 *= 0.1;
            break;
            case "ep":
              cost2 *= 0.5;
            break;
            // case "gp":
            //   cost2 *= 0.01;
            // break;
            case "pp":
              cost2 *= 10;
            break;
          }
        }
        item2.cost = cost2;
        console.log(item2);
        updateObject(respond, "base_item", item2);
      }
    }
    const item = items[pos];
    console.log(item);
    let cost = 0;
    const costPieces = item.cost.split(" ");
    if (costPieces.length === 2) {
      cost = +costPieces[0];
      switch (costPieces[1].toLowerCase()) {
        case "cp":
          cost *= 0.01;
        break;
        case "sp":
          cost *= 0.1;
        break;
        case "ep":
          cost *= 0.5;
        break;
        // case "gp":
        //   cost *= 0.01;
        // break;
        case "pp":
          cost *= 10;
        break;
      }
    }
    item.cost = cost;
    updateObject(respond, "base_item", item);
  }

  getObjects(gotItems, "base_item");
}
 
function fixSpells() {
  function gotSpells(spells) {
    let pos = 0;
    function respond(response) {
      pos++;
      if (pos < spells.length) {
        const spell2 = spells[pos];
        if (spell2.effect && 
          spell2.effect.type && 
          spell2.effect.type !== "None") {
          if (spell2.effect.attack_type && 
            spell2.effect.attack_type === "Ranged Spell") {
            // It should have an attack_type, but doesn't
            if (spell2.saving_throw_ability_score && 
              spell2.saving_throw_ability_score !== "") {
              // It uses a spell save DC
              spell2.effect.attack_type = "Save";
            }
          } else if (spell2.effect.attack_type &&
            spell2.effect.attack_type === "Save" &&
            (!spell2.saving_throw_ability_score ||
              spell2.saving_throw_ability_score === "")) {
            spell2.effect.attack_type = "Ranged Spell";
          }
        }
        updateObject(respond, "spell", spell2);
      }
    }
    const spell = spells[pos];
    if (spell.effect && 
      spell.effect.type && 
      spell.effect.type !== "None") {
      if (spell.effect.attack_type && 
        spell.effect.attack_type === "Ranged Spell") {
        // It should have an attack_type, but doesn't
        if (spell.saving_throw_ability_score && 
          spell.saving_throw_ability_score !== "") {
          // It uses a spell save DC
          spell.effect.attack_type = "Save";
        }
      } else if (spell.effect.attack_type &&
        spell.effect.attack_type === "Save" &&
        (!spell.saving_throw_ability_score ||
          spell.saving_throw_ability_score === "")) {
        spell.effect.attack_type = "Ranged Spell";
      }
    }
    
    updateObject(respond, "spell", spell);
  }

  getObjects(gotSpells, "spell", 0);
}
 
function findSpells() {
  function gotSpells(spells) {
    spells.forEach(spell => {
      if (spell.saving_throw_ability_score &&
        spell.saving_throw_ability_score !== "" && 
        (!spell.effect || 
        (spell.effect.type === null || spell.effect.type === "None"))) {
        console.log(spell);
      }
    });
  }

  getObjects(gotSpells, "spell", 0);
}
 
function fixInvocations() {
  function gotInvocations(eldritch_invocations) {
    let pos = 0;
    function respond(response) {
      pos++;
      if (pos < eldritch_invocations.length) {
        const eldritch_invocation2 = eldritch_invocations[pos];
        eldritch_invocation2.pact = "None";
        
        updateObject(respond, "eldritch_invocation", eldritch_invocation2);
      }
    }
    const eldritch_invocation = eldritch_invocations[pos];
    eldritch_invocation.pact = "None";
    
    updateObject(respond, "eldritch_invocation", eldritch_invocation);
  }

  getObjects(gotInvocations, "eldritch_invocation", 0);
}
 
function fixResources() {
  function gotResources(resources) {
    let pos = 0;
    function respond(response) {
      pos++;
      if (pos < resources.length) {
        const resource2 = resources[pos];
        resource2.default_dice_size = 1;
        
        updateObject(respond, "resource", resource2);
      }
    }
    const resource = resources[pos];
    resource.default_dice_size = 1;
    
    updateObject(respond, "resource", resource);
  }

  getObjects(gotResources, "resource", 0);
}

function getUserByLogin(respond, email, password) {
  try {
    const db = client.db(dbName);
    db.collection("user")
      .find({ email, password })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond(null);
        else respond(docs[0]);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getUserByEmail(respond, email) {
  try {
    const db = client.db(dbName);

    db.collection("user")
      .find({ email })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}` });
        else if (docs == null || docs.length == 0) respond({ message: 'User not found' });
        else respond(docs[0]);
      });
  } catch (err) {
    console.log(err);
    respond(null);
  }
}

function register(respond, user) {
  const db = client.db(dbName);

  db.collection("user").insertOne(user);
  respond({ 
    message: `Registration successful for ${user.email}!`
  });
}

function getObjects(respond, data_type, filter, skip, take) {
  try {
    const db = client.db(dbName);
    if (filter.search_string && filter.start_letter) {
      filter.$and = [
        { name: { $regex : new RegExp(filter.search_string, "i") }},
        { name: { $regex : new RegExp("^" + filter.start_letter, "i") }}
      ];
      delete filter.start_letter;
      delete filter.search_string;
    } else if (filter.search_string) {
      filter.name = { $regex : new RegExp(filter.search_string, "i") };
      delete filter.search_string;
    } else if (filter.start_letter) {
      filter.name = { $regex : new RegExp("^" + filter.start_letter, "i") };
      delete filter.start_letter;
    } else if (filter.ids) {
      const ids = [];
      filter.ids.forEach(id => {
        ids.push(ObjectID(id));
      });
      filter._id = { $in: ids };
      delete filter.ids;
    }
    if (take === -1) {
      db.collection(data_type)
        .find(filter).sort({ "name": 1 }).skip(skip)
        .toArray(function(err, docs) {
          if (err) respond({ error: `Error: ${err}.` });
          else if (docs == null || docs.length == 0) respond([]);
          else respond(docs);
        });
    } else {
      db.collection(data_type)
        .find(filter).sort({ "name": 1 }).skip(skip).limit(take)
        .toArray(function(err, docs) {
          if (err) respond({ error: `Error: ${err}.` });
          else if (docs == null || docs.length == 0) respond([]);
          else respond(docs);
        });
    }
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getObjectCount(respond, data_type, filter) {
  try {
    const db = client.db(dbName);
    if (filter.name && filter.start_letter) {
      filter.$and = [
        { name: { $regex : new RegExp(filter.name, "i") }},
        { name: { $regex : new RegExp("^" + filter.start_letter, "i") }}
      ];
      delete filter.start_letter;
      delete filter.name;
    } else if (filter.name) {
      filter.name = { $regex : new RegExp(filter.name, "i") };
    } else if (filter.start_letter) {
      filter.name = { $regex : new RegExp("^" + filter.start_letter, "i") };
      delete filter.start_letter;
    } else if (filter.ids) {
      const ids = [];
      filter.ids.forEach(id => {
        ids.push(ObjectID(id));
      });
      filter._id = { $in: ids };
      delete filter.ids;
    }
    db.collection(data_type).find(filter).count(function(err, count) {
      if (err) respond({ error: `Error: ${err}.` });
      else respond({ count });
    }); 
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getObjectFieldValues(respond, data_type, field, filter) {
  try {
    const db = client.db(dbName);
    if (filter.name && filter.start_letter) {
      filter.$and = [
        { name: { $regex : new RegExp(filter.name, "i") }},
        { name: { $regex : new RegExp("^" + filter.start_letter, "i") }}
      ];
      delete filter.start_letter;
      delete filter.name;
    } else if (filter.name) {
      filter.name = { $regex : new RegExp(filter.name, "i") };
    } else if (filter.start_letter) {
      filter.name = { $regex : new RegExp("^" + filter.start_letter, "i") };
      delete filter.start_letter;
    } else if (filter.ids) {
      const ids = [];
      filter.ids.forEach(id => {
        ids.push(ObjectID(id));
      });
      filter._id = { $in: ids };
      delete filter.ids;
    }
    filter[field] = { $ne: "" };
    db.collection(data_type).distinct(field, filter, function(err, values) {
      if (err) respond({ error: `Error: ${err}.` });
      else respond({ values });
    }); 
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getObject(respond, data_type, object_id) {
  try {
    const db = client.db(dbName);
    db.collection(data_type)
      .find({ _id: ObjectID(object_id) })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond([]);
        else respond(docs);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getUserObjects(respond, data_type, userID) {
  try {
    const db = client.db(dbName);
    db.collection(data_type)
      .find({ })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond([]);
        else respond(docs);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function createObject(respond, data_type, obj) {
  const db = client.db(dbName);
  delete obj._id;

  db.collection(data_type)
  .insertOne(obj)
  .then(res => {
    respond(res.insertedId);
  });
}

function updateObject(respond, data_type, obj) {
  const db = client.db(dbName);
  obj._id = ObjectID(obj._id);

  db.collection(data_type).updateOne(
    { _id: obj._id },
    { $set: obj }
  );
  respond({ message: `${data_type} ${obj.name} (${obj._id}) updated!`})
}

function deleteObject(respond, data_type, object_id) {
  const db = client.db(dbName);

  db.collection(data_type).deleteOne({
    _id: ObjectID(object_id)
  });
  respond({ message: `${data_type} ${object_id} deleted!` });
}

module.exports = {
  open,
  close,
  getUserByLogin,
  getUserByEmail,
  register,
  getObjectCount,
  getObjectFieldValues,
  getObject,
  getObjects,
  getUserObjects,
  createObject,
  updateObject,
  deleteObject
};
