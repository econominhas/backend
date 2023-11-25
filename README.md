# Econominhas - Expenses Tracker

An app to track your finances and check if you are spending within your budget.

## Docs

- [API](https://wise-bulldog-88.redoc.ly/)
- [Database](https://dbdocs.io/henriqueleite42/Econominhas?view=relationships)

## Process to develop a new feature

> Obs: Only follow the steps if they are necessary, example: If a feature doesn't require any database update, you can skip the steps related to database

> Obs: Each step probably represents 1 PR and 1 task.

1. The **DATABASE ENGINEER** will update the database docs in `./prisma/schema.prisma`
2. The **ARCHITECT** will update the API docs in `./openapi/*`
3. The **DEVELOPERS** will create or update the related entity _models_ in `./src/models/*.ts` following the specifications in the database and API docs.
4. The **DEVELOPERS** will create or update the related entity _repository_ in `./src/repositories/**/*-repository.{module,service}.ts` following the entity's module specification.
   1. Remember to also write the unitary tests.
5. The **DEVELOPERS** will create or update the related entity _usecase_ in `./src/usecases/**/*.{module,service}.ts` following the entity's module specification.
   1. Remember to also add the _usecase's_ module to the `imports` list of `./src/app.module.ts`.
   2. Remember to also write the unitary tests.
6. The **DEVELOPERS** will .
   1. Remember to also add this controller to the _usecase's_ module.
   2. Remember to also write the unitary tests.

> TODO: Add extra steps, like creation of adapters

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
				Architect a solution to achieve our goal and created tasks to document the API and Database changes
			</td>
			<td>
				<b>ARCHITECT</b>
				,
				<b>DATABASE ENGINEER</b>
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
		<tr>
			<td>
				<i>End of thinking process and start of the development process</i>
			</td>
			<td></td>
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
			</td>
			<td>
				<b>DEVELOPER</b>
			</td>
		</tr>
		<tr>
			<td>
				Create or update the related entity <i>usecase</i> in <code>./src/usecases/**/*.{module,service}.ts</code> following the entity's module specification
			</td>
			<td>
				<b>DEVELOPER</b>
			</td>
		</tr>
		<tr>
			<td>
				Update the related entity <i>controller</i> in <code>./src/delivery/*.controller</code>
			</td>
			<td>
				<b>DEVELOPER</b>
			</td>
		</tr>
	</tbody>
</table>

> TODO: Find a better way to document this
