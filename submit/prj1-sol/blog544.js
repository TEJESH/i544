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
  }

  /** Create a blog object as per createSpecs and
   * return id of newly created object
   */
  async create(category, createSpecs) {
    if(category == 'comments'){
      this.count = this.count + 1;
      const obj_c = this.validator.validate(category, 'create', createSpecs);
      let a = (Math.random()*1000).toFixed(2);
      //a.toFixed(2);
      obj_c.id = a;
      let x = this.myMap_c.set(a, obj_c);
      //x.set(x.articleId, this.count);
      //console.log(this.myMap_c);
      //return a;
    }

    else if(category == 'users'){
      const obj_u = this.validator.validate(category, 'create', createSpecs);
      //const obj_c = this.validator.validate(category, 'create', createSpecs);
      let b = (Math.random()*1000).toFixed(2);
      //b.toFixed(2);
      let y = this.myMap_u.set(b, obj_u);
      //console.log(obj_u.id);
      //return b;
    }
    else {
      const obj_a = this.validator.validate(category, 'create', createSpecs);
      let c = (Math.random()*1000).toFixed(2);
      //c.toFixed(2);
      obj_a.id = c;

      let z = this.myMap_a.set(c, obj_a);
      //obj_a.set(obj_a.id, this.count);
      return c;
    }
    //console.log(this.count);
    //const obj = this.validator.validate(category, 'create', createSpecs);
    //let x = this.myMap.set(category, obj);

    //@TODO
    //console.log(typeof(x));
    //console.log(x);
    //let y = this.obj1.push(x);
    //this.myMap = obj;
    /**obj.id = 1234;
    obj.fname = "Tejesh";
    obj.email = "ta@h.c";
    obj.lname = "Agrawal";
    obj.roles = "Author";
    obj.creationTime = Date.now();
    obj.updateTime = Date.now();**/

  //  $.getJSON("~/Desktop/i544/i544/submit/cs544/data/users/harry.json", function(json) {
  //    obj = JSON.stringify(json);
  //    console.log(obj); // this will show the info it in firebug console
  //  });
    //console.log("Hello constructor");
    //console.log(this.obj1.type);
    //return this.obj1;
  }

  /** Find blog objects from category which meets findSpec.  Returns
   *  list containing up to findSpecs._count matching objects (empty
   *  list if no matching objects).  _count defaults to DEFAULT_COUNT.
   */
  async find(category, findSpecs={}) {
    const obj = this.validator.validate(category, 'find', findSpecs);
    //@TODO
    //console.log(obj);
    //console.log(this.myMap_c);
    if (category === 'users'){
      //if(findSpec.id === )
        var i = 0;
        var dd = [];
        const iterator1 = this.myMap_u.values();
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
          //console.log(bb.id);
          for(i=0;i<user_size;i++){
            let bb = iterator1.next().value;
            if(aa === bb.id ){
              return [bb];
              break;
              //let bb = iterator1.next().value;
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
          if(aa === bb.id || aa === bb.commenterId){
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

    //return [];
    //console.log(obj);
  }

  /** Remove up to one blog object from category with id == rmSpecs.id. */
  async remove(category, rmSpecs) {
    const obj = this.validator.validate(category, 'remove', rmSpecs);




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
          objte.lastName = String(Object.entries(obj)[1][1]);
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
          objte.lastName = String(Object.entries(obj)[1][1]);
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
          objte.lastName = String(Object.entries(obj)[1][1]);
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
