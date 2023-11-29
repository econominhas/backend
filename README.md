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

## Third party Urls

### Dev

- [Google](https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&client_id=489785083174-0rqt9bc7l9t09luor3fc16h21kdf57q7.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8081&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&access_type=offline&state=1234_purpleGoogle&prompt=consent&authuser=1&service=lso&o2v=2&theme=glif&flowName=GeneralOAuthFlow)

## Useful commands

| Command         | Description                                                 |
| --------------- | ----------------------------------------------------------- |
| `start:dev`     | Run the project with all it's dependencies locally          |
| `openapi:serve` | Serve the API docs locally so you can validate your changes |
| `db:prisma`     | Update the ORM types                                        |

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
