const express = require('express')
const app = express()

var morgan = require('morgan')
app.use(morgan('combined'))


app.use(express.json())

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
  response.json(persons)
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

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(p => p.id != Number(request.params.id))
  response.status(204).end()
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.post("/api/persons", (request, response) => {
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
  if (persons.filter(p => p.name === body.name).length) {
    console.log(persons.filter(p => p.name === body.name));
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  const person = {
    id: getRandomInt(99999999),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  console.log(person);

  response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})