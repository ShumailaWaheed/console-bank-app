#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
class BankAccount {
    accountNumber;
    accountBalance;
    firstName;
    lastName;
    age;
    gender;
    cnic;
    constructor(accountNumber, initialBalance, firstName, lastName, age, gender, cnic) {
        this.accountNumber = accountNumber;
        this.accountBalance = initialBalance;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.gender = gender;
        this.cnic = cnic;
    }
    getAccountNumber() {
        return this.accountNumber;
    }
    debit(amount) {
        if (amount <= 0) {
            return chalk.red("The amount you entered is invalid!");
        }
        if (this.accountBalance >= amount) {
            this.accountBalance -= amount;
            return chalk.green(`Transaction done successfully! New account balance is ${this.accountBalance}`);
        }
        else {
            return chalk.red("You don't have enough money to do this transaction.");
        }
    }
    credit(amount) {
        if (amount <= 0) {
            return chalk.red("The amount you entered is invalid!");
        }
        this.accountBalance += amount;
        if (amount > 100) {
            this.accountBalance -= 1; // Fee for large deposits
        }
        return chalk.green("Your account has been credited successfully!");
    }
    getBalance() {
        return chalk.blue(`Current balance: ${this.accountBalance}`);
    }
    // Method to show only name, account number, and balance
    getDetails() {
        return `
        Name: ${this.firstName} ${this.lastName}
        Account Number: ${this.accountNumber}
        ${this.getBalance()}
        `.trim();
    }
}
class Bank {
    accounts = new Map();
    createAccount(initialBalance, firstName, lastName, age, gender, cnic) {
        const accountNumber = this.generateRandomAccountNumber();
        this.accounts.set(accountNumber, new BankAccount
            (accountNumber, initialBalance, firstName, lastName, age, gender, cnic));
        // Use chalk to style the message
        return `
        ${chalk.green("Congratulations! Your account has been created successfully.")}
        ${chalk.yellow(`Your account number is ${accountNumber}`)}
        ${chalk.blue(`Initial balance: ${initialBalance}`)}
        `.trim();
    }
    viewAccount(accountNumber) {
        const account = this.accounts.get(accountNumber.trim());
        if (account) {
            return account.getDetails();
        }
        else {
            return chalk.red("Account not found!");
        }
    }
    getAccount(accountNumber) {
        return this.accounts.get(accountNumber.trim());
    }
    generateRandomAccountNumber() {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Generate a 10-digit number
    }
}
const bank = new Bank();
const questions = [
    {
        type: "list",
        name: "action",
        message: "Select an option:",
        choices: ["Create Account", "View Account Details", "Debit", "Credit", "Exit"]
    },
    {
        type: "input",
        name: "firstName",
        message: "Enter your first name:",
        when: (answers) => answers.action === "Create Account"
    },
    {
        type: "input",
        name: "lastName",
        message: "Enter your last name:",
        when: (answers) => answers.action === "Create Account"
    },
    {
        type: "number",
        name: "age",
        message: "Enter your age:",
        when: (answers) => answers.action === "Create Account"
    },
    {
        type: "list",
        name: "gender",
        message: "Enter your gender:",
        choices: ["Male", "Female", "Other"],
        when: (answers) => answers.action === "Create Account"
    },
    {
        type: "input",
        name: "cnic",
        message: "Enter your CNIC number:",
        when: (answers) => answers.action === "Create Account",
        validate: (input) => {
            return input.trim().length === 13 ? true : "CNIC number must be exactly 13 digits long";
        }
    },
    {
        type: "number",
        name: "initialBalance",
        message: "Add initial balance:",
        when: (answers) => answers.action === "Create Account",
        validate: (input) => {
            return !isNaN(input) && input > 0 ? true : "Initial balance must be a positive number";
        }
    },
    {
        type: "input",
        name: "accountNumber",
        message: "Enter your account number:",
        when: (answers) => answers.action === "View Account Details" || answers.action === "Debit" || answers.action === "Credit",
        validate: (input) => {
            return input.trim().length >= 10 ? true : "Account number must be at least 10 digits long";
        }
    },
    {
        type: "input",
        name: "cardNumber",
        message: "Enter your card number:",
        when: (answers) => answers.action === "Credit" || answers.action === "Debit",
        validate: (input) => {
            return input.trim().length === 16 ? true : "Card number must be 16 digits long";
        }
    },
    {
        type: "input",
        name: "pinCode",
        message: "Enter your PIN code:",
        when: (answers) => answers.action === "Credit" || answers.action === "Debit",
        validate: (input) => {
            return input.trim().length === 4 ? true : "PIN code must be 4 digits long";
        },
        mask: "*"
    },
    {
        type: "number",
        name: "amount",
        message: "Enter amount:",
        when: (answers) => answers.action === "Credit" || answers.action === "Debit",
        validate: (input) => {
            return input > 0 ? true : "Amount must be a positive number";
        }
    }
];
const handleAction = async () => {
    const answers = await inquirer.prompt(questions);
    switch (answers.action) {
        case "Create Account":
            console.log(bank.createAccount(parseFloat(answers.initialBalance), 
            answers.firstName, answers.lastName, parseInt(answers.age), answers.gender, answers.cnic));
            break;
        case "View Account Details":
            console.log(bank.viewAccount(answers.accountNumber.trim()));
            break;
        case "Credit":
        case "Debit":
            const account = bank.getAccount(answers.accountNumber.trim());
            if (account) {
                const result = answers.action === "Credit"
                    ? account.credit(parseFloat(answers.amount))
                    : account.debit(parseFloat(answers.amount));
                console.log(result);
            }
            else {
                console.log(chalk.red("Account not found!"));
            }
            break;
        case "Exit":
            console.log(chalk.yellow("Thank you for using the bank application!"));
            return;
    }
    handleAction(); // Repeat for further actions
};
handleAction();
