const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(cors())
morgan.token('request-body', (req) => JSON.stringify(req.body))


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

const date = new Date()

app.get('/api/persons',(req,res) => {
    res.json(persons).end()
})

app.get('/info',(req,res) => {
    res.send(`<P>phonebook has info for ${persons.length} pepole</p><P>${date}</p>`)
    .end()
})

app.get('/api/persons/:id',(req, res) => {
    const id = Number(req.params.id) 
    const person = persons.find(person =>  person.id === id)
    if (person){
    res.json(person).end()} else {res.status(404).end()}
})

app.delete('/api/persons/:id',(req,res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})
const generateId = Math.floor(Math.random() * 1000000000)


app.use(express.json())
app.post('/api/persons', (request, res) => {

  const body = request.body
  console.log(body);
  if(!body.name || !body.number ){
    res.status(400).json({error: "name or number missing"})
  }else{
    if(persons.find(p => p.name === body.name)) {
      res.status(400).json({error: "name must be unique"})
    
  }else{

  const person ={
    id: generateId,
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  console.log(persons);
  res.json(person)
  }}
})

const port = 3001
app.listen(port, () => console.log(`app works in port 3001`))