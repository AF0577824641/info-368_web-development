const express = require("express");
const router = express.Router();

const Comment = require("../models/comment");
const Book = require("../models/book");

router.post("/create", (req, res) => {
  if (!req.session.currentUser) {
    return res.redirect("/users/login");
  }
  // This creates a new comment
  const newComment = {
    bookId: req.body.bookId,
    userEmail: req.session.currentUser.email,
    userName: req.session.currentUser.name || "Anonymous",
    text: req.body.text.trim(),
  };
  // Adds new comment to local file
  Comment.add(newComment);
  // Redirects user back to book's detail page
  res.redirect(303, `/books/show/${req.body.bookId}`);
});
// Route to render the edit comment form
router.get("/edit/:id", (req, res) => {
  // Redirects login if user is not authenticated
  if (!req.session.currentUser) {
    return res.redirect("/users/login");
  }
  // Gets comment by its ID
  const comment = Comment.get(req.params.id);

  if (!comment || comment.userEmail !== req.session.currentUser.email) {
    return res.redirect(`/books/show/${comment ? comment.bookId : ""}`);
  }
  // Gets the book associated with the comment
  const book = Book.get(comment.bookId);

  const templateVars = {
    title: "BookedIn || Edit Comment",
    comment: comment,
    book: book,
  };
  // Shows the edit comment page
  res.render("comments/edit", templateVars);
});
// Route to handle updating a comment
router.post("/update", (req, res) => {
  if (!req.session.currentUser) {
    return res.redirect("/users/login");
  }
  // Gets the comment to be updated
  const comment = Comment.get(req.body.id);
  // Redirects to books page if the comment doesn't exist or if the user doesn't own the comment
  if (!comment || comment.userEmail !== req.session.currentUser.email) {
    return res.redirect("/books");
  }
  // Updates the comment's text
  comment.text = req.body.text.trim();
  Comment.update(comment);
  // Redirect back to the book's detail page
  res.redirect(303, `/books/show/${comment.bookId}`);
});

module.exports = router;
