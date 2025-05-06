<template>
    <div>
      <h2>Danh sách Độc giả</h2>
      <table>
        <thead>
          <tr>
            <th>Họ lót</th>
            <th>Tên</th>
            <th>Ngày sinh</th>
            <th>Phái</th>
            <th>Địa chỉ</th>
            <th>Điện thoại</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="docGia in docGiaList" :key="docGia._id">
            <td>{{ docGia.HoLot }}</td>
            <td>{{ docGia.Ten }}</td>
            <td>{{ docGia.NgaySinh }}</td>
            <td>{{ docGia.Phai }}</td>
            <td>{{ docGia.DiaChi }}</td>
            <td>{{ docGia.DienThoai }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
  import DocGiaService from "@/services/docGia.service";
  
  export default {
    data() {
      return {
        docGiaList: []
      };
    },
    async created() {
      await this.fetchDocGiaList();
    },
    methods: {
      async fetchDocGiaList() {
        try {
          this.docGiaList = await DocGiaService.getAll();
        } catch (error) {
          console.error("Error fetching Độc giả list:", error);
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