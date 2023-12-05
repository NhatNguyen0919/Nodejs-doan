require("dotenv").config();
import db from "../models";

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Missing parameter",
                })
            } else {
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
                            dayBooking:data.dayBooking
                        }
                    })
                }

                resolve({
                    errorCode: 0,
                    errorMessage: "Save infor patient succeed !"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    postBookAppointment
}