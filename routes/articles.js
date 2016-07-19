var express = require('express');
var router = express.Router();
var markdown = require('marked');

var db = require('../config/db');
var ObjectID = require('mongodb').ObjectID;

/* GET articles listing. */
router.get('/', function(req, res, next) {
  // Get all articles published and group by categories (in categories order)
  db.get('articles').aggregate(
    [
      { $match : { 'status' : 'Published' } },
      {
        $group: {
          _id : '$category_tag',
          articles : { $push : '$$ROOT' },
          //rating : { $avg : '$rating' } // TODO(naum): Sort by rating average(?)
        }
      },
      {
        $lookup : {
          from : 'categories',
          localField : '_id',
          foreignField : 'tag',
          as : 'category'
        }
      },
      { $unwind : '$category' },
      { $sort : { 'category.order' : 1 } },
      {
        $project : {
          _id : 0,
          name : '$category.name',
          tag : '$category.tag',
          articles : '$articles'
        }
      }
    ],
    function(err, categories) {
      if (err || !categories)
        next();

      res.render('articles', { title: 'Articles', categories: categories });
    }
  );
});

/* GET article. */
router.get('/:id', function(req, res, next) {
  db.get('articles').findOne({ _id : ObjectID(req.params.id) }, function(err, article) {
    if (err || !article)
      next();

    // Fetch users db
    var usersPromise = db.get('users').find(
      {
        $or : [
          { _id : ObjectID(article.author_id) },
          { _id : { $in : article.contributor_ids.map(function(id) { return ObjectID(id); }) } }
        ]
      }
    );

    // Fetch categories db
    var categoriesPromise = db.get('categories').find(
      {
        $or : [
          { tag : article.category },
          { tag : { $in : article.tags } }
        ]
      }
    );

    // Users resolve
    usersPromise.then(function(users) {
      var lookup = {};
      for (var i = 0; i < users.length; ++i)
        lookup[users[i]._id] = users[i];

      article.author = lookup[article.author_id];

      var contributors = [];
      for (var i = 0; i < article.contributor_ids.length; ++i)
        contributors.push(lookup[article.contributor_ids[i]]);

      article.contributors = contributors;
    });

    // Categories resolve
    categoriesPromise.then(function(categories) {
      // Create a category lookup by tag
      var lookup = {};
      for (var i = 0; i < categories.length; ++i)
        lookup[categories[i].tag] = categories[i];

      // Get category
      article.category = lookup[article.category_tag];

      // Get tags
      var tags = [];
      for (var i = 0; i < article.tags.length; ++i)
        tags.push(lookup[article.tags[i]]);
      article.tags = tags;
    });

    Promise.all([usersPromise, categoriesPromise]).then(function() {
      // Markdown content
      article.content = markdown(article.content);

      // Render page
      res.render('article', {
        title : article.title,
        article : article
      });
    }).catch(function() {
      next();
    });
  });
});

module.exports = router;
