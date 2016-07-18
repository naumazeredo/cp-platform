var express = require('express');
var router = express.Router();
var markdown = require('marked');

var db = require('../config/db');

/* GET articles listing. */
router.get('/', function(req, res, next) {
  // Get all articles published and group by categories (in categories order)
  db.get('articles').aggregate(
    [
      { $match : { 'status' : 'Published' } },
      {
        $group: {
          _id : { $arrayElemAt: [ '$categories', 0 ] },
          articles : { $push : '$$ROOT' },
          //rating : { $avg : '$rating' }
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
  var categories = [{title: 'Dynamic Programming', tag: 'dp', url: '#'}, {title: 'Graphs', tag: 'graphs', url: '#'}];
  var author = {name: 'kogyblack', rating: 4};
  var date = new Date(2015, 6, 1);
  var content = markdown('# Article Title\n\n## This is the content\n\nText here just to complete\n\n- A\n- Simple\n- List\n\nJust to test things out\n');
  var title = 'Article title';
  res.render('article', { title: title, categories: categories, author: author, date: date, content: content });
});

module.exports = router;
