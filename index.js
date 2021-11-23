import express from "express"
import morgan  from "morgan"
import cors    from "cors"

import Person from "./modles/phonebook.js";

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

const app = express()

const unknownEndpoint = (request, response) => {
	response.status(404).send({error: 'unknown endpoint'})
}

app.use(express.static('build'))
app.use(express.json())
app.use(morgan((tokens, req, res) => {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens['response-time'](req, res), 'ms',
		tokens.req.body
	].join(' ')
}))
app.use(cors())


app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
})

app.get('/api/persons/:id', (req, res) => {
	Person.findById(req.params.id).then(person => {
		res.json(person)
	})
})

app.post('/api/persons', (req, res, next) => {
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


	Person.find({name: body.name}, (err, docs) => {
		if (docs) {
			const person = {
				name: body.name,
				number: body.number
			}
			Person.findByIdAndUpdate(docs._id, person, {new: true})
				.then(updatedPerson => {
					res.json(updatedPerson)
				})
				.catch(error => next(error))
		} else {
			const person = new Person({
				name: body.name,
				number: body.number
			})
			person.save().then(savedPerson => {
				res.json(savedPerson)
			})
		}
	})


})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

app.get('/info', (req, res) => {
	res.send(`
		<div>Phonebook has info for ${persons.length} people</div>
		<div>${Date()}</div>
	`)
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.log(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({error: 'malformatted id'})
	}
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})