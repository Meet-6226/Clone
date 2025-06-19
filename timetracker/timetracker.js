const killNull = JSON.parse(localStorage.getItem("local"));
if (killNull === null) {
    const temp = [];
    localStorage.setItem("local", JSON.stringify(temp));
}
const projectList = document.getElementById("project__list");

projectLister = () => {
    const array = JSON.parse(localStorage.getItem("local"));
    let html = ``;
    for (i in array) {
        html += `<option>${array[i].project}</option>`;
    }
    projectList.innerHTML = html;
};
projectLister();

const displayTimeTracker = () => {
    const array = JSON.parse(localStorage.getItem("local"));
    let html = "";
    for (let i = 0; i < array.length; i++) {
        let obj = array[i];
        for (key in obj) {
            if (obj[key].time != undefined && obj[key].time != 0) {
                let tempo = key;
                let timeInMinutes = Math.floor(obj[key].time / 60); // Round down for display
                html += `  
                <div class="Timetracker__body__info">
                    <div>
                        <span>Day : <b>${key}</b></span>
                    </div>
                    <div>
                        <input placeholder="Add Description" title=${tempo} id=${obj.id} onchange="inputChangeTracker(this)" value="${obj[key].desc}">
                    </div>
                    <div>
                        <span>Project Name : <b>${obj.project}</b></span>
                    </div>
                    <div>
                        <span>Total Time : <input type="number" title=${tempo} id=${obj.id} onchange="inputTimeChangeTracker(this)" value="${timeInMinutes}"> <b>Minutes</b></span>
                    </div>
                    <div>
                        <i title=${tempo} id=${obj.id} onClick="deleteTimeTracker(this)" class="far fa-trash-alt"></i>
                    </div>
                </div>`;
            }
        }
    }
    document.getElementById("Timetracker__body").innerHTML = html;
};
displayTimeTracker();

const inputTimeChangeTracker = (e) => {
    const newValue = e.value;
    let array = JSON.parse(localStorage.getItem("local"));
    let id = e.id;
    let day = e.title;
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            if (newValue !== "") {
                array[i][day].time = Math.round(parseFloat(newValue)) * 60; // round to full minutes
            }
        }
    }
    localStorage.setItem("local", JSON.stringify(array));
    displayTimeTracker();
};

const inputChangeTracker = (e) => {
    const newValue = e.value;
    let array = JSON.parse(localStorage.getItem("local"));
    let id = e.id;
    let day = e.title;
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            array[i][day].desc = newValue;
        }
    }
    localStorage.setItem("local", JSON.stringify(array));
    displayTimeTracker();
};

deleteTimeTracker = (e) => {
    let array = JSON.parse(localStorage.getItem("local"));
    let id = e.id;
    let day = e.title;
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            array[i][day].time = 0;
            array[i][day].desc = "";

            if (
                array[i].monday.time == 0 &&
                array[i].tuesday.time == 0 &&
                array[i].wednesday.time == 0 &&
                array[i].thursday.time == 0 &&
                array[i].friday.time == 0 &&
                array[i].saturday.time == 0 &&
                array[i].sunday.time == 0
            ) {
                array.splice(i, 1);
            }
        }
    }
    localStorage.setItem("local", JSON.stringify(array));
    displayTimeTracker();
};

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

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const btn = document.getElementById("time__start");
const counter = document.getElementById("time__tracker");

let count = 0;
let intervalId = null;
let flag = 0;

counter.textContent = '00:00:00';

btn.addEventListener("click", () => {
    const timeTrackerDesc = document.getElementById("Timetracker__description").value;
    const timeTrackerProject = document.getElementById("projectListInput").value.toLowerCase();
    const timeTrackerWeekDay = document.getElementById("weekDaysInput").value.toLowerCase();

    if (flag === 0) {
        if (timeTrackerProject === "" || timeTrackerWeekDay === "") {
            alert("Please fill in the project and weekday fields before starting the timer.");
            return;
        }

        // Start timer
        count = 0;
        counter.textContent = formatTime(count);
        intervalId = setInterval(() => {
            count++;
            counter.textContent = formatTime(count);
        }, 1000);

        btn.innerHTML = "Stop";
        btn.style.background = "red";
        btn.style.color = "white";
        btn.style.borderColor = "red";
        flag = 1;
    } else {
        // Stop timer and save rounded minutes
        clearInterval(intervalId);
        intervalId = null;

        const roundedSeconds = Math.round(count / 60) * 60; // round to nearest minute (in seconds)

        let array = JSON.parse(localStorage.getItem("local")) || [];
        let existingProject = array.find(p => p.project === timeTrackerProject);

        if (existingProject) {
            if (existingProject[timeTrackerWeekDay]) {
                existingProject[timeTrackerWeekDay].desc = timeTrackerDesc;
                existingProject[timeTrackerWeekDay].time += roundedSeconds;
            }
        } else {
            const id = Math.ceil(Math.random() * 10000);
            const store = new Storagemanager(id, timeTrackerProject, 0, 0, 0, 0, 0, 0, 0);
            store[timeTrackerWeekDay].desc = timeTrackerDesc;
            store[timeTrackerWeekDay].time = roundedSeconds;
            array.push(store);
        }

        localStorage.setItem("local", JSON.stringify(array));
        displayTimeTracker();

        // Reset UI
        document.getElementById("Timetracker__description").value = "";
        document.getElementById("projectListInput").value = "";
        document.getElementById("weekDaysInput").value = "";

        counter.textContent = formatTime(0);
        count = 0;
        flag = 0;

        btn.innerHTML = "Start";
        btn.style.background = "#5FBDF7";
        btn.style.color = "white";
        btn.style.borderColor = "#5FBDF7";
    }
});