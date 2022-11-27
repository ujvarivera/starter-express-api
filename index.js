import { books } from './bestBooks.js'
import express from 'express'

const app = express()

app.use((err, req, res, next) => {
    res.status(500).json({ message: err })
})

/* returns a random book */
app.get('/random', (req, res) => {
    res.json(books.results[Math.floor(Math.random()*books.results.length)])
})

/* returns random books of given number */
app.get('/random/:num', (req, res) => {
    const num = req.params.num;
    const shuffled = books.results.sort(() => 0.5 - Math.random());
    res.json(shuffled.slice(0, num));
})

/* returns information about books by a given title (should not be exact match)*/
app.get('/bookinfo/:title', (req, res) => {
    let title = req.params.title;
    let booksOfGivenTitle = [];

    for (const book of books.results) {
        if (book.title.toLowerCase().includes(title.toLowerCase())) { // eval: "['Horror']" => ['Horror']
            booksOfGivenTitle.push(book);
        }
    }

    res.json(booksOfGivenTitle); // returns a list with more or one object(s)
})

/* returns information about A BOOK by a given title (should be EXACT match, although case-insensitive)*/
app.get('/bookinfo/exact/:title', (req, res) => {
    let title = req.params.title;

    for (const book of books.results) {
        /*
        if (book.title.toLowerCase() === title.toLowerCase()) { // eval: "['Horror']" => ['Horror']
            return res.json(book); // returns only an object
        }
        */
        if (book.title.toLowerCase().includes(title.toLowerCase())) { // eval: "['Horror']" => ['Horror']
            return res.json(book); // returns only an object // returns the first match
        }
    }

    res.json({});
})

/* returns books by the ratings in desc order */
app.get('/bestbooks', (req, res) => {

    books.results = books.results.sort((a, b) => (a.rating > b.rating) ? -1 : 1);

    res.json(books.results);
})

/* returns the languages that can be chosed */
app.get('/languages', (req, res) => {

    const languages = [];

    for (const book of books.results) {
        if (!languages.includes(book.language) && book.language !== "") {
            languages.push(book.language);
        }
    }

    res.json(languages); // returns a list of strings
})

/* returns the genres that can be chosed */
app.get('/genres', (req, res) => {

    const genres = [];

    for (const book of books.results) {
        for (const genre of eval(book.genres)) {
            if (!genres.includes(genre) && genre !== "") {
                genres.push(genre);
            }
        }
    }

    res.json(genres); // returns a list of strings
})

/* returns the top X best books */
app.get('/bestbooks/:num', (req, res) => {
    let num = req.params.num;
    books.results = books.results.sort((a, b) => (a.rating > b.rating) ? -1 : 1);

    res.json(books.results.slice(0, num)); // returns a list of objects
})

/* returns the first X books */
app.get('/:num', (req, res) => {
    const num = req.params.num;
    res.json(books.results.slice(0, num)) // returns a list of objects
})

/* returns books in given genre */
app.get('/genre/:genre', (req, res) => {
    let genre = req.params.genre;
    genre = genre.toLowerCase();

    //genre = genre.charAt(0).toUpperCase() + genre.slice(1); // 'romance' => 'Romance' // állhat több szóból egy műfaj!
    const genreList = genre.split(' ');
    genre = [];

    for (let word of genreList) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
        genre.push(word)
    }

    genre = genre.join(' ');

    const booksInGenre = [];

    for (const book of books.results) {
        if (eval(book.genres).includes(genre)) { // eval: "['Horror']" => ['Horror']
            booksInGenre.push(book);
        }
    }

    res.json(booksInGenre); // returns a list of objects
})

/* returns a random book in given genre */
app.get('/genre/:genre/random', (req, res) => {
    let genre = req.params.genre;
    genre = genre.toLowerCase();

    const genreList = genre.split(' ');
    genre = [];

    for (let word of genreList) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
        genre.push(word)
    }

    genre = genre.join(' ');

    const booksInGenre = [];

    for (const book of books.results) {
        if (eval(book.genres).includes(genre)) { // eval: "['Horror']" => ['Horror']
            booksInGenre.push(book);
        }
    }

    if (booksInGenre.length === 0) {
        return res.json({});
    }

    res.json(booksInGenre[Math.floor(Math.random()*booksInGenre.length)]); //returns an object
})

