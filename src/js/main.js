//Returns an array with all the expenses
function getExpenses() {
    let expenses = JSON.parse(localStorage.getItem("expenses"));
    if (!expenses) {
        expenses = [];
    }
    return expenses;
}

//returns the selected currency
function getCurrency() {
    let currency = localStorage.getItem('currency');
    if (!currency) {
        currency = 'USD';
        localStorage.setItem('currency', 'USD');
    }
    return currency;
}

// Add a invisible row to the expenses table
// this row will be use to edit an expense
function addUpdateRow(expense){
    let row = document.createElement("tr");
    let date = document.createElement("td");
    let title = document.createElement("td");
    let amount = document.createElement("td");
    let tag = document.createElement("td");
    let action = document.createElement("td");

    row.className = "table_row";
    row.id = "update-row_" + expense.position;
    row.style = "display: none";
    date.innerHTML = `
                    <input
                        type="date"
                        class="expense_input"
                        id="expense_input_date_${expense.position}"
                        value=${expense.date}
                    />`;
    title.innerHTML = `<input
                        type="text"
                        value=${expense.title}
                        class="expense_input"
                        id="expense_input_title_${expense.position}"
                    />`;
    amount.innerHTML = `
                    <input
                        type="number"
                        value=${expense.amount}
                        class="expense_input"
                        id="expense_input_amount_${expense.position}"
                    />`;
    tag.innerHTML = `<select class="expense_input" id="select_tags_${expense.position}"></select>`;
    action.classList = 'expense_action';
    action.innerHTML = `<button
                        class='btn_expense btn_expense--chg'
                        onclick="updateRow(${expense.position})"
                    ><i class="fa fa-check" aria-hidden="true"></i></button>`;
    action.innerHTML += `<button
                        class='btn_expense btn_expense--del'
                        onclick="hideUpdateRow(${expense.position})"
                    ><i class="fa fa-ban" aria-hidden="true"></i></button>`;

    row.appendChild(date);
    row.appendChild(title);
    row.appendChild(amount);
    row.appendChild(tag);
    row.appendChild(action);

    return row;

}


