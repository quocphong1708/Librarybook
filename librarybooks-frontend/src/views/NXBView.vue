<template>
    <div>
        <h2>Danh sách NXB</h2>
        <div class="actions">
            <button @click="toggleFilter">Lọc</button>
            <button v-if="isFiltered" @click="unFilter">Bỏ lọc</button>
            <button @click="toggleSort">Sắp xếp</button>
            <button @click="onCreateChange">Thêm</button>
            <button @click="deleteMany" :disabled="selectedItems.length == 0">Xóa</button>
        </div>
        <div v-if="showFilter">
            <input type="text" v-model="filterCriteria.TenNXB" placeholder="Tên NXB">
            <input type="text" v-model="filterCriteria.DiaChi" placeholder="Địa chỉ">
        </div>
        <table>
            <thead>
            <tr>
                <th>Thao tác</th>
                <th>Tên NXB <button v-if="showSort" @click="changeSortByTen"><i v-if="sortUp && sortByTen" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByTen" class="fa-solid fa-sort-down"></i><i v-if="!sortByTen" class="fa-solid fa-eject"></i></button></th>
                <th>Địa chỉ <button v-if="showSort" @click="changeSortByDiaChi"><i v-if="sortUp  && sortByDiaChi" class="fa-solid fa-sort-up"></i><i v-if="!sortUp && sortByDiaChi" class="fa-solid fa-sort-down"></i><i v-if="!sortByDiaChi" class="fa-solid fa-eject"></i></button></th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="onCreate">
                <td><button @click="createNXB()"><i class="fa-solid fa-save" :disabled="(newNXB.TenNXB == '' || newNXB.DiaChi == '')"></i></button></td>
                <td><input type="text" v-model="newNXB.TenNXB"></td>
                <td><input type="text" v-model="newNXB.DiaChi"></td>
            </tr>
            <tr v-for="nxb in filteredList" :key="nxb._id">
                <td><input type="checkbox" v-model="selectedItems" :value="nxb._id"> <button @click="onchange(nxb._id)"><i class="fa-solid fa-pen"></i></button> <button v-if="nxb._id == onchangeItem" @click="savechange(nxb.TenNXB, nxb.DiaChi)"><i class="fa-solid fa-save"></i></button></td>
                <td><div v-if="nxb._id != onchangeItem">{{ nxb.TenNXB }}</div><input v-if="nxb._id == onchangeItem" type="text" :placeholder="nxb.TenNXB" v-model="changevalue.TenNXB"></td>
                <td><div v-if="nxb._id != onchangeItem">{{ nxb.DiaChi }}</div><input v-if="nxb._id == onchangeItem" type="text" :placeholder="nxb.DiaChi" v-model="changevalue.DiaChi"></td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>
  
