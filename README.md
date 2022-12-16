# M0ney42 - Expenses Tracker

An app to track your finances and check if you are spending within your budget.

## Features

- SingUp
- SingIn
- Create Expense (this page is the only one that has to be made thinking in the mobile, all the others should be made thinking in the PC)
  - Category
  - Title
  - Description
  - Value
  - Date
  - Installments (parcelas)
- Expenses History
  - Name of the month
    - Arrows to the left and right, where the user can see the previous or next month
  - Graph of the expenses per category (based on GuiaBolso)
  - List of expenses in order of creation (new -> old)
    - Category
    - Title
    - Value
    - Date
- Graphs
  - Donut Category Expenses
- Settings
  - Timezone
  - Language
- Budget
  - The user will be able to define a budget for all the categories, the budget works per month
  - #Category
    - #January - #Budget - #Button to copy budget (Calendly style)
    - ...

## Backend

- A function that runs every time that a expense is created / edited / deleted, to update the budget of the next month

## Database

### User

| column    | type   |
| --------- | ------ |
| id        | string |
| email     | string |
| password  | string |
| timezone  | string |
| language  | string |
| createdAt | string |

### Categories

| column | type   |
| ------ | ------ |
| id     | string |
| userId | string |
| name   | string |
| icon   | string |
| color  | string |

### Budget

| column     | type   |
| ---------- | ------ |
| id         | string |
| categoryId | string |
| userId     | string |
| month      | string |
| value      | number |
| balance    | number |

### Expense

| column            | type    | description                           |
| ----------------- | ------- | ------------------------------------- |
| id                | string  |                                       |
| categoryId        | string  |                                       |
| userId            | string  |                                       |
| createdAt         | Date    |                                       |
| value             | number  |                                       |
| title             | string  |                                       |
| description       | string? |                                       |
| expenseGroupId    | string? | used to identify related installments |
| installmentNumber | number? | Like 1 (of 10 installments)           |
| totalInstallments | number? | 10, 11, total installments            |
