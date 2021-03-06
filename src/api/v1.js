'use strict';

/**
 * API Router Module (V1)
 * Integrates with various models through a common Interface (.get(), .post(), .put(), .delete())
 * @module src/api/v1
 */

const cwd = process.cwd();

const express = require('express');
const swaggerUI = require('swagger-ui-express');

const modelFinder = require(`../middleware/model-finder.js`);
const auth = require('../auth/middleware.js');


const router = express.Router();

// Evaluate the model, dynamically
router.param('model', modelFinder);

// Swagger Docs
const swaggerDocs = require(`${cwd}/docs/config/20labswagger.json`);
router.use('/api/v1/doc/', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// API Routes
router.get('/api/v1/:model', auth('read'), handleGetAll);
router.post('/api/v1/:model', auth('create'),  handlePost);
router.get('/api/v1/:model/:id', auth('read'), handleGetOne);
router.put('/api/v1/:model/:id', auth('update'), handlePut);
router.delete('/api/v1/:model/:id', auth('delete'), handleDelete);

router.get('/api/v1/schema', auth('super'), printSchema);

// Route Handlers

/**
 * Fetches all records from a given model.
 * @example router.get('/api/v1/:model', handleGetAll);
 * @param req {object} Express Request Object (required params: model)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handleGetAll(request,response,next) {
  request.model.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

/**
 * Fetches a single record from a given model.
 * @example router.get('/api/v1/:model/:id', handleGetOne);
 * @param req {object} Express Request Object (required params: model, id)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handleGetOne(request,response,next) {
  request.model.get(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
}

/**
 * Creates a single record in a given model.
 * @example router.post('/api/v1/:model', handlePost);
 * @param req {object} Express Request Object (required params: req.model)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handlePost(request,response,next) {
  request.model.post(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 * Updates a single record in a given model.
 * @example router.put('/api/v1/:model/:id', handlePut);
 * @param req {object} Express Request Object (required params: model, id)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handlePut(request,response,next) {
  request.model.put(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 * Deletes a single record from a given model.
 * @example router.delete('/api/v1/:model/:id', handleDelete);
 * @param req {object} Express Request Object (required params: model, id)
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
function handleDelete(request,response,next) {
  request.model.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}


function printSchema(request, response, next){
  let schema = {username: {String:required}};
  response.status(200).send(shema);
}

module.exports = router;
