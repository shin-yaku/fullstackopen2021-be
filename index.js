if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const Person = require('/app/models/person')

var morgan = require('morgan')
app.use(morgan('combined'))

const cors = require('cors')
app.use(cors())


app.use(express.json())
app.use(express.static('build'))


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } 

  next(error)
}


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people<br>
                 <br>
                 ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
  const person = persons.filter(p => p.id === Number(request.params.id))
  if (person.length) {
    response.json(person)
  } else {
    response.status(400).json({
      error: "not found"
    })
  }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing"
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number is missing"
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


// this has to be the last loaded middleware.
app.use(errorHandler)