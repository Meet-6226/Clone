const projectList = document.getElementById("project__list");

projectLister = () => {
    const array = JSON.parse(localStorage.getItem("local")) || [];
    let html = ``;
    for (i in array) {
        html += `<option>${array[i].project}</option>`;
    }
    projectList.innerHTML = html;
};
projectLister();

const convertToHoursAndMinutes = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins} min`;
    if (mins === 0) return `${hrs} hr`;
    return `${hrs} hr ${mins} min`;
};

const displayChart = (array, chartType) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: chartType,
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [{
                label: 'Minutes spent',
                data: array,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 109, 29, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(150, 15, 41, 2)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Total time spent in a week'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
};

const showAllData = (chartType) => {
    document.getElementById("dashboard__container__graph").innerHTML = `
        <div class="dashboard__container__graph__controls">
            <button onclick="barChart()">Bar</button>
            <button onclick="pieChart()">Pie</button>
            <button onclick="lineChart()">Line</button>
            <button onclick="radarChart()">Radar</button>
            <button onclick="doughnutChart()">Doughnut</button>
        </div>
        <canvas id="myChart"></canvas>`;

    const array = JSON.parse(localStorage.getItem("local")) || [];

    let [rowMon, rowTue, rowWed, rowThu, rowFri, rowSat, rowSun] = [0, 0, 0, 0, 0, 0, 0];

    array.forEach((item) => {
        rowMon += Math.floor(item.monday.time / 60);
        rowTue += Math.floor(item.tuesday.time / 60);
        rowWed += Math.floor(item.wednesday.time / 60);
        rowThu += Math.floor(item.thursday.time / 60);
        rowFri += Math.floor(item.friday.time / 60);
        rowSat += Math.floor(item.saturday.time / 60);
        rowSun += Math.floor(item.sunday.time / 60);
    });

    const sumTotal = rowMon + rowTue + rowWed + rowThu + rowFri + rowSat + rowSun;
    const minutesPerWeek = [rowMon, rowTue, rowWed, rowThu, rowFri, rowSat, rowSun];

    const weeklyDataReport = [
        ["Monday", rowMon],
        ["Tuesday", rowTue],
        ["Wednesday", rowWed],
        ["Thursday", rowThu],
        ["Friday", rowFri],
        ["Saturday", rowSat],
        ["Sunday", rowSun]
    ];

    weeklyDataReport.sort((a, b) => a[1] - b[1]);

    const minDay = weeklyDataReport[0][0];
    const minTime = weeklyDataReport[0][1];
    const maxDay = weeklyDataReport[6][0];
    const maxTime = weeklyDataReport[6][1];

    document.getElementById("dashboard__stats__unique").innerHTML = `
        <div>
            <span>Total Time</span>
            <h2 id="dashboard__stats__total__time">${convertToHoursAndMinutes(sumTotal)}</h2>
        </div>
        <div>
            <span>Average Time</span>
            <h2 id="dashboard__stats__average__time">${(sumTotal / 7).toFixed(1)} Min</h2>
        </div>`;

    document.getElementById("dashboard__stats__details").innerHTML = `
        <div>
            <ul>
                <h3>Most</h3>
                <li>You have spent the most of your time on <b>${maxDay}</b></li>
                <li>The time spent is <b>${maxTime} Minutes</b></li>
            </ul>
        </div>
        <div>
            <ul>
                <h3>Least</h3>
                <li>You have spent the least of your time on <b>${minDay}</b></li>
                <li>The time spent is <b>${minTime} Minutes</b></li>
            </ul>
        </div>`;

    displayChart(minutesPerWeek, chartType);
};

showAllData("bar");

// Chart controls
function pieChart() { showAllData("pie"); }
function radarChart() { showAllData("radar"); }
function lineChart() { showAllData("line"); }
function barChart() { showAllData("bar"); }
function doughnutChart() { showAllData("doughnut"); }

const goFilter = document.getElementById("goFilter");

const filterByProjectName = () => {
    document.getElementById("dashboard__container__graph").innerHTML = `<canvas id="myChart"></canvas>`;
    const selectedProject = document.getElementById("projectListInput").value;

    if (selectedProject === "") {
        alert("Please select a project");
        return;
    }

    const array = JSON.parse(localStorage.getItem("local")) || [];
    let dataCollector = [];
    let dataCollectorStats = [];
    let totalTime = 0;

    for (i in array) {
        if (array[i].project.toLowerCase() === selectedProject.toLowerCase()) {
            dataCollector = [
                Math.floor(array[i].monday.time / 60),
                Math.floor(array[i].tuesday.time / 60),
                Math.floor(array[i].wednesday.time / 60),
                Math.floor(array[i].thursday.time / 60),
                Math.floor(array[i].friday.time / 60),
                Math.floor(array[i].saturday.time / 60),
                Math.floor(array[i].sunday.time / 60)
            ];

            dataCollectorStats = [
                ["Monday", dataCollector[0], array[i].monday.desc],
                ["Tuesday", dataCollector[1], array[i].tuesday.desc],
                ["Wednesday", dataCollector[2], array[i].wednesday.desc],
                ["Thursday", dataCollector[3], array[i].thursday.desc],
                ["Friday", dataCollector[4], array[i].friday.desc],
                ["Saturday", dataCollector[5], array[i].saturday.desc],
                ["Sunday", dataCollector[6], array[i].sunday.desc]
            ];
        }
    }

    totalTime = dataCollector.reduce((acc, val) => acc + val, 0);

    document.getElementById("dashboard__stats__unique").innerHTML = `
        <div>
            <span>Total Time</span>
            <h2 id="dashboard__stats__total__time">${convertToHoursAndMinutes(totalTime)}</h2>
        </div>
        <div>
            <span>Average Time</span>
            <h2 id="dashboard__stats__average__time">${(totalTime / 7).toFixed(1)} Min</h2>
        </div>`;

    dataCollectorStats.sort((a, b) => a[1] - b[1]);

    const minDay = dataCollectorStats[0][0];
    const minTime = dataCollectorStats[0][1];
    const minDesc = dataCollectorStats[0][2];
    const maxDay = dataCollectorStats[6][0];
    const maxTime = dataCollectorStats[6][1];
    const maxDesc = dataCollectorStats[6][2];

    displayChart(dataCollector, "bar");

    document.getElementById("dashboard__stats__details").innerHTML = `
        <div>
            <h2>For the Project <b style="color:#44A5F3; text-transform:uppercase; letter-spacing:1.2px">${selectedProject}</b></h2>
        </div>
        <div>
            <ul>
                <h3>Most</h3>
                <li>You have spent the most of your time on <b>${maxDay}</b></li>
                <li>The time spent is <b>${maxTime} Minutes</b></li>
                <li>The task you did was <b>${maxDesc.trim() ? maxDesc : 'No Description Given'}</b></li>
            </ul>
        </div>
        <div>
            <ul>
                <h3>Least</h3>
                <li>You have spent the least of your time on <b>${minDay}</b></li>
                <li>The time spent is <b>${minTime} Minutes</b></li>
                <li>The task you did was <b>${minDesc.trim() ? minDesc : 'No Description Given'}</b></li>
            </ul>
        </div>`;

    document.getElementById("projectListInput").value = "";
};

goFilter.addEventListener("click", filterByProjectName);