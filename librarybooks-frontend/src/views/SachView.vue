<template>
    <div>
      <h2>Sách hiện có</h2>
      <div class="actions">
        <button v-if="!showForm" @click="toggleFilter">Lọc</button>
        <button v-if="isFiltered && !showForm" @click="unFilter">Bỏ lọc</button>
        <button v-if="!showForm" @click="toggleSort">Sắp xếp</button>
        <button v-if="!showForm" @click="toggleForm">Thêm</button>
        <button v-if="showForm" @click="toggleForm">Hủy</button>
        <button v-if="!showForm" @click="deleteMany" :disabled="selectedItems.length == 0">Xóa</button>
      </div>
      <div v-if="showFiltered && !showForm">
        <input type="text" v-model="filterCriteria.TenSach" placeholder="Tên Sách">
        <input type="text" v-model="filterCriteria.NguonGoc" placeholder="Nguồn Gốc">
        <input type="text" v-model="filterCriteria.TenNXB" placeholder="Tên NXB">
        <br>
        <label for="NXBFilter">Năm Xuất Bản: <button @click="changeNamXuatBanQuery">{{ filterCriteria.NamXuatBanQuery }}</button></label>
        <input id="NXBFilter" type="number" v-model="filterCriteria.NamXuatBan" placeholder="Năm Xuất Bản" inputmode="numeric">
        <br>
        <label for="SoQuyenFilter">Số quyển: <button @click="changeSoQuyenQuery">{{ filterCriteria.SoQuyenQuery }}</button></label>
        <input id="SoQuyenFilter" type="number" v-model="filterCriteria.SoQuyen" placeholder="Số Quyển" inputmode="numeric">
        <br>
        <label for="DonGiaFilter">Đơn giá: <button @click="changeDonGiaQuery">{{ filterCriteria.DonGiaQuery }}</button></label>
        <input id="DonGiaFilter" type="number" v-model="filterCriteria.DonGia" placeholder="Đơn Giá" inputmode="numeric">
      </div>
      <div v-if="showForm" id="addForm">
        <h2>Thêm mới Sách</h2>
        <label for="tenSach">Tên Sách:</label>
        <input type="text" id="tenSach" v-model="newSach.TenSach" placeholder="Nhập tên sách">

        <label for="donGia">Đơn giá (x1000đ):</label>
        <input type="number" id="donGia" v-model="newSach.DonGia" placeholder="Nhập đơn giá">

        <label for="soQuyen">Số quyển:</label>
        <input type="number" id="soQuyen" v-model="newSach.SoQuyen" placeholder="Nhập số quyển">

        <label for="namXuatBan">Năm xuất bản:</label>
        <input type="number" id="namXuatBan" v-model="newSach.NamXuatBan" placeholder="Nhập năm xuất bản">

        <label for="maNXB">Mã NXB:</label>
        <input id="maNXB" type="text" :value="newSach.MaNXB" disabled>
        <div style="display: flex;">
          <input type="text" v-model="tenNXBtofilter" placeholder="Lọc">
          <select id="chonNXB" v-model="newSach.MaNXB">
            <option value="">Chọn nhà xuất bản</option>
            <option v-for="nxb in nxbFilteredList" :key="nxb._id" :value="nxb._id">{{ nxb.TenNXB }}</option>
          </select>
        </div>
        <br>
        <label for="nguonGoc">Nguồn gốc:</label>
        <input type="text" id="nguonGoc" v-model="newSach.NguonGoc" placeholder="Nhập nguồn gốc">

        <button @click="addSach">Thêm Sách</button>
      </div>
      <table v-if="!showForm">
        <thead>
          <tr>
            <th>Thao Tác</th>
            <th>Tên Sách <button v-if="showSort" @click="changeSortByTen"><i v-if="sortUp && sortByTen" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByTen" class="fa-solid fa-sort-down"></i><i v-if="!sortByTen" class="fa-solid fa-eject"></i></button></th>
            <th>Đơn giá <button v-if="showSort" @click="changeSortByDonGia"><i v-if="sortUp && sortByDonGia" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByDonGia" class="fa-solid fa-sort-down"></i><i v-if="!sortByDonGia" class="fa-solid fa-eject"></i></button></th>
            <th>Số quyển <button v-if="showSort" @click="changeSortBySoQuyen"><i v-if="sortUp && sortBySoQuyen" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortBySoQuyen" class="fa-solid fa-sort-down"></i><i v-if="!sortBySoQuyen" class="fa-solid fa-eject"></i></button></th>
            <th>Còn lại <button v-if="showSort" @click="changeSortByConLai"><i v-if="sortUp && sortByConLai" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByConLai" class="fa-solid fa-sort-down"></i><i v-if="!sortByConLai" class="fa-solid fa-eject"></i></button></th>
            <th>Năm xuất bản <button v-if="showSort" @click="changeSortByNamXuatBan"><i v-if="sortUp && sortByNamXuatBan" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByNamXuatBan" class="fa-solid fa-sort-down"></i><i v-if="!sortByNamXuatBan" class="fa-solid fa-eject"></i></button></th>
            <th>Nhà xuất bản <button v-if="showSort" @click="changeSortByTenNXB"><i v-if="sortUp && sortByTenNXB" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByTenNXB" class="fa-solid fa-sort-down"></i><i v-if="!sortByTenNXB" class="fa-solid fa-eject"></i></button></th>
            <th>Nguồn gốc <button v-if="showSort" @click="changeSortByNguonGoc"><i v-if="sortUp && sortByNguonGoc" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByNguonGoc" class="fa-solid fa-sort-down"></i><i v-if="!sortByNguonGoc" class="fa-solid fa-eject"></i></button></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sach in filteredList" :key="sach._id">
            <td><input type="checkbox" v-model="selectedItems" :value="sach._id"><button @click="editRow(sach._id)"><i class="fa-solid fa-pen"></i></button><button v-if="sach._id == editedItemId" @click="saveChange(sach)"><i class="fa-solid fa-save"></i></button></td>
            <td>
              <div v-if="sach._id !== editedItemId">{{ sach.TenSach }}</div>
              <input v-else type="text" v-model="editedItem.TenSach" :placeholder="sach.TenSach">
            </td>
            <td>
              <div v-if="sach._id !== editedItemId">{{ sach.DonGia }}</div>
              <input v-else type="number" v-model="editedItem.DonGia" :placeholder="sach.DonGia">
            </td>
            <td>
              <div v-if="sach._id !== editedItemId">{{ sach.SoQuyen }}</div>
              <input v-else type="number" v-model="editedItem.SoQuyen" :placeholder="sach.SoQuyen">
            </td>
            <td>
              <div v-if="sach._id !== editedItemId">{{ sach.ConLai }}</div>
            </td>
            <td>
              <div v-if="sach._id !== editedItemId">{{ sach.NamXuatBan }}</div>
              <input v-else type="number" v-model="editedItem.NamXuatBan" :placeholder="sach.NamXuatBan">
            </td>
            <td>
              <div v-if="sach._id !== editedItemId">{{ sach.TenNXB || "Loading..." }}</div>
              <div v-else style="display: flex;">
                <select id="chonNXB" v-model="sach.MaNXB">
                  <option value="">Chọn nhà xuất bản</option>
                  <option v-for="nxb in nxbFilteredList" :key="nxb._id" :value="nxb._id">{{ nxb.TenNXB }}</option>
                </select>
              </div>
            </td>
            <td>
              <div v-if="sach._id !== editedItemId">{{ sach.NguonGoc }}</div>
              <input v-else type="text" v-model="editedItem.NguonGoc" :placeholder="sach.NguonGoc">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
  import SachService from "@/services/sach.service";
  import NXBService from "@/services/nhaXuatBan.service";
  import theoDoiMuonSachService from "@/services/theoDoiMuonSach.service";

  export default {
    data() {
      return {
        SachList: [],
        selectedItems: [],
        nxbList:[],
        TDMSList: [],
        isFiltered:false,
        showFiltered:false,
        filterCriteria:{
          TenSach:"",
          DonGia:-1,
          SoQuyen:-1,
          NamXuatBan:-1,
          NamXuatBanQuery:"=",
          SoQuyenQuery:"=",
          DonGiaQuery:"=",
          TenNXB:"",
          NguonGoc:""
        },
        onChange:false,
        newSach: {
          TenSach: "",
          DonGia: -1,
          SoQuyen: -1,
          NamXuatBan: -1,
          MaNXB: "",
          NguonGoc: ""
        },
        showForm: false,
        tenNXBtofilter:"",
        editedItemId: "",
        editedItem: {},
        sortByTen: false,
        sortByDonGia: false,
        sortBySoQuyen: false,
        sortByConLai:false,
        sortByNamXuatBan: false,
        sortByTenNXB:false,
        sortByNguonGoc: false,
        sortUp: true,
        showSort: false,
      };
    },
    async created() {
      await this.fetchSachList();
      await this.fetchNXBList();
    },
    computed: {
      filteredList() {
        this.isFiltered = !(this.filterCriteria.TenSach === '' &&
          this.filterCriteria.NguonGoc === '' &&
          this.filterCriteria.NamXuatBan === -1 &&
          this.filterCriteria.TenNXB === '' &&
          this.filterCriteria.SoQuyen === -1 &&
          this.filterCriteria.DonGia === -1);

        let returnList = this.SachList;
        if (this.isFiltered) {
          returnList = this.SachList.filter(sach => {
            const tenSachMatched = sach.TenSach.toLowerCase().includes(this.filterCriteria.TenSach.toLowerCase());
            const nguonGocMatched = sach.NguonGoc.toLowerCase().includes(this.filterCriteria.NguonGoc.toLowerCase());
            const namXuatBanMatched = (this.query(sach.NamXuatBan, this.filterCriteria.NamXuatBan, this.filterCriteria.NamXuatBanQuery) || this.filterCriteria.NamXuatBan === -1);
            const tenNXBMatched = sach.TenNXB.toLowerCase().includes(this.filterCriteria.TenNXB.toLowerCase());
            const soQuyenMatched = (this.query(sach.SoQuyen, this.filterCriteria.SoQuyen, this.filterCriteria.SoQuyenQuery) || this.filterCriteria.SoQuyen === -1);
            const donGiaMatched = (sach.DonGia === this.filterCriteria.DonGia || this.filterCriteria.DonGia === -1);
            return tenSachMatched && nguonGocMatched && namXuatBanMatched && tenNXBMatched && soQuyenMatched && donGiaMatched;
          });
        }

        if (this.sortByTen && this.sortUp) {
          returnList.sort((a, b) => {
            return a.TenSach.localeCompare(b.TenSach);
          });
        } else if (this.sortByTen && !this.sortUp) {
          returnList.sort((a, b) => {
            return b.TenSach.localeCompare(a.TenSach);
          });
        } else if (this.sortByDonGia && this.sortUp) {
          returnList.sort((a, b) => {
            return a.DonGia - b.DonGia;
          });
        } else if (this.sortByDonGia && !this.sortUp) {
          returnList.sort((a, b) => {
            return b.DonGia - a.DonGia;
          });
        } else if (this.sortBySoQuyen && this.sortUp) {
          returnList.sort((a, b) => {
            return a.SoQuyen - b.SoQuyen;
          });
        } else if (this.sortBySoQuyen && !this.sortUp) {
          returnList.sort((a, b) => {
            return b.SoQuyen - a.SoQuyen;
          });
        } else if (this.sortByConLai && this.sortUp) {
          returnList.sort((a, b) => {
            return a.ConLai - b.ConLai;
          });
        } else if (this.sortByConLai && !this.sortUp) {
          returnList.sort((a, b) => {
            return b.ConLai - a.ConLai;
          });
        } else if (this.sortByNamXuatBan && this.sortUp) {
          returnList.sort((a, b) => {
            return a.NamXuatBan - b.NamXuatBan;
          });
        } else if (this.sortByNamXuatBan && !this.sortUp) {
          returnList.sort((a, b) => {
            return b.NamXuatBan - a.NamXuatBan;
          });
        } else if (this.sortByTenNXB && this.sortUp) {
          returnList.sort((a, b) => {
            return a.TenNXB.localeCompare(b.TenNXB);
          });
        } else if (this.sortByTenNXB && !this.sortUp) {
          returnList.sort((a, b) => {
            return b.TenNXB.localeCompare(a.TenNXB);
          });
        } else if (this.sortByNguonGoc && this.sortUp) {
          returnList.sort((a, b) => {
            return a.NguonGoc.localeCompare(b.NguonGoc);
          });
        } else if (this.sortByNguonGoc && !this.sortUp) {
          returnList.sort((a, b) => {
            return b.NguonGoc.localeCompare(a.NguonGoc);
          });
        }

        return returnList;
      },
      nxbFilteredList(){
        const returnList = this.nxbList.filter(nxb =>{
          return nxb.TenNXB.toLowerCase().includes(this.tenNXBtofilter.toLowerCase());      
        });
        returnList.sort((a,b) => {
          return a.TenNXB.localeCompare(b.TenNXB);
        })
        if(returnList.length > 0){
          this.newSach.MaNXB = returnList[0]._id;
        }else this.newSach.MaNXB = "";
        return returnList;
      }
    },
    methods: {
      query(a,b,q){
        let result=false;
        if(q == "=" && a==b){
          result= true;
        }else if (q=="<" && a<b){
          result= true;
        }else if (q==">" && a>b){
          result= true;
        }
        return result;
      },
      async fetchSachList() {
        try {
          this.SachList = await SachService.getAll();
          await Promise.all(this.SachList.map(async (element) => {
            const NXB = await NXBService.get(element.MaNXB);
            element.TenNXB = NXB.TenNXB;
            let conlai = element.SoQuyen;
            this.TDMSList=await theoDoiMuonSachService.getAll();
            this.TDMSList.forEach(ele => {
              if (ele.MaSach == element._id && !ele.DaTra){
                conlai--;
              }
            });
            element.ConLai = conlai;
          }));
        } catch (error) {
          console.error("Error fetching Sach list:", error);
        }
      },
      async fetchNXBList(){
        try {
          this.nxbList= await NXBService.getAll();
        }catch(error){
          console.log("Error fetching NXB list:", error);
        }
      },
      toggleFilter(){
        this.showFiltered=!this.showFiltered;
      },
      unFilter(){
        this.filterCriteria={
          TenSach:"",
          DonGia:-1,
          SoQuyen:-1,
          NamXuatBan:-1,
          TenNXB:"",
          NguonGoc:"",
          DonGiaQuery:"=",
          SoQuyenQuery:"=",
          NamXuatBanQuery:"="
        }
        if (this.isFiltered){
          this.isFiltered=false;
        }
      },
      changeSoQuyenQuery(){
        if (this.filterCriteria.SoQuyenQuery == "="){
          this.filterCriteria.SoQuyenQuery = ">";
        }else if (this.filterCriteria.SoQuyenQuery == ">"){
          this.filterCriteria.SoQuyenQuery = "<";
        }else if (this.filterCriteria.SoQuyenQuery == "<"){
          this.filterCriteria.SoQuyenQuery = "=";
        }
      },
      changeDonGiaQuery(){
        if (this.filterCriteria.DonGiaQuery == "="){
          this.filterCriteria.DonGiaQuery = ">";
        }else if (this.filterCriteria.DonGiaQuery == ">"){
          this.filterCriteria.DonGiaQuery = "<";
        }else if (this.filterCriteria.DonGiaQuery == "<"){
          this.filterCriteria.DonGiaQuery = "=";
        }
      },
      changeNamXuatBanQuery(){
        if (this.filterCriteria.NamXuatBanQuery == "="){
          this.filterCriteria.NamXuatBanQuery = ">";
        }else if (this.filterCriteria.NamXuatBanQuery == ">"){
          this.filterCriteria.NamXuatBanQuery = "<";
        }else if (this.filterCriteria.NamXuatBanQuery == "<"){
          this.filterCriteria.NamXuatBanQuery = "=";
        }
      },
      async deleteMany() {
        try {
          if (confirm("Bạn có muốn xóa các mục đã chọn không?")) {
            await Promise.all(this.selectedItems.map(async (element) => {
              await SachService.delete(element);
            }));
            let tempFilter=this.filterCriteria;
            this.unFilter();
            await this.fetchSachList();
            this.filterCriteria=tempFilter;
            this.selectedItems=[];
            } else {
                      
            }
          } catch (error) {
            console.error("Lỗi khi xóa nhiều mục:", error);
        }
      },
      toggleForm() {
        this.showForm = !this.showForm;
      },
      async addSach() {
        try {
          await SachService.create(this.newSach);
          alert("Thêm sách thành công!");
          this.resetForm();
        } catch (error) {
          console.error("Lỗi khi thêm sách:", error);
          alert("Đã xảy ra lỗi khi thêm sách!");
        }
      },
      async resetForm() {
        this.newSach = {
          TenSach: "",
          DonGia: -1,
          SoQuyen: -1,
          NamXuatBan: -1,
          MaNXB: "",
          NguonGoc: ""
        };
        this.showForm=false;
        this.unFilter();
        await this.fetchSachList();
      },
      editRow(itemId) {
        this.editedItemId = itemId;
        this.editedItem = this.SachList.find(sach => sach._id == itemId);
      },
      async saveChange(editedItem) {
        try {
          await SachService.update(editedItem._id, editedItem);
          let tempFilter=this.filterCriteria;
          this.unFilter();
          await this.fetchSachList();
          this.filterCriteria=tempFilter;
          this.editedItemId = null;
          this.editedItem = {};
        } catch (error) {
          console.error("Lỗi khi cập nhật mục:", error);
        }
      },
      toggleSort() {
          if (this.showSort) {
              this.sortByTen = false;
              this.sortByDonGia = false;
              this.sortBySoQuyen = false;
              this.sortByConLai = false;
              this.sortByNamXuatBan = false;
              this.sortByTenNXB = false;
              this.sortByNguonGoc =  false;
              this.sortUp = true;
          }
          this.showSort = !this.showSort;
      },
      changeSortByTen() {
          if (this.sortByTen == false) {
              this.sortByTen = true;
              this.sortByDonGia = false;
              this.sortBySoQuyen = false;
              this.sortByConLai = false;
              this.sortByNamXuatBan = false;
              this.sortByTenNXB = false;
              this.sortByNguonGoc =  false;
              this.sortUp = true;
          } else {
              this.sortUp = !this.sortUp;
          }
      },
      changeSortByDonGia() {
          if (this.sortByDonGia == false) {
              this.sortByDonGia = true;
              this.sortByTen = false;
              this.sortBySoQuyen = false;
              this.sortByConLai = false;
              this.sortByNamXuatBan = false;
              this.sortByTenNXB = false;
              this.sortByNguonGoc =  false;
              this.sortUp = true;
          } else {
              this.sortUp = !this.sortUp;
          }
      },
      changeSortBySoQuyen() {
          if (this.sortBySoQuyen == false) {
              this.sortBySoQuyen = true;
              this.sortByTen = false;
              this.sortByDonGia = false;
              this.sortByConLai = false;
              this.sortByNamXuatBan = false;
              this.sortByTenNXB = false;
              this.sortByNguonGoc =  false;
              this.sortUp = true;
          } else {
              this.sortUp = !this.sortUp;
          }
      },
      changeSortByConLai() {
          if (this.sortBySoQuyen == false) {
              this.sortBySoQuyen = false;
              this.sortByTen = false;
              this.sortByDonGia = false;
              this.sortByConLai = true;
              this.sortByNamXuatBan = false;
              this.sortByTenNXB = false;
              this.sortByNguonGoc =  false;
              this.sortUp = true;
          } else {
              this.sortUp = !this.sortUp;
          }
      },
      changeSortByNamXuatBan() {
          if (this.sortByNamXuatBan == false) {
              this.sortByNamXuatBan = true;
              this.sortByTen = false;
              this.sortByDonGia = false;
              this.sortBySoQuyen = false;
              this.sortByConLai = false;
              this.sortByTenNXB = false;
              this.sortByNguonGoc =  false;
              this.sortUp = true;
          } else {
              this.sortUp = !this.sortUp;
          }
      },
      changeSortByTenNXB() {
          if (this.sortByTenNXB == false) {
              this.sortByNamXuatBan = false;
              this.sortByTen = false;
              this.sortByDonGia = false;
              this.sortBySoQuyen = false;
              this.sortByConLai = false;
              this.sortByTenNXB = true;
              this.sortByNguonGoc =  false;
              this.sortUp = true;
          } else {
              this.sortUp = !this.sortUp;
          }
      },
      changeSortByNguonGoc(){
        if (this.sortByNguonGoc == false) {
              this.sortByNamXuatBan = false;
              this.sortByTen = false;
              this.sortByDonGia = false;
              this.sortBySoQuyen = false;
              this.sortByConLai = false;
              this.sortByTenNXB = false;
              this.sortByNguonGoc =  true;
              this.sortUp = true;
          } else {
              this.sortUp = !this.sortUp;
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
  label{
    width: 300px;
  }

  #addForm
  input[type="text"],
  #addForm
  input[type="number"] {
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
  }
</style>