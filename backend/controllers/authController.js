const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

// Mock User DB
const users = [
    {
        id: 1,
        username: 'admin',
        name: 'Super Admin',
        email: 'admin@tracker.test',
        password: '$2a$10$wI.qx.sZ.k.x.y.z.hashedpassword', // password is 'admin123' (mock hash)
        roles: [
            {
                id: 1,
                name: 'Super Admin',
                slug: 'super-admin'
            }
        ]
    }
];

// Mocking bcrypt compare for demo simplicity with cleartext if hash fails (DO NOT DO IN PROD)
// Actually let's just use simple check for the demo to ensure it works without complex seeding
const validateUser = async (username, password) => {
    const user = users.find(u => u.username === username);
    if (!user) return null;
    // For demo: accepting 'admin123'
    if (password === 'admin123') return user;
    return null;
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await validateUser(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user.id, role: user.roles[0].slug }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id, role: user.roles[0].slug }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Send Refresh Token in HttpOnly Cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
        access_token: accessToken,
        token_type: 'bearer',
        expires_in: 3600,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles
        }
    });
};

exports.refresh = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    });
};

exports.logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict', secure: false });
    res.json({ message: 'Cookie cleared' });
};
