Chat-Message
This program is designed to create a backend server for chat functionality and viewing conversation participants using NestJS and TypeScript. The server communicates with a client application via both REST API and WebSocket. While a client app isn’t required, either Swagger documentation or a Postman collection should be provided for request validation.

To test WebSocket, sample data and response examples for each request should be prepared. The source code should be uploaded to GitHub, with a link to the project. Docker usage is encouraged, and deploying the app on a host with a working example is a plus.

The server app should meet these functional requirements:

Launch Parameters: Run from the command line, accepting parameters for host, port, and DSN connection string for the database. If unspecified, these should default to .env file values.
Database Connection: Connect to a PostgreSQL database with the specified parameters. The database structure should be provided as a SQL dump in the project root.
JWT-Protected REST API: API methods require JWT authentication, generated via the /login endpoint with email and password.
Token Refreshing: A refresh token method should provide a new token when the current one expires.
API Methods

  View a list of chat participants
  Send a private message to a specific user
  Send a public message to all users
  Retrieve the message history with a specific user
  Retrieve public messages
(Both history endpoints should support large data sets with paginated loading)
WebSocket Integration:
  Authenticate users in WebSocket connections using a JWT token.
  Send a new token to the WebSocket after token refresh via REST API.
Message Handling via WebSocket: Handle new messages from users, ensuring private messages remain confidential.
Data Storage: Use PostgreSQL to store user credentials (email/password) and either PostgreSQL or MongoDB for user messages, at the developer's discretion.
  Use DTOs.
Additional recommended features:

Docker deployment with "one-click" setup
A fully deployed and ready-to-use app is a significant plus
Comprehensive testing (REST API + WebSocket), with a provided Postman collection
Code formatting with Prettier
Database migration mechanisms (seeds, scripts for initializing database structure)
Console logging with NestJS's built-in logger
Clear project documentation (including deployment instructions).

Step-by-step Manuall:

1. Download and Install PostgreSQL (https://www.postgresql.org/download/)
2. Dowload and Install Docker (https://www.docker.com/products/docker-desktop/)
3. Dowload and Install Visual Studio Code (https://code.visualstudio.com/download)

4. Download the Gitlab Project (the fastest way):
4.1   Open Visual Studio Code.
4.2   Open link (https://gitlab.abcloudz.com/student_projects/Ivan_Shtepa_NodeJS)
4.3   Click on the blue button "Clone", you will see a dropdown list. 
      Choose "Open in your IDE" -> Visual Studio Code (HTTPS).
      After that you will download a project from "Ivan Shtepa NodeJS"
5. In the downloaded project find file docker-compose.yml
5.1   

commands to check project
cd path_to_project
tree

After that you will this:
C:.
├───db
│   └───migrations
│       └───trash-bin
├───dist
│   ├───db
│   │   └───migrations
│   └───src
│       ├───auth
│       │   └───dto
│       ├───config
│       ├───filters
│       ├───messages
│       │   ├───dto
│       │   ├───entity
│       │   └───gateway
│       ├───routes
│       ├───socket
│       │   ├───dto
│       │   └───entity
│       └───utils
├───src
│   ├───auth
│   │   └───dto
│   ├───config
│   ├───filters
│   ├───messages
│   │   ├───dto
│   │   ├───entity
│   │   └───gateway
│   ├───routes
│   ├───socket
│   ├───user
│   │   ├───dto
│   │   └───entity
│   └───utils
└───test


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
