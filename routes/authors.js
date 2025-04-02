const express = require('express');
const router = express.Router();

const helpers = require('./helpers')
const Author = require('../models/author');

router.get('/', async function(req, res, next) {
    try {
        const authors = await Author.all();
        res.render('authors/index', { title: 'BookedIn || Authors', authors: authors });
    } catch (error) {
        next(error);
    }
});

router.get('/form', async (req, res, next) => {
    if (helpers.ForceLoggedInUser(req, res)) {
        return;
    }
    res.render('authors/form', { title: 'BookedIn || Authors' });
});

router.post('/upsert', async (req, res, next) => {
    try {
        if (helpers.ForceLoggedInUser(req, res)) {
            return;
        }
        const author = await Author.upsert(req.body);
        let createdOrupdated = req.body.id ? 'updated' : 'created';
        req.session.flash = {
            type: 'info',
            intro: 'Success!',
            message: `The author ${author.firstName} ${author.lastName} has been ${createdOrupdated}!`,
        };
        res.redirect(303, '/authors');
    } catch (error) {
        next(error);
    }
});

router.get('/edit', async (req, res, next) => {
    try {
        if (helpers.ForceLoggedInUser(req, res)) {
            return;
        }
        const authorId = req.query.id;
        const author = await Author.get(authorId);
        if (!author) {
            res.status(404).send('Author not found');
            return;
        }
        res.render('authors/form', { 
            title: 'BookedIn || Authors', 
            author: author
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

