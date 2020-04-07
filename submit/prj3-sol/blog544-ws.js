import assert from 'assert';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import querystring from 'querystring';

import BlogError from './blog-error.js';

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

export default function serve(port, meta, model) {
  const app = express();
  app.locals.port = port;
  app.locals.meta = meta;
  app.locals.model = model;
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}

function setupRoutes(app) {
  const base = '/';
  app.use(cors());
  app.use(bodyParser.json({strict: false}));
  //@TODO
  app.get(base, doList(app));
  app.get("/users/:id", findInfo(app, "users"));
  app.get("/articles/:id", findInfo(app, "articles"));
  app.get("/comments/:id", findInfo(app, "comments"));
  app.get("/users", findInfo(app,"users"));
  app.get("/articles", findInfo(app,"articles"));
  app.get("/comments", findInfo(app,"comments"));
  app.get("/meta", doMeta(app));
  app.post(base, doCreate(app));
  app.post("/users", doCreate(app, "users"));
  app.post("/articles", doCreate(app, "articles"));
  app.post("/comments", doCreate(app, "comments"));
  app.put(`${base}/:id`, doReplace(app));
  app.put("/users/:id", doReplace(app, "users"));
  app.put("/articles/:id", doReplace(app, "articles"));
  app.put("/comments/:id", doReplace(app, "comments"));
  app.delete(`${base}/:id`, doDelete(app));
  app.delete("/users/:id", doDelete(app, "users"));
  app.delete("/articles/:id", doDelete(app, "articles"));
  app.delete("/comments/:id", doDelete(app, "comments"));
  app.patch(`${base}/:id`, doUpdate(app));
  app.patch("/users/:id", doUpdate(app, "users"));
  app.patch("/articles/:id", doUpdate(app, "articles"));
  app.patch("/comments/:id", doUpdate(app, "comments"));


  app.use(doErrors()); //must be last
}

/****************************** Handlers *******************************/



//@TODO

