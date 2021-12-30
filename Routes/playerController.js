const express = require('express');
const router = express.Router();
const { database } = require('../models/db-config');

/* -----------------------------------------------------------------------------
                              GET PART
----------------------------------------------------------------------------- */

router.get('/', async (request, response) => { // Get all players in database => actually work but need to have more option like what table we want and what data
  database.query(
    'SELECT * FROM player',
    (error, docs) => {
      if(error) {
        console.log('Error in query => ' + error);
      } else if(!docs[0]) { // Check if we have an element in list and if it's not it response failure
        response.json({ status: 'Failure', reason: 'No players found'});
      } else {
        response.json(docs);
      };
    });
});

router.get('/:IdOrName', async (request, response) => { // Get data of a player in database => actually work but need to have more option like what data we want
  if(request.params.IdOrName == parseInt(request.params.IdOrName, 10)) { // check if it's an id 
    database.query(
      'SELECT * FROM player WHERE player.id = ?',
      [ parseInt(request.params.IdOrName, 10) ],
      (error, docs) => {
        if(error) {
          response.json({ status:'Failure', reason: error })
        } else if(!docs[0]) { 
          response.json({ status: 'Failure', reason: 'No player with this id was found'});
        } else {
          response.json(docs);
          console.log(docs);
        };
    });
  } else { // if it's not an id, it search for a name
    database.query(
      'SELECT * FROM player WHERE player.name = ?',
      [ `${request.params.IdOrName}` ],
      (error, docs) => {
        if(error) {
          response.json({ status:'Failure', reason: error });
          console.log(error);
        } else if(!docs[0]) { 
          response.json({ status: 'Failure', reason: 'No player with this id was found'});
        } else {
          response.json(docs);
        };
    });
  };
});

/* -----------------------------------------------------------------------------
                              INSERT PART
----------------------------------------------------------------------------- */

router.post('/', async (request, response) => { // Insert data in the database => actually don't work correctly
  const data = { // get the data we want to post in our database
    id: 0,
    name: request.body.name,
    money: 0,
    resources: 0,
    workforce: 0,
    score: 0
  };

  database.query(
    'INSERT INTO player VALUES (?, ?, ?, ?, ?, ?, NOW())',
    Object.values(data), // To return data in array
    (error) => {
      if (error) {
        response.json({ status: 'Failure', reason: error })
      } else {
        response.json({ status: 'Success', data: data })
      };
    });
});

/* -----------------------------------------------------------------------------
                              UPDATE PART
----------------------------------------------------------------------------- */

router.put('/:id', async (request, response) => { // Update a player with his id
  const data = {
    id: request.params.id,
    name: request.body.name,
    money: request.body.money,
    resources: request.body.resources,
    workforce: request.body.workforce,
    score: request.body.score
  };

  const query = 'UPDATE player SET name = '+ data.name +', money = '+ data.money +', resources = '+ data.resources +', workforce = '+ data.workforce +', score = '+ data.score +' WHERE id = '+ data.id;

  database.query(
    query,
    (error) => {
      if(error) {
        response.json({ status: 'Failure', reason: error });
      } else {
        response.json({ status: 'Success', data: data })
      };
  });
});

/* -----------------------------------------------------------------------------
                              DELETE PART
----------------------------------------------------------------------------- */

router.delete('/', async (request, response) => { // This clean all player stock in the database, don't use it stupidly
  database.query(
    'SET FOREIGN_KEY_CHECKS = 0', // remove the check of FK
    (error) => {
      if(error) {
        response.json({ status: 'Failure', reason : error });
      };
  });

  database.query(
    'TRUNCATE TABLE player',
    (error) => {
      if(error) {
        response.json({ status: 'Failure', reason : error });
      } else {
        response.json({ status: 'Success' });
      };
  });

  database.query(
    'SET FOREIGN_KEY_CHECKS = 1', // Reapply the check of FK
    (error) => {
      if(error) {
        response.json({ status: 'Failure', reason : error });
      };
  });
});

router.delete('/:IdOrName', async (request, response) => {
  if(request.params.IdOrName == parseInt(request.params.IdOrName, 10)){
    database.query(
      'DELETE FROM player WHERE id = ?',
      [ parseInt(request.params.IdOrName) ],
      (error, docs) => {
        if(error) {
          response.json({ status: 'Failure', reason: error });
        } else {
          response.json({ status: 'Success' });
        };
    });
  } else {
    database.query(
      'DELETE FROM player WHERE name = ?',
      [ parseInt(request.params.IdOrName) ],
      (error, docs) => {
        if(error) {
          response.json({ status: 'Failure', reason: error });
        } else {
          response.json({ status: 'Success' });
        };
    });
  };
});

module.exports = router;