const Permission = require('../models/Permission');

exports.createPermission = async (req, res) => {
    try {
        const { name, slug, group_name } = req.body;

        const existingPermission = await Permission.findOne({ slug });
        if (existingPermission) {
            return res.status(400).json({ message: 'Permission already exists' });
        }

        const permission = new Permission({
            name,
            slug,
            group_name
        });

        await permission.save();

        res.status(201).json(permission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
