import { UserRepository } from './userRepository'
import { InMemoryDb } from './inMemoryDb'
import { BadRequestError } from '../utils'

test('user creation succeeds if email has not been used yet', async () => {
    const userRepository = new UserRepository(new InMemoryDb())
    await userRepository.create({ passwordHash: 'some hash', email: 'email@test.com' })
    await userRepository.create({ passwordHash: 'other hash', email: 'email@test2.com' })
})

test('user creation fails if email is used', async () => {
    const userRepository = new UserRepository(new InMemoryDb())
    await userRepository.create({ passwordHash: 'some hash', email: 'email@test.com' })
    await expect(
        userRepository.create({ passwordHash: 'other hash', email: 'email@test.com' }),
    ).rejects.toThrow(BadRequestError)
})
