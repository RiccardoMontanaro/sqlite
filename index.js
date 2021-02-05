const express = require('express')
const sqlite3 = require('sqlite3').verbose()

const app = new express()
const db = new sqlite3.Database(':memory:')
const port = 8080

db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS tabelaBela (user varchar(255) PRIMARY KEY, password varchar(255))")
	const stmt = db.prepare("INSERT INTO tabelaBela VALUES (?, ?)")
	for (let i = 0; i < 10; i++){
		stmt.run("user" + i, "password" + i)
	}
	stmt.finalize()
})

app.get("/login/:user/:pwd", (req, res) => {
	const {user, pwd} = req.params
	db.get("SELECT * FROM tabelaBela WHERE user = ? AND password = ?", [user, pwd], (err, row) => {
		if (err) {
			res.json({error: err.message})
		} else {
			if (row !== undefined) {
				res.status(200).json({ok: true})		
			} else {
				res.status(401).json({ok: false})
			}	
		}
	})
})

app.listen(port, () => console.log(`App listening on port ${port}`))