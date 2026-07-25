# Amass - System Requirements

## Functional Requirements

FR1: The system shall allow a user to register with email and password.
FR2: The system shall allow a user to log in and log out securely.
FR3: The system shall allow a user to add an income entry with amount, date, and source.
FR4: The system shall allow a user to add an expense entry with amount, category, date, and optional note.
FR5: The system shall allow a user to edit or delete an existing transaction.
FR6: The system shall display a dashboard summarizing total income, total expenses, and remaining balance.
FR7: The system shall display a chart of expenses grouped by category.
FR8: The system shall allow a user to set a monthly budget limit per category.
FR9: The system shall display how much of each category's budget has been used.
FR10: The system shall allow a user to create and manage savings goals by specifying a goal name, target amount, and target date.
FR11: The system shall display the user's progress toward each savings goal based on their current saved amount and target amount.
FR12: The system shall generate a monthly financial report summarizing total income, total expenses, savings, and spending by category for the selected month.
FR13: The system shall provide a predefined list of expense and income categories (e.g., Food, Transport, Bills, Entertainment, Salary, Allowance) for users to select from when adding a transaction.

## Non-Functional Requirements

NFR1: The system shall store user passwords in encrypted (hashed) form, never in plain text.
NFR2: The system shall restrict users to viewing and editing only their own financial data.
NFR3: The system shall display dashboard data within 3 seconds under normal operating conditions.
NFR4: The system shall provide a transaction entry flow completable in 3 taps/clicks or fewer.
NFR5: The system shall not lose any submitted transaction data due to a network or server error.
NFR6: The system shall be accessible via any modern web browser without requiring installation.
NFR7: The system shall be responsive and usable on both desktop and mobile screen sizes.
NFR8: The system shall automatically back up user data at regular intervals to prevent data loss.
NFR9: The system shall support at least 1,000 registered users and 100,000 transactions without significant performance degradation.
NFR10: The system shall be available to users at least 99% of the time, excluding scheduled maintenance.