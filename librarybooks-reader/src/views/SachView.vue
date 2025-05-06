<template>
    <div>
      <h2>Sách hiện có</h2>
      <div class="actions">
        <button v-if="!showForm" @click="toggleFilter">Lọc</button>
        <button v-if="isFiltered && !showForm" @click="unFilter">Bỏ lọc</button>
        <button v-if="!showForm" @click="toggleSort">Sắp xếp</button>
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
            <td><button @click="showBorrowCard(sach._id, sach.TenSach)" :disabled="sach.ConLai == 0"><i class="fa-solid fa-hand-holding"></i></button></td>
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
      <div v-if="showForm">
        <h3>Mượn: </h3>
        <br>
        <label for="b-docgia">Độc giả: </label>
        <input id="b-docgia" type="text" disabled :value="tendocgia">
        <input type="text" hidden disabled v-model="borrowCard.MaDocGia">
        <br>
        <label for="b-sach">Sách: </label>
        <input id='b-sach' type="text" disabled :value="tenSach">
        <input type="text" hidden disabled v-model="borrowCard.MaSach">
        <br>
        <label for="b-ngaymuon">Ngày mượn: </label>
        <input type="date" :min ="thismoment()" v-model="borrowCard.NgayMuon">
        <br>
        <label for="b-ngaytra">Ngày trả</label>
        <input type="date" :min="borrowCard.NgayMuon" v-model="borrowCard.NgayTra">
        <br>
        <button @click="yes">Mượn</button>
        <button @click="showBorrowCard">Hủy</button>
      </div>
    </div>
</template>
  
<script>
  import SachService from "@/services/sach.service";
  import NXBService from "@/services/nhaXuatBan.service";
  import theoDoiMuonSachService from "@/services/theoDoiMuonSach.service";
  import DocGiaService from "@/services/docGia.service";
  import moment from "moment";

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
        borrowCard: {
          MaSach:'',
          MaDocGia: this.$route.params.id,
          NgayMuon:'',
          NgayTra:'',
          DaTra: false,
        },
        tendocgia:'',
        maDocGia:'',
        tenSach:'',
        maSach:'',
      };
    },
    async created() {
      await this.fetchSachList();
      await this.fetchNXBList();
      await this.fetchDocGia();
    },
    computed: {
      moment(){
        return moment();
      },
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
      async yes (){
        try {
          await theoDoiMuonSachService.create(this.borrowCard);
        }catch(err){
          console.log("Error when yesMuonSach:", err);
        }
        await this.fetchSachList();
        this.showBorrowCard();
      },
      thismoment(){
        let moments = moment();
        moments.add(1, 'day');
        return moments.format("YYYY-MM-DD");
      },
      toggleBrc(){
        this.showForm=!this.showForm;
      },
      showBorrowCard(masach, tensach){
        if(this.showB){
          this.borrowCard= {
            MaSach:'',
            MaDocGia: this.$route.params.id,
            NgayMuon:'',
            NgayTra:'',
          },
          this.tendocgia='',
          this.maDocGia='',
          this.tenSach='',
          this.maSach='';
        }else{
          this.borrowCard.NgayMuon=this.thismoment();
          this.borrowCard.NgayTra=this.thismoment();
          this.borrowCard.MaSach=masach;
          this.tenSach=tensach;
        }
        this.toggleBrc();
      },
      async fetchDocGia(){
        const docGia = await DocGiaService.get(this.$route.params.id);
        this.tendocgia = docGia.HoLot + ' ' + docGia.Ten;
        this.maDocGia = docGia.MaDocGia;
      },
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
          if (this.sortByConLai == false) {
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