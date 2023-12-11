require("dotenv").config();
import db from "../models";
import _ from "lodash";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })

            resolve({
                errorCode: 0,
                data: users
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ['password', 'image']
                },
            })

            resolve({
                errorCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error);
        }
    })
}


let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML
                || !inputData.contentMarkdown || !inputData.action
                || !inputData.selectedPrice || !inputData.selectedPayment
                || !inputData.selectedProvince || !inputData.nameClinic
                || !inputData.addressClinic || !inputData.note
            ) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing parameter",
                })
            }
            else {
                // upsert to markdown table
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                }
                else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: {
                            doctorId: inputData.doctorId,
                        },
                        raw: false
                    })

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save();
                    }
                }

                // upsert to Doctor_infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorID: inputData.doctorId,
                    },
                    raw: false
                })

                if (doctorInfor) {
                    // update
                    doctorInfor.doctorID = inputData.doctorId;
                    doctorInfor.priceID = inputData.selectedPrice;
                    doctorInfor.provinceID = inputData.selectedProvince;
                    doctorInfor.paymentID = inputData.selectedPayment;
                    doctorInfor.note = inputData.note;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    await doctorInfor.save();
                } else {
                    // create
                    await db.Doctor_Infor.create({
                        doctorID: inputData.doctorId,
                        priceID: inputData.selectedPrice,
                        provinceID: inputData.selectedProvince,
                        paymentID: inputData.selectedPayment,
                        note: inputData.note,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                    })
                }

                resolve({
                    errorCode: 0,
                    errorMessage: 'Save infor doctor success !'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getDetailDoctorByIdService = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing required id !",
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: idInput
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                'description',
                                'contentHTML',
                                'contentMarkdown'
                            ],

                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },

                            ]

                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errorCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getAllDetailDoctorService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ['password', 'image', 'createdAt', 'firstName', 'lastName', 'phoneNumber']
                },
                include: [
                    {
                        model: db.Markdown,
                        attributes: [
                            'description',
                            'contentHTML',
                            'contentMarkdown'
                        ],
                    },
                ],
                raw: false,
                nest: true
            })

            resolve({
                errorCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error);
        }
    
    })
}


let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.arraySchedule || !data.doctorId || !data.date) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing require param !"
                })
            }
            else {
                let schedule = data.arraySchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                // get all exist data
                let existing = await db.Schedule.findAll(
                    {
                        where: { doctorId: data.doctorId, date: data.date },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true

                    }
                );

                // compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });


                // create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);

                }

                console.log("hoi dan it to schedule", toCreate);


                resolve({
                    errorCode: 0,
                    errorMessage: "OK"
                })
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing required parameters"
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },

                    ],
                    raw: false,
                    nest: true
                })
                if (!data) {
                    return data = [];
                }
                resolve({
                    errorCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getExtraInforDoctor = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing required parameters"
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorID: doctorId
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};
                resolve({
                    errorCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getProfileDoctor = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing required parameters"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                'description',
                                'contentHTML',
                                'contentMarkdown'
                            ],

                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },

                            ]

                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errorCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getTopDoctorHome,
    getAllDoctor,
    saveDetailInforDoctor,
    getDetailDoctorByIdService,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctor,
    getProfileDoctor,
    getAllDetailDoctorService
}