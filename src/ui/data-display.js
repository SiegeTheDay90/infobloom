// Update myProfile

export function updateDisplay(){
    try{
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentUser = localStorage.getItem("InfoBloomUser");
        const allData = JSON.parse(localStorage.getItem("InfoBloomData"));
        const userProfile = allData[currentUser];
        
        const {firstName, lastName, questionsAnswered} = userProfile;
        const birthDate = new Date(userProfile.birthDate);
        
        const fullNameBadgeContent = document.querySelector("#fullName .badge-content");
        fullNameBadgeContent.innerText = firstName + " " + lastName;
        
        const birthDateBadgeContent = document.querySelector("#birthDate .badge-content");
        birthDateBadgeContent.innerText = months[birthDate.getMonth()] + " " + birthDate.getDate();
    
        const questionsAnsweredBadgeContent = document.querySelector("#questionsAnswered .badge-content");
        questionsAnsweredBadgeContent.innerText = questionsAnswered || 0;
    } catch(error) {
        console.error("updateDisplay did not work");
        console.error(error.message);
        // setTimeout(() => location.reload(), 2000);
    }
}