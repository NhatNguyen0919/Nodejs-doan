import express from "express";
import homeController from "../controller/homeController"
import userController from "../controller/userController"
import doctorsController from "../controller/doctorsController"
import patientController from "../controller/patientController"
import specialtyController from "../controller/specialtyController"

let router = express.Router();

let initWebRoutes = (app) => {
    // HOME Controller
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.showCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);
    // HOME Controller

    // USER Controller
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);
    // USER Controller

    // DOCTOR Controller
    router.get('/api/top-doctor-home', doctorsController.getTopDoctorHome);
    router.get('/api/get-all-doctor', doctorsController.getAllDoctor);
    router.post('/api/save-infor-doctor', doctorsController.postInforDoctors);
    router.get('/api/get-detail-doctor-by-id', doctorsController.getDetailDoctorById);
    router.get('/api/get-all-detail-doctor', doctorsController.getAllDetailDoctor);
    // DOCTOR Controller


    // Schedule Controller
    router.post('/api/bulk-create-schedule', doctorsController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorsController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorsController.getExtraInforDoctor);
    router.get('/api/get-profile-doctor-by-id', doctorsController.getProfileDoctor);

    router.post('/api/patient-booking', patientController.postBookAppointment);
    router.post('/api/verify-booking', patientController.postVerifyBookAppointment);
    router.get('/api/get-day-booking', patientController.getDateBooking);

    router.post('/api/create-specialty', specialtyController.createSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty', specialtyController.getDetailSpecialty);

    return app.use("/", router);
}

module.exports = initWebRoutes;