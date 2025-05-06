<template>
    <div>
      <h2>Theo dõi mượn sách</h2>
      <div class="actions">
        <button @click="toggleFilter">Lọc</button>
        <button v-if="isFiltered" @click="unFiltered">Bỏ lọc</button>
        <button @click="toggleSort">Sắp xếp</button>
      </div>
      <div v-if="showFiltered">
        <input v-model="filterCriterial.TenSach" type="text" placeholder="Tên sách">
        <input v-model="filterCriterial.TenDocGia" type="text" placeholder="Tên độc giả">
        <br>
        <label for="NgayMuonFilter">Ngày mượn: </label>
        từ <input id="NgayMuonFilter" type="date" v-model="filterCriterial.NgayMuon_from">
        đến <input type="date" v-model="filterCriterial.NgayMuon_to">
        <br>
        <label for="StatusFilter">Thống kê: </label>
        <select v-model="filterCriterial.ThongKe" id="StatusFilter">
          <option value="">Lọc theo...</option>
          <option value="trả trễ">trả trễ</option>
          <option value="chờ">chờ</option>
          <option value="trả sớm">trả sớm</option>
          <option value="đang mượn">đang mượn</option>
          <option value="đã trả">đã trả</option>
          <option value="hủy hẹn">hủy hẹn</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tên Sách <button v-if="showSort" @click="changeSortByTen"><i v-if="sortUp && sortByTen" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByTen" class="fa-solid fa-sort-down"></i><i v-if="!sortByTen" class="fa-solid fa-eject"></i></button></th>
            <th>Tên độc giả <button v-if="showSort" @click="changeSortByDocGia"><i v-if="sortUp && sortByDocGia" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByDocGia" class="fa-solid fa-sort-down"></i><i v-if="!sortByDocGia" class="fa-solid fa-eject"></i></button></th>
            <th>Ngày mượn <button v-if="showSort" @click="changeSortByNgayMuon"><i v-if="sortUp && sortByNgayMuon" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByNgayMuon" class="fa-solid fa-sort-down"></i><i v-if="!sortByNgayMuon" class="fa-solid fa-eject"></i></button></th>
            <th>Ngày hẹn trả</th>
            <th>Đã trả <button v-if="showSort" @click="changeSortByDaTra"><i v-if="sortUp && sortByDaTra" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByDaTra" class="fa-solid fa-sort-down"></i><i v-if="!sortByDaTra" class="fa-solid fa-eject"></i></button></th>
            <th>Thống kê <button v-if="showSort" @click="changeSortByStatus"><i v-if="sortUp && sortByStatus" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByStatus" class="fa-solid fa-sort-down"></i><i v-if="!sortByStatus" class="fa-solid fa-eject"></i></button></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tdms in FilteredList" :key="tdms._id">
            <td>{{ tdms.TenSach || 'Loading...' }}</td>
            <td>{{ tdms.TenDocGia || 'Loading...' }}</td>
            <td>{{ tdms.NgayMuon }}</td>
            <td>{{ tdms.NgayTra }}</td>
            <td>{{ tdms.DaTra }} <button @click="tra(tdms._id)" v-if="tdms.status=='trả trễ'"><i class="fa-solid fa-hand-holding-hand"></i></button></td>
            <td>{{ tdms.status }} <button @click="deleteTDMS(tdms._id)" v-if="tdms.DaTra"><i class="fa-solid fa-trash"></i></button></td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
  import TheoDoiMuonSachService from "@/services/theoDoiMuonSach.service";
  import SachService from "@/services/sach.service";
  import DocGiaService from "@/services/docGia.service";
  import moment from "moment/moment";
  function checkday(dateString) {
    const dateToCompare = moment(dateString, "DD-MM-YYYY");
    const currentDate = moment();
    if (dateToCompare.isBefore(currentDate)) {
      return "past";
    } else if (dateToCompare.isSame(currentDate)) {
      return "now";
    } else {
      return "future";
    }
  };

  function isDateBetween(dateStartString, dateEndString, dateCheckedString){
    const dateChecked = moment(dateCheckedString, "DD-MM-YYYY");
    if (dateStartString === '' && dateEndString === '') return true;
    else{
      if (dateStartString === ''){
        const dateEnd = moment(dateEndString, "YYYY-MM-DD");
        return (dateChecked.isSameOrBefore(dateEnd));
      }else if (dateEndString === ''){
        const dateStart = moment(dateStartString, "YYYY-MM-DD");
        return (dateChecked.isSameOrAfter(dateStart));
      }else{
        const dateEnd = moment(dateEndString, "YYYY-MM-DD");
        const dateStart = moment(dateStartString, "YYYY-MM-DD");
        return (dateChecked.isBetween(dateStart, dateEnd, "[]"));
      }
    } 
  }
  
  export default {
    data() {
      return {
        TDMSList: [],
        showFiltered:false,
        filterCriterial:{
          TenSach:'',
          TenDocGia:'',
          NgayMuon_from: '',
          NgayMuon_to: '',
          ThongKe:'',
        },
        isFiltered:false,
        sortByNgayMuon: false,
        sortByTen: false,
        sortByDocGia: false,
        sortByDaTra: false,
        sortByStatus: false,
        sortUp: true,
        showSort: false
      };
    },
    async created() {
      await this.fetchSachList();
    },
    computed:{
      FilteredList(){
        this.isFiltered = !(this.filterCriterial.TenSach === '' &&
          this.filterCriterial.TenDocGia === '' &&
          this.filterCriterial.NgayMuon_from == '' &&
          this.filterCriterial.NgayMuon_to == '' &&
          this.filterCriterial.ThongKe == '');

        let returnList = this.TDMSList;

        if (this.isFiltered){
          returnList = this.TDMSList.filter(tdms => {
            const matchTenSach = tdms.TenSach.toLowerCase().includes(this.filterCriterial.TenSach);
            const matchTenDocGia = tdms.TenDocGia.toLowerCase().includes(this.filterCriterial.TenDocGia);
            const matchStatus = tdms.status.includes(this.filterCriterial.ThongKe);
            const matchDate = isDateBetween(this.filterCriterial.NgayMuon_from, this.filterCriterial.NgayMuon_to, tdms.NgayMuon);
            return matchTenSach && matchTenDocGia && matchStatus && matchDate;
          })
        };

        if (this.sortByTen && this.sortUp) {
          returnList.sort((a, b) => {
            return a.TenSach.localeCompare(b.TenSach);
          });
        } else if (this.sortByTen && !this.sortUp) {
          returnList.sort((a, b) => {
            return b.TenSach.localeCompare(a.TenSach);
          });
        } else if (this.sortByDocGia && this.sortUp) {
          returnList.sort((a, b) => {
            return a.TenDocGia.localeCompare(b.TenDocGia);
          });
        } else if (this.sortByDocGia && !this.sortUp) {
          returnList.sort((a, b) => {
            return b.TenDocGia.localeCompare(a.TenDocGia);
          });
        } else if (this.sortByNgayMuon && this.sortUp) {
          returnList.sort((a, b) => {
            return moment(a.NgayMuon, 'DD-MM-YYYY').diff(moment(b.NgayMuon, 'DD-MM-YYYY'));
          });
        } else if (this.sortByNgayMuon && !this.sortUp) {
          returnList.sort((a, b) => {
            return moment(b.NgayMuon, 'DD-MM-YYYY').diff(moment(a.NgayMuon, 'DD-MM-YYYY'));
          });
        } else if (this.sortByDaTra && this.sortUp) {
          returnList = returnList.filter(item => item.DaTra === true);
        } else if (this.sortByDaTra && !this.sortUp) {
          returnList = returnList.filter(item => item.DaTra === false);
        } else if (this.sortByStatus && this.sortUp) {
          returnList.sort((a, b) => {
            return a.Status.localeCompare(b.Status);
          });
        } else if (this.sortByStatus && !this.sortUp) {
          returnList.sort((a, b) => {
            return b.Status.localeCompare(a.Status);
          });
        }

        return returnList;
      }
    },
    methods: {
      async tra(id){
        await TheoDoiMuonSachService.update(id, {DaTra: true});
        let tempFIlter = this.filterCriterial;
        this.unFiltered();
        await this.fetchSachList();
        this.filterCriterial=tempFIlter;
      },
      async fetchSachList() {
        try {
          this.TDMSList = await TheoDoiMuonSachService.getAll();
          this.TDMSList.forEach((element) => {
                    if(checkday(element.NgayMuon)=="future" || checkday(element.NgayMuon)=="now"){
                        element.status = "chờ"
                        if(element.DaTra){
                            element.status = "hủy hẹn"
                        }
                    }else if(checkday(element.NgayMuon)=="past"){
                        if(checkday(element.NgayTra) == "future" || checkday(element.NgayTra)=="now"){
                            element.status = "đang mượn"
                            if(element.DaTra){
                                element.status = "trả sớm"
                            }
                        }else if(checkday(element.NgayTra) == "past"){
                            element.status = "trả trễ"
                            if(element.DaTra){
                                element.status = "đã trả"
                            }
                        }
                    }
                })
          await Promise.all(this.TDMSList.map(async (element) => {
            const sach = await SachService.get(element.MaSach);
            element.TenSach = sach.TenSach;
            const docgia = await DocGiaService.get(element.MaDocGia);
            element.TenDocGia = docgia.HoLot + ' ' + docgia.Ten;
          }));
        } catch (error) {
          console.error("Error fetching Theo dõi mượn sách list:", error);
        }
      },
      async deleteTDMS(id){
        try {
          await TheoDoiMuonSachService.delete(id);
          let tempFIlter = this.filterCriterial;
          this.unFiltered();
          await this.fetchSachList();
          this.filterCriterial=tempFIlter;
        }catch (error){
          console.log("Lỗi khi xóa Theo Dõi Mượn Sách:", error);
        }
      },
      toggleFilter(){
        this.showFiltered=!this.showFiltered;
      },
      toggleSort(){
        if(this.showSort){
          this.isFiltered=false,
          this.sortByNgayMuon= false,
          this.sortByTen= false,
          this.sortByDocGia= false,
          this.sortByDaTra= false,
          this.sortByStatus= false,
          this.sortUp= true;
        }
        this.showSort=!this.showSort
      },
      unFiltered(){
        this.filterCriterial={
          TenSach:'',
          TenDocGia:'',
          NgayMuon_from: '',
          NgayMuon_to: '',
          ThongKe:'',
        };
      },
      changeSortByTen() {
        if (this.sortByTen === false) {
          this.sortByNgayMuon = false;
          this.sortByDocGia = false;
          this.sortByDaTra = false;
          this.sortByStatus = false;
          this.sortByTen = true;
          this.sortUp = true;
        } else {
          this.sortUp = !this.sortUp;
        }
      },

      changeSortByDocGia() {
        if (this.sortByDocGia === false) {
          this.sortByNgayMuon = false;
          this.sortByTen = false;
          this.sortByDaTra = false;
          this.sortByStatus = false;
          this.sortByDocGia = true;
          this.sortUp = true;
        } else {
          this.sortUp = !this.sortUp;
        }
      },

      changeSortByNgayMuon() {
        if (this.sortByNgayMuon === false) {
          this.sortByNgayMuon = true;
          this.sortByTen = false;
          this.sortByDocGia = false;
          this.sortByDaTra = false;
          this.sortByStatus = false;
          this.sortUp = true;
        } else {
          this.sortUp = !this.sortUp;
        }
      },

      changeSortByDaTra() {
        if (this.sortByDaTra === false) {
          this.sortByNgayMuon = false;
          this.sortByTen = false;
          this.sortByDocGia = false;
          this.sortByStatus = false;
          this.sortByDaTra = true;
          this.sortUp = true;
        } else {
          this.sortUp = !this.sortUp;
        }
      },

      changeSortByStatus() {
        if (this.sortByStatus === false) {
          this.sortByNgayMuon = false;
          this.sortByTen = false;
          this.sortByDocGia = false;
          this.sortByDaTra = false;
          this.sortByStatus = true;
          this.sortUp = true;
        } else {
          this.sortUp = !this.sortUp;
        }
      },

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