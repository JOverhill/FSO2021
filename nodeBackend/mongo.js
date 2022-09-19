//Testitiedosto, ei projektissa käytössä

const mongoose = require('mongoose')

// Jos yritetään käynnistää vain komennolla "node mongo.js" komentoriviltä -> pyytää salasanaa
if(process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}
//salasana on komentorivin kolmas sana (indeksi 2) eli node mongo.js salasana
const password = process.argv[2]
//komentorivin neljäs sana on tallennettava nimi ja viides sana numero
const nameInput = process.argv[3]
const numInput = process.argv[4]

const url =
    `mongodb+srv://jiritesti:${password}@cluster0.oc4y7.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
   
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: nameInput,
    number: numInput,
})

if ((nameInput != undefined) && (numInput != undefined)) {
    person.save().then(result => {
        console.log(`Lisätään ${nameInput} ${numInput} luetteloon`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
}
/* note.save().then(result => {
    console.log('Note saved!')
    mongoose.connection.close()
}) */

