<template>
    <div>
      <h2>Danh sách Nhân viên</h2>
      <table>
        <thead>
          <tr>
            <th>Tên Nhân viên</th>
            <th>Chức vụ</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="nhanVien in nhanVienList" :key="nhanVien._id">
            <td>{{ nhanVien.HoTenNV }}</td>
            <td>{{ nhanVien.ChucVu }}</td>
            <td>{{ nhanVien.DiaChi }}</td>
            <td>{{ nhanVien.SoDienThoai }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
  import NhanVienService from "@/services/nhanVien.service";
  
  export default {
    data() {
      return {
        nhanVienList: []
      };
    },
    async created() {
      await this.fetchNhanVienList();
    },
    methods: {
      async fetchNhanVienList() {
        try {
          this.nhanVienList = await NhanVienService.getAll();
        } catch (error) {
          console.error("Error fetching Nhan Vien list:", error);
        }
      }
    }
  };
</script>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  .actions {
    display: inline;
  }
  .actions>button{
    margin: 5px;
    border-radius: 5px;
  }
  .actions>button:hover{
    background-color: bisque;
  }
  table button:hover{
    background-color: bisque;
  }
</style>