import mongoose from "mongoose"
import dotenv   from "dotenv"

dotenv.config()


mongoose.connect(process.env.MONGODB_URI)
	.then(res => console.log("connected"))

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length < 4) {
	Person.find({})
		.then((result) => {
			result.forEach((person) => {
				console.log(person.name, person.number)
			})
			mongoose.connection.close()
				.then(() => {
					console.log("connection closed")
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
					console.log("connection closed")
				})
		})
}




