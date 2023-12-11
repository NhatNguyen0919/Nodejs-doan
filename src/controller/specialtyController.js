
import specialtyService from "../services/specialtyService"

const createSpecialty = async (req, res) => {
    try {
        let information = await specialtyService.createSpecialtyService(req.body);
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
    createSpecialty
}