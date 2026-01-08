const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/categories.json');

const readData = () => {
    try {
        if (!fs.existsSync(dataPath)) return [];
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

exports.getAllCategories = (req, res) => {
    const categories = readData();
    res.json(categories);
};

exports.createCategory = (req, res) => {
    const categories = readData();
    const newCategory = {
        id: Date.now().toString(),
        ...req.body
    };
    categories.push(newCategory);
    writeData(categories);
    res.status(201).json(newCategory);
};

exports.updateCategory = (req, res) => {
    const categories = readData();
    const index = categories.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Category not found' });

    categories[index] = { ...categories[index], ...req.body };
    writeData(categories);
    res.json(categories[index]);
};

exports.deleteCategory = (req, res) => {
    let categories = readData();
    const exists = categories.find(c => c.id === req.params.id);
    if (!exists) return res.status(404).json({ message: 'Category not found' });

    categories = categories.filter(c => c.id !== req.params.id);
    writeData(categories);
    res.json({ message: 'Category deleted successfully' });
};
