// Simply deletes the projects which have total time of 0
// Deletes projects with total time of 0 seconds across all days
const timeSheetGrabageCollector = () => {
    const grabage = JSON.parse(localStorage.getItem("local"));

    if (grabage && grabage.length !== 0) {
        for (let i = grabage.length - 1; i >= 0; i--) {
            const item = grabage[i];
            if (
                item.monday.time === 0 &&
                item.tuesday.time === 0 &&
                item.wednesday.time === 0 &&
                item.thursday.time === 0 &&
                item.friday.time === 0 &&
                item.saturday.time === 0 &&
                item.sunday.time === 0
            ) {
                grabage.splice(i, 1);
            }
        }
        localStorage.setItem("local", JSON.stringify(grabage));
    }
};

timeSheetGrabageCollector();

// Constructor to store values
function Storagemanager(id, project, monday, tuesday, wednesday, thursday, friday, saturday, sunday) {
    this.id = id;
    this.project = project;

    this.monday = { time: monday, desc: "" };
    this.tuesday = { time: tuesday, desc: "" };
    this.wednesday = { time: wednesday, desc: "" };
    this.thursday = { time: thursday, desc: "" };
    this.friday = { time: friday, desc: "" };
    this.saturday = { time: saturday, desc: "" };
    this.sunday = { time: sunday, desc: "" };
}

const addTimesheet = document.getElementById("addTimesheet");

// Add elements into the table
const addElement = () => {
    const proj = document.getElementById("project").value;
    const inputs = [
        document.getElementById("mon").value,
        document.getElementById("tue").value,
        document.getElementById("wed").value,
        document.getElementById("thu").value,
        document.getElementById("fri").value,
        document.getElementById("sat").value,
        document.getElementById("sun").value,
    ];

    const id = Math.ceil(Math.random() * 10000);

    if (proj !== "") {
        const allEmpty = inputs.every(val => val == 0 || val === "");
        if (allEmpty) {
            alert("You need to fill at least one field in time");
            return;
        }

        const roundedToSeconds = inputs.map(val => (val === "" ? 0 : Math.round(parseFloat(val)) * 60));
        const [monday, tuesday, wednesday, thursday, friday, saturday, sunday] = roundedToSeconds;
        const store = new Storagemanager(id, proj.toLowerCase(), monday, tuesday, wednesday, thursday, friday, saturday, sunday);

        let localArray = JSON.parse(localStorage.getItem("local")) || [];
        localArray.push(store);
        localStorage.setItem("local", JSON.stringify(localArray));

        displayTimesheet();

        // Reset inputs
        document.getElementById("project").value = "";
        document.getElementById("mon").value = "";
        document.getElementById("tue").value = "";
        document.getElementById("wed").value = "";
        document.getElementById("thu").value = "";
        document.getElementById("fri").value = "";
        document.getElementById("sat").value = "";
        document.getElementById("sun").value = "";
    } else {
        alert("Project name can't be empty");
    }
};

// Display the added elements in the sheet
displayTimesheet = () => {
    const array = JSON.parse(localStorage.getItem("local")) || [];
    let [rowMon, rowTue, rowWed, rowThu, rowFri, rowSat, rowSun] = [0, 0, 0, 0, 0, 0, 0];
    let html = "";

    array.forEach((item, index) => {
        const mon = Math.floor(item.monday.time / 60);
        const tue = Math.floor(item.tuesday.time / 60);
        const wed = Math.floor(item.wednesday.time / 60);
        const thu = Math.floor(item.thursday.time / 60);
        const fri = Math.floor(item.friday.time / 60);
        const sat = Math.floor(item.saturday.time / 60);
        const sun = Math.floor(item.sunday.time / 60);

        const colSum = mon + tue + wed + thu + fri + sat + sun;

        rowMon += mon;
        rowTue += tue;
        rowWed += wed;
        rowThu += thu;
        rowFri += fri;
        rowSat += sat;
        rowSun += sun;

        html += `
        <div class="Timesheet__table__body">
            <div class="Timesheet__table__spacer">
                <p>${item.project}</p>
            </div>
            <div class="Timesheet__table__details">
                <div><p>${mon} Min</p></div>
                <div><p>${tue} Min</p></div>
                <div><p>${wed} Min</p></div>
                <div><p>${thu} Min</p></div>
                <div><p>${fri} Min</p></div>
                <div><p>${sat} Min</p></div>
                <div><p>${sun} Min</p></div>
                <div><p>${colSum} Min</p></div>
                <div><button onclick="deleteTimeSheet(${index})">Delete</button></div>
            </div>
        </div>`;
    });

    document.getElementById("Timesheet__table__body").innerHTML = html;
    const sumTotal = rowMon + rowTue + rowWed + rowThu + rowFri + rowSat + rowSun;

    document.getElementById("monTotal").innerHTML = rowMon + " Min";
    document.getElementById("tueTotal").innerHTML = rowTue + " Min";
    document.getElementById("wedTotal").innerHTML = rowWed + " Min";
    document.getElementById("thuTotal").innerHTML = rowThu + " Min";
    document.getElementById("friTotal").innerHTML = rowFri + " Min";
    document.getElementById("satTotal").innerHTML = rowSat + " Min";
    document.getElementById("sunTotal").innerHTML = rowSun + " Min";
    document.getElementById("sumTotal").innerHTML = sumTotal + " Min";
};

addTimesheet.addEventListener("click", addElement);
displayTimesheet();

// Delete an entry
deleteTimeSheet = (index) => {
    const array = JSON.parse(localStorage.getItem("local")) || [];
    array.splice(index, 1);
    localStorage.setItem("local", JSON.stringify(array));
    displayTimesheet();
};

// Clear all data
clearAll = () => {
    const localData = JSON.parse(localStorage.getItem("local")) || [];
    if (localData.length === 0) {
        alert("The list is empty");
    } else if (window.confirm("Do you really want to clear the list?")) {
        localStorage.setItem("local", JSON.stringify([]));
        displayTimesheet();
    }
};

// Keep cleaning empty records in the background
setInterval(timeSheetGrabageCollector, 1000);