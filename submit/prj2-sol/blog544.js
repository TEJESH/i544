// -*- mode: JavaScript; -*-

import mongo from 'mongodb';
import assert from 'assert'
import BlogError from './blog-error.js';
import Validator from './validator.js';

//debugger; //uncomment to force loading into chrome debugger

/**
A blog contains users, articles and comments.  Each user can have
multiple Role's from [ 'admin', 'author', 'commenter' ]. An author can
create/update/remove articles.  A commenter can comment on a specific
article.

Errors
======

DB:
  Database error

BAD_CATEGORY:
  Category is not one of 'articles', 'comments', 'users'.

BAD_FIELD:
  An object contains an unknown field name or a forbidden field.

BAD_FIELD_VALUE:
  The value of a field does not meet its specs.

BAD_ID:
  Object not found for specified id for update/remove
  Object being removed is referenced by another category.
  Other category object being referenced does not exist (for example,
  authorId in an article refers to a non-existent user).

EXISTS:
  An object being created already exists with the same id.

MISSING_FIELD:
  The value of a required field is not specified.

*/

export default class Blog544 {

  constructor(meta, options, client, db) {
    //@TODO
    this.meta = meta;
    this.options = options;
    this.db = db;
    this.client = client;
    this.collection1 = this.db.collection('users');
    this.collection2 = this.db.collection('articles');
    this.collection3 = this.db.collection('comments');
    this.validator = new Validator(meta);
  }

  /** options.dbUrl contains URL for mongo database */
  static async make(meta, options) {
    //@TODO
    //const MongoClient = require('mongodb').MongoClient;
    //const assert = require('assert');

    // Connection URL
    const url = 'mongodb://127.0.0.1:27017';
    const url1 = 'mongodb://localhost:27017';

    //console.log(options.dbUrl===url)
    //console.log(process.argv.slice(2)[0] === options.dbUrl)
    if(options.dbUrl.match(/^(mongodb:(?:\/{2})?)((localhost)|(\d{1,3}.{3}.{3}:[0-9]{5}$))/ig) === null){
      const msg = `Database is not correct`;
      throw [ new BlogError('Mongo DB link is not correct', msg)];
    }
    // Database Name
    else {
      const dbName = 'myproject';
      //console.log(options.dbUrl)
      // Create a new MongoClient
      const client = new mongo.MongoClient(options.dbUrl, MONGO_CONNECT_OPTIONS);
      //console.log(client);
      // Use connect method to connect to the Server

      await client.connect(function (err) {
        assert.equal(null, err);
        //console.log("Connected successfully to server");

        if (err) throw err;
        //console.log("db object points to the database : " + client.db(dbName));
        //client.close();
        //console.log("close");
      });


      //const mongoClient = await mongo.connect(options.dbUrl, MONGO_CONNECT_OPTIONS);
      /*await mongoClient.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
      });*/


      const db = await client.db(dbName);
      //await listDatabases(client);
      //const collection1 = db.collections('users');
      //console.log(db);
      return new Blog544(meta, options, client, db);
    }
  }

  /** Release all resources held by this blog.  Specifically, close
   *  any database connections.
   */
  async close() {
    //@TODO
    //console.log("close");
    await this.client.close();
  }

  /** Remove all data for this blog */
  async clear() {
    console.log("clear");
    await this.collection1.deleteMany({});
    await this.collection2.deleteMany({});
    await this.collection3.deleteMany({});
    //@TODO
  }

  /** Create a blog object as per createSpecs and 
   * return id of newly created object 
   */
  async create(category, createSpecs) {
    const obj = this.validator.validate(category, 'create', createSpecs);
    //@TODO
    //const db = this.client.db(this.dbName)
    //console.log(obj);
    const zz = await this.find(category, {id:obj.id});
    //console.log(zz)
    //console.log(zz[0].id);
    if(category === 'users') {
        if(zz.length === 0){
          obj._id = obj.id;
          await this.collection1.insertOne(obj)
              .then(result => {
                console.log(`Successfully inserted items!`);
              }).catch(err => console.error(`Failed to insert: ${err}`))
          return obj.id;
        }
        else {
          if(zz[0].id === obj.id){
            const msg = `users object having id ${obj.id} exists for ${category}`;
            throw [ new BlogError('EXIST', msg)];
          }
          else {
            obj._id = obj.id;
            await this.collection1.insertOne(obj)
                .then(result => {
                  console.log(`Successfully inserted items!`);
                }).catch(err => console.error(`Failed to insert: ${err}`))
            return obj.id;
          }
        }
    }

    else if(category === 'articles'){
      //article ID
      let xxx = this.find('users', {id:obj.authorId})

      if(xxx.length === 0){
        const msg = `Author ID: ${obj.authorId} not exists in users`;
        throw [ new BlogError('NOT EXIST', msg)];
      }
      else {
        let c = (Math.random() * 1000).toFixed(4);
        obj.id = c;
        obj._id = c;
        await this.collection2.insertOne(obj)
            .then(result => {
              console.log(`Successfully inserted items!`);
            }).catch(err => console.error(`Failed to insert: ${err}`))
        return c;
      }
    }

    else if(category === 'comments'){

      let xxx = this.find('users', {id:obj.commenterId})

      if(xxx.length === 0){
        const msg = `Commenter ID: ${obj.commenterId} not exists in users`;
        throw [ new BlogError('NOT EXIST', msg)];
      }
      else {
        let d = (Math.random() * 1000).toFixed(4);
        obj._id = d;
        obj.id = d;
        await this.collection3.insertOne(obj)
            .then(result => {
              console.log(`Successfully inserted items!`);
            }).catch(err => console.error(`Failed to insert: ${err}`))
      }
    }

  }

