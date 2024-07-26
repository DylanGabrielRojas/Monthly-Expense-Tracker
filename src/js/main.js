function getExpenses() {
    let expenses = JSON.parse(localStorage.getItem("expenses"));
    if (!expenses) {
        expenses = [];
    }
    return expenses;
}

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
                        onclick="deleteRow(${expense.position})"
                    >Update</button>`;
    action.innerHTML += `<button
                        class='btn_expense btn_expense--del'
                        onclick="revertUpdateRow(${expense.position})"
                    >Cancel</button>`;

    row.appendChild(date);
    row.appendChild(title);
    row.appendChild(amount);
    row.appendChild(tag);
    row.appendChild(action);

    return row;

}

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
                        >Delete</button>`;
        action.innerHTML += `<button
                            class='btn_expense btn_expense--chg'
                            onclick="updateRow(${expense.position})"
                        >Edit</button>`;

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

function getTags() {
    let tags = JSON.parse(localStorage.getItem("tags"));
    if (!tags) {
        tags = [];
    }
    return tags;
}

function updateTags(tags) {
    document.getElementById("select_tags").innerHTML = "";
    tags.forEach((tag) => {
        let opt = document.createElement("option");
        opt.innerHTML = tag;
        opt.value = tag;
        document.getElementById("select_tags").appendChild(opt);
    });
}

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

function calculateTotalExpenses(expenses) {
    let total_expenses = 0;
    expenses.forEach(expense => {
        total_expenses += Number(expense.amount);
    });
    return total_expenses;
}

function updateBadges () {
    document.getElementById("Total_budget").children[0].innerHTML =
        localStorage.getItem("Total_budget");
    document.getElementById("Total_expense").children[0].innerHTML = calculateTotalExpenses(getExpenses());
    let budget_left = Number(localStorage.getItem("Total_budget")) - Number(calculateTotalExpenses(getExpenses()));
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

// Update Row
function updateRow(expensePos) {
    document.getElementById('update-row_'+expensePos).style.display = 'table-row';
    document.getElementById('display-row_'+expensePos).style.display = 'none';
}

// revert display Update Row
function revertUpdateRow(expensePos) {
    document.getElementById('update-row_'+expensePos).style.display = 'none';
    document.getElementById('display-row_'+expensePos).style.display = 'table-row';
}