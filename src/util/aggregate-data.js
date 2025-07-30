const allData = JSON.parse(localStorage.getItem("InfoBloomData")) || {};

// Arrays 
export const heightsArray = Object.values(allData).map(user => user.heightInInches || 0);
export const birthDatesArray = Object.values(allData).map(user => {
    const birthDate = new Date(user.birthDate?.seconds * 1000 || user.birthDate);
    return Number(birthDate);
});

export const heightBins = [0, 0, 0, 0, 0]; // bins: 48-54, 55-60, 61-66, 67-72, 73-78
export const screenTimeBins = [0, 0, 0, 0, 0, 0]; // bins: 0-1, 1-2, 2-3, ..., 5+
export const birthByMonthDay = {};
export const subjectCounts = {};
Object.values(allData).forEach((user) => {
    // Heights split into ranges
    const height = user.heightInInches;
    if(height < 55){
        heightBins[0] += 1;
    } else if(height < 61){
        heightBins[1] += 1;
    } else if(height < 67){
        heightBins[2] += 1;
    } else if(height < 73){
        heightBins[3] += 1;
    } else if(height >= 73){
        heightBins[4] += 1;
    }

    // Birthdays by month and day
    const birthDate = new Date(user.birthDate?.seconds * 1000 || user.birthDate);
    const month = birthDate.getMonth();
    const day = birthDate.getDate();
    birthByMonthDay[`${month + 1}-${day}`] ||= {x: month + 1, y: day, v: 0};
    birthByMonthDay[`${month + 1}-${day}`].v += 1;

    const subject = user.favoriteSubject;
    if (subject) {
        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    }

    const hours = user.screenTimeHours;
    if (typeof hours === 'number') {
        if (hours < 1) screenTimeBins[0]++;
        else if (hours < 2) screenTimeBins[1]++;
        else if (hours < 3) screenTimeBins[2]++;
        else if (hours < 4) screenTimeBins[3]++;
        else if (hours < 5) screenTimeBins[4]++;
        else screenTimeBins[5]++;
    }
});