<script>
    import NXBService from "@/services/nhaXuatBan.service";
    
    export default {
        data() {
            return {
                nxbList: [],
                selectedItems: [],
                onchangeItem: '',
                showFilter: false,
                isFiltered: false,
                sortByTen:false,
                sortByDiaChi:false,
                showSort:false,
                sortUp:true,
                onCreate:false,
                filterCriteria: {
                    TenNXB: "",
                    DiaChi: ""
                },
                changevalue: {
                    TenNXB: "",
                    DiaChi: ""
                },
                newNXB: {
                    TenNXB: "",
                    DiaChi: ""
                }
            };
        },
        async created() {
            await this.fetchNXBList();
        },
        computed: {
            filteredList() {
                if (this.filterCriteria.TenNXB == "" && this.filterCriteria.DiaChi == ""){
                    this.isFiltered = false;
                }else this.isFiltered = true;
                const returnList = this.nxbList.filter(nxb => {
                    const tenNXBMatched = nxb.TenNXB.toLowerCase().includes(this.filterCriteria.TenNXB.toLowerCase());
                    const diaChiMatched = nxb.DiaChi.toLowerCase().includes(this.filterCriteria.DiaChi.toLowerCase());
                    return tenNXBMatched && diaChiMatched;
                });
                if (this.sortByTen && this.sortUp){
                    returnList.sort((a,b)=>{
                        return a.TenNXB.localeCompare(b.TenNXB);
                    })
                }
                else if (this.sortByTen && !this.sortUp){
                    returnList.sort((a,b)=>{
                        return b.TenNXB.localeCompare(a.TenNXB);
                    })
                }else if (this.sortByDiaChi && this.sortUp){
                    returnList.sort((a,b)=>{
                        return a.DiaChi.localeCompare(b.DiaChi);
                    })
                }else if (this.sortByDiaChi && !this.sortUp){
                    returnList.sort((a,b)=>{
                        return b.DiaChi.localeCompare(a.DiaChi);
                    })
                }
                return returnList;
            }
        },
        methods: {
            async fetchNXBList() {
                try {
                    this.nxbList = await NXBService.getAll();
                } catch (error) {
                    console.error("Error fetching NXB list:", error);
                }
            },
            toggleFilter() {
                this.showFilter = !this.showFilter;
            },
            toggleSort(){
                if (this.showSort){
                    this.sortByTen=false;
                    this.sortByDiaChi=false;
                    this.sortUp=true;
                }
                this.showSort = !this.showSort;
            },
            changeSortByTen(){
                if (this.sortByTen==false){
                    this.sortByTen=true;
                    this.sortByDiaChi=false;
                    this.sortUp=true;
                }else{
                   this.sortUp=!this.sortUp; 
                }
            },
            changeSortByDiaChi(){
                if (this.sortByDiaChi==false){
                    this.sortByDiaChi=true;
                    this.sortByTen=false;
                    this.sortUp=true;
                }else{
                   this.sortUp=!this.sortUp; 
                }
            },
            unFilter() {
                this.filterCriteria.TenNXB="";
                this.filterCriteria.DiaChi="";
                this.isFiltered=false;
            },
            async deleteMany() {
                try {
                    if (confirm("Bạn có muốn xóa các mục đã chọn không?")) {
                        await Promise.all(this.selectedItems.map(async (element) => {
                            await NXBService.delete(element);
                        }));
                        await this.fetchNXBList();
                        this.selectedItems=[];
                    } else {
                        
                    }
                } catch (error) {
                    console.error("Lỗi khi xóa nhiều mục:", error);
                }
            },
            onchange(nxbid){
                if(this.onchangeItem == nxbid){
                    this.onchangeItem='';
                }
                else this.onchangeItem=nxbid;
                this.changevalue['TenNXB']='';
                this.changevalue['DiaChi']='';
            },
            async savechange(oldTenNXB, oldDiaChi){
                if (!(this.changevalue['TenNXB'] == "" && this.changevalue['DiaChi']=="")){
                    const data={};
                    this.changevalue['TenNXB'] != "" ? data['TenNXB']=this.changevalue['TenNXB'] : data['TenNXB']=oldTenNXB;
                    this.changevalue['DiaChi'] != "" ? data['DiaChi']=this.changevalue['DiaChi'] : data['DiaChi']=oldDiaChi;
                    try {
                        await NXBService.update(this.onchangeItem, data);
                        await this.fetchNXBList();
                    }catch (error) {
                        console.error("Lỗi khi cập nhật mục:", error);
                    }
                }
                this.onchangeItem='';
                this.changevalue['TenNXB']='';
                this.changevalue['DiaChi']='';
            },
            onCreateChange(){
                if(this.onCreate){
                    this.newNXB['TenNXB']=='';
                    this.newNXB['DiaChi']=='';
                }
                this.onCreate=!this.onCreate;
            },
            async createNXB(){
                try{
                    if(!(this.newNXB['TenNXB']=='' || this.newNXB['DiaChi']=='')){
                        await NXBService.create(this.newNXB);
                        await this.fetchNXBList();
                    }
                    this.onCreateChange();
                }catch (error){
                    console.log('Lỗi khi thêm mục:', error0);
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
    
    th,
    td {
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
  