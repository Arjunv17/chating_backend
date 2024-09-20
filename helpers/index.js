const bcrypt = require('bcrypt');


const findOne = (model, data, projection) => {
    let resultData = model.findOne(data, projection);
    return resultData;
}

const findAll = (model, data, projection) => {
    let resultData = model.find(data, projection);
    return resultData;
}
const upsert = async (model, id, data, options = { new: true, upsert: true }) => {
    try {
        // Ensure the id is wrapped as a query object
        let updateData = await model.updateOne({ _id: id }, { $set: data }, options);
        return updateData;
    } catch (error) {
        throw new Error(`Error updating data: ${error.message}`);
    }
};




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
    comparePass,
    upsert
}