import userService from "../services/userService"

const handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errorCode: 1,
            message: 'Missing inputs parameter !'
        })
    }

    let userData = await userService.handleUserLogin(email, password);
    console.log(userData);

    return res.status(200).json({
        errorCode: userData.errorCode,
        message: userData.errorMsg,
        user: userData.user ? userData.user : {}
    })
}

const handleGetAllUsers = async (req, res) => {
    let id = req.query.id; //ALL, id

    if (!id) {
        return res.status(200).json({
            errorCode: 1,
            errorMsg: 'Missing required parameters !',
            users: []
        })
    }

    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errorCode: 0,
        errorMsg: 'OK',
        users
    })
}

const handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message)
}


const handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errorCode: 1,
            errorMsg: "Missing require parameters !"
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message)
}

const handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message)
}

const getAllCode = async (req, res) => {
    try {
        setTimeout(async () => {
            let data = await userService.getAllCodeService(req.query.type);
            return res.status(200).json(data)
        }, 5000)

    } catch (error) {
        console.log("Get all code server:", error);
        return res.status(200).json({
            errorCode: -1,
            errorMsg: "Error from server",
        })
    }
}


module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode
}