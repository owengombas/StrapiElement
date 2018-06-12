'use strict';

const makeTree = async (obj) => {
  const newObj = {};
  for (let prop in obj.fields) {
    newObj[`$${prop}`] = obj.fields[prop].value;
  }
  obj.children.forEach(child => {
    makeTree(child).then((newChild) => {
      newObj[child.title] = newChild;
    });
  });
  return newObj;
};

module.exports = {

  /**
   * Retrieve element records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    return strapi.services.element.fetchAll(ctx.query);
  },

  get: async(ctx) => {
    return new Promise((resolve, reject) => {
      strapi.services.element.fetchAll(ctx.query).exec((err, tree) => {
        if (!err) {
          makeTree(tree[0]).then(result => { resolve(result); });
        } else {
          reject(err);
        }
      });
    });
  },

  /**
   * Retrieve a element record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.element.fetch(ctx.params);
  },
  /**
  * Retrieve a element record.
  *
  * @return {Object}
  */

  findOneByName: async (ctx) => {
    return strapi.services.element.fetch(ctx.params.name);
  },

  /**
   * Create a/an element record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.element.add(ctx.request.body);
  },

  /**
   * Update a/an element record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.element.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an element record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.element.remove(ctx.params);
  }
};