/* returns X random books in given genre */
app.get('/genre/:genre/:num', (req, res) => {
    let genre = req.params.genre;
    let num = req.params.num;
    genre = genre.toLowerCase();

    const genreList = genre.split(' ');
    genre = [];

    for (let word of genreList) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
        genre.push(word)
    }

    genre = genre.join(' ');

    const booksInGenre = [];

    for (const book of books.results) {
        if (eval(book.genres).includes(genre)) { // eval: "['Horror']" => ['Horror']
            booksInGenre.push(book);
        }
    }

    res.json(booksInGenre.slice(0, num)); // returns a list of objects
})

/* returns the books of given author */
app.get('/author/:name', (req, res) => {
    let authorName = req.params.name;
    // lehet ilyen is egy szerző neve: "Seth Harwood (Goodreads Author)"
    // vagy több szerző esetén: "Anna Akhmatova, Paul Valet (Translator)"

    const booksOfAuthor = [];

    for (const book of books.results) {
        if (book.author.toLowerCase().includes(authorName.toLowerCase())) {
            booksOfAuthor.push(book);
        }
    }

    res.json(booksOfAuthor); // returns a list of objects if author is found, else an empty list
})

/* returns the books which were published in given date */
app.get('/publication-date/:date', (req, res) => {
    let date = req.params.date;
    // így néz ki: "October 1st 2015"

    const booksPublished = [];

    for (const book of books.results) {
        if (book.publishDate.toString().slice(-4) == date) {
            booksPublished.push(book);
        }
    }

    res.json(booksPublished); // returns a list of objects
})

/* returns the books which have less than :num pages */
app.get('/pages/:num', (req, res) => {
    let num = req.params.num;

    const searchedBooks = [];

    for (const book of books.results) {
        if (book.pages != "" && book.pages <= num) {
            searchedBooks.push(book);
        }
    }

    res.json(searchedBooks); // returns a list of objects
})

/* returns a random book which have less than :num pages */
app.get('/pages/:num/random', (req, res) => {
    let num = req.params.num;

    const searchedBooks = [];

    for (const book of books.results) {
        if (book.pages != "" && book.pages <= num && typeof book.pages !== 'string') {
            searchedBooks.push(book);
        }
    }

    if(searchedBooks.length === 0) {
        return res.json({});
    }

    res.json(searchedBooks[Math.floor(Math.random()*searchedBooks.length)]); // returns an object
})

/* returns the books which cost less than :price */
app.get('/price/:price', (req, res) => {
    let price = req.params.price;
    // ár így néz ki: 5.5, lehet üres string

    const searchedBooks = [];

    for (const book of books.results) {
        if (book.price != "" && book.price <= price) {
            searchedBooks.push(book);
        }
    }

    res.json(searchedBooks); // returns a list of objects
})

/* returns a random book which cost less than :price */
app.get('/price/:price/random', (req, res) => {
    let price = req.params.price;

    const searchedBooks = [];

    for (const book of books.results) {
        if (book.price != "" && book.price <= price) {
            searchedBooks.push(book);
        }
    }

    if(searchedBooks.length === 0) {
        return res.json({});
    }

    res.json(searchedBooks[Math.floor(Math.random()*searchedBooks.length)]); // returns an object
})

/* returns a random book of given language */
app.get('/language/:language/random', (req, res) => {
    let language = req.params.language;

    const booksOfLanguage = [];

    for (const book of books.results) {
        if (book.language.toLowerCase().includes(language.toLowerCase())) {
            booksOfLanguage.push(book);
        }
    }

    if (booksOfLanguage.length === 0) {
        return res.json({});
    }

    res.json(booksOfLanguage[Math.floor(Math.random()*booksOfLanguage.length)]); // returns an object
})

/* returns books of given language */
app.get('/language/:language', (req, res) => {
    let language = req.params.language;

    const booksOfLanguage = [];

    for (const book of books.results) {
        if (book.language.toLowerCase().includes(language.toLowerCase())) {
            booksOfLanguage.push(book);
        }
    }

    res.json(booksOfLanguage); // returns a list of objects
})

app.listen(process.env.PORT || 3000)