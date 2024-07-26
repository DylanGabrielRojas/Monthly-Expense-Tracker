function getExpenses() {
    let expenses = JSON.parse(localStorage.getItem("expenses"));
    if (!expenses) {
        expenses = [];
    }
    return expenses;
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
        row.id = "row_" + expense.position;
        date.innerHTML = expense.date;
        title.innerHTML = expense.title;
        amount.innerHTML = expense.amount;
        tag.innerHTML = expense.tag;
        action.style = 'width: 20%';
        action.innerHTML = `<button
                            class='btn_expense'
                            onclick="deleteRow(${expense.position})"
                        >Delete</button>`;
        action.innerHTML += `<button
                            class='btn_expense'
                            onclick="updateRow(${expense.position})"
                        >Edit</button>`;

        row.appendChild(date);
        row.appendChild(title);
        row.appendChild(amount);
        row.appendChild(tag);
        row.appendChild(action);

        document.getElementById("Expense_list").children[1].appendChild(row);
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
    localStorage.setItem("tags", JSON.stringify(tags));
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
        document.getElementById("budget_state").innerHTML = "You are over the budget!";
        document.getElementById("budget_state").style = "color: red;";
    } else {
        document.getElementById("budget_state").innerHTML = "You are inside the budget!";
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
