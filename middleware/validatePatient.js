export const validatePatient = (req, res, next) => {
    const{user_id,date_of_birth,blood_group}= req.body;
    if(user_id === undefined || typeof user_id !== "number" || user_id <= 0) {
        return res.status(400).json({
            message: "Invalid user_id. It must be a positive number."
        });
    };
    if(date_of_birth === undefined ||
         typeof date_of_birth !== "string"||
         date_of_birth.trim() === "" || 
         isNaN(Date.parse(date_of_birth))) {
         return res.status(400).json({
            message: "Invalid date_of_birth.Please Provide a valid date string in the format YYYY-MM-DD."
        });
    };
    const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if(blood_group === undefined ||
        blood_group.trim() === ""||
         !validBloodGroups.includes(blood_group) ) {
        return res.status(400).json({
            message: "Invalid blood_group. It must be one of the following: A+, A-, B+, B-, AB+, AB-, O+, O-"
        });
    };
    next();
};