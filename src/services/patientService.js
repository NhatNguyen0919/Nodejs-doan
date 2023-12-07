require("dotenv").config();
import db from "../models";
import { sendSimpleEmail } from "./EmailService";

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing parameter",
                })
            } else {

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
                    redirectLink: "https://www.facebook.com/"
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
                            dayBooking: data.dayBooking
                        }
                    })
                }

                
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    postBookAppointment
}