# Tic-Tac-Toe GraphQL server
## Running
Requirements:
* node 12

```
npm start 
```

For other options, see `package.json`

## Architecture notes

#### Code structure

```
src/
    model/        # a model of the system - types and pure functions manipulating them.
                  # most business logic is here 
                  # It doesn't know anything about the outer world, like DB, services, repositories, GraphQL
                  # It's just the model of Tic-Tac-Toe domain

    repositories/ # DB related classes - InMemoryDB and repositories themselves
    resolvers/    # Apollo resolvers, a very thin layer over services - there is no logic in there
                  # besides basic input validation and output transformation
    schema/       # GraphQL schema, split into subdomains
    services/     # business logic involving outer world, like DB or authorization 
```

Notes:
* personally I prefer the other style of code organization, that is splitting code by subdomains
  first, and by layer second, as it groups related functionalities together, but both are fine IMO,
  and having started with splitting code by layers first, subdomains second, I didn't feel like 
  changing it would bring much.
* one benefit the reorganization as above would allow, is keeping resolvers and schema together,
  as they are tightly coupled

#### Library choices

Not having any experience with node ecosystem, I knew nothing about existing libraries,
and deeply exploring the possibilities would probably consume my whole time for this assignment,
so I just picked whatever did its job, seemed simple to use and maintained:
* Apollo Server - because I played with it a little in the past, and it was very pleasant
* Bunyan - structured log (JSON), predefined and prefilled fields, child loggers: 
           it ticked all the boxes and worked out of the box, nice
* TypeDI - it had a nice README with basic examples, making it easy to figure out how to use,
           which I can't say about the more popular option I looked at - Inversify. Though I am not
           if I'd trust TypeDI in a bigger, commercial project, judging by the issues on GitHub,
           a bit lacking documentation and cases where it silently continued working even though 
           I set it up incorrectly.
* Jest - I used before and had no problems with it, so no reason for change

#### GraphQL API
I followed the following guide when designing mutations:
https://www.apollographql.com/blog/designing-graphql-mutations-e09de826ed97/
TLDR:
* Naming. Name your mutations verb first. Then the object, or “noun,” if applicable. Use camelCase.
* Specificity. Make mutations as specific as possible. Mutations should represent semantic actions that might be taken by the user whenever possible.
* Input object. Use a single, required, unique, input object type as an argument for easier mutation execution on the client.
* Unique payload type. Use a unique payload type for each mutation and add the mutation’s output as a field to that payload type.
* Nesting. Use nesting to your advantage wherever it makes sense.

The arguments given seem reasonable, though the part about single `input` argument and nesting felt
like overkill for simple tic-tac-toe which is not going to evolve at all, but hey, let's pretend
it will become the greatest tic-tac-toe service in the world. 

#### Database
A global service, InMemoryDb, serves as a database for the system - it's a simple implementation
storing objects in arrays. To migrate to a proper database BaseRepository would have to be 
rewritten, without touching other code - it has a simple, asynchronous interface.

#### Auth

Neither authentication nor authorization were given in the requirements,
but it seemed reasonable to have them to enable safe game creation, joining or making moves.
Therefore, a barebones user and password auth was implemented. The goal was to enable mentioned 
game features, not to be a comprehensive or safe solution.    

* only mutations require log in, read only endpoints and subscriptions are not protected
* password is hashed using bcrypt and stored in InMemoryDb
* a JWT token valid for 1 hour is returned, containing user id and email 

#### Code generation
I haven't used any code generation for GraphQL types or resolvers. It was just easier to start 
without it and for such simple service the pain of keeping TypeScript definitions in sync with GraphQL 
schema was bearable. I'd definitely look more into it if I had to expand the service.

#### PubSub
A simple in memory PubSub from Apollo is used with just one channel. So far it was fine to just pass
whole game model through it, "in the future" probably a simplified, specific event type would be nice.

#### Dependency injection and logging
Logs are structured (JSON) and allow tracing requests.

To associate logs with the request that triggered them, and the user which sent the request,
a child logger with these two field specified, and a child DI container, is created for every request.
All services which don't have to global singletons (basically everything except InMemoryDb)
are handled by this child container, allowing injection of a nicely preconfigured logger.

I wanted to keep resolvers in DI container and inject services into them, but I gave up after 
wrestling with it for some time. ApolloServer's constructor accepts resolvers as a static map at
app startup, and to use DI, I needed them to be created on per request basis. Therefore I had to 
resort to passing DI container in the context, and using it as a service locator in resolvers.

#### Code formatting
Prettier is set up in the project, together with Husky and lint-staged to automatically format code
before commits
