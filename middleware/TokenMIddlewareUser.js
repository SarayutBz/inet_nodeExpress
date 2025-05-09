// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     try {
//         console.log("Authorization Header:", req.headers.authorization);
//         const token = req.headers.authorization.split("Bearer ")[1]
//         const decoded = jwt.verify(token, process.env.JWT_KEY)
//         req.auth = decoded
//         return next()
//     }
//     catch (error) {
//         return res.status(401).json({
//             message: 'Auth failed'
//         })
//     }
// }
const jwt = require('jsonwebtoken');
const userModel = require('../models/users'); // เพิ่มการ import userModel

module.exports = async (req, res, next) => {
    try {
        // console.log("Authorization Header:", req.headers.authorization);
        const token = req.headers.authorization.split("Bearer ")[1];

        if (!token) {
            return res.status(401).json({ message: 'Token ไม่พบ' });
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้ในระบบที่ได้รับการ Approve' });
        }

        if (!user.approve) {
            return res.status(403).json({ message: 'คุณยังไม่ได้รับการอนุมัติจากแอดมิน' });
        }

        req.auth = decoded;
        next(); 
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            status:401,
            message: 'คนไม่มีสิทธิ อย่าเข้ามานะ',
        });
    }
};
