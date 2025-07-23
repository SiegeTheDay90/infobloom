import * as auth from "../firebase/authFunctions.js";
import { updateProfile, updateStoredData } from "../firebase/dataFunctions.js";
import { updateDisplay } from "../ui/data-display.js";

// Handle Sign Out
const signOutButton = document.getElementById("signOutButton") || {};
signOutButton.onclick = async (e) => {
  e.preventDefault();
  try {
    await auth.signOutUser();
    alert("Signed out successfully.");
  } catch (err) {
    alert("Sign-out error: " + err.message);
  }
};

// Profile Update Button
const updateProfileBtn = document.getElementById("updateProfileBtn") || {};
const profileBadgeForms = Array.from(document.querySelectorAll(".badge-form .form-control,.form-select"));
const userId = localStorage.getItem("InfoBloomUser");
const profile = {uid: userId};
updateProfileBtn.onclick = async (e) => {
  try{
    profileBadgeForms.forEach((input) => {
      if(input.value){
        profile[input.name] = input.value;
      }
    })
    await updateProfile(profile);
    await updateStoredData();
    updateDisplay();
  } catch(error){
    console.log("Profile could not update.");
    throw error;
  }
}

const menuButtons = {
    myProfile: document.getElementById('showMyProfile'),
    myData: document.getElementById('showMyData'),
    populationData: document.getElementById('showPopulationData'),
    forceRefresh: document.getElementById('forceRefresh')
}

const mainDivs = {
    myProfile: document.getElementById('myProfile'),
    myData: document.getElementById('myData'),
    populationData: document.getElementById('populationData')
}

function showForm(formKey) {
    Object.keys(mainDivs).forEach((key) => {
      if (key === formKey) {
        menuButtons[key].classList.add("active");
        mainDivs[key].classList.add("active");
      } else {
        menuButtons[key].classList.remove("active");
        mainDivs[key].classList.remove("active");
      }
    });
  }

// Attach menu buttons
document.getElementById("showMyProfile")?.addEventListener('click', () => showForm("myProfile"));
document.getElementById("showMyData")?.addEventListener('click', () => showForm("myData"));
document.getElementById("showPopulationData")?.addEventListener('click', () => showForm("populationData"));
document.getElementById("forceRefresh")?.addEventListener('click', async () => {await updateStoredData(); updateDisplay();});


const allData = JSON.parse(localStorage.getItem("InfoBloomData"));
let ctx = document.getElementById('myHeightChart')?.getContext('2d');
const heights = [0, 0, 0, 0, 0];
const birthDates = {};
if(ctx){
  Object.values(allData).forEach((val) => {
    const height = val.height;
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

    const birthDate = new Date(val.birthDate);
    const month = birthDate.getMonth();
    const day = birthDate.getDate();
    birthDates[`${month},${day}`] ||= {x: month+1, y: day, v: 0};
    birthDates[`${month},${day}`].v += 1;
  });

  new Chart(ctx, {
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
  });
}

// ctx = document.getElementById('myBirthDateChart')?.getContext('2d');
// if(ctx){
//   new Chart(ctx, {
//     type: 'matrix',
//     data: {
//       datasets: [{
//         label: 'Birthday Heatmap',
//         data: Object.values(birthDates),
//         backgroundColor(context) {
//           const value = context.dataset.data[context.dataIndex].v;
//           const alpha = Math.min(1, value / 10);
//           return `rgba(255, 99, 132, ${alpha})`;
//         },
//         borderColor: 'rgba(200, 200, 200, 0.2)',
//         borderWidth: 1,
//         width: ({ chart }) => chart.width / 30,
//         height: ({ chart }) => chart.height / 30
//       }]
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         title: {
//           display: true,
//           text: 'Birthday Frequency by Day & Month'
//         }
//       },
//       scales: {
//         x: {
//           type: 'linear',
//           position: 'top',
//           min: 1,
//           max: 12,
//           ticks: {
//             stepSize: 1,
//             callback: val => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][val - 1]
//           }
//         },
//         y: {
//           type: 'linear',
//           min: 1,
//           max: 31,
//           ticks: { stepSize: 1 }
//         }
//       }
//     }
//   });
// }

// try{
//   ctx = document.getElementById('myQuestionsAnsweredChart')?.getContext('2d');
//   if(ctx){
//       new Chart(ctx, {
//       type: 'boxplot',
//       data: {
//           labels: ['Height'],
//           datasets: [{
//           label: 'Student Heights',
//           data: [
//               { min: 140, q1: 155, median: 160, q3: 170, max: 180 }
//           ],
//           backgroundColor: '#1cc88a'
//           }]
//       },
//       options: {
//           plugins: {
//           title: { display: true, text: 'Height Distribution' }
//           }
//       }
//       });
//   }
// } catch(err) {
//   console.log("No Box Plot");
//   // console.error(err);
// }

if(window.location.href.slice(-9) == "data.html") updateDisplay();