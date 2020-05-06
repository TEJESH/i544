//-*- mode: javascript -*-

import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import Path from 'path';
import mustache from 'mustache';
import querystring from 'querystring';

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';

//emulate commonjs __dirname in this ES6 module
const __dirname = Path.dirname(new URL(import.meta.url).pathname);

export default function serve(port, ws) {
  const app = express();
  app.locals.port = port;
  app.locals.ws = ws;       //web service wrapper
  process.chdir(__dirname); //so paths relative to this dir work
  setupTemplates(app);
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}

/******************************** Routes *******************************/

function setupRoutes(app) {
  //const base = app.locals.base;
  app.use('/', express.static(STATIC_DIR));
  //@TODO add routes to handlers
  //console.log(base);
  app.get('/users', listUsers(app, 'users'));
  //app.get('/users', listUsers_(app, 'users'));
  //app.get(`${base}/search.html`, listUsers(app));
  //app.get('/users/:id.html', getUser(app));
  app.get('/search/users', doSearch(app, 'users'));
  app.use(doErrors(app)); //must be last   
}


/************************** Field Definitions **************************/

const FIELDS_INFO = {
  id: {
    friendlyName: 'User Id',
    isSearch: true,
    isId: true,
    isRequired: true,
    regex: /^\w+$/,
    error: 'User Id field can only contain alphanumerics or _',
  },
  firstName: {
    friendlyName: 'First Name',
    isSearch: true,
    regex: /^[a-zA-Z\-\' ]+$/,
    error: "First Name field can only contain alphabetics, -, ' or space",
  },
  lastName: {
    friendlyName: 'Last Name',
    isSearch: true,
    regex: /^[a-zA-Z\-\' ]+$/,
    error: "Last Name field can only contain alphabetics, -, ' or space",
  },
  email: {
    friendlyName: 'Email Address',
    isSearch: true,
    type: 'email',
    regex: /^[^@]+\@[^\.]+(\.[^\.]+)+$/,
    error: 'Email Address field must be of the form "user@domain.tld"',
  },
  creationTime: {
    friendlyName: 'ISO Creation Time',
    isSearch: true,
    //type: 'date',
    regex: /^\d{4}\-\d\d?\-\d\d?$/,
    error: 'Date of date field must be of the form "YYYY-MM-DD"',
  },
};

const FIELDS =
    Object.keys(FIELDS_INFO).map((n) => Object.assign({name: n}, FIELDS_INFO[n]));


/****************************** Handlers *******************************/

//@TODO: add handlers

function doErrors(app) {
  return async function(err, req, res, next) {
    console.log('doErrors()');
    const errors = [ `Server error` ];
    const html = doMustache(app, `errors`, {errors, });
    res.send(html);
    console.error(err);
  };
}

function listUsers(app, category) {
  return async function(req, res) {
    const users = await app.locals.ws.list(category,req.query);
    //const model = { base: app.locals.base, users: users };
    console.log(users);

    for(let i=0; i< users.users.length; i++) {
      //x = new Date(Date.parse(x));
      //y = new Date(Date.parse(x));
      //console.log(x);

      users.users[i].creationTime = formatdate(users.users[i].creationTime);
      users.users[i].updateTime = formatdate(users.users[i].updateTime);

    }

    if(users.hasOwnProperty('next')){
      if(req.query.hasOwnProperty('_index')){
        req.query._index = users.next
        users.nextQuery = "?" + querystring.stringify(req.query)
      }
      else{

        if(Object.keys(req.query).length > 0) {
          users.nextQuery = "?" + querystring.stringify(req.query) + "&" + "_index=" + users.next
        }
        else{
          users.nextQuery = "?" + "_index=" + users.next
        }

      }

    }

    if(users.hasOwnProperty('prev')){
      if(req.query.hasOwnProperty('_index')){
        req.query._index = users.prev
        users.prevQuery = "?" + querystring.stringify(req.query)
      }
      else{

        if(Object.keys(req.query).length > 0) {
          users.prevQuery = "?" + querystring.stringify(req.query) + "&" + "_index=" + users.prev
        }
        else{
          users.prevQuery = "?" + "_index=" + users.prev
        }

      }
    }
    //console.log(users)
    const html = doMustache(app, 'summary', users);
    res.send(html);
  };
};

function doSearch(app, category) {
  return async function(req, res) {
    const isSubmit = req.query.submit !== undefined;
    let users = [];
    let errors = undefined;
    const search = getNonEmptyValues(req.query);
    if (isSubmit) {
      errors = validate(search);
      if (Object.keys(search).length == 0) {
        const msg = 'at least one search parameter must be specified';
        errors = Object.assign(errors || {}, { _: msg });
      }
      if (!errors) {
        const q = querystring.stringify(search);
        try {
          users = await app.locals.ws.list(category, search);
        }
        catch (err) {
          console.error(err);
          errors = wsErrors(err);
        }
        if (users.users.length === 0) {
          errors = {_: 'no users found for specified criteria; please retry'};
        }
      }
    }
    let model, template;
    if (Object.keys(users).length > 0 && users.users.length > 0) {
      res.redirect("/users?" + querystring.stringify(search))
      template = 'summary';
      const fields =
          users.users.map((u) => ({id: u.id, fields: fieldsWithValues(u)}));
      model = { base: app.locals.base, users: fields };
    }
    else {
      template =  'search';
      model = errorModel(app, search, errors);
    }
    const html = doMustache(app, template, model);
    res.send(html);
  };
};






/************************** Field Utilities ****************************/

/** Return copy of FIELDS with values and errors injected into it. */

function formatdate(date) {
  var fullDate = new Date(date)
  console.log(fullDate);
//Thu May 19 2011 17:25:38 GMT+1000 {}

//convert month to 2 digits
  var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);

  var currentDate = twoDigitMonth + "/" + fullDate.getDate() + "/" +  fullDate.getFullYear();
  console.log(currentDate);
  return(currentDate);
}
function fieldsWithValues(values, errors={}) {
  return FIELDS.map(function (info) {
    const name = info.name;
    const extraInfo = { value: values[name] };
    if (errors[name]) extraInfo.errorMessage = errors[name];
    return Object.assign(extraInfo, info);
  });
}

/** Given map of field values and requires containing list of required
 *  fields, validate values.  Return errors hash or falsy if no errors.
 */
function validate(values, requires=[]) {
  const errors = {};
  requires.forEach(function (name) {
    if (values[name] === undefined) {
      errors[name] =
          `A value for '${FIELDS_INFO[name].friendlyName}' must be provided`;
    }
  });
  for (const name of Object.keys(values)) {
    const fieldInfo = FIELDS_INFO[name];
    const value = values[name];
    if (fieldInfo.regex && !value.match(fieldInfo.regex)) {
      errors[name] = fieldInfo.error;
    }
  }
  return Object.keys(errors).length > 0 && errors;
}

function getNonEmptyValues(values) {
  const out = {};
  Object.keys(values).forEach(function(k) {
    if (FIELDS_INFO[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });
  return out;
}

/** Return a model suitable for mixing into a template */
function errorModel(app, values={}, errors={}) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues(values, errors)
  };
}

/************************ General Utilities ****************************/

/** Set up error handling for handler by wrapping it in a 
 *  try-catch with chaining to error handler on error.
 */

function wsErrors(err) {
  const msg = (err.message) ? err.message : 'web service error';
  console.error(msg);
  return { _: [ msg ] };
}

function errorWrap(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    }
    catch (err) {
      console.log('errorWrap()');
      next(err);
    }
  };
}

function isNonEmpty(v) {
  return (v !== undefined) && v.trim().length > 0;
}

/************************ Mustache Utilities ***************************/

function doMustache(app, templateId, view) {
  const templates = { footer: app.templates.footer };
  return mustache.render(app.templates[templateId], view, templates);
}

function setupTemplates(app) {
  app.templates = {};
  for (let fname of fs.readdirSync(TEMPLATES_DIR)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}

