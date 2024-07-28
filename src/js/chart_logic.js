
const barChart = document.getElementById('bar_chart');
const doughnutChart = document.getElementById('doughnut_chart');
const tags = JSON.parse(localStorage.getItem('tags'));
const expenses = JSON.parse(localStorage.getItem('expenses'));


// sets a map with the data for the expenses tags
function getMapExpensesPerTag(expenses) {
    const expensesMap = new Map();
    expenses.forEach(expense => {
        if (expensesMap.has(expense.tag)) {
            expensesMap.set(expense.tag, (Number(expensesMap.get(expense.tag))+ Number(expense.amount)));
        }else {
            expensesMap.set(expense.tag, expense.amount);
        }
    });
    return expensesMap;
}
// Return a color  from an iterative sequence
function GetColor(tags) {
    const colors = ['#FF99C8', '#FCF6BD', '#D0F4DE', '#A9DEF9', '#E4C1F9'];
    let colorsTotal = []
    tags.forEach((e, ind) => {
        colorsTotal.push(colors[ind% colors.length]);
    });
    return colorsTotal;
}



//Creates bar chart
new Chart(barChart, {
    type: 'bar',
    data: {
      labels: Array.from(getMapExpensesPerTag(expenses).keys()),
      datasets: [{
        label: 'Amount of money expended',
        data: Array.from(getMapExpensesPerTag(expenses).values()),
        borderWidth: 1,
        backgroundColor: GetColor(tags),
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
});

//Creates doughnut chart
new Chart(doughnutChart, {
    type: 'doughnut',
    data: {
      labels: Array.from(getMapExpensesPerTag(expenses).keys()),
      datasets: [{
        label: 'Amount of money expended',
        data: Array.from(getMapExpensesPerTag(expenses).values()),
        borderWidth: 1,
        backgroundColor: GetColor(tags),
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
});



document.getElementById('cng-chart-btn').addEventListener('click', () => {
    if (document.getElementById('section_bar-chart').style.display == 'none') {
        document.getElementById('section_bar-chart').style.display = 'block';
        document.getElementById('section_doughnut-chart').style.display = 'none';
    } else {
        document.getElementById('section_bar-chart').style.display = 'none';
        document.getElementById('section_doughnut-chart').style.display =  'block';
    }

});