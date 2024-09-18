const addBtn = document.getElementById('addBtn');
const date = document.getElementById('date');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const dateUpdate = document.getElementById('dateUpdate');
const desUpdate = document.getElementById('desUpdate');
const amountUpdate = document.getElementById('amountUpdate');
const updateBtn = document.getElementById('updateBtn');
const totalExpenseSpan = document.getElementById('totalExpense');
const expenseAverage = document.getElementById('expenseAverage');
const highestExpense = document.getElementById('highestExpense');
const totalEntry = document.getElementById('totalEntry')

let currentUpdateIndex = null;
let totalEntries = 0;

let expenseList = [];

addBtn.addEventListener('click', function (e) {
    e.preventDefault();
    let expense = {
        date: date.value,
        description: description.value,
        amount: amount.value
    };




    if (expense.date === '' || expense.description === '' || expense.amount === '') {
        return;
    }

    expenseList.push(expense);

    totalEntries++

    showExpenses();
    ExpenseSummary();

    date.value = '';
    description.value = '';
    amount.value = '';

})

function showExpenses() {
    const list = document.getElementById('list')
    list.innerHTML = '';

    expenseList.forEach((expense, position) => {
        const html = `<tr class="text-left border-b-[1px] border-b-gray-300 py-4">
        <td >${expense.date}</td>
        <td>${expense.description}</td><td>${expense.amount}</td>   
        <td class="flex flex-col gap-2 md:flex-row py-1">
        <button class="py-1 px-1 bg-red-500 text-[0.7rem] rounded-md font-bold" onclick="deleteExpense(${position})">Delete</button>
        <button class="py-1 px-1 bg-blue-500 text-[0.7rem] rounded-md font-bold" onclick="showModal(${position})">Update</button></td></tr>`
        list.innerHTML += html;
    })
}

function deleteExpense(position) {
    if (confirm('Are you sure you want to delete this record?')) {
        totalEntries--
        expenseList.splice(position, 1)
        showExpenses();
        ExpenseSummary();
    }
}

function showModal(position) {
    const modal = document.getElementById('modal')
    const overlay = document.getElementById('overlay')

    modal.classList.remove('hidden')
    overlay.classList.remove('hidden')

    console.log(expenseList[position])
    currentUpdateIndex = position;

    dateUpdate.value = expenseList[position].date
    desUpdate.value = expenseList[position].description
    amountUpdate.value = expenseList[position].amount


}

updateBtn.addEventListener('click', updateExpense)

function updateExpense() {
    expenseList[currentUpdateIndex].date = dateUpdate.value
    expenseList[currentUpdateIndex].description = desUpdate.value
    expenseList[currentUpdateIndex].amount = amountUpdate.value

    modal.classList.add('hidden')
    overlay.classList.add('hidden')
    alert('Expense Updated');

    showExpenses();
    ExpenseSummary();
}

function ExpenseSummary() {
    console.log(expenseList)
    let totalExpense = 0;
    let averageExpense = 0;
    let highExpense = 0;
    expenseList.forEach(expense => {
        if (highExpense < Number(expense.amount)) {
            highExpense = Number(expense.amount);
        }
        totalExpense += Number(expense.amount);
        averageExpense = totalExpense / expenseList.length;
    })
    totalExpenseSpan.textContent = `$${totalExpense}`
    expenseAverage.textContent = `$${averageExpense}`
    highestExpense.textContent = `$${highExpense}`
    totalEntry.textContent = totalEntries;
    console.log(totalExpense)
}