const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  { id: '1', name: 'Arto Hellas', number: '040-123456' },
  { id: '2', name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: '3', name: 'Dan Abramov', number: '12-43-234345' },
  { id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' }
]

const generateId = () => {
  return String(Math.floor(Math.random() * 1000000))
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find((p) => p.id === req.params.id)
  if (!person) {
    return res.status(404).json({ error: 'Person not found' })
  }
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter((p) => p.id !== req.params.id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number is missing' })
  }

  if (persons.some((p) => p.name === body.name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  res.status(201).json(newPerson)
})

module.exports = app
