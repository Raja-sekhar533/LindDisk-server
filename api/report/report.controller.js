const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    sendReport: async(req, res) => {
        const email = "linedisk3@gmail.com";
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            service: 'gmail',
            auth: {
                user: 'linedisk3@gmail.com',
                pass: 'mwbuqytgfhjatpxl'
            },
            secureConnection: 'false',
            tls: {
                rejectUnauthorized: false
            }
        });
        const reqBody = req.body;
        if (req.body.UserId) {
            const token = req.body.UserId;
            const decoded = jwt.decode(token, "LineDisk");
            const _id = decoded.subject



            var datas = {
                from: "linedisk3@gmail.com",
                // sender address 
                to: email, // list of receivers 
                subject: `Report on ${reqBody.videoId}`, // Subject line 
                html: `<div class="container-fluid"><div class="row"><div style="width: 100%; height:4rem; background-color:#00ccff"><img style="height:4rem;width:auto;" src="cid:logo" alt=""></div><div><div><br></div><h4>Dear Admin,</h4><p>user <span style="font-weight: bold; color:blue">${_id}</span> reported on the following video content as <span style="font-weight: bold; color:red">${reqBody.Reportedas}</span>.</p><h3 style="font-weight: bold;">Content Details:</h3><ul style="font-weight: bold; list-style:none"><li style="font-weight:600">Video ID: <span style="color:gray">${reqBody.videoId}</span></li><li>Uploaded User ID: <span style="color:gray">${reqBody.VideoUserId}</span></li><li>Reported User ID: <span style="color:gray">${reqBody._id}</span></li><li>Reported as: <span style="color:red">${reqBody.Reportedas}</span></li></ul><div><p>Thanks and Regards <br> <span>Line Disk Reports Team</span></p>  </div></div></div></div>` // html body
                    ,
                attachments: [

                    {
                        filename: 'logo2.png',
                        path: __dirname + '/images/logo2.png',
                        cid: 'logo'
                    }
                ]
            };
        }
        var datas1 = {
            from: "linedisk3@gmail.com",
            // sender address 
            to: email, // list of receivers 
            subject: `Report on ${reqBody.videoId}`, // Subject line 
            html: `<div class="container-fluid"><div class="row"><div style="width: 100%; height:4rem; background-color:#00ccff"><img style="height:4rem;width:auto;" src="cid:logo" alt=""></div><div><div><br></div><h4>Dear Admin,</h4><p>Unknown user reported on the following video content as <span style="font-weight: bold; color:red">${reqBody.Reportedas}</span>.</p><h3 style="font-weight: bold;">Content Details:</h3><ul style="font-weight: bold; list-style:none"><li style="font-weight:600">Video ID: <span style="color:gray">${reqBody.videoId}</span></li><li>Uploaded User ID: <span style="color:gray">${reqBody.VideoUserId}</span></li><li>Reported as: <span style="color:red">${reqBody.Reportedas}</span></li></ul><div><p>Thanks and Regards <br> <span>Line Disk Reports Team</span></p>  </div></div></div></div>` // html body
                ,
            attachments: [

                {
                    filename: 'logo2.png',
                    path: __dirname + '/images/logo2.png',
                    cid: 'logo'
                }
            ]
        };

        if (req.body.UserId) {
            transporter.sendMail(datas, (err, data) => {
                if (err) {
                    // res.json({
                    //     error: err.message
                    // })
                    console.log(err.message);
                } else {
                    console.log("success")
                    res.status(200).json({ status: true })
                    console.log(data)
                }
            })
        } else {
            transporter.sendMail(datas1, (err, data) => {
                if (err) {
                    // res.json({
                    //     error: err.message
                    // })
                    console.log(err.message);
                } else {
                    console.log("success")
                    res.status(200).json({ status: true })
                    console.log(data)
                }
            })
        }
    }
}