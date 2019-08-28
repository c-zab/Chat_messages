const express = require('express')
const body_parser = require('body-parser')
const app = express()
const cors = require('cors')
const http = require('http').Server(app)
const io = require('socket.io')(http)
// const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose')

app.use(cors());
app.use(express.static(__dirname))
app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: false}))

// const dbUrl = 'mongodb+srv://username:username@cluster0-qpvof.mongodb.net/test?retryWrites=true&w=majority'
const dbUrl = 'mongodb+srv://username:username@cluster0-qpvof.mongodb.net/lyndadb'

const Message = mongoose.model('Message', {
	name: String,
	message: String
})

let messages = [
	{name: 'Tim', message: 'Hi'},
	{name: 'Carlos', message: 'Hello'}
]

app.get('/messages', (req, res, next) => {
	Message.find({}, (err, messages) => {
		res.send(messages)
	})
})

app.post('/messages', (req, res) => {
	let message = new Message(req.body)

	message.save((err) => {
		if(err)
			sendStatus(500)
		io.emit('message', req.body)
		res.sendStatus(200)
	})

})


io.on('connection', (socket) => {
	console.log("User connected")
})

mongoose.connect(dbUrl, {useNewUrlParser: true}, (err) => {
	console.log('mongo db connection', err)
})


let server = http.listen(3000, () => {
	console.log('server is listenning on port ', server.address().port)
})
