import patientService from '../services/patientService'

let postBookAppointment = async (req, res) => {
    try {
        let information = await patientService.postBookAppointment(req.body);
        return res.status(200).json(information);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}
let postVerifyBookAppointment = async (req, res) => {
    try {
        let information = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(information);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}

let getDateBooking =  async (req, res) => {
    try {
        let response = await patientService.getDateBooking(req.query.token);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}



module.exports = {
    postBookAppointment,
    postVerifyBookAppointment,
    getDateBooking
}