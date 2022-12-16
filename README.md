# Econominhas - Expenses Tracker

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
- A way to create expenses that repeat every month, every 2 months, as the user wishes

## Backend Functions

- A function that runs every time that a expense is created / edited / deleted, to update the budget of the next month
- A function that runs every first day of the year, to clone the Budgets for the next year
- Create user (auth0?)
  - email, password
  - email unique
- Login (auth0?)
  - email, password
- Create expense
  - if the expense has multiple installments, create the expenses for the next months
- Edit expense
  - Option to apply only to the expense, to all expenses related or to the expense all all next expenses related (something like google calendar when you edit an event that repeats itself)
- Delete expense
  - Option to apply only to the expense, to all expenses related or to the expense all all next expenses related (something like google calendar when you edit an event that repeats itself)
- List monthly expenses
  - Optional params:
    - month (2022-01)
    - categoryId
    - walletId
    - creditCardId
  - Returns:
```json
{
  "categories": {
    "<category-id>": {
      "name": "string",
      "icon": "string",
      "color": "string"
    }
  },
  "expenses": [
    {
      "id": "uuid",
      "categoryId": "uuid / none",
      "createdAt": "2022-12-16T16:10:28.033Z",
      "value": 0,
      "title": "string",
      "description": "string",
      "installmentGroupId": "uuid",
      "installmentNumber": 0,
      "totalInstallments": 0,
    }
  ]
}
```

## Database

### User

| column      | type   |
| ----------- | ------ |
| id          | string |
| email       | string |
| password    | string |
| timezone    | string |
| language    | string |
| currency    | string |
| expenseType | string |
| createdAt   | string |

### Wallet

| column    | type   |
| --------- | ------ |
| id        | string |
| userId    | string |
| name      | string |
| color     | string |
| icon      | string |
| balance   | number |
| createdAt | string |

### Credit Card

| column    | type   |
| --------- | ------ |
| id        | string |
| userId    | string |
| name      | string |
| color     | string |
| icon      | string |
| credit    | number |
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

| column             | type    | description                           |
| ------------------ | ------- | ------------------------------------- |
| id                 | string  |                                       |
| categoryId         | string? |                                       |
| walletId           | string  |                                       |
| creditCardId       | string? |                                       |
| userId             | string  |                                       |
| createdAt          | Date    |                                       |
| paidAt             | Date    |                                       |
| value              | number  |                                       |
| title              | string  |                                       |
| description        | string? |                                       |
| installmentGroupId | string? | used to identify related installments |
| installmentNumber  | number? | Like 1 (of 10 installments)           |
| totalInstallments  | number? | 10, 11, total installments            |

## Connect to banks

https://pluggy.ai/en