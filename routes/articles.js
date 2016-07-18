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
          _id : '$category',
          articles : { $push : '$$ROOT' },
          //rating : { $avg : '$rating' } //TODO(naum): Sort by rating average(?)
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
  // TODO(naum): Improve this!!!
  db.get('articles').aggregate(
    [
      { $match : { _id : ObjectID(req.params.id) } },
      {
        $lookup : {
          from : 'users',
          localField : 'author_id',
          foreignField : '_id',
          as : 'author'
        }
      },
      { $unwind : '$author' }
    ],
    function(err, article) {
      if (err || !article)
        next();

      article = article[0];

      db.get('categories').find(
        {
          $or : [
            { tag : article.category },
            { tag : { $in : article.tags } }
          ]
        },
        function(err, cat) {
          if (err || !cat)
            next();

          // TODO(naum): Add contributors ontributors (

          // Create a category lookup by tag
          var catLookup = {};
          for (var i = 0; i < cat.length; ++i)
            catLookup[cat[i].tag] = cat[i];

          // Get category
          var category = catLookup[article.category];

          // Get tags
          var tags = [];
          for (var i = 0; i < article.tags.length; ++i)
            tags.push(catLookup[article.tags[i]]);

          // Get author
          var author = article.author;

          // Markdown text
          article.content = markdown(article.content);

          res.render('article', {
            title : article.title,
            category : category,
            tags : tags,
            author : author,
            article : article
          });
        }
      );
    }
  );
});

module.exports = router;
