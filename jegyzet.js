const noBookIsFound = {
    "bookId": "",
    "title": "",
    "series": "",
    "author": "",
    "rating": 0.00,
    "description": "",
    "language": "",
    "isbn": 0,
    "genres": "",
    "characters": "",
    "bookFormat": "",
    "edition": "",
    "pages": 0,
    "publisher": "",
    "publishDate": "",
    "firstPublishDate": "",
    "awards": "[]",
    "numRatings": 0,
    "ratingsByStars": "[]",
    "likedPercent": 0,
    "setting": "[]",
    "coverImg": "",
    "bbeScore": 0,
    "bbeVotes": 0,
    "price": 0
}

app.get('/compare-pages/:title1&:title2', function(req, res) {
    const title1 = req.params.title1;
    const title2 = req.params.title2;
    let book1 = {};
    let book2 = {};

    for (const book of books.results) {
        if (book.title.toLowerCase().includes(title1)) {
            book1 = book;
        } else if (book.title.toLowerCase().includes(title2)) {
            book2 = book;
        }
    }
    console.log(book1, book2);

    res.json({book1_title:book1.title, book1_pages: book1.pages, book2_title:book2.title, book2_pages: book2.pages})
    /*
    if (book1.pages > book2.pages) {
        res.json({'message': 'book1 is longer than book2'})
    } else {
        res.json({'message': 'book2 is longer than book1'})
    }
    */

});