  /** Find blog objects from category which meets findSpec.  
   *
   *  First returned result will be at offset findSpec._index (default
   *  0) within all the results which meet findSpec.  Returns list
   *  containing up to findSpecs._count (default DEFAULT_COUNT)
   *  matching objects (empty list if no matching objects).  _count .
   *  
   *  The _index and _count specs allow paging through results:  For
   *  example, to page through results 10 at a time:
   *    find() 1: _index 0, _count 10
   *    find() 2: _index 10, _count 10
   *    find() 3: _index 20, _count 10
   *    ...
   *  
   */
  async find(category, findSpecs={}) {
    const obj = this.validator.validate(category, 'find', findSpecs);
    //@TODO
    //console.log(obj);
    let x = Object.entries(findSpecs).length;
    let y = 0;
    let z = 0;

    if(x === 0) {
      y = DEFAULT_COUNT;
    }
    else if(obj._count && obj._index){
      z = parseInt(obj._index)
      console.log(z)
      y = parseInt(obj._count)
    }
    else if(obj._count){
      y = parseInt(obj._count)
    }

    let a = 0
    let b = 0
    if(x!==0){
      b = Object.keys(obj)[0];
      a = Object.values(obj)[0];
    }
    //console.log(b,a)
    let u = 0
    if(category === 'users'){
      u = this.collection1;
    }
    else if(category === 'articles'){
      u = this.collection2;
    }
    else if(category === 'comments'){
      u = this.collection3;
    }

    //console.log(Object.entries(findSpecs).length)
    let doc = 0;
    if(x === 0) {
      doc = await u.find({}).sort( { creationTime: -1 } ).skip(z).limit(y).project({_id:0}).toArray();
    }
    else if(obj._count){
      doc = await u.find({}).sort( { creationTime: -1 } ).skip(z).limit(y).project({_id:0}).toArray();
    }
    else if(Object.keys(obj)[0] === 'creationTime'){
      doc = await u.find({creationTime:{$lt:obj.creationTime}}).sort( { creationTime: -1 } ).skip(z).limit(y).project({_id:0}).toArray();
    }
    else {
      doc = await u.find({[b]:a}).sort( { creationTime: -1 } ).skip(z).limit(y).project({_id:0}).toArray();
    }
    return doc

  }

  /** Remove up to one blog object from category with id == rmSpecs.id. */
  async remove(category, rmSpecs) {
    const obj = this.validator.validate(category, 'remove', rmSpecs);
    //@TODO
    //console.log(obj)
    let a = Object.keys(obj)[0]
    let b = Object.values(obj)[0]
    let c = 0
    let d = 0
    //let aaa = 0
    //console.log(a,b)
    const aa = await this.find(category, {[a]:b});
    //console.log(aa.length)
    if(aa.length === 0){
      const msg = `object having id ${obj.id} does not exists for ${category}`;
      throw [ new BlogError('NOT EXIST', msg)];

    }

    else {
      let aaa = 0
      //console.log(aaa)
      let u = 0
      if (category === 'users') {
        u = this.collection1
        aaa = await this.find('users', rmSpecs)
        c = await this.find('articles', {authorId:aaa[0].id})
        d = await this.find('comments', {commenterId:aaa[0].id})
      } else if (category === 'articles') {
        u = this.collection2
        aaa = await this.find('articles', rmSpecs)
        d = await this.find('comments', {articleId:aaa[0].id})
        //console.log(aa[0].id)
        //console.log(aaa)
        //console.log(d)
        //console.log(d.length)
      } else if (category === 'comments') {
        u = this.collection3
      }

      if((c.length !== 0 ||d.length !== 0) && (category==='users')){
        const msg = `${category} object having id ${obj.id} exists for Articles ${c[0].id} || comments ${d[0].id}`;
        throw [ new BlogError('EXIST', msg)];
      }
      else if((d.length !== 0) && (category==='articles')){
        const msg = `${category} object having id ${obj.id} exists for comments ${d[0].id}`;
        throw [ new BlogError('EXIST', msg)];
      }
      else {
        await u.deleteOne({[a]: b}, function (err, docs) {
          assert.equal(err, null);
          //console.log("Found the following records");
          //console.log(docs)
          //callback(docs);
        });
      }
    }
  }

  /** Update blog object updateSpecs.id from category as per
   *  updateSpecs.
   */
  async update(category, updateSpecs) {
    const obj = this.validator.validate(category, 'update', updateSpecs);
    //@TODO
    //console.log(Object.keys(obj)[0])
    const xx = await this.find(category, {id:obj.id})
    let u = 0
    if(category==='users'){
      u = this.collection1
    }
    else if(category === 'articles'){
      u = this.collection2
    }
    else if(category === 'comments'){
      u = this.collection3
    }
    let z = 0
    let a = Object.keys(obj)[0]
    let b = Object.values(obj)[0]

    let c = Object.keys(obj)[1]
    let d = Object.values(obj)[1]
    //if(xx.id === Object.values(obj)[0]){
    //console.log(a,b,c,d)
    z = await u.updateOne({[a]:b}, {$set: {[c]:d}})
    const yy = await this.find(category, {id:obj.id})
    //}
    //console.log(yy)
    //return z;
    //console.log(xx);
  }
  
}

const DEFAULT_COUNT = 5;

const MONGO_CONNECT_OPTIONS = { useUnifiedTopology: true };
