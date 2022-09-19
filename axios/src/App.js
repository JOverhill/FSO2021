import React from 'react'
import { useState, useEffect } from 'react';
import axios from "axios";
import Filter from "./components/Filter"
//import database from './components/database';



const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [filter, setFilter] = useState('')
  const baseUrl = "https://restcountries.com/v3.1/all";

  useEffect(() => {
    axios
    .get(baseUrl)
    .then(response => {
      console.log(response)
      console.log(response.data)
      setNotes(response.data)
    })
  }, [])
  console.log('render', notes.length, 'notes')

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }
    return (
      
      <div>
       <Filter handleFilter={handleFilter} filter={filter} />
      <h1>Maat</h1>
      <div>
        {
        notes.map(maat => {
           return <p>{maat.name.common}</p>
        })
        }
      </div>
      </div>
      
    );
  }

export default App;
