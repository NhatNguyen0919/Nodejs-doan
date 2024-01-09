import doctorService from "../services/doctorService"


let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;

    try {
        let doctors = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(doctors);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            message: "error from server..."
        })
    }
}

let getAllDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctor();
        return res.status(200).json(doctors);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}

let postInforDoctors = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let information = await doctorService.getDetailDoctorByIdService(req.query.id);
        return res.status(200).json(information);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}
let getAllDetailDoctor = async (req, res) => {
    try {
        let information = await doctorService.getAllDetailDoctorService();
        return res.status(200).json(information);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let response = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let response = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}

let getExtraInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.getExtraInforDoctor(req.query.doctorId);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}

let getProfileDoctor = async (req, res) => {
    try {
        let response = await doctorService.getProfileDoctor(req.query.doctorId);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}

let getListPatients = async (req, res) => {
    try {
        let response = await doctorService.getListPatientsService(req.query.doctorId, req.query.date);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}

let sendPrescription = async (req, res) => {
    try {
        let response = await doctorService.sendPrescriptionService(req.body);
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
    getTopDoctorHome, getAllDoctor, postInforDoctors, getDetailDoctorById,
    bulkCreateSchedule, getScheduleByDate, getExtraInforDoctor,
    getProfileDoctor, getAllDetailDoctor, getListPatients,
    sendPrescription
}