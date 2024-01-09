import clinicService from '../services/clinicService'

let createClinic = async (req, res) => {
    try {
        let information = await clinicService.createClinicService(req.body);
        return res.status(200).json(information);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let information = await clinicService.getAllClinicService();
        return res.status(200).json(information);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }

}


let getDetailClinic = async (req, res) => {
    try {
        let information = await clinicService.getDetailClinicService(req.query.id);
        return res.status(200).json(information);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: "error from server"
        })
    }

}

module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinic

}