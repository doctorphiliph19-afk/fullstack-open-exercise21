const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('Phonebook API', () => {
  test('contacts are returned as JSON', async () => {
    const response = await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('name')
    expect(response.body[0]).toHaveProperty('number')
  })

  test('a contact can be found by ID', async () => {
    const response = await api
      .get('/api/persons/1')
      .expect(200)

    expect(response.body.name).toBe('Arto Hellas')
  })

  test('an unknown contact returns 404', async () => {
    await api.get('/api/persons/unknown-id').expect(404)
  })
})
