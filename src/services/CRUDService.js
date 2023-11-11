import bcrypt from 'bcrypt';
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);


let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const myPlaintextPassword = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: myPlaintextPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })

            resolve('create new user success');

        } catch (error) {
            reject(e)
        }
    })

}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        // const someOtherPlaintextPassword = 'not_bacon';

        try {
            const hash = bcrypt.hashSync(password, salt);
            resolve(hash);
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            })

            if (user) {
                resolve(user);
            }
            else {
                resolve({});
            }

        } catch (error) {
            reject(error);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.lastName = data.lastName,
                    user.firstName = data.firstName,
                    user.address = data.address,
                    user.phoneNumber = data.phoneNumber

                await user.save();

                let allUsers = await db.User.findAll();
                resolve(allUsers)
            } else {
                resolve()
            }
        } catch (error) {
            console.log(error);
        }
    })
}

let deleteUserByID = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id }
            })
            if (user) {
                user.destroy();
            }

            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    createNewUser,
    getAllUsers,
    getUserInfoById,
    updateUserData,
    deleteUserByID,
}