const mongoose = require('mongoose');
const config = require("./app/config");
const { DocGia, Sach, NhaXuatBan, TheoDoiMuonSach, NhanVien } = require('./app/models/models');
const faker = require('faker');
const { max, min } = require('moment/moment');

const deleteAllData = async () => {
    try {
        await NhaXuatBan.deleteMany({});
        console.log("Đã xóa tất cả dữ liệu từ bảng Nhà Xuất Bản.");

        await Sach.deleteMany({});
        console.log("Đã xóa tất cả dữ liệu từ bảng Sách.");

        await DocGia.deleteMany({});
        console.log("Đã xóa tất cả dữ liệu từ bảng Độc Giả.");

        await TheoDoiMuonSach.deleteMany({});
        console.log("Đã xóa tất cả dữ liệu từ bảng Theo Dõi Mượn Sách.");
        
        await NhanVien.deleteMany({});
        console.log("Đã xóa tất cả dữ liệu từ bảng Nhân Viên.");

    } catch (error) {
        console.error("Lỗi khi xóa dữ liệu:", error.message);
    }
};

const createFakeDocGia = async () => {
    const numberOfFakeDocGia = 10;

    for (let i = 0; i < numberOfFakeDocGia; i++) {
        const fakeDocGiaData = {
            HoLot: faker.name.firstName(),
            Ten: faker.name.lastName(),
            NgaySinh: faker.date.between('1950-01-01', '2005-12-31'),
            Phai: faker.random.arrayElement(['Nam', 'Nữ']),
            DiaChi: faker.address.streetAddress(),
            DienThoai: faker.phone.phoneNumber()
        };
        const newDocGia = new DocGia(fakeDocGiaData);
        await newDocGia.save();
    }
    console.log("Dữ liệu Độc Giả giả mạo đã được thêm vào CSDL thành công.");
};

const createFakeNXB = async () => {
    try {
        const numFakeNXB = 10;
        
        const fakeNXBData = [];
        
        for (let i = 0; i < numFakeNXB; i++) {
            const fakeNXB = {
                TenNXB: faker.company.companyName(),
                DiaChi: faker.address.streetAddress()
            };
            fakeNXBData.push(fakeNXB);
        }
        
        await NhaXuatBan.insertMany(fakeNXBData);
        console.log("Dữ liệu NXB giả mạo đã được thêm vào CSDL thành công.");
    } catch (error) {
        console.error("Lỗi khi thêm dữ liệu giả mạo cho NXB:", error.message);
    }
};

const getAllMaNXB = async () => {
    try {
        const nhaXuatBanList = await NhaXuatBan.find({}, '_id');
        return nhaXuatBanList.map(nxb => nxb._id);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách mã NXB:", error.message);
        return [];
    }
};

const createFakeSach = async () => {
    try {
        const fakeSachData = [];
        const numFakeSach = 50;
        const maNXBList = await getAllMaNXB();

        for (let i = 0; i < numFakeSach; i++) {
            const origins = [];
            for (let i = 0; i < 10; i++) {
                origins.push(faker.name.lastName());
            }
            origins.push("Truyền thuyết", "Dân gian", "Văn học");

            const fakeSach = {
                TenSach: faker.lorem.words(),
                DonGia: faker.datatype.number({ min: 10, max: 500 }),
                SoQuyen: faker.datatype.number({ min: 1, max: 20 }),
                NamXuatBan: faker.datatype.number({ min: 1990, max: 2022 }),
                MaNXB: faker.random.arrayElement(maNXBList),
                NguonGoc: faker.random.arrayElement(origins)
            };
            fakeSachData.push(fakeSach);
        }

        await Sach.insertMany(fakeSachData);
        console.log("Dữ liệu sách giả mạo đã được thêm vào CSDL thành công.");
    } catch (error) {
        console.error("Lỗi khi thêm dữ liệu giả mạo cho sách:", error.message);
    }
};

const createFakeNhanVien = async () => {
    try {
        const numFakeNhanVien = 5;
        
        const fakeNhanVienData = [];
        
        for (let i = 0; i < numFakeNhanVien; i++) {
            const fakeNhanVien = {
                HoTenNV: faker.name.findName(),
                Password: faker.internet.password(),
                ChucVu: faker.name.jobTitle(),
                DiaChi: faker.address.streetAddress(),
                SoDienThoai: faker.phone.phoneNumber()
            };
            fakeNhanVienData.push(fakeNhanVien);
        }
        
        await NhanVien.insertMany(fakeNhanVienData);
        console.log("Dữ liệu nhân viên giả mạo đã được thêm vào CSDL thành công.");
    } catch (error) {
        console.error("Lỗi khi thêm dữ liệu giả mạo cho nhân viên:", error.message);
    }
};

const getAllMaDocGia = async () => {
    try {
        const docGiaList = await DocGia.find({}, '_id');
        return docGiaList.map(docGia => docGia._id);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách mã DocGia:", error.message);
        return [];
    }
};

const getAllMaSach = async () => {
    try {
        const sachList = await Sach.find({}, '_id');
        return sachList.map(sach => sach._id);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách mã Sach:", error.message);
        return [];
    }
};

const createFakeTheoDoiMuonSach = async () => {
    try {
        const fakeTheoDoiMuonSachData = [];
        const numFakeTheoDoiMuonSach = 50;
        const maDocGiaList = await getAllMaDocGia();
        const maSachList = await getAllMaSach();
        const fakeNgayMuonList = []
        for (let i=0; i<=10; i++){
            fakeNgayMuonList.push(faker.date.past());
        }
        for(let i=0; i<=3; i++){
            fakeNgayMuonList.push(faker.date.future());
        }
        for (let i = 0; i < numFakeTheoDoiMuonSach; i++) {
            let fakeNgayMuon = faker.random.arrayElement(fakeNgayMuonList);
            let futureDay = new Date(fakeNgayMuon);
            futureDay.setDate(futureDay.getDate() + 50);
            let fakeNgayTra = faker.date.between(fakeNgayMuon, futureDay);
            const fakeTheoDoiMuonSach = {
                MaDocGia: faker.random.arrayElement(maDocGiaList),
                MaSach: faker.random.arrayElement(maSachList),
                NgayMuon: fakeNgayMuon,
                NgayTra: fakeNgayTra,
                DaTra: faker.random.arrayElement([true, false])
            };
            fakeTheoDoiMuonSachData.push(fakeTheoDoiMuonSach);
        }

        await TheoDoiMuonSach.insertMany(fakeTheoDoiMuonSachData);
        console.log("Dữ liệu theo dõi mượn sách giả mạo đã được thêm vào CSDL thành công.");
    } catch (error) {
        console.error("Lỗi khi thêm dữ liệu giả mạo cho theo dõi mượn sách:", error.message);
    }
};


mongoose.connect(config.db.uri)
    .then(async () => {
        console.log("Đã kết nối tới CSDL MongoDB.");

        await deleteAllData();

        await createFakeNXB();
        await createFakeDocGia();
        await createFakeSach();
        await createFakeNhanVien();
        await createFakeTheoDoiMuonSach();
        
        mongoose.disconnect();
    })
    .catch(error => {
        console.error("Lỗi khi kết nối tới CSDL MongoDB:", error.message);
    });
