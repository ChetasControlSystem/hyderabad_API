const Permission = require("../models/permission.model")


exports.createPermission = async function(req, res, next){

    try {

        const newPermission = await Permission.create(req.body);
        return res.status(201).json({ error: false, msg: "Permission created successfully", data: newPermission });
     
    } catch (error) {
        return res.status(400).send({ error : true, msg: "Permission not created"})
    }

}