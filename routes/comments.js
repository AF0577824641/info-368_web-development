const express = require("express");
const router = express.Router();

const Comment = require("../models/comment");
const Book = require("../models/book");

router.post("/create", (req, res) => {
  if (!req.session.currentUser) {
    return res.redirect("/users/login");
  }

  const newComment = {
    bookId: req.body.bookId,
    userEmail: req.session.currentUser.email,
    userName: req.session.currentUser.name || "Anonymous",
    text: req.body.text.trim(),
  };

  Comment.add(newComment);
  res.redirect(303, `/books/show/${req.body.bookId}`);
});

router.get("/edit/:id", (req, res) => {
  if (!req.session.currentUser) {
    return res.redirect("/users/login");
  }

  const comment = Comment.get(req.params.id);

  if (!comment || comment.userEmail !== req.session.currentUser.email) {
    return res.redirect(`/books/show/${comment ? comment.bookId : ""}`);
  }

  const book = Book.get(comment.bookId);

  const templateVars = {
    title: "BookedIn || Edit Comment",
    comment: comment,
    book: book,
  };

  res.render("comments/edit", templateVars);
});

router.post("/update", (req, res) => {
  if (!req.session.currentUser) {
    return res.redirect("/users/login");
  }

  const comment = Comment.get(req.body.id);

  if (!comment || comment.userEmail !== req.session.currentUser.email) {
    return res.redirect("/books");
  }

  comment.text = req.body.text.trim();
  Comment.update(comment);

  res.redirect(303, `/books/show/${comment.bookId}`);
});

module.exports = router;
