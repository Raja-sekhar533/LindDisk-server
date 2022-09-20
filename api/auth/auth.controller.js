const authModel = require('./auth.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('./admin.model');
module.exports = {
    Signup: async(req, res) => {
        try {
            let user_result = req.body.body;
            console.log(user_result)
            let result = await authModel.findOne({ email: user_result.email });
            if (result)
                res.status(208).send({ result: false, message: "user is already registered..." });
            else {
                let salt = await bcrypt.genSalt(10);
                user_result.password = await bcrypt.hash(user_result.password, salt);
                user_result.revenue = 0;
                try {
                    let new_user = await authModel.create(user_result);
                    const payload = { subject: new_user._id };
                    const token = jwt.sign(payload, 'LineDisk');
                    // const token = new_user.generateAuthToken();
                    let userData = {};
                    userData.email = new_user.email,
                        userData._id = new_user._id,
                        userData.username = new_user.username,

                        userData.token = token
                    res.status(200).send({
                        result: true,
                        data: userData.token,
                        role: userData.role
                    });
                } catch (e) {
                    console.log(e)
                    res.status(400).send(e.message)
                }


            }
        } catch (err) {
            console.log(err)

            res.status(400).send(err.message)
        }
    },
    login: async(req, res, next) => {
        let userData = req.body;
        try {
            let result = await authModel.findOne({ $or: [{ email: userData.username }, { username: userData.username }] });
            if (result) {
                let isValidPassword = await bcrypt.compare(userData.password, result.password);
                if (!isValidPassword)
                    res.status(208).send({ result: false, message: "Invalid Password..." });
                else {
                    const payload = { subject: result._id };
                    const token = jwt.sign(payload, 'LineDisk');
                    // const token = result.generateAuthToken();
                    let data = {}
                    data.email = result.email,
                        data._id = result._id,
                        data.username = result.username,
                        data.token = token

                    res.status(200).send({
                        result: true,
                        token: data.token,
                        id: data._id,
                        name: data.username,
                        revenue: data.revenue
                    });
                }
            } else {
                res.status(208).send({ result: false, message: "Invalid Email Id or Phone Number..." });
            }
        } catch (e) {
            //  next(e); 
            console.log(e.message);
        }
    },
    AddAdmin: async(req, res) => {
        try {
            const data = req.body;
            if (data) {
                const AdminData = new Admin();
                AdminData.username = data.username;
                AdminData.email = data.email;
                AdminData.phone = data.mobile;
                let salt = await bcrypt.genSalt(10);
                AdminData.password = await bcrypt.hash(data.password, salt);

                const result = AdminData.save();
                if (result) {
                    res.status(200).send({ result: true, message: "Admin Added Successfully!" });
                }
            }

        } catch (err) {
            res.status(400).send(err.message);
        }
    },
    AdminLogin: async(req, res, next) => {
        let userData = req.body;
        console.log(userData)
        try {
            let result = await Admin.findOne({ $or: [{ email: userData.username }, { username: userData.username }] });
            if (result) {
                let isValidPassword = await bcrypt.compare(userData.password, result.password);
                if (!isValidPassword)
                    res.status(208).send({ result: false, message: "Invalid Password..." });
                else {
                    const payload = { subject: result._id };
                    const token = jwt.sign(payload, 'LineDisk');
                    // const token = result.generateAuthToken();
                    let data = {}
                    data.email = result.email,
                        data._id = result._id,
                        data.username = result.username,
                        data.token = token

                    res.status(200).send({ result: true, token: data.token, id: data._id, name: data.username });
                }
            } else {
                res.status(208).send({ result: false, message: "Invalid Email Id or Phone Number..." });
            }
        } catch (e) {
            //  next(e); 
            console.log(e.message);
        }
    },
    getRevenueById: async(req, res) => {
        const userId = req.params.id;
        try {
            const token = userId;
            const decoded = jwt.decode(token, "LineDisk");
            const _id = decoded.subject
            const revenue = await authModel.findById(_id);
            if (revenue) {
                res.status(200).json({ revenue: revenue.revenue });
            }
        } catch (e) {
            res.status(400).send(e.message);
        }
    }

}