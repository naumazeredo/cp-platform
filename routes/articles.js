var express = require('express');
var router = express.Router();
var markdown = require('marked');

/* GET articles listing. */
router.get('/', function(req, res, next) {
  res.render('articles', { title: 'Articles' });
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