//  Generate the table with all the expenses
function updateExpenses(expenses) {
    document.getElementById("Expense_list").children[1].innerHTML = "";

    expenses.forEach((expense) => {
        let row = document.createElement("tr");
        let date = document.createElement("td");
        let title = document.createElement("td");
        let amount = document.createElement("td");
        let tag = document.createElement("td");
        let action = document.createElement("td");

        row.className = "table_row";
        row.id = "display-row_" + expense.position;
        date.innerHTML = expense.date;
        title.innerHTML = expense.title;
        amount.innerHTML = expense.amount;
        tag.innerHTML = expense.tag;
        action.classList = 'expense_action';
        action.innerHTML = `<button
                            class='btn_expense btn_expense--del'
                            onclick="deleteRow(${expense.position})"
                        ><i class="fa fa-trash" aria-hidden="true"></i></button>`;
        action.innerHTML += `<button
                            class='btn_expense btn_expense--chg'
                            onclick="showUpdateRow(${expense.position})"
                        ><i class="fa fa-pencil" aria-hidden="true"></i></button>`;

        row.appendChild(date);
        row.appendChild(title);
        row.appendChild(amount);
        row.appendChild(tag);
        row.appendChild(action);

        document.getElementById("Expense_list").children[1].appendChild(row);
        document.getElementById("Expense_list").children[1].appendChild(addUpdateRow(expense));
        updateTagsRow(getTags(), expense.position, expense.tag);
        
    });
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

//Return an aray with all the tags
function getTags() {
    let tags = JSON.parse(localStorage.getItem("tags"));
    if (!tags) {
        tags = [];
    }
    return tags;
}

//Add the tags to the selector in the left column
function updateTags(tags) {
    document.getElementById("select_tags").innerHTML = "";
    tags.forEach((tag) => {
        let opt = document.createElement("option");
        opt.innerHTML = tag;
        opt.value = tag;
        document.getElementById("select_tags").appendChild(opt);
    });
}

//Add the tags to the selector in the left column
function updateCurrencies() {
    document.getElementById("select_currency").innerHTML = "";
    currencies.response.forEach((currency) => {
        let opt = document.createElement("option");
        opt.innerHTML = currency.name;
        opt.value = currency.short_code;
        document.getElementById("select_currency").appendChild(opt);
    });
    document.getElementById("select_currency").value = getCurrency();
}

//Add the tags to a selector in the table
function updateTagsRow(tags, expensePos, tag) {
    document.getElementById("select_tags_"+expensePos).innerHTML = "";
    tags.forEach((tag) => {
        let opt = document.createElement("option");
        opt.innerHTML = tag;
        opt.value = tag;
        document.getElementById("select_tags_"+expensePos).appendChild(opt);
    });
    document.getElementById("select_tags_"+expensePos).value = tag;
}

//Return the value of all the expenses added
function calculateTotalExpenses(expenses) {
    let total_expenses = 0;
    expenses.forEach(expense => {
        total_expenses += Number(expense.amount);
    });
    return total_expenses;
}

//Update the values of the badges 
function updateBadges () {
    document.getElementById("Total_budget").children[0].innerHTML =
        localStorage.getItem("Total_budget");
    document.getElementById("Total_expense").children[0].innerHTML = Math.round(calculateTotalExpenses(getExpenses()) * 100) / 100;
    let budget_left = Math.round((Number(localStorage.getItem("Total_budget")) - Number(calculateTotalExpenses(getExpenses()))) * 100) / 100;
    if (budget_left <= 0){
        document.getElementById("budget_state").innerHTML = "⚠️ You are over the budget! ⚠️";
        document.getElementById("budget_state").style = "color: red;";
    } else {
        document.getElementById("budget_state").innerHTML = "😁 You are whitin the budget! 😁";
        document.getElementById("budget_state").style = "color: green;";
    }
    document.getElementById("Budget_left").children[0].innerHTML = budget_left;
}


//on load:
window.onload = () => {
    //load top badges
    updateBadges();

    //get tags
    updateTags(getTags());

    //get expenses
    updateExpenses(getExpenses());

    //get currencies
    updateCurrencies();


    document.getElementById("expense_input_date").valueAsDate = new Date();
};

// Changes the total budget
document.getElementById("budget_btn").addEventListener("click", () => {
    if (document.getElementById("budget_input").value == ''){
        alert(`the budget can't be empty`);
        return;
    }
    localStorage.setItem(
        "Total_budget",
        (total_budget = document.getElementById("budget_input").value)
    );
    updateBadges();

});

// Add tags
document.getElementById("tag_btn--add").addEventListener("click", () => {
    if (document.getElementById("tag_input").value == "") return;
    let tags = getTags();
    if (tags.indexOf(document.getElementById("tag_input").value) == -1) {
        tags.push(document.getElementById("tag_input").value);
    } else {
        alert("This tag already exists!");
    }
    updateTags(tags);
    localStorage.setItem("tags", JSON.stringify(tags));
});

// Delete tags
document.getElementById("tag_btn--del").addEventListener("click", () => {
    if (document.getElementById("tag_input").value == "") return;
    let tags = getTags();

    if (tags.indexOf(document.getElementById("tag_input").value) > -1) {
        console.log(tags.indexOf(document.getElementById("tag_input").value));
        tags.splice(
            tags.indexOf(document.getElementById("tag_input").value),
            1
        );
        updateTags(tags);
    }
});

// Add expense

document.getElementById("expense_btn").addEventListener("click", () => {
    if (
        document.getElementById("expense_input_title").value == "" ||
        document.getElementById("expense_input_amount").value == "" ||
        document.getElementById("select_tags").value == "" ||
        document.getElementById("expense_input_date").value == ""
    )
        return;
    let expenses = getExpenses();
    expenses.push({
        title: document.getElementById("expense_input_title").value,
        amount: document.getElementById("expense_input_amount").value,
        tag: document.getElementById("select_tags").value,
        date: document.getElementById("expense_input_date").value,
        position: expenses.length,
    });

    updateExpenses(expenses);
    updateBadges();
});

// Delete expense
function deleteRow(expensePos) {
    let expenses = getExpenses();
    let result = expenses.filter(expense => expense.position != expensePos);
    updateExpenses(result);
}

// shows Update Row
function showUpdateRow(expensePos) {
    document.getElementById('update-row_'+expensePos).style.display = 'table-row';
    document.getElementById('display-row_'+expensePos).style.display = 'none';
}

function updateRow(expensePos) {
    let expenses = getExpenses();
    let updateExpense = {
        title: document.getElementById("expense_input_title_"+expensePos).value,
        amount: document.getElementById("expense_input_amount_"+expensePos).value,
        tag: document.getElementById("select_tags_"+expensePos).value,
        date: document.getElementById("expense_input_date_"+expensePos).value,
        position: expensePos,
    };
    expenses[expensePos] = updateExpense

    updateExpenses(expenses);
    updateBadges();
}

// hide Update Row
function hideUpdateRow(expensePos) {
    document.getElementById('update-row_'+expensePos).style.display = 'none';
    document.getElementById('display-row_'+expensePos).style.display = 'table-row';
}

//Currency exchange
document.getElementById('currency_btn').addEventListener('click', async () => {
    const oldCurrency = localStorage.getItem('currency');
    const newCurrency = document.getElementById('select_currency').value;
    if (oldCurrency == newCurrency)
        return;
    await fetch('https://api.currencybeacon.com/v1/latest?' + new URLSearchParams({
        api_key: API,
        base: oldCurrency,
    }).toString()).then(response => response.json())
    .then(data => {
        let rates = data.rates;
        localStorage.setItem('Total_budget', Math.round(localStorage.getItem('Total_budget')*rates[newCurrency] * 100) / 100 );
        let expenses = getExpenses();
        expenses.forEach((expense => {
            expense.amount = Math.round(expense.amount*rates[newCurrency] * 100) / 100;
        }));
        updateExpenses(expenses);
        updateBadges();
    });


    localStorage.setItem('currency', newCurrency);
});

// Export Data:

document.getElementById('export_btn').addEventListener('click', () => {
    const JSONData = {
        'Total_budget': localStorage.getItem('Total_budget'),
        'expenses': localStorage.getItem('expenses'),
        'tags': localStorage.getItem('tags'),
        'currency': localStorage.getItem('currency')
    };
    const data = JSON.stringify(JSONData);
    const blob = new Blob([data], { type: "application/json" });
    const jsonObjectUrl = URL.createObjectURL(blob);
    const filename = "MonthlyExpenses.json";
    const anchorEl = document.createElement("a");
    anchorEl.href = jsonObjectUrl;
    anchorEl.download = filename;
    anchorEl.click();
    URL.revokeObjectURL(jsonObjectUrl);
});

document.getElementById('import_file').addEventListener('change', () => {
    if (document.getElementById('import_file').files.length > 0) {
        var reader = new FileReader();
        const blob = new Blob([document.getElementById('import_file').files[0]], {type:"application/json"});
        console.log(blob);
        reader.addEventListener("load", e => {
            const result = JSON.parse(reader.result);
            
            localStorage.setItem('Total_budget', result['Total_budget']);
            localStorage.setItem('expenses', result['expenses']);
            localStorage.setItem('tags', result['tags']);
            localStorage.setItem('currency', result['currency']);
            location.reload();
          });
          
          reader.readAsText(blob);
    }
});