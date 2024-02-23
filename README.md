# Econominhas - Expenses Tracker

An app to track your finances and check if you are spending within your budget.

## About

This project use lot's of tools to be as efficient as possible, here's the list with the links that you need to learn more about them.

### Linting & Formatting

- [husky](https://typicode.github.io/husky/) to run commands before commit
- [lint-staged](https://www.npmjs.com/package/lint-staged) to lint and format modified files before commit
- [editorconfig](https://editorconfig.org/) to help with linting
- [typescript](https://www.typescriptlang.org/) to enforce type check and be easier to write self explanatory code
- [eslint](https://eslint.org/) find and fix problems in the code
- [prettier](https://prettier.io/) beautify code

### Help Development

- [localstack](https://www.localstack.cloud/) to simulate AWS environment locally
- [docker](https://www.docker.com/) & [docker-compose](https://docs.docker.com/compose/) to orchestrate (to "run") the api, database, localstack and all the heavy-external tools that we need to make the project work
- [nestjs](https://nestjs.com/) framework to help with dependency injection and make the code more readable
- [github actions](https://docs.github.com/en/actions) to run pipelines to deploy and validate things

### Documentation

- [prisma](https://www.prisma.io/) to document the database, generate the migrations, and communicate with the database (project's ORM)
- [dbdocs](https://dbdocs.io/) to host the database docs
- [openapi](https://www.openapis.org/) to document the API routes
  - We don't document the API using the code to don't bind us to any library or framework, this way we can be more tool agnostic and use the default way to document APIs: OpenAPI
- [redocly](https://redocly.com/) to host the API docs

## Hosted Docs

- [API](https://wise-bulldog-88.redoc.ly/)
- [Database](https://dbdocs.io/henriqueleite42/Econominhas?view=relationships)

## Useful commands

| Command                   | Description                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `start:dev`               | Run the project with all it's dependencies locally                                                                             |
| `openapi:serve`           | Serve the API docs locally so you can validate your changes                                                                    |
| `openapi:postman`         | Generate Postman json file (at `openapi/postman.json`)                                                                         |
| `lint:prisma`             | Lint prisma schema                                                                                                             |
| `db:prisma`               | Update the ORM types (You need to run this every time that you change `prisma/schema.prisma`)                                  |
| `test`                    | Run tests                                                                                                                      |
| `test:cov`                | Run tests and collect coverage                                                                                                 |
| `db:migrate`              | Run the migrations                                                                                                             |
| `db:gen-migration <name>` | Generates a new migration based on the schema-database difference (you must run `start:dev` and `db:migrate` before run this!) |

## How to create a migration

- Run `yarn start:db`
- In another tab, run `yarn db:gen-migration <migration name>`

## Teams

The teams names are based on different currencies around the world, but the countries that they are used don't have any influence on the things that the teams works on.

| Team  | Responsible for | Full list                                                           |
| ----- | --------------- | ------------------------------------------------------------------- |
| Real  | Auth            | Accounts, SignInProvider, MagicLink, RefreshToken, TermsAndPolicies |
| Franc | Profile         | Configs, Salary                                                     |
| Yuan  | Transactions    | Transactions, Recurrent transactions                                |
| Peso  | Cards           | Cards, Card Providers, Cards Bills                                  |
| Rand  | Bank Accounts   | Bank Accounts, Bank Providers, Subscriptions                        |
| Rupee | Budgets         | Budgets, Categories                                                 |

## Process to develop a new feature

The following documentation is to help you to understand the development process of every feature. It's a general documentation that should **cover everything** in the feature creation process, **not all steps are required for every feature**, so make sure to only follow the ones that your context needs.

The documentation is trying to achieve: **1 step = 1 task = 1 PR**.

### Planning & Documentation

This phase is the most important one, here we define exactly what we want to develop and how we are gonna to develop it.

All the changes, validations, usecases, flows, conditions, etc must be defined and documented here.

<table>
	<thead>
		<tr>
			<th>Description</th>
			<th>Assigners</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				Create a <b>Story</b> describing what we want to achieve
			</td>
			<td>
				<b>PRODUCT OWNER</b>
			</td>
		</tr>
		<tr>
			<td>
				Architect a technical solution to achieve our goal and create tasks to document the API and Database changes
				</br>
				</br>
				After this step, a estimation of time to develop this should be delivered to the <b>PRODUCT OWNER</b>, so he can decide if when this story should be done.
			</td>
			<td>
				<b>ARCHITECT</b>
				AND
				<b>DATABASE ENGINEER</b>
			</td>
		</tr>
		<tr>
			<td>
				Create a new branch for the story, following the pattern <code>story/[story-id]</code>,
				</br>
				</br>
				All the next steps must be done in branches derived from this branch, following the patter <code>task/[task-id]</code>.
			</td>
			<td>
				<b>ARCHITECT</b>
			</td>
		</tr>
		<tr>
			<td>
				Update the database docs in <code>./prisma/schema.prisma</code> and write the tasks to apply these changes on the code
			</td>
			<td>
				<b>DATABASE ENGINEER</b>
			</td>
		</tr>
		<tr>
			<td>
				Update the API docs in <code>./openapi/*</code> and write the tasks to apply these changes on the code
			</td>
			<td>
				<b>ARCHITECT</b>
			</td>
		</tr>
	</tbody>
</table>

### Execution

This phase is were we convert the documentation to code and make everything works.

<table>
	<thead>
		<tr>
			<th>Description</th>
			<th>Assigners</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				If we need to use any external libraries, create an <i>adapter</i> in <code>./src/adapters/*.ts</code> to wrap it and make it easier to change this dependency.
			</td>
			<td>
				<b>DEVELOPER</b>
			</td>
		</tr>
		<tr>
			<td>
				Create or update the related entity <i>models</i> in <code>./src/models/*.ts</code>
			</td>
			<td>
				<b>DEVELOPER</b>
			</td>
		</tr>
		<tr>
			<td>
				Create or update the related entity <i>repository</i> in <code>./src/repositories/**/*-repository.{module,service}.ts</code> following the entity's module specification
				</br>
				</br>
				<b>Obs:</b> Remember to also write the unitary tests.
			</td>
			<td>
				<b>DEVELOPER</b>
			</td>
		</tr>
		<tr>
			<td>
				Create or update the related entity <i>usecase</i> in <code>./src/usecases/**/*.{module,service}.ts</code> following the entity's module specification
				</br>
				</br>
				<b>Obs1:</b> Remember to also add the <i>usecase's</i> module to the <code>imports</code> list of <code>./src/app.module.ts</code>.
				</br>
				<b>Obs2:</b> Remember to also write the unitary tests.
			</td>
			<td>
				<b>DEVELOPER</b>
			</td>
		</tr>
		<tr>
			<td>
				Update the related entity <i>controller</i> in <code>./src/delivery/*.controller</code>
				</br>
				</br>
				<b>Obs1:</b> Remember to also add this controller to the <i>usecase's</i> module.
				</br>
				<b>Obs2:</b> Remember to also write the unitary tests.
			</td>
			<td>
				<b>DEVELOPER</b>
			</td>
		</tr>
	</tbody>
</table>

### Running the API for the first time

1. Copy and paste <code>.env.example</code> and rename the copy to <code>.env</code>
2. Run <code>yarn start:dev</code>
3. Run econominhas-api migrations
   - Step 2.1: List id container Run<code>docker ps</code>
   - Step 2.2: Run <code>docker exec -it \<container id\> sh</code>
   - Step 2.3: Run <code>yarn db:migrate</code>
4. Available at http://localhost:3000/v1

<br/>
