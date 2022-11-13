import { books } from './books.js'
import { books_with_images } from './books_with_images.js'
import express from 'express'

const app = express()

app.use((err, req, res, next) => {
    res.status(500).json({ message: err })
})

/* returns all the books without the images  */
/*
app.get('/', (req, res) => {
    res.json(books.books)
})
*/

/* returns a random book without the images  */
app.get('/randombook', (req, res) => {
    res.json(books.books[Math.floor(Math.random()*books.books.length)])
})

/* returns the first X books without the images  */
app.get('/:num', (req, res) => {
    const num = req.params.num;
    res.json(books.books.slice(0, num))
})

/* returns a random book */
app.get('/random', (req, res) => {
    res.json(books_with_images.results[Math.floor(Math.random()*books_with_images.results.length)]);
})

/* returns random books of given number */
app.get('/random/:num', (req, res) => {
    const num = req.params.num;
    const shuffled = books_with_images.results.sort(() => 0.5 - Math.random());
    res.json(shuffled.slice(0, num));
    console.log(res.status);
})

/* returns the first X books */
app.get('/books/:num', (req, res) => {
    const num = req.params.num;
    res.json(books_with_images.results.slice(0,num));
})

app.listen(process.env.PORT || 3000)