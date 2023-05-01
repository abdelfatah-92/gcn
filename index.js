const express = require('express')
require('dotenv').config()
const app = express()
const morgan = require('morgan')
const cors = require('cors')
// const mongoose = require('mongoose')
const Person = require('./modules/model')
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
morgan.token('request-body', (req) => JSON.stringify(req.body))
app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    if (persons.length > 0) {
      res.json(persons)
    } else {
      res.status(404).end()
    }
  }).catch(error => next(error))
})
const date = new Date()
app.get('/info',(req,res) => {
  res.send(`<P>phonebook has info for ${Person.findOne.length} pepole</p><P>${date}</p>`)
    .end()})
app.get('/api/persons/:id',(req, res, next) => {
  Person.findById(req.params.id).then(person => {if(person){ res.json(person).end()} else {
    res.status(404).json({ error : 'id is not correct' })
  }
  })
    .catch(error => next(error))
})
app.delete('/api/persons/:id',(req,res,next) => {
  Person.findByIdAndDelete(req.params.id).then(
    res.status(204).end())
    .catch(error => next(error))
})
app.put('/api/persons/:id',(req,res,next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, person ,{ new : true , runValidators : true , context : 'query' })
    .then(ubdatedPerson =>
      res.json(ubdatedPerson))
    .catch(error => next(error))
})
app.post('/api/persons', (request, res, next) => {
  const body = request.body
  console.log(body)
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedperson => {
    console.log(savedperson)
    res.json(person)})
    .catch(error => next(error))
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'then error' })
}
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'catch error' }) } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => console.log('app works in port 3001'))