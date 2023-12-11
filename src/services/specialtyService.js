require("dotenv").config();
import db from "../models";


let createSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing parameter",
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errorCode: 0,
                    errorMessage: "Ok",
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}



module.exports = {
    createSpecialtyService,

}