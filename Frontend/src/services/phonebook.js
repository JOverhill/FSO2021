import axios from "axios";
// baseurlissa pitää olla /api/ huom
//const baseUrl = "http://localhost:3001/api/persons";
//herokun tavallinen url
//const baseUrl = 'https://thawing-taiga-60346.herokuapp.com/api/persons'
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const create = personObject => {
  const request = axios.post(baseUrl, personObject);
  return request.then(response => response.data);
};

const update = (id, personObject) => {
  const request = axios.put(`${baseUrl}/${id}`, personObject);
  return request.then(response => response.data);
};

const deletePerson = id => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(response => response.data);
};

export default {
  getAll: getAll,
  create: create,
  update: update,
  deletePerson: deletePerson
};