export function showUpdateButton(){
    document.getElementById("updateProfileBtn").classList.remove("d-none");
}

export function updateDisplay() {
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