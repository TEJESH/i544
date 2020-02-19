// -*- mode: JavaScript; -*-

import BlogError from './blog-error.js';
import Validator from './validator.js';

debugger; //uncomment to force loading into chrome debugger

/**
A blog contains users, articles and comments.  Each user can have
multiple Role's from [ 'admin', 'author', 'commenter' ]. An author can
create/update/remove articles.  A commenter can comment on a specific
article.

Errors
======

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

  constructor(meta, options,myMap_a, myMap_u, myMap_c, obj1) {
    //@TODO
    //const globj =   $.getJSON("~/Desktop/i544/i544/submit/cs544/data/users/harry.json", function(json) {
        //obj = JSON.parse(json);
    //    console.log(globj); // this will show the info it in firebug console
    //  });
    this.meta = meta;
    this.options = options;
    this.validator = new Validator(meta);
    this.myMap_u = myMap_u;
    this.myMap_c = myMap_c;
    this.myMap_a = myMap_a;
    this.obj1 = obj1;
    //this.count = count;
    //this.myMap = new Map(meta);
    //console.log("Hello constructor");
    //return globj;
    //console.log(myMap);
  }

  static async make(meta, options) {
    //@TODO
    //console.log()
    let myMap_u = new Map();
    let myMap_a = new Map();
    let myMap_c = new Map();
    let obj1 = new Object();
    var count = 0;
    //myMap.set("key0", "value");
    //console.log(myMap);
    return new Blog544(meta, options, myMap_u, myMap_c, myMap_a, obj1);
  }

  /** Remove all data for this blog */
  async clear() {
    //@TODO
    this.myMap_a = new Map();
    this.myMap_c = new Map();
    this.myMap_u = new Map();
  }

  /** Create a blog object as per createSpecs and
   * return id of newly created object
   */
  async create(category, createSpecs) {

    const obj = this.validator.validate(category, 'create', createSpecs);

  //  if(this.find(category, {id:obj.id}).length > 0){
  //    const msg = `object with id ${obj.id} already exists for ${category}`;
  //    throw [ new BlogError('EXISTS', msg)];
  //  }
  //  else {

      if(category == 'users'){

        const iterator1 = this.myMap_u.values();
        let user_size = this.myMap_u.size;
        for(let i=0;i<user_size;i++){
          let bb = iterator1.next().value;
          if(obj.id === bb.id){
            const msg = `object with id ${obj.id} already exists for ${category}`;
            throw [ new BlogError('EXISTS', msg)];
          }

        }
        let y = this.myMap_u.set(obj.id, obj);
        return obj.id
      }

      else if(category == 'comments'){
        var i = 0;
        this.count = this.count + 1;
        const iterator1 = this.myMap_u.values();
        const iterator2 = this.myMap_u.keys();
        let user_size = this.myMap_u.size;

        for (i=0;i<user_size;i++){
          let bb = iterator1.next().value;
          //console.log(obj.commenterId);
          if(obj.commenterId === bb.id){
            let a = (Math.random()*1000).toFixed(2);
            obj.id = a;
            let x = this.myMap_c.set(a, obj);
            break;
          }
        /*  else{
            const msg = `object with commenterId ${obj.commenterId} does exists in users`;
            throw [ new BlogError('NOT EXISTS', msg)];
          }*/
        }
        return obj.id
      }


      else {

        var i = 0;
        this.count = this.count + 1;
        const iterator1 = this.myMap_u.values();
        const iterator2 = this.myMap_u.keys();
        let user_size = this.myMap_u.size;

        //for (i=0;i<user_size;i++){
          let bb = iterator1.next().value;
          //if(obj.authorId === bb.id){
            let c = (Math.random()*1000).toFixed(2);
            obj.id = c;
            let z = this.myMap_a.set(c, obj);
            return c;
          //}
        /*  else{
            const msg = `object with authorId ${obj.authorId} does exists in users`;
            throw [ new BlogError('NOT EXISTS', msg)];
          }*/
      //}
    //}
    return obj.id

    //@TODO
  }
}

  /** Find blog objects from category which meets findSpec.  Returns
   *  list containing up to findSpecs._count matching objects (empty
   *  list if no matching objects).  _count defaults to DEFAULT_COUNT.
   */
  async find(category, findSpecs={}) {
    const obj = this.validator.validate(category, 'find', findSpecs);
    //@TODO
    //console.log(this.myMap_u);

    if(this.myMap_u.size <= 0 || this.myMap_c.size <= 0 || this.myMap_a.size <= 0){
      const msg = `Data not exists for ${category}`;
      throw [ new BlogError('No DATA', msg)];
    }
    else {
      if (category === 'users'){
        //if(this.myMap_u())
          var i = 0;
          var dd = [];
          const iterator1 = this.myMap_u.values();
          const iterator2 = this.myMap_u.keys();
          let user_size = this.myMap_u.size;
          if(Object.keys(obj).length === 0){
            for(i=0;i<DEFAULT_COUNT;i++){
              let bb = iterator1.next().value;
              //console.log(bb)
              dd.push(bb);
              //return [bb];
            }
            return dd;
          }
          else if(Object.entries(obj)[0][0] == '_count'){
            for(i=0;i<obj._count;i++){
              let bb = iterator1.next().value;
              //console.log(bb)
              dd.push(bb);
              //return [bb];
            }
            return dd;
          }
          else {
            let aa = Object.entries(obj)[0][1];
            //console.log(Object.entries(obj)[0][0]);
            //console.log(this.myMap_u.get(aa));
            for(i=0;i<user_size;i++){
              let bb = iterator1.next().value;
              let cc = iterator2.next().value;
              //console.log(bb.id);
              if(aa === bb.id){
                return [bb];
                break;
                //let bb = iterator1.next().value;
              }
              else if(this.myMap_u.get(aa) === undefined){
                const msg = `object with id ${obj.id} doesn't exists for ${category}`;
                throw [ new BlogError('NOT EXIST', msg)];
                //break;
              }
            }
          }


          //console.log(Object.entries(obj)[0][1]);
          //console.log(this.myMap_u.has(aa));


      }
      else if (category === 'articles'){
        //if(findSpec.id === )
          var i = 0;
          var dd = [];
          const iterator1 = this.myMap_a.values();
          let article_size = this.myMap_a.size;
          if(Object.keys(obj).length === 0){
            for(i=0;i<DEFAULT_COUNT;i++){
              let bb = iterator1.next().value;
              dd.push(bb);
              //return [bb];
            }
            return dd;
          }
          else if(Object.entries(obj)[0][0] == '_count'){
            for(i=0;i<obj._count;i++){
              let bb = iterator1.next().value;
              //console.log(bb)
              dd.push(bb);
              //return [bb];
            }
            return dd;
          }
          else {
            let aa = Object.entries(obj)[0][1];

            //console.log(bb.id);
            for(i=0;i<article_size;i++){
              let bb = iterator1.next().value;
              if(aa === bb.id || aa === bb.authorId){
                //return [bb];
                dd.push(bb)
              //  break;
                //let bb = iterator1.next().value;
              }
            }
            return dd;
          }


          //console.log(Object.entries(obj)[0][1]);
          //console.log(this.myMap_u.has(aa));


      }

      else if(category === 'comments') {
        //if(findSpec.id === )
        var i = 0;
        var dd = [];
        const iterator1 = this.myMap_c.values();
        const iterator2 = this.myMap_c.keys();
        let comments_size = this.myMap_c.size;
        if(Object.keys(obj).length === 0){
          for(i=0;i<DEFAULT_COUNT;i++){
            let bb = iterator1.next().value;
            let cc = iterator2.next().value;
            //console.log(cc)
            dd.push(bb);
            //return dd;
            //console.log(bb);
          }
          //console.log(dd);
          return dd;
        }
        else if(Object.entries(obj)[0][0] == '_count'){
          for(i=0;i<obj._count;i++){
            let bb = iterator1.next().value;
            //console.log(bb)
            dd.push(bb);
            //return [bb];
          }
          return dd;
        }
        else{
          let aa = Object.entries(obj)[0][1];
          //console.log(aa);
          //console.log(bb.id);
          //var dd = [];
          for(i=0;i<comments_size;i++){
            let bb = iterator1.next().value;
            let cc = iterator2.next().value;
            //console.log(bb.commenterId);
            if(aa === bb.id || aa === bb.commenterId | aa === bb.articleId){
              //console.log(bb.id);
              //console.log(bb);
              dd.push(bb);
              //dd.push();
              //return [bb];
              //console.log(dd)

              //let bb = iterator1.next().value;
            }
          }
          return dd;
          //}
        }

          //console.log(Object.entries(obj)[0][1]);
          //console.log(this.myMap_u.has(aa));


      }
  }
    //return [];
    //console.log(obj);
  }

  /** Remove up to one blog object from category with id == rmSpecs.id. */
  async remove(category, rmSpecs) {
    const obj = this.validator.validate(category, 'remove', rmSpecs);

    if(category === 'users'){
      let aa = Object.entries(obj)[0][1];
      //console.log(aa);
      //console.log(bb.id);
      //var dd = [];
      var x = 0;
      const iterator1 = this.myMap_u.values();
      const iterator2 = this.myMap_u.keys();

      const iterator3 = this.myMap_a.values();
      const iterator4 = this.myMap_a.keys();

      const iterator5 = this.myMap_c.values();
      const iterator6 = this.myMap_c.keys();

      let article_size = this.myMap_a.size;
      let comments_size = this.myMap_c.size;
      let users_size = this.myMap_u.size;

      var us_a = [];
      var us_c = [];
      for(let i=0;i<users_size;i++){
        let bb = iterator1.next().value;
        let cc = iterator2.next().value;
        //console.log(bb.commenterId);
        if(aa === bb.id){
          for(let i=0;i<article_size;i++){
            let ee = iterator3.next().value;
            if(ee.authorId == bb.id){
              us_a.push(ee.id)
            }
          }
          for(let i=0;i<comments_size;i++){
            let ff = iterator5.next().value;
            if(ff.commenterId == bb.id){
              us_c.push(ff.id)
            }
          }

          /*error Handling*/
          if(us_c.length > 0 || us_a.length > 0){
            const msg = `user ${obj.id} referenced by commenterId for comments  ${us_c}`;
            const msg1 = `user ${obj.id} referenced by authorId for articles  ${us_a}`;
            throw [ new BlogError('BAD_ID', msg), new BlogError('BAD_ID', msg1)];
          }
          else{
            let objte = this.myMap_u.get(cc);
            this.myMap_u.delete(cc);
          }
          /*error Handling*/
        }
      }
    }
    else if(category === 'comments'){
      let aa = Object.entries(obj)[0][1];
      var x = 0;
      const iterator1 = this.myMap_c.values();
      const iterator2 = this.myMap_c.keys();
      let users_size = this.myMap_c.size;
      for(let i=0;i<users_size;i++){
        let bb = iterator1.next().value;
        let cc = iterator2.next().value;
        if(aa === bb.id){
          x = cc;
          let objte = this.myMap_c.get(cc);
          this.myMap_c.delete(cc);
        }
      }
    }
    else if(category === 'articles'){
      let aa = Object.entries(obj)[0][1];
      var x = 0;
      const iterator1 = this.myMap_a.values();
      const iterator2 = this.myMap_a.keys();

      const iterator3 = this.myMap_c.values();
      const iterator4 = this.myMap_c.keys();


      let article_size = this.myMap_a.size;
      let comments_size = this.myMap_c.size;

      var us_c = [];

      for(let i=0;i<article_size;i++){
        let bb = iterator1.next().value;
        let cc = iterator2.next().value;



        if(aa === bb.id){

          for(let i=0;i<comments_size;i++){

            let ee = iterator3.next().value;
            let ff = iterator4.next().value;
            if(ee.id == cc){
              us_c.push(ee.id)
            }
          }

          if(us_c.lenght > 0){
            const msg = `articles ${obj.id} referenced by commenter Id for comments  ${us_c}`;
            //const msg1 = `user ${obj.id} referenced by authorId for articles  ${us_a}`;
            throw [ new BlogError('BAD_ID', msg)];
          }
          else{
            let objte = this.myMap_a.get(cc);
            this.myMap_a.delete(cc);
          }
        }
      }

    }

    //@TODO
  }

  /** Update blog object updateSpecs.id from category as per
   *  updateSpecs.
   */
  async update(category, updateSpecs) {
    const obj = this.validator.validate(category, 'update', updateSpecs);
    //@TODO
    //var q = category
    if(category==='users'){

      var i = 0;
      const iterator1 = this.myMap_u.values();
      const iterator2 = this.myMap_u.keys();
      let user_size = this.myMap_u.size;


      let aa = Object.entries(obj)[0][1];
      //console.log(Object.entries(obj)[1][1]);
      //let dd;
      //console.log(bb.id);
      for(i=0; i < user_size; i++){
        let bb = iterator1.next().value;
        let cc = iterator2.next().value;
        if( aa === bb.id ){
          //console.log(bb)
          //console.log(cc);
          let objte = this.myMap_u.get(cc);
          //console.log(objte.lastName);
          let y = Object.entries(obj)[1][0];
          //console.log(y);
          objte[y] = String(Object.entries(obj)[1][1]);
          //console.log(this.myMap_u.get(cc));
          this.myMap_u.set(cc, objte);
          return [this.myMap_u.get(cc)];
          //console.log(this.myMap_u.get(cc));
          //console.log(Object.entries(obj)[0][2]);
          break;
          //let bb = iterator1.next().value;
        }
      }



    }

    else if(category === 'articles'){
      var i = 0;
      const iterator1 = this.myMap_a.values();
      const iterator2 = this.myMap_a.keys();
      let user_size = this.myMap_a.size;


      let aa = Object.entries(obj)[0][1];
      //console.log(Object.entries(obj)[1][1]);
      //let dd;
      //console.log(bb.id);
      for(i=0; i < user_size; i++){
        let bb = iterator1.next().value;
        let cc = iterator2.next().value;
        if( aa === bb.id ){
          //console.log(bb)
          //console.log(cc);
          let objte = this.myMap_a.get(cc);
          //console.log(objte.lastName);
          let y = Object.entries(obj)[1][0];
          objte[y] = String(Object.entries(obj)[1][1]);
          //console.log(this.myMap_u.get(cc));
          this.myMap_a.set(cc, objte);
          return [this.myMap_a.get(cc)];
          //console.log(this.myMap_u.get(cc));
          //console.log(Object.entries(obj)[0][2]);
          break;
          //let bb = iterator1.next().value;
        }
      }
    }

    else{
      var i = 0;
      const iterator1 = this.myMap_c.values();
      const iterator2 = this.myMap_c.keys();
      let user_size = this.myMap_c.size;


      let aa = Object.entries(obj)[0][1];
      //console.log(Object.entries(obj)[1][1]);
      //let dd;
      //console.log(bb.id);
      for(i=0; i < user_size; i++){
        let bb = iterator1.next().value;
        let cc = iterator2.next().value;
        if( aa === bb.id ){
          //console.log(bb)
          //console.log(cc);
          let objte = this.myMap_c.get(cc);
          //console.log(objte.lastName);
          let y = Object.entries(obj)[1][0];
          objte[y] = String(Object.entries(obj)[1][1]);
          //console.log(this.myMap_u.get(cc));
          this.myMap_c.set(cc, objte);
          return [this.myMap_c.get(cc)];
          //console.log(this.myMap_u.get(cc));
          //console.log(Object.entries(obj)[0][2]);
          break;
          //let bb = iterator1.next().value;
        }
      }
    }
    //console.log(Object.entries(obj)[0][1]);
  }


}

const DEFAULT_COUNT = 5;
//You can add code here and refer to it from any methods in Blog544.
