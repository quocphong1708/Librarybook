const express = require('express');
const router = express.Router();
const { NhanVien } = require('../models/models');
const ApiError = require('../api-error');

router.get('/', async (req, res, next) => {
    try {
        const nhanVienList = await NhanVien.find();
        res.json(nhanVienList);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const nhanVien = await NhanVien.findById(req.params.id);
        if (!nhanVien) {
            return next(new ApiError(404, 'NhanVien not found'));
        }
        res.json(nhanVien);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newNhanVien = new NhanVien(req.body);
        const savedNhanVien = await newNhanVien.save();
        res.status(201).json(savedNhanVien);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const updatedNhanVien = await NhanVien.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNhanVien) {
            return next(new ApiError(404, 'NhanVien not found'));
        }
        res.json(updatedNhanVien);
    } catch (err) {
        next(err);
    }
});

// DELETE - Xóa nhân viên
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedNhanVien = await NhanVien.findByIdAndDelete(req.params.id);
        if (!deletedNhanVien) {
            return next(new ApiError(404, 'NhanVien not found'));
        }
        res.json({ message: 'NhanVien deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;