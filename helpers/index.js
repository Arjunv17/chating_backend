const bcrypt = require('bcrypt');


const findOne = (model, data, projection) => {
    let resultData = model.findOne(data, projection);
    return resultData;
}

const findAll = (model, data, projection) => {
    let resultData = model.find(data, projection);
    return resultData;
}



const createHashPass = async (data)=>{
    return await bcrypt.hash(data, 10);
}

const comparePass = async (newpass, oldpass)=>{
    return await bcrypt.compare(newpass, oldpass);
}

module.exports = {
    findOne,
    findAll,
    createHashPass,
    comparePass
}