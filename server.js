const express = require('express')
const body_parser = require('body-parser')
const app = express()
const cors = require('cors')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')
var path = require('path');

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

app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages)
	})
})

app.post('/messages', async (req, res) => {
	try {
		let message = new Message(req.body)

		let savedMessage = await message.save()

		console.log('Message saved');

		let censored = await Message.findOne({message: 'badword'})

		if( censored )
			await Message.deleteOne({_id: censored._id})
		else
			io.emit('Message ->', req.body)

		res.sendStatus(200)
	} catch (error) {
			res.sendStatus(500)
			return console.error(error)
	}
})

app.get('/about', (req, res) => {
	res.sendFile(path.join(__dirname + '/about.html'));
})

io.on('connection', (socket) => {
	console.log("User connected")
})

mongoose.connect(dbUrl, {useNewUrlParser: true}, (err) => {
	console.log('Mongo db connection ->', err)
})


let server = http.listen(3000, () => {
	console.log('server is listenning on port ', server.address().port)
})
