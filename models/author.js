const authors = [
  { id: 1, firstName: "James", lastName: "S. A. Corey" },
  { id: 2, firstName: "Craig", lastName: "Alanson" },
  { id: 3, firstName: "Cixin", lastName: "Liu" },
  { id: 4, firstName: "David", lastName: "Grann" },
];

let nextId = 5; // For generating new IDs

exports.all = async () => {
  return authors;
};

exports.get = async (id) => {
  return authors.find((author) => author.id === parseInt(id)) || null;
};

exports.add = async (author) => {
  const newAuthor = {
    id: nextId++,
    firstName: author.firstName,
    lastName: author.lastName,
  };
  authors.push(newAuthor);
  return newAuthor;
};

exports.update = async (author) => {
  const index = authors.findIndex((a) => a.id === parseInt(author.id));
  if (index !== -1) {
    authors[index] = {
      id: parseInt(author.id),
      firstName: author.firstName,
      lastName: author.lastName,
    };
    return authors[index];
  }
  return null;
};

exports.upsert = async (author) => {
  if (author.id) {
    return await exports.update(author);
  } else {
    return await exports.add(author);
  }
};
