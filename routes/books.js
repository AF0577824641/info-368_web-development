const express = require('express');
const router = express.Router();

const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookUser = require('../models/book_user');

router.get('/', function(req, res, next) {
  const books = Book.all
  res.render('books/index', { title: 'BookedIn || books', books: books });
});

router.get('/form', async (req, res, next) => {
  res.render('books/form', { title: 'BookedIn || Books', authors: Author.all, genres: Genre.all });});

router.post('/upsert', async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body))
  Book.upsert(req.body);
  let createdOrupdated = req.body.id ? 'updated' : 'created';
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: `the book ${req.body.title} has been ${createdOrupdated}!`,
  };
  res.redirect(303, '/books')
});

router.get('/edit', async (req, res, next) => {
  let bookIndex = req.query.id;
  let book = Book.get(bookIndex);
  res.render('books/form', {
    title: 'BookedIn || Books',
    book: book,
    bookIndex: bookIndex,
    authors: Author.all,
    genres: Genre.all
  });
});

router.get('/show/:id', async (req, res, next) => {
  const Comment = require('../models/comment');
  var templateVars = {
    title: "BookedIn || show",
    book: Book.get(req.params.id),
    bookId: req.params.id,
    statuses: BookUser.statuses,
    user: req.session.currentUser,  // Add the user information
    comments: Comment.getAllForBook(req.params.id)  // Add the comments
  }
  if (templateVars.book.authorIds) {
    templateVars.authors = templateVars.book.authorIds.map((authorId) => Author.get(authorId));
  }
  if (templateVars.book.genreId) {
    templateVars['genre'] = Genre.get(templateVars.book.genreId);
  }
  if (req.session.currentUser) {
    templateVars['bookUser'] = BookUser.get(req.params.id, req.session.currentUser.email);
    templateVars['currentUser'] = req.session.currentUser;  // Keep this for backward compatibility
  }
  res.render('books/show', templateVars);
});

module.exports = router;
