## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Docker:

```bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod

# run all tests in a docker container
yarn docker:test
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/api/v1.0/market/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /api/v1.0/market/auth/register` - register\
`POST /api/v1.0/market/auth/login` - login\
`POST /api/v1.0/market/auth/refresh-tokens` - refresh auth tokens\
`POST /api/v1.0/market/auth/forgot-password` - send reset password email\
`POST /api/v1.0/market/auth/reset-password` - reset password\
`POST /api/v1.0/market/auth/send-verification-email` - send verification email\
`POST /api/v1.0/market/auth/verify-email` - verify email

**User routes**:\
`POST /api/v1.0/market/users` - create a user\
`GET /api/v1.0/market/users` - get all users\
`GET /api/v1.0/market/users/:userId` - get user\
`PATCH /api/v1.0/market/users/:userId` - update user\
`DELETE /api/v1.0/market/users/:userId` - delete user

**Company routes**:\
`POST /api/v1.0/market/company/register` - Register a company\
`GET /api/v1.0/market/company/getall` - get all company details\
`GET /api/v1.0/market/company/info/:companyCode` - get company details\
`DELETE /api/v1.0/market/company/delete/:companyCode` - delete company

**Stocks routes**:\
`POST /api/v1.0/market/stock/add/:companyCode` - add a stock price for a specific company\
`GET /api/v1.0/market/stock/get/:companyCode/:startDate/:endDate` - get the specific stock price detail within the time frame for a specific company
