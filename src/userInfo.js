const userInfoTypes = `{
    "email": String,
    "firstName": String,
    "lastName": String,
    "preferredName": String,
    "birthDate": DateString,
    "classPeriod": String,
    "heightInInches": Integer,
    "hoursOfSleep": Number,
    "favoriteSubject": String,
    "screenTimeHours": Number,
    "careerInterest": String,
    "favoriteSocialMedia": String,
    "languagesSpoken": Array<String>,
    "hasPets": Boolean,
    "petType": String,
    "motivationalQuote": String,
    "superpower": String
}`;

const userInfo = {
    "role": "student",
    "userId": 103,
    "email": "student103@school.org",
    "firstName": "Alex",
    "lastName": "Jordan",
    "fullName": "Alex Jordan",
    "birthDate": "2010-04-22",
    "classPeriod": "2B",
    "heightInInches": 62,
    "hoursOfSleep": 7.5,
    "favoriteSubject": "Science",
    "screenTimeHours": 3,
    "careerInterest": "Game Developer",
    "favoriteSocialMedia": "TikTok",
    "languagesSpoken": ["English", "Spanish"],
    "hasPets": true,
    "petType": "Dog",
    "motivationalQuote": "Learning is a superpower!",
    "superpower": "Time travel"
};

export default userInfo;