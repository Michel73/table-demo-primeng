'use strict';

const randomName = require('node-random-name');
const faker = require('faker');

module.exports = () => {
  const data = { users: [] }
  // Create 1000 users
  for (let i = 0; i < 1000; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    data.users.push({ id: i, firstName, lastName, email: faker.internet.email(firstName, lastName) })
  }
  console.log('data called')
  return data
}
