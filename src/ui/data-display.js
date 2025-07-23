import { percentile, ranking } from "../util/calculator";
// import Chart from 'chartjs/';
// import ChartAnnotation from 'chartjs-plugin-annotation';


export function showUpdateButton(){
    document.getElementById("updateProfileBtn").classList.remove("d-none");
}

export function updateDisplay() {
    updateMyProfile();
    updateMyData();
    updatePopulationData();
}


export var myBirthDateChart;
function updateMyData(){
    const currentUser = localStorage.getItem("InfoBloomUser");
    const allData = JSON.parse(localStorage.getItem("InfoBloomData")) || {};
    if (!allData?.[currentUser]) return;   
    const userData = allData[currentUser];
    const heightsArray = Object.values(allData).map(user => user.heightInInches || 0);
    const heightPercentile = percentile(heightsArray, userData.heightInInches || 0);
    if(myBirthDateChart) myBirthDateChart.destroy();
    myBirthDateChart = new Chart(document.getElementById('myHeightChart'), {
    type: 'bar',
    data: {
        labels: ['Height Percentile'],
        datasets: [{
        label: 'Percentile',
        data: [Math.round(heightPercentile)], // Full scale
        backgroundColor: '#5a60ffff',
        borderSkipped: false,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        scales: {
        x: {
            min: 0,
            max: 100,
            ticks: {
            stepSize: 10,
            callback: value => `${value}%`,
            }
        },
        y: {
            display: false
        }
        },
        plugins: {
        annotation: {
            annotations: {
            studentMarker: {
                type: 'line',
                xMin: heightPercentile,
                xMax: heightPercentile,
                borderColor: 'blue',
                borderWidth: 2,
                label: {
                enabled: true,
                content: `${heightPercentile}th`,
                position: 'start',
                backgroundColor: 'blue',
                color: 'white'
                }
            }
            }
        },
        legend: { display: false }
        }
    },
    // plugins: [ChartAnnotation] // Load annotation plugin separately
    });

    const birthDatesArray = Object.values(allData).map(user => {
        const birthDate = new Date(user.birthDate?.seconds * 1000 || user.birthDate);
        return Number(birthDate);
    });

    const birthDateRanking = ranking(birthDatesArray, Number(new Date(userData.birthDate?.seconds * 1000 || userData.birthDate)));
    const birthDayEl = document.getElementById("myBirthDateChart");
    if(birthDayEl){
        birthDayEl.innerText = `Your birthday is ranked #${birthDateRanking} oldest out of ${birthDatesArray.length} students.`;
    }
}


export var populationHeightChart;
export var populationBirthDateChart;
function updatePopulationData() {
    try {
        const currentUser = localStorage.getItem("InfoBloomUser");
        const allData = JSON.parse(localStorage.getItem("InfoBloomData")) || {};
        if (!allData?.[currentUser]) return;   

        const userData = allData[currentUser];

        let ctx = document.getElementById('populationHeightChart')?.getContext('2d');
        const heights = [0, 0, 0, 0, 0];
        const birthDates = {};
        if(ctx){
            Object.values(allData).forEach((user) => {
                const height = user.heightInInches;
                if(height < 55){
                    heights[0] += 1;
                } else if(height < 61){
                    heights[1] += 1;
                } else if(height < 67){
                    heights[2] += 1;
                } else if(height < 73){
                    heights[3] += 1;
                } else if(height >= 73){
                    heights[4] += 1;
                }

                const birthDate = new Date(user.birthDate?.seconds * 1000 || user.birthDate);
                const month = birthDate.getMonth();
                const day = birthDate.getDate();
                // debugger;
                birthDates[`${month},${day}`] ||= {x: month+1, y: day, v: 0};
                birthDates[`${month},${day}`].v += 1;
            })

            if(populationHeightChart) populationHeightChart.destroy();
            populationHeightChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['48-54', '55-60', '61-66', '67-72', '73-78'],
                    datasets: [{
                    label: 'Height in Inches',
                    data: heights,
                    backgroundColor: '#4e73df'
                    }]
                },
                options: {
                    plugins: {
                    title: { display: true, text: 'Student Heights Histogram' }
                    }
                }
            })
        }

        ctx = document.getElementById('populationBirthDateChart')?.getContext('2d');
        if(ctx){
        if(populationBirthDateChart) populationBirthDateChart.destroy();
          populationBirthDateChart = new Chart(ctx, {
            type: 'matrix',
            data: {
              datasets: [{
                label: 'Date',
                data: Object.values(birthDates),
                backgroundColor(context) {
                  const value = context.dataset.data[context.dataIndex].v;
                  const alpha = Math.min(1, value / 2);
                  return `rgba(255, 0, 0, ${alpha})`;
                },
                borderColor: 'rgba(255, 17, 17, 0.1)',
                borderWidth: 1,
                width: ({ chart }) => chart.width / 30,
                height: ({ chart }) => chart.height / 30
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Birthday Frequency by Day & Month'
                }
              },
              scales: {
                x: {
                  type: 'linear',
                  position: 'top',
                  min: 1,
                  max: 12,
                  ticks: {
                    stepSize: 1,
                    callback: val => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][val - 1]
                  }
                },
                y: {
                  type: 'linear',
                  min: 1,
                  max: 31,
                  ticks: { stepSize: 1 }
                }
              }
            }
          });
        }
    } catch (error) {
        console.error("updateMyData did not work");
        throw error;
    }
}

