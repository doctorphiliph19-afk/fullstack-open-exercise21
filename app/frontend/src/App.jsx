import { useState, useEffect } from 'react';
import name from './service/name';
import './index.css';

// const Notification = ({ successMessage }) => {
//   if (successMessage === "") {
//     return null;
//   }

//   return (
//     <div className="success">
//       {successMessage}
//     </div>
//   );
// };


const Name = ({ person, handleDelete }) => (
  <div>
    {person.name} {person.number} 
    <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
  </div>
);

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with:
    <input value={filter} onChange={handleFilterChange} />
  </div>
);

const PersonForm = ({ 
  addName, 
  newName,
  handleNameChange, 
  newNumber, 
  handleNumberChange,
  // successMessage
 }) => (
 <div>
  {/* <Notification successMessage={successMessage} /> */}
     <form onSubmit={addName}>
    <div>
      name:
      <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number:
      <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
 </div>
);

const Person = ({ personsToShow, handleDelete }) => (
  <div>
    {personsToShow.map((person) => (
      <Name key={person.id} person={person} handleDelete={handleDelete} />
    ))}
  </div>
);

const Notification = ({ message, isError }) => {
  if (message === "") {
    return null;
  }

  const classname = isError ? "error" : "success";

  return (
    <div className={classname}>{message}</div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    name.getAll()
      .then((initialPerson) => setPersons(initialPerson))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const addName = (event) => {
    event.preventDefault();

const existingPerson = persons.find(
  (person) => person.name.toLowerCase() === newName.toLowerCase()
);

const nameExists = Boolean(existingPerson);

const nameObject = {
   name: newName, 
   number: newNumber
   };

if (nameExists) {
  const confirmed = window.confirm(
    `${newName} is already added to phonebook, replace the old number with a new one?`
  );
  if (!confirmed) {
    // if user does not confirm, do nothing
    return;
  }

  const updatedPerson = { ...existingPerson, number: newNumber };

  name.update(existingPerson.id, updatedPerson)
    .then((returnedPerson) => {
      setPersons(
        persons.map((person) =>
          person.id !== existingPerson.id ? person : returnedPerson
      ));
      setSuccessMessage(`${updatedPerson.name}'name has been updated successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      
    })
    .catch((error) => {
 console.error("Error updating number:", error.message);
  setErrorMessage(`information: ${nameExists.name} has already been removed from the server`);
  setTimeout(() => setErrorMessage(""), 3000);
    });
} else {

    name.create(nameObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setSuccessMessage(`Added ${returnedPerson.name} is successfully added to the phonebook!`);
        setTimeout(() => setSuccessMessage(""), 3000);
        setNewName('');
        setNewNumber('');
      })
      .catch((error) => {
        setErrorMessage(`Error adding person: ${error.message}`);
        setTimeout(() => setErrorMessage(""), 3000);
        console.error("Error adding person:", error);
      });
    }
  };

  const handleDelete = (id, nameToDelete) => {
    if (window.confirm(`Delete ${nameToDelete}?`)) {
      
      name.remove(id)
        .then(() => setPersons(persons.filter((p) => p.id !== id)))
        .catch((error) => console.error("Error deleting person:", error));
    }
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {/* <Notification successMessage={successMessage} /> */}
      <Notification message={successMessage} isError={false} />
      <Notification  message={errorMessage} isError={true} />
      <h2>Phonebook</h2>
       
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        // successMessage={successMessage}
      />

      <h3>Numbers</h3>
      <Person personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;