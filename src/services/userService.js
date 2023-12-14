import db from "../models/index";
import bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        // const someOtherPlaintextPassword = 'not_bacon';
        try {
            const hash = await bcrypt.hashSync(password, salt);
            resolve(hash);
        } catch (error) {
            reject(error);
        }
    })
}


const handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                // user already exists
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes:
                        ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    raw: true,

                })
                if (user) {
                    // comparse password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errorCode = 0;
                        userData.errorMsg = 'Ok';
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errorCode = 3;
                        userData.errorMsg = `Wrong password . Please try again !`
                    }

                }
                else {
                    userData.errorCode = 2;
                    userData.errorMsg = `User isn't exist . Please try again !`
                }
            }
            else {
                // return error
                userData.errorCode = 1;
                userData.errorMsg = `Your's email isn't exist . Please try again !`
            }
            resolve(userData);
        } catch (error) {
            reject(error)
        }
    })
}


const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error);
        }
    })
}

const getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

const createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errorCode: 1,
                    errorMessage: "Your email is already in use . Please try again"
                })
            }
            else {
                const myPlaintextPassword = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: myPlaintextPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })

                resolve({
                    errorCode: 0,
                    errorMsg: "OK"
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: id }
        })
        if (!user) {
            resolve({
                errorCode: 2,
                errorMsg: `The User is not exist in the database`
            })
        }

        await db.User.destroy({
            where: { id: id }
        })

        resolve({
            errorCode: 0,
            errorMsg: 'User was deleted'
        })
    })
}

const updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("check:", data);
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errorCode: 2,
                    errorMsg: 'Missing required parameter'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phoneNubmber = data.phoneNumber;
                user.image = data.avatar;

                await user.save()

                resolve({
                    errorCode: 0,
                    Msg: 'Update success !'
                })
            } else {
                resolve({
                    errorCode: 1,
                    errorMsg: 'User not found !'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

const getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errorCode: 1,
                    errorMessage: 'Missing parameter!'
                });
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errorCode = 0;
                res.data = allcode;
                resolve(res);
            }

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    updateUserData,
    getAllCodeService

}