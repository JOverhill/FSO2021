import { useState, useEffect } from 'react';
import Persons from './components/Persons.js';
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Notification from "./components/Notification";
import phonebook from './services/phonebook';
import './styles/main.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    phonebook
    .getAll()
    .then((response) => {
      setPersons(response);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault()
    
    const personObject = {
      name: newName,
      number: newNumber,
      id: Math.floor(Math.random() * 101),
  };

    if (
      persons.filter(person => person.name === personObject.name).length > 0
    ) {
      if (
        window.confirm(`${personObject.name} on jo luettelossa, korvataanko vanha numero uudella?`) 
      ) 
      {
        const previousPerson = persons.find(n => n.name === newName);
        phonebook
          .update(previousPerson.id, { ...previousPerson, number: newNumber })
          .then(updatedPerson => {
            setPersons(persons.map(n => (n.name === newName ? updatedPerson : n))
            );
          })
          .catch(error => {
            console.log(error);
            setErrorMessage("Päivitys epäonnistui");
          });
        setPersons(persons.concat(personObject));
        setErrorMessage(`Muutettiin ${personObject.name} numero`);
        setNewName("");
        setNewNumber("");
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      }
    } else {
      phonebook
        .create(personObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson));
          setErrorMessage(`Lisättiin ${personObject.name}`);
          setNewName("");
          setNewNumber("");
        })
        .catch(error => {
          setErrorMessage(`${error.response.data.error}`);
          console.log(error.response.data);
        });
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };
  
    
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
    setFilter(event.target.value)
  }
  
  const handleRemove = (name, id) => {
    return () => {
      if (window.confirm(`Poistetaanko ${name} ?`)) {
        phonebook
          .deletePerson(id)
          .then(() => {
            setPersons(persons.filter(n => n.id !== id));
            setErrorMessage(`Poistettiin ${name}`);
          })
          .catch(error => {
            setPersons(persons.filter(n => n.name !== name));
            setErrorMessage(`Käyttäjä ${name} on jo poistettu palvelimelta.`);
          });
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      }
      setNewName("");
      setNewNumber("");
    }; 
  };

  



  return (
    <div>
      <h2 className="header">Phonebook</h2>
        
        <Notification 
         message={errorMessage}
          />
        
        <Filter handleFilter={handleFilter} filter={filter} />

      <h2>Add a new number</h2>
          <PersonForm
          newName={newName}
          newNumber={newNumber}
          addPerson={addPerson}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}
          />
      <h2>Numbers</h2>
      <Persons filter={filter} persons={persons} handleRemove={handleRemove} />
    </div>
  )
  
}

export default App