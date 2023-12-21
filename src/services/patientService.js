require("dotenv").config();
import db from "../models";
import { sendSimpleEmail } from "./emailService";
import { v4 as uuidv4 } from 'uuid';

let buildURLEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&&doctor-id=${doctorId}`;
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing parameter",
                })
            } else {
                let token = uuidv4();

                resolve({
                    data,
                    errorCode: 0,
                    errorMessage: "Save infor patient succeed !"
                })

                await sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildURLEmail(data.doctorId, token)
                })
                // upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    }
                });

                // create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            dayBooking: data.dayBooking,
                            token: token
                        }
                    })
                }


            }
        } catch (error) {
            reject(error);
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing parameter",
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save();

                    resolve({
                        errorCode: 0,
                        errorMessage: "Update successful !"
                    })
                } else {
                    resolve({
                        errorCode: 2,
                        errorMessage: "Appointment has already been activated or does not exist"
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getDateBooking = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!token) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing require param !"
                })
            }
            else {
                let res = await db.Booking.findOne({
                    where: {
                        token: token,
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData2', attributes: ['valueEn', 'valueVi'] },

                    ],

                    raw: false

                })
                resolve({
                    errorCode: 0,
                    data: res
                })
            }
        } catch (error) {
            reject(error);
        }

    })
}

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment,
    getDateBooking
}