const contactModel = require("../model/contactModel")
const aws = require("../service/aws")

/******************************************************CREATING CONTACT'S**************************************************** */
const createContact = async (req, res) => {
    try {
        let data = req.body;
        if (!data.userName || !data.userContact) {
            return res.status(400).send({ status: false, message: "Please Provide Username and Usercontact", data: "" })
        }
        if (data.userContact.length < 10) {
            return res.status(400).send({ status: false, message: "Please Provide valid Usercontact, must have 10 number", data: "" })
        }
        const file = req.files;
        if (!file || file.length == 0) {
            return res.status(400).send({ status: false, message: "Please provide Contact Photo in file", data: "" })
        }
        if (file && file.length > 0) {
            if (file[0].mimetype.indexOf('image') == -1) {
                return res.status(400).send({ status: false, message: 'Only image files are allowed !' })
            }
        }
        const photo = await aws.uploadFile(file[0]);
        data.contactPhoto = photo

        const contactRes = await contactModel.create(data)
        return res.status(201).send({ status: true, message: "Contact created Successfully", data: contactRes })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message, data: "" })
    }
}


/*************************************************DELETE CONTACT'S***************************************************** */
const deleteContact = async (req, res) => {
    try {
        if (!req.body.contact) {
            return res.status(400).send({ status: false, message: "Please provide contact", data: "" })
        }
        const deleteContact = await contactModel.findOneAndUpdate({ userContact: req.body.contact }, {
            $set: {
                isDeleted: true
            }
        }, {
            new: true
        })
        if (!deleteContact) {
            return res.status(404).send({ status: false, message: "Contact not found", data: "" })
        }
        return res.status(200).send({ status: true, message: "Contact deleted Successfully", data: deleteContact })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message, data: "" })
    }
}

/************************************************FETCH ALL CONTACT'S*************************************************** */
const fetchAllContact = async (req, res) => {
    try {
        const data = await contactModel.find({ isDeleted: false }).select({ _id: 0, userName: 1, userContact: 1, contactPhoto: 1})
        if (data.length == 0) {
            return res.status(404).send({ status: false, message: "No contact Found", data: "" })
        }
        return res.status(200).send({ status: true, message: "Contact found Successfully", totalContact: data.length, data: data })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message, data: "" })
    }
}


/*******************************************FETCH ALL DELETED CONTACT'S************************************************ */
const fetchAllDeletedContact = async (req, res) => {
    try {
        const data = await contactModel.find({ isDeleted: true }).select({ _id: 0, userName: 1, userContact: 1, contactPhoto: 1 })
        if (data.length == 0) {
            return res.status(404).send({ status: false, message: "No contact Found", data: "" })
        }
        return res.status(200).send({ status: true, message: "Contact found Successfully", totalContact: data.length, data: data })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message, data: "" })
    }
}


/*****************************************************SEARCH ALL CONTACT'S*********************************************** */
const searchContact = async (req, res) => {
    try {
        let search = {}
        search.isDeleted = false
        if (!req.body.name || !req.body.phoneNumber) {
            return res.status(400).send({ status: false, message: "Please provide Username in name and Usercontact in phoneNumber. For no search provide blank", data: "" })
        }
        if (req.body.name && req.body.name !== " ") {
            search.userName = { $regex: req.body.name, $options: "i" }
        }
        if (req.body.phoneNumber && req.body.phoneNumber !== " ") {
            search.userContact = req.body.phoneNumber
        }
        const data = await contactModel.find(search).select({ _id: 0, userName: 1, userContact: 1, contactPhoto: 1 })
        if (data.length == 0) {
            return res.status(404).send({ status: false, message: "No contact Found", data: "" })
        }
        return res.status(200).send({ status: true, message: "Contact Found Successfully", data: data })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message, data: "" })
    }
}


/************************************************UPDATE CONTACT'S******************************************************* */

const updateContact = async (req, res) => {
    try {
        let data = req.body;
        if (!data.phoneNumber) {
            return res.status(400).send({ status: false, message: "Please provide phone number", data: "" })
        }
        let updateData = {}
        if (req.body.userName && req.body.userName !== "") {
            updateData.userName = req.body.userName
        }
        if (req.body.userContact && req.body.userContact !== "") {
            updateData.userContact = req.body.userContact
        }
        if (req.body.isDeleted) {
            updateData.isDeleted = req.body.isDeleted
        }
        const file = req.files;
        if (file && file.length > 0) {
            if (file[0].mimetype.indexOf('image') == -1) {
                return res.status(400).send({ status: false, message: 'Only image files are allowed !' })
            } else {

                const photo = await aws.uploadFile(file[0]);
                updateData.contactPhoto = photo
            }
        }
        const updateContact = await contactModel.findOneAndUpdate({ userContact: req.body.phoneNumber },
            {
                $set: updateData
            }, {
            new: true
        })
        if (!updateContact) {
            return res.status(404).send({ status: false, message: "Contact not found", data: "" })
        }
        return res.status(200).send({ status: true, message: "Contact Updated Successfully", data: updateContact })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message, data: "" })
    }
}


/********************************************EXPORTING CONTACT'S HANDLERS********************************************* */

module.exports = {
    createContact,
    deleteContact,
    fetchAllContact,
    fetchAllDeletedContact,
    searchContact,
    updateContact
}