import { books } from './books.js'
import { books_with_images } from './books_with_images.js'
import express from 'express'

const app = express()

/* returns the books without the images  */
app.get('/', async(req, res) => {
    res.json(books.books)
})

/* returns the books with images  */
app.get('/books', async(req, res) => {
    res.json(books_with_images.results)
})

/* returns a random book */
app.get('/random', async(req, res) => {
    res.json(books_with_images.results[Math.floor(Math.random()*books_with_images.results.length)]);
})

app.listen(process.env.PORT || 3000)