function findInfo(app, category) {

  return errorWrap(async function(req, res) {
    //console.log(req.query)

    try {
      let url = requestUrl(req);
      let a = 0
      let finalo = {}
      //console.log(Object.keys(req.query).length)
      if(Object.keys(req.query).length > 0 ){
        a = await app.locals.model.find(category, req.query);

      }
      else {
        a = await app.locals.model.find(category, req.params);
      }
      let b = a.map((x)=>{let obj = {}
        obj.url = url+'/'+x.id
        obj.rel = 'self'
        obj.name = 'self'
        x.links = [obj]
        return x
      })
      let obj1 = {}
      obj1[category] = b
      //console.log(obj1)



      if(Object.keys(req.query).length > 0 ){
        let obj2 = {}
        //console.log(req.query)
        let str1 = ""
        for(const a in req.query){ str1 = (str1+`${a}`+'='+`${req.query[a]}`+'&')}

        //console.log(Object.entries(req.query)[1][0])

        obj2.url = url+'?'+str1
        obj2.rel = 'self'
        obj2.name = 'self'
        let links = [];
        links.push(obj2)
        let prev = 0
        let next = 0
        //console.log(req.query.hasOwnProperty('_count'))
        if(req.query.hasOwnProperty('_index')){

          console.log(req.query._count)
          if(req.query.hasOwnProperty('_count')){
            next = parseInt(req.query._count) + parseInt(req.query._index)
            prev = parseInt(req.query._index) - parseInt(req.query._count)
            //req.query._index = parseInt(req.query._count) + parseInt(req.query._index)
            //console.log(parseInt(req.query._count))
            //console.log(parseInt(req.query._index))
            if(prev<0){
              prev = 0
            }

          }
          else{
            //req.query._index = parseInt(req.query._count)
            next = parseInt(req.query._index) + DEFAULT_COUNT
            prev = parseInt(req.query._index) - DEFAULT_COUNT
            if(prev<0){
              prev = 0
            }
          }

          let b = {}
          let str2 = ""
          req.query._index = next
          for(const a in req.query){ str2 = (str2+`${a}`+'='+`${req.query[a]}`+'&')}
          b.url = url+'?'+str2
          b.rel = 'next'
          b.name = 'next'
          links.push(b)

          obj1.links = links
          obj1.next = next
          obj1.prev = prev

          let c = {}
          //console.log(Object.entries(req.query)[1][1])
          let str3 = ""
          req.query._index = prev
          for(const a in req.query){ str3 = (str3+`${a}`+'='+`${req.query[a]}`+'&')}



          //console.log(Object.entries(req.query)[1][1])

          c.url = url+'?'+str3
          c.rel = 'prev'
          c.name = 'prev'
          links.push(c)

        }

        else if(req.query.hasOwnProperty('_count')){
          //let b = {}

          //console.log(Object.entries(req.query)[1][1])
          //let str2 = ""

          let b = {}
          let str2 = ""
          next = parseInt(req.query._count)
          req.query._index = next
          for(const a in req.query){ str2 = (str2+`${a}`+'='+`${req.query[a]}`+'&')}
          b.url = url+'?'+str2
          b.rel = 'next'
          b.name = 'next'
          links.push(b)

          obj1.links = links
          obj1.next = parseInt(req.query._count)


        }
        else{
          let b = {}
          let str2 = ""
          for(const a in req.query){ str2 = (str2+`${a}`+'='+`${req.query[a]}`+'&')}
          b.url = url+'?'+str2 + '_index=' + DEFAULT_COUNT
          b.rel = 'next'
          b.name = 'next'
          links.push(b)

          obj1.links = links
          obj1.next = DEFAULT_COUNT
        }

        return res.json(obj1);
      }
      else {
        return res.json(obj1);
      }

    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}


function doList(app) {
  return errorWrap(async function(req, res) {
    const q = req.query || {};
    try {
      let obj = {};
      obj.rel = "self";
      obj.name = "self";
      obj.url = "http://localhost:2345";
      let obj1 = {}
      obj1.rel = "self"
      obj1.name = "self"
      obj1.url = "http://localhost:2345/meta"
      let a = []
      a.push(obj)
      a.push(obj1)
      let retobj = {};
      for(const x in app.locals.meta){let obj2 = {}
        obj2.rel = "collections";
        obj2.name = x
        obj2.url = "http://localhost:2345/" + x
        a.push(obj2)
      }

      retobj.links = [a];
      await res.json(retobj);
    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doCreate(app, category) {
  return errorWrap(async function(req, res) {
    try {
      const obj = req.body;
      const results = await app.locals.model.create(category, obj);
      res.append('Location', requestUrl(req) + '/' + obj.id);
      res.sendStatus(CREATED);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doMeta(app) {
  return errorWrap(async function(req, res) {
    try {

      const results = await app.locals.meta;
      if (results.length === 0) {
        throw {
          isDomain: true,
          errorCode: 'NOT_FOUND',
          message: `user ${id} not found`,
        };
      }
      else {
        res.json(results);
      }
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doDelete(app, category) {
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const results = await app.locals.model.remove(category, { id: id });
      res.sendStatus(OK);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doReplace(app, category) {
  return errorWrap(async function(req, res) {
    try {
      const replacement = Object.assign({}, req.body);
      replacement.id = req.params.id;
      const results = await app.locals.model.update(category, replacement);
      res.sendStatus(OK);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}


function doUpdate(app, category) {
  return errorWrap(async function(req, res) {
    try {
      const patch = Object.assign({}, req.body);
      patch.id = req.params.id;
      const results = app.locals.model.update(category, patch);
      res.sendStatus(OK);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

/**************************** Error Handling ***************************/

/** Ensures a server error results in nice JSON sent back to client
 *  with details logged on console.
 */ 
function doErrors(app) {
  return async function(err, req, res, next) {
    res.status(SERVER_ERROR);
    res.json({ code: 'SERVER_ERROR', message: err.message });
    console.error(err);
  };
}

/** Set up error handling for handler by wrapping it in a 
 *  try-catch with chaining to error handler on error.
 */
function errorWrap(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    }
    catch (err) {
      next(err);
    }
  };
}

const ERROR_MAP = {
  BAD_CATEGORY: NOT_FOUND,
  EXISTS: CONFLICT,
}

/** Map domain/internal errors into suitable HTTP errors.  Return'd
 *  object will have a "status" property corresponding to HTTP status
 *  code.
 */
function mapError(err) {
  console.error(err);
  return (err instanceof Array && err.length > 0 && err[0] instanceof BlogError)
    ? { status: (ERROR_MAP[err[0].code] || BAD_REQUEST),
	code: err[0].code,
	message: err.map(e => e.message).join('; '),
      }
    : { status: SERVER_ERROR,
	code: 'INTERNAL',
	message: err.toString()
      };
} 

/****************************** Utilities ******************************/

/** Return original URL for req (excluding query params)
 *  Ensures that url does not end with a /
 */
function requestUrl(req) {
  const port = req.app.locals.port;
  const url = req.originalUrl.replace(/\/?(\?.*)?$/, '');
  return `${req.protocol}://${req.hostname}:${port}${url}`;
}


const DEFAULT_COUNT = 5;

//@TODO
