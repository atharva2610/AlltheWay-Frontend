export default function hasEmptyValues(fdata, optionalFields=[]){

    let found = false;
    let emptyFields = {};

    for (const field in fdata){
        if (!optionalFields.includes(field) && fdata[field] === ""){
            found = true;
            emptyFields[field] = ["This is required!"];
        }
    }

    return [found, emptyFields];
}