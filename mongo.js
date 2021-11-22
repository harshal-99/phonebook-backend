import mongoose from "mongoose"
import dotenv   from "dotenv"

dotenv.config()

const password = process.env.MONGODB_PASSWORD;

const url = `mongodb+srv://harshal:${password}@cluster0.phqea.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url)
	.then(res => console.log('connected'))

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
	Person.find({})
		.then((result) => {
			result.forEach((person) => {
				console.log(person.name, person.number)
			})
			mongoose.connection.close()
				.then(() => {
					console.log('connection closed')
				})
		})
		.catch(err => console.log(err))
} else {
	const person = new Person({
		name: process.argv[2],
		number: process.argv[3]
	})

	person
		.save()
		.then(() => {
			console.log(`added ${person.name} number ${person.number} to phonebook`)
			mongoose.connection.close()
				.then(() => {
					console.log('connection closed')
				})
		})
}




