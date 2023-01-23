const videoModel = require('./video.model');
const jwt = require('jsonwebtoken');
const e = require('express');
const viewModel = require('./view.model');
const ObjectID = require('mongodb').ObjectId;
var mongoose = require('mongoose');
const authModel = require('../auth/auth.model');
const { response } = require('express');

startJobAt(14, 46, tick);

function startJobAt(hh, mm, code) {
    var interval = 0;
    var today = new Date();
    var todayHH = today.getHours();
    var todayMM = today.getMinutes();
    if ((todayHH > hh) || (todayHH == hh && todayMM > mm)) {
        var midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        interval = midnight.getTime() - today.getTime() +
            (hh * 60 * 60 * 1000) + (mm * 60 * 1000);
    } else {
        interval = (hh - todayHH) * 60 * 60 * 1000 + (mm - todayMM) * 60 * 1000;
    }
    return setTimeout(code, interval);
}

function tick() {

}

module.exports = {

    PostVideo: async(req, res) => {
        const file = req.file;
        const url = req.protocol + '://' + req.get("host");
        const final_path = url + '/' + file.path;

        try {
            if (!file) {
                const error = new Error('Please upload a file')
                error.httpStatusCode = 400
                return next(error)
            }
            const data = req.body;
            const token = data.userId;
            const decoded = jwt.decode(token, "LineDisk");
            const _id = decoded.subject
            const uploadedData = new videoModel();
            uploadedData.videourl = final_path;
            uploadedData.filetitle = data.title;
            uploadedData.fileDescription = data.description;
            uploadedData.fileSize = data.size;
            uploadedData.date = new Date(data.date);
            uploadedData.userId = _id;
            uploadedData.views = 0;
            uploadedData.revenue = 0;

            const confirm = uploadedData.save();
            if (confirm) {
                res.status(200).send({
                    statusCode: 200,
                    status: 'success',
                    uploadedFile: file
                });
                console.log("success");
            } else {
                res.status(500).send({
                    statusCode: 500,
                    status: 'faild',
                });
                console.log("faild");
            }

        } catch (error) {
            res.status(400).send(error.message);
        }
    },
    getVideosById: async(req, res) => {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        console.log(pageSize, currentPage);

        const token = req.params.id;
        const decoded = jwt.decode(token, "LineDisk");
        const _id = decoded.subject;

        const videosQuery = videoModel.find({ userId: _id });
        try {
            if (pageSize && currentPage) {
                videosQuery.skip(pageSize * (currentPage - 1))
                    .limit(pageSize)
            }
            const videosQueryCount = await videoModel.find({ userId: _id }).count();
            const data = await videosQuery;
            res.status(200).send({
                result: true,
                data: data,
                total: videosQueryCount
            });


        } catch (err) {
            res.status(400).send(err.message);
        }
    },
    getVideoById: async(req, res) => {

        try {
            const id = req.params.id;

            const data = await videoModel.findById(id);
            if (data) {
                res.status(200).json({ result: true, data: data })
            } else {
                res.status(208).send({ result: false, message: "File Not Found!" });
            }
        } catch (err) {
            res.staus(400).send(err.message);
        }
    },
    UpdateById: async(req, res) => {
        try {
            const token = req.params.id;
            const decoded = jwt.decode(token, "LineDisk");
            const _id = decoded.subject
            const body = req.body;
            const UpdateVideoData = await videoModel.findByIdAndUpdate(_id, { $set: { filetitle: body.Filetitle, fileDescription: body.Description, date: new Date(body.date), } }, { new: true });

            if (UpdateVideoData) {
                res.status(200).json({ result: true, message: "Update Successful" });
            } else {
                res.status(208).send({ result: false, message: "update is faild!" })
            }

        } catch (err) {
            res.status(400).send(err.message);
        }
    },
    deleteVideo: async(req, res) => {
        try {
            const _id = req.params.id;
            const deletedVideo = await videoModel.findByIdAndDelete(_id);
            res.status(200).json({ result: true, message: "File Deleted Successfully!" });

        } catch (err) {
            res.status(400).send(err.messsage);
        }
    },
    getAllVideos: async(req, res) => {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        console.log(pageSize, currentPage);


        const videosQuery = videoModel.find();
        try {
            if (pageSize && currentPage) {
                videosQuery.skip(pageSize * (currentPage - 1))
                    .limit(pageSize)
            }
            const videosQueryCount = await videoModel.find().count();
            const data = await videosQuery;
            res.status(200).send({
                result: true,
                data: data,
                total: videosQueryCount
            });
        } catch (err) {
            res.status(400).send(err.message);
        }
    },

    addViewCount: async(req, res) => {
        try {
            const data = req.body;

            if (data.userId) {

                const token = req.body.userId;
                const decoded = jwt.decode(token, "LineDisk");
                const _id = decoded.subject

                const checkView = await viewModel.findOne({ videoId: data.videoId, userId: _id });


                if (checkView) {
                    res.status(200).json({ result: true });
                } else {
                    const viewCount = new viewModel();
                    viewCount.videoId = data.videoId;
                    viewCount.userId = _id;
                    viewCount.date = data.date;
                    const addedviewcount = await viewCount.save();
                    const video = await videoModel.findById(data.videoId);
                    const addview = await videoModel.findByIdAndUpdate(data.videoId, { $set: { views: video.views + 1 } }, { new: true });
                    const video1 = await videoModel.findById(data.videoId);
                    const addrevenue = await videoModel.findByIdAndUpdate(data.videoId, { $set: { revenue: video1.views * 0.00080 } }, { new: true });
                    const userinfo = await authModel.findById(_id);
                    const user = await authModel.findByIdAndUpdate(_id, { $set: { revenue: userinfo.revenue + 0.00080 } }, { new: true });
                    res.stuatus(200).send({ status: true });
                    if (addedviewcount) {
                        res.status(200).json({ result: true })
                    } else {
                        res.status(400).send("Something went wrong!.")
                    }
                }
            } else {
                const data = req.body;
                const checkView1 = await viewModel.findOne({ videoId: data.videoId, ipAddress: data.IpAddress });
                if (checkView1) {
                    res.status(200).json({ result: true });
                } else {
                    const viewCount = new viewModel();
                    viewCount.videoId = data.videoId;
                    viewCount.ipAddress = data.IpAddress;
                    viewCount.date = data.date;
                    const addedviewcount = await viewCount.save();
                    const video = await videoModel.findById(data.videoId);
                    const addview = await videoModel.findByIdAndUpdate(data.videoId, { $set: { views: video.views + 1 } }, { new: true });
                    const video1 = await videoModel.findById(data.videoId);
                    const addrevenue = await videoModel.findByIdAndUpdate(data.videoId, { $set: { revenue: video1.views * 0.00080 } }, { new: true });
                    const userinfo = await authModel.findById(video.userId);
                    const user = await authModel.findByIdAndUpdate(userinfo._id, { $set: { revenue: userinfo.revenue + 0.00080 } }, { new: true });
                    if (addedviewcount) {
                        res.status(200).json({ result: true })
                    } else {
                        res.status(400).send("Something went wrong!.")
                    }
                }
            }

        } catch (err) {
            res.status(400).send(err);
        }

    },

    getTotalRevenue: async(req, res) => {
        try {
            const id = req.params.id;
            const token = id;
            const decoded = jwt.decode(token, "LineDisk");
            const _id = decoded.subject
            const revenue = await videoModel.aggregate([{
                $project: {
                    userId: mongoose.Types.ObjectId(_id),
                    TotalValue: { $sum: "$revenue" }
                }
            }])
            let revenueAmount = 0;
            revenue.forEach(element => {
                revenueAmount = revenueAmount + element.TotalValue;
            });

            res.status(200).json({ result: true, revenueTotal: revenueAmount })

        } catch (err) {
            res.status(400).send(err.message);
        }
    },
    savetomydisk: async(req, res) => {
        try {
            const token = req.params.id;
            const decoded = jwt.decode(token, "LineDisk");
            const _id = decoded.subject
            const data = req.body;
            const uploadedData = new videoModel();
            uploadedData.videourl = data.playerUrl;
            uploadedData.filetitle = data.title;
            uploadedData.fileDescription = data.fileDescription;
            uploadedData.fileSize = data.fileSize;
            uploadedData.date = new Date();
            uploadedData.userId = _id;
            uploadedData.views = 0;
            uploadedData.revenue = 0;

            const saveDisk = uploadedData.save();
            if (saveDisk) {
                res.status(200).json({ status: true })
            }


        } catch (err) {
            res.status(400).send(err.message);
        }
    },
    isVideoSaved: async(req, res) => {
        try {
            const data = req.body;
            const token = req.body.userId;
            const decoded = jwt.decode(token, "LineDisk");
            const _id = decoded.subject;
            const isSaved = await videoModel.findOne({ _id: data.videoId, userId: _id });

            if (isSaved) {
                res.status(200).json({ status: true })
            } else {
                res.status(200).json({ status: false })
            }
        } catch (err) {
            res.status(200).send(err.message);
        }
    },

    categoryFilter: async(req, res, next) => {
        try {
            let name = req.body.name;
            const catData = await videoModel.find();

            let data = catData.filter(res => {
                return res.name.toLocaleLowerCase().match(name);
            })
            if (data) {
                res.status(200).json({ data: data });
            } else {
                res.status(200).json({ message: 'category not found' });
            }
        } catch (e) {
            res.status(400).send(e.message);
        }
    },

    getCategorybyId: async(req, res) => {
        const _id = req.params.id;
        try {
            const category_details = await videoModel.findById(_id);
            if (!category_details) {
                return res.status(202).send();
            }
            res.send(category_details);
        } catch (error) {
            res.status(400).send(error);
        }
    },
}