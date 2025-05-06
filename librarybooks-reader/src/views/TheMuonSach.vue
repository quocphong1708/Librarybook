<template>
    <h2>Lịch sử mượn</h2>
    <div>
        <table>
            <thead>
                <tr>
                    <td>Sách</td>
                    <td>Ngày mượn</td>
                    <td>Ngày hẹn trả</td>
                    <td>Đã trả</td>
                    <td>Trạng thái</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="themuon in LSMuon" :key="themuon._id">
                    <td>{{ themuon.TenSach || "loading..." }}</td>
                    <td>{{ themuon.NgayMuon }}</td>
                    <td>{{ themuon.NgayTra }}</td>
                    <td>{{ themuon.DaTra }}</td>
                    <td>{{ themuon.TrangThai }} <button @click="discard(themuon._id)" v-if="themuon.TrangThai == 'chờ'"><i class="fa-solid fa-rectangle-xmark"></i></button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import theoDoiMuonSachService from "@/services/theoDoiMuonSach.service";
    import sachService from "@/services/sach.service";
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
    
    export default {
        data() {
            return {
                LSMuon: []
            }
        },
        async created() {
            await this.fetchData();
        },
        methods: {
            async discard(themuonId){
                await theoDoiMuonSachService.update(themuonId, {DaTra: true});
                await this.fetchData();
            },
            async fetchData(){
                this.LSMuon = await theoDoiMuonSachService.getByDocGia(this.$route.params.id);
                await Promise.all(this.LSMuon.map(async (element) => {
                    const themuonsach = await sachService.get(element.MaSach);
                    element.TenSach = themuonsach.TenSach;
                }))
                this.LSMuon.forEach((element) => {
                    if(checkday(element.NgayMuon)=="future" || checkday(element.NgayMuon)=="now"){
                        element.TrangThai = "chờ"
                        if(element.DaTra){
                            element.TrangThai = "hủy hẹn"
                        }
                    }else if(checkday(element.NgayMuon)=="past"){
                        if(checkday(element.NgayTra) == "future" || checkday(element.NgayTra)=="now"){
                            element.TrangThai = "đang mượn"
                            if(element.DaTra){
                                element.TrangThai = "trả sớm"
                            }
                        }else if(checkday(element.NgayTra) == "past"){
                            element.TrangThai = "trả trễ"
                            if(element.DaTra){
                                element.TrangThai = "đã trả"
                            }
                        }
                    }
                })
            }
        }
    }
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