import { percentile, ranking } from "../util/calculator";
import { attachBoxPlot, attachHistogram, attachMatrixChart, attachRadarChart, attachScatterPlot } from "./chartFunctions";
import { heightsArray, birthDatesArray, heightBins, screenTimeBins, birthByMonthDay, subjectCounts } from "../util/aggregate-data";

// Raw data from localStorage
const allData = JSON.parse(localStorage.getItem("InfoBloomData")) || {};
const currentUser = localStorage.getItem("InfoBloomUser");
const userData = allData?.[currentUser];




export function showUpdateButton(){
    document.getElementById("updateProfileBtn").classList.remove("d-none");
}

export function updateDisplay() {
    updateMyProfile();
    updateMyData();
    updatePopulationData();
}


function updateMyData(){
    if (!userData) return;
    const heightPercentile = percentile(heightsArray, userData.heightInInches || 0);
    const heightPercentileEl = document.getElementById("myHeightChart");
   const data = {
        labels: ['Height Percentile'],
        datasets: [{
            label: 'Percentile',
            data: [Math.round(heightPercentile)],
            backgroundColor: '#5a60ffff',
            borderSkipped: false,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
        }]
    }
    const options = {
        indexAxis: 'y',
        responsive: true,
        scales: {
        x: {
            min: 0,
            max: 100,
            ticks: {
                stepSize: 5,
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

    }

    if(heightPercentileEl){
        attachHistogram(heightPercentileEl, data, options);
    }



    const birthDateRanking = ranking(birthDatesArray, Number(new Date(userData.birthDate?.seconds * 1000 || userData.birthDate)));
    const birthDayEl = document.getElementById("myBirthDateChart");
    if(birthDayEl){
        birthDayEl.innerText = `Your birthday is ranked #${birthDateRanking} oldest out of ${birthDatesArray.length} users.`;
    }
}


function updatePopulationData() {
    try {
        if (!userData) return;

        // Heights Histogram
        let populationHeightEl = document.getElementById('populationHeightChart');
        if (populationHeightEl) {
            const heightLabels = ['48-54', '55-60', '61-66', '67-72', '73-78'];
            const data = {
                labels: heightLabels,
                datasets: [{
                    label: 'Height in Inches',
                    data: heightBins,
                    backgroundColor: '#4e73df'
                }]
            }
            const options = {
                plugins: {
                    title: { display: true, text: 'Student Heights Histogram' }
                }
            }
            attachHistogram(populationHeightEl, data, options);
        }

        // Birthdays Matrix
        let populationBirthEl = document.getElementById('populationBirthDateChart');
        if(populationBirthEl){
            const options = {
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

            const data = {
                datasets: [{
                    label: 'Date',
                    data: Object.values(birthByMonthDay),
                    backgroundColor(context) {
                        const value = context.dataset.data[context.dataIndex].v;
                        const alpha = Math.min(1, value / 4);
                        return `rgba(255, 0, 0, ${alpha})`;
                    },
                    borderColor: 'rgba(255, 17, 17, 0.1)',
                    borderWidth: 1,
                    width: ({ chart }) => chart.width / 30,
                    height: ({ chart }) => chart.height / 30
                }]
            }
            
            attachMatrixChart(populationBirthEl, data, options);
        }

        // --- Screen Time vs Sleep Hours Scatter Plot ---
        const scatterEl = document.getElementById('screenTimeVsSleepChart');
        if (scatterEl) {
            const scatterData = Object.values(allData)
                .filter(user => typeof user.screenTimeHours === 'number' && typeof user.hoursOfSleep === 'number')
                .map(user => ({
                    x: user.screenTimeHours,
                    y: user.hoursOfSleep
                }));

            const data = {
                datasets: [{
                    label: 'Screen Time vs. Sleep Hours',
                    data: scatterData,
                    backgroundColor: '#10b981'
                }]
            }

            const options = {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Screen Time vs. Sleep Hours'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Screen Time (hours)'
                        },
                        min: 0,
                        max: 12
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Sleep Hours'
                        },
                        min: 0,
                        max: 12
                    }
                }
            }

            attachScatterPlot(scatterEl, data, options);
        }

                // --- Radar Chart: Favorite Subject Preferences ---
        const radarEl = document.getElementById('subjectPreferenceChart');
        if (radarEl) {

            const radarLabels = Object.keys(subjectCounts);
            const radarData = Object.values(subjectCounts);
            const data =  {
                labels: radarLabels,
                datasets: [{
                    label: 'Number of Students',
                    data: radarData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                }]
            }

            const options = {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Favorite Subject Preferences'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true
                    }
                }
            }

            attachRadarChart(radarEl, data, options);
        }

        // --- Screen Time Histogram ---
        const screenTimeEl = document.getElementById('screenTimeHistogramChart');
        if (screenTimeEl) {

            const screenTimeLabels = ['0–1 hr', '1–2 hrs', '2–3 hrs', '3–4 hrs', '4–5 hrs', '5+ hrs'];
            const data = {
                labels: screenTimeLabels,
                datasets: [{
                    label: 'Number of Students',
                    data: screenTimeBins,
                    backgroundColor: '#6366f1'
                }]
            }

            const options = {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Screen Time Hours'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }
            }
            attachHistogram(screenTimeEl, data, options);
        }

        // --- Box Plot: Height Distribution ---
        const heightBoxEl = document.getElementById('heightBoxPlotChart');
        if (heightBoxEl) {
            const heightValues = Object.values(allData)
                .map(user => user.heightInInches)
                .filter(h => typeof h === 'number');

            const data = {
                labels: ['Heights'],
                datasets: [{
                    label: 'Student Heights',
                    data: [heightValues],
                    backgroundColor: 'rgba(132, 132, 255, 0.77)',
                    borderColor: 'rgba(109, 109, 207, 1)',
                    borderWidth: 2
                }]
            }

            const options = {
                responsive: true,
                indexAxis: 'y',
                scales:{
                    x: {
                        max: 78,
                        min: 54,
                        ticks:{
                            stepSize: 6,
                            callback: function formatHeight(heightInInches) {
                                const feet = Math.floor(heightInInches / 12);
                                const inches = Math.round(heightInInches % 12);
                                return `${feet}'${inches}"`;
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Box Plot of Student Heights'
                    }
                }
            }

            if (heightValues.length > 0) {
                attachBoxPlot(heightBoxEl, data, options);
            }
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