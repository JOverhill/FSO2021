require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/note')
const { response } = require('express')

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456789",
      important: true
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "29-469874123",
      important: false
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345",
      important: true
    }
  ]
  
  const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    console.log('---')
    next()
  }

 
  app.use(express.static('build'))
  
  app.use(express.json())

  app.use(requestLogger)

  app.use(cors())

  app.use(express.static('build'))


  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
 
  //Jos haluaa POST vaiheessa käyttää id:n generointia
/*   const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
    return maxId + 1
  } */

/*   app.get('/api/info/', (request, response) => {
    const pvm_obj = new Date();
    response.send(`Phonebook has info for ${persons.length} things` 
    + `<br> ${pvm_obj}`)
    
  })
 */

 
  app.post('/api/persons', (request, response, next) => {
 
    const body = request.body
    
    /* if (!body.name) { //Toimiva virheenkäsitellijä, uusi testi alempana
      return response.status(400).json({
        error: 'name missing'
        
      })
    }
    
    if (!body.number) {
      return response.status(400).json({
        error: 'number missing'
        
      })
    } */

    const person = new Person({
      name: body.name,
      important: body.important || false, 
      number: body.number,
      date: new Date(),
      /* id: generateId(), */
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
  })  

  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
     response.json(persons)
    })
  }) 

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => {
        next(error)
      })
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then (() => {
        response.status(204).end()
      })
      .catch (error => next(error))
   
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(request.params.id,
      {name, number},
      {new: true, runValidators: true, context: 'query'}
      )
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))


  })

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
