require("dotenv").config();
import { reject } from "lodash";
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

let getAllSpecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errorCode: 0,
                errorMessage: "OK",
                data
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getDetailSpecialtyService = async (idInput, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput || !location) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing parameter",
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: idInput
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                });

                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: idInput },
                            attributes: ['doctorId', 'provinceId'],
                        });
                    } else {
                        // find by location
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: idInput,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        });
                    }

                    resolve({
                        errorCode: 0,
                        errorMessage: "OK",
                        data,
                        doctorSpecialty
                    })
                } else data = {}

            }
        } catch (error) {
            reject(error);
        }
    })
}



module.exports = {
    createSpecialtyService,
    getAllSpecialtyService,
    getDetailSpecialtyService
}