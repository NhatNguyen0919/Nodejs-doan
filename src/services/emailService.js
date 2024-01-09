require('dotenv').config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (datasend) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.MAIL_APP,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"CareMed 👻" <CareMed@gmail.com>', // sender address
        to: datasend.receiverEmail, // list of receivers
        subject: "Xác Nhận Đặt Lịch Khám Bệnh ✔", // Subject line
        text: "Hello world?", // plain text body
        html: getBodyEmail(datasend)  // html body
    });
}

let getBodyEmail = (datasend) => {
    let result = '';
    if (datasend.language === 'vi') {
        result = `
        <h3>Kính gửi bệnh nhân ${datasend.patientName}!</h3>
        <p>Chúng tôi xin thông báo rằng bạn đã đặt lịch khám bệnh online trên hệ thống CareMed.</p>
        <p>Thông tin chi tiết đặt lịch: </p>
        <div><b>Thời gian: ${datasend.time}</b></div>
        <div><b>Bác sĩ: ${datasend.doctorName}</b></div>

        <p>Nếu các thông tin trên là chính xác, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh:</p>
        <div>
            <a href="${datasend.redirectLink}" target="_blank">Xác Nhận Lịch Khám</a>
        </div>

        <p>Xin cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ CareMed</p>
    `
    }
    if (datasend.language === 'en') {
        result = `
        <h3>Dear patient ${datasend.patientName}!</h3>
        <p>We would like to inform you that you have successfully booked an online medical appointment through the CareMed system.</p>
        <p>Details of your appointment:</p>
        <div><b>Time: ${datasend.time}</b></div>
        <div><b>Doctor: ${datasend.doctorName}</b></div>

        <p>If the information above is correct, please click the link below to confirm and complete the appointment booking process:</p>
        <div>
            <a href="${datasend.redirectLink}" target="_blank">Confirm Appointment</a>
        </div>

        <p>Thank you for choosing our services.</p>
        <p>Best regards,</p>
        <p>The CareMed Team</p>

    `
    }
    return result;
}

let sendAttachment = async (datasend) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: process.env.MAIL_APP,
                pass: process.env.MAIL_PASSWORD,
            },
        });


        const info = await transporter.sendMail({
            from: '"CareMed 👻" <CareMed@gmail.com>', // sender address
            to: datasend.email, // list of receivers
            subject: "Kết quả đặt Lịch Khám Bệnh ✔", // Subject line
            text:
                `Kính gửi bệnh nhân ${datasend.patientName} !
            Xin cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
            Trân trọng
            Đội ngũ CareMed
            `, // plain text body
            html: getBodyEmailPrescription(datasend),          // html body
            attachments: {   // encoded string as an attachment
                filename: `prescription-${datasend.patientId}-${new Date().getTime()}.png`,
                content: datasend.imgBase64.split("base64")[1],
                encoding: 'base64'
            },
        });
    } catch (error) {
        throw error;
    }


}

let getBodyEmailPrescription = (datasend) => {
    let result = '';
    if (datasend.language === 'vi') {
        result = `
        <h3></h3>
        <p>Chúng tôi xin thông báo rằng bạn đã đặt lịch khám bệnh online trên hệ thống CareMed.</p>
        <p>Thông tin hóa đơn : </p>
       
        
        <p>Xin cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ CareMed</p>
    `
    }
    if (datasend.language === 'en') {
        result = `
        <h3>Dear ${datasend.patientName} !</h3>
        <p>We would like to inform you that you have successfully booked an online medical appointment through the CareMed system.</p>
        <p>Details of your appointment:</p>
        

        <p>Thank you for choosing our services.</p>
        <p>Best regards,</p>
        <p>The CareMed Team</p>

    `
    }
    return result;
}




module.exports = {
    sendSimpleEmail,
    sendAttachment
}