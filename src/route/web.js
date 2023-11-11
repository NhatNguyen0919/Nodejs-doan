import express from "express";
import homeController from "../controller/homeController"
import userController from "../controller/userController"
import doctorsController from "../controller/doctorsController"

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
    // DOCTOR Controller


    return app.use("/", router);
}

module.exports = initWebRoutes;