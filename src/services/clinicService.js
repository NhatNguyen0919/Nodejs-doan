require("dotenv").config();
// import { reject } from "lodash";
import db from "../models";

let createClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing parameter",
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
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

let getAllClinicService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
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

let getDetailClinicService = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing parameter",
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: idInput
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'name', 'id', 'address'],
                });


                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: idInput },
                        attributes: ['doctorId', 'provinceId'],
                    });

                    resolve({
                        errorCode: 0,
                        errorMessage: "OK",
                        doctorClinic,
                        data
                    })
                } else data = {}

            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    createClinicService,
    getAllClinicService,
    getDetailClinicService
}