function updateMyProfile() {
    try {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const currentUser = localStorage.getItem("InfoBloomUser");
        const allData = JSON.parse(localStorage.getItem("InfoBloomData")) || {};
        if (!allData?.[currentUser]) return;

        const userProfile = allData[currentUser];

        Object.entries(userProfile).forEach(([key, value]) => {
            const badge = document.querySelector(`#${key}`);
            if (!badge) return;

            const contentEl = badge.querySelector(".badge-content");
            const formEl = badge.querySelector(".badge-form");
            const editButton = badge.querySelector(".editBadgeBtn") || {};
            const formInput = formEl.querySelector("input, select") || {};
            editButton.onclick = (e) => {
                contentEl.classList.add("d-none");
                formEl.classList.remove("d-none");
                editButton.classList.add("d-none");
                showUpdateButton();
            }
            formInput.oninput = (e) => {
                if(e.target.value){
                    showUpdateButton();
                }
            }

            if (value !== undefined && value !== null && value !== "") {
            // Show the value
            editButton.classList.remove("d-none");
            contentEl.classList.remove("d-none");
            if (key === "birthDate") {
                const birthDate = new Date(value);
                contentEl.innerText = `${months[birthDate.getMonth()]} ${birthDate.getDate()}`;
            } else if (Array.isArray(value)) {
                contentEl.innerText = value.join(", ");
                formInput.value = value.join(", ");
            } else if (typeof value === "boolean") {
                contentEl.innerText = value ? "Yes" : "No";
                formInput.value = value ? "Yes" : "No";
            } else {
                contentEl.innerText = value;
                formInput.value = value;
            }
            formEl?.classList.add("d-none"); // keep form hidden
            } else {
            contentEl.innerText = "Not answered yet.";
            editButton.classList?.add("d-none");
            formEl?.classList?.remove("d-none"); // show form for editing
            }
        });


        const fullName = `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim();
        const fullNameBadge = document.querySelector("#fullName");
        const contentEl = fullNameBadge.querySelector(".badge-content");
        contentEl.innerText = fullName || "Not answered yet.";
        const firstNameInput = document.querySelector("#firstNameInput");
        const lastNameInput = document.querySelector("#lastNameInput");
        firstNameInput.value = userProfile.firstName || "";
        lastNameInput.value = userProfile.lastName || "";
        const fullNameForm = fullNameBadge.querySelector("form");

        const editButton = fullNameBadge.querySelector(".editBadgeBtn") || {};
        contentEl.classList.remove("d-none");
        fullNameForm.classList.add("d-none");
        editButton.classList.remove("d-none");

        editButton.onclick = (e) => {
            contentEl.classList.add("d-none");
            fullNameForm.classList.remove("d-none");
            editButton.classList.add("d-none");
            showUpdateButton();
        }

  
    } catch (error) {
      console.error("updateDisplay did not work");
      throw error;
    }
}