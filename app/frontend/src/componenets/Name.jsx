const Name = ({ person, handleDelete }) => (
  <>
    {person.name} {person.number} 
    <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
  </>
);

export default Name;