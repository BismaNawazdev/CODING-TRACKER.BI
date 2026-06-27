const form = document.getElementById("sessionForm");
const table = document.getElementById("sessionTable");

const totalHours = document.getElementById("totalHours");
const totalSessions = document.getElementById("totalSessions");
const totalLanguages = document.getElementById("totalLanguages");

const progressBar = document.getElementById("progressBar");

const themeBtn = document.getElementById("themeBtn");

let sessions =
JSON.parse(localStorage.getItem("sessions")) || [];

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
});

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const session = {
        date: document.getElementById("date").value,
        language: document.getElementById("language").value,
        hours: Number(document.getElementById("hours").value),
        topic: document.getElementById("topic").value
    };

    sessions.push(session);

    saveData();

    form.reset();

    render();
});

function saveData(){
    localStorage.setItem(
        "sessions",
        JSON.stringify(sessions)
    );
}

function deleteSession(index){

    sessions.splice(index,1);

    saveData();

    render();
}

function render(){

    table.innerHTML="";

    let hours = 0;

    sessions.forEach((s,index)=>{

        hours += s.hours;

        table.innerHTML += `
        <tr>
            <td>${s.date}</td>
            <td>${s.language}</td>
            <td>${s.hours}</td>
            <td>${s.topic}</td>
            <td>
                <button
                    class="delete-btn"
                    onclick="deleteSession(${index})"
                >
                    Delete
                </button>
            </td>
        </tr>
        `;
    });

    totalHours.textContent = hours;

    totalSessions.textContent =
    sessions.length;

    const langs =
    [...new Set(
        sessions.map(
            s => s.language
        )
    )];

    totalLanguages.textContent =
    langs.length;

    let progress =
    (hours / 100) * 100;

    if(progress > 100)
        progress = 100;

    progressBar.style.width =
    progress + "%";

    updateChart();
}

let chart;

function updateChart(){

    const ctx =
    document.getElementById("hoursChart");

    const labels =
    sessions.map(s=>s.language);

    const data =
    sessions.map(s=>s.hours);

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{
        type:"bar",
        data:{
            labels:labels,
            datasets:[{
                label:"Hours",
                data:data
            }]
        }
    });
}

render();