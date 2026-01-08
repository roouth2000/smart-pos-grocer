const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');

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

exports.getAllProducts = (req, res) => {
    const products = readData();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    if (endIndex < products.length) {
        results.next = { page: page + 1, limit: limit };
    }
    if (startIndex > 0) {
        results.previous = { page: page - 1, limit: limit };
    }

    results.total = products.length;
    results.results = products.slice(startIndex, endIndex);

    res.json(results);
};

exports.getProductById = (req, res) => {
    const products = readData();
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
};

exports.createProduct = (req, res) => {
    const products = readData();
    const newProduct = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
    };

    if (req.file) {
        newProduct.image = `/uploads/products/${req.file.filename}`;
    }

    products.push(newProduct);
    writeData(products);
    res.status(201).json(newProduct);
};

exports.updateProduct = (req, res) => {
    const products = readData();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    const updatedData = { ...req.body };
    if (req.file) {
        updatedData.image = `/uploads/products/${req.file.filename}`;
    }

    products[index] = { ...products[index], ...updatedData, updatedAt: new Date().toISOString() };
    writeData(products);
    res.json(products[index]);
};

exports.deleteProduct = (req, res) => {
    let products = readData();
    const exists = products.find(p => p.id === req.params.id);
    if (!exists) return res.status(404).json({ message: 'Product not found' });

    products = products.filter(p => p.id !== req.params.id);
    writeData(products);
    res.json({ message: 'Product deleted successfully' });
};
