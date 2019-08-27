var express = require('express')
var body_parser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: false}))

let messages = [
	{name: 'Tim', message: 'Hi'},
	{name: 'Carlos', message: 'Hello'}
]

app.get('/messages', (req, res) => {
	res.send(messages)
})

app.post('/messages', (req, res) => {
	messages.push(req.body)
	io.emit('message', req.body)
	res.sendStatus(200)
})

io.on('connection', (socket) => {
	console.log("User connected")
})

let server = http.listen(3000, () => {
	console.log('server is listenning on port ', server.address().port)
})
