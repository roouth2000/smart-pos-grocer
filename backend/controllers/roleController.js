const Role = require('../models/Role');
const Permission = require('../models/Permission');

exports.createRole = async (req, res) => {
    try {
        const { name, slug, permissions } = req.body;

        const existingRole = await Role.findOne({ slug });
        if (existingRole) {
            return res.status(400).json({ message: 'Role already exists' });
        }

        // Validate permissions
        if (permissions && permissions.length > 0) {
            const validPermissions = await Permission.find({ _id: { $in: permissions } });
            if (validPermissions.length !== permissions.length) {
                return res.status(400).json({ message: 'One or more invalid permission IDs' });
            }
        }

        const role = new Role({
            name,
            slug,
            permissions
        });

        await role.save();

        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
