const comments = [
  {
    id: "0",
    bookId: "0",
    userEmail: "rvanmech@pratt.edu",
    text: "I would love to read this!!",
  },
  {
    id: "1",
    bookId: "0",
    userEmail: "rvanmech@pratt.edu",
    text: "OMG is just so good, i hope it stays this way",
  },
  {
    id: "2",
    bookId: "0",
    userEmail: "rvanmech@pratt.edu",
    text: "It's so sad that i finished it, what do you think?",
  },
];

function getNextId() {
  return Math.max(...comments.map((c) => parseInt(c.id))) + 1;
}

exports.add = (comment) => {
  comment.id = getNextId().toString();
  comments.push(comment);
};

exports.update = (comment) => {
  const index = comments.findIndex((c) => c.id === comment.id);
  if (index !== -1) comments[index] = comment;
};

exports.upsert = (comment) => {
  if (comment.id) {
    exports.update(comment);
  } else {
    exports.add(comment);
  }
};

exports.get = (id) => comments.find((c) => c.id == id);

exports.allForBook = (bookId) => comments.filter((c) => c.bookId == bookId);
