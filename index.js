import express from "express"
import morgan  from "morgan"
import cors    from "cors"

const app = express()

let persons = [
	{
		"id": 1,
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": 2,
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": 3,
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
		"id": 4,
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	}
]

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({error: 'unknown endpoint'})
}

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())


app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(person => person.id === id)

	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.post('/api/persons', (req, res) => {
	const body = req.body

	if (!body.name && !body.number) {
		return res.status(404).json({
			error: 'name and number are missing'
		})
	}

	if (!body.name) {
		return res.status(404).json({
			error: 'name is missing'
		})
	}

	if (!body.number) {
		return res.status(404).json({
			error: 'number is missing'
		})
	}

	let result = persons.find(person => person.name === body.name)

	if (result) {
		return res.status(404).json({
			error: 'name must be unique'
		})
	}

	const person = {
		id: Math.random() * 100,
		name: body.name,
		number: body.number
	}

	persons = persons.concat(person)

	res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)
	res.json({message: `id ${id} deleted`})
	res.status(204).end()
})

app.get('/info', (req, res) => {
	res.send(`
		<div>Phonebook has info for ${persons.length} people</div>
		<div>${Date()}</div>
	`)
})

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})