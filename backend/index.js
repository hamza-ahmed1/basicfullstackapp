import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import bodyParser from 'body-parser';

// making database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'daniyal',
    database: 'book_store'
    });

    const app=express();
    app.use(cors());
    app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('hello from backend');
})

//getting  all books
app.get('/books',(req,res)=>{
    const sqlSelect = 'SELECT * FROM tbl_books';
    db.query(sqlSelect,(err,data)=>{
        if (err) return res.json(err);
        res.json(data);
    })
})


// posting all books:
app.post('/books', (req, res) => {
    const sqlInsert = 'INSERT INTO tbl_books (`title`,`description`,`cover`) VALUES (?)';
    const book = [
        req.body.title,
        req.body.description,
        req.body.cover
    ];
    db.query(sqlInsert, [book], (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(data);
    });
});

//delete book;
app.delete('/books/:id',(req,res)=>{
    const bookId=req.params.id;
    const q = 'DELETE FROM tbl_books WHERE id=?';
    db.query(q,[bookId],(err,data)=>{
        if(err) return res.status(500).json(err);
        res.status(200).json(data);
        
    })

})

//getting book of specific id:
app.get('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const q = 'SELECT * FROM tbl_books WHERE id = ?';
    db.query(q, [bookId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(data[0]);
    });
});

//update book :
app.put('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const q = 'UPDATE tbl_books SET title = ?, description = ?, cover = ? WHERE id = ?';
    const values = [
        req.body.title,
        req.body.description,
        req.body.cover
    ];
    db.query(q, [...values, bookId], (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json('Book updated successfully');
    });
});


app.listen(3000,()=>{
    console.log("listening at port 3000");
})

