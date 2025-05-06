<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
defineProps({
  reader: {
    type: String,
    required: false
  }
})
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Welcome {{ hoten == '' ? 'Guess' : hoten }}!</template>
    <router-link v-if="$route.params.id != undefined" to="/">Logout</router-link>
    <div v-if="$route.params.id == undefined">
      Nhập thông tin của bạn:
      <br>
      <label for="sdtInput">Số điện thoại: </label>
      <input type="text" v-model="sdt">
      <button @click="fetchDocGia">Tìm</button>
      <hr>
      <div>
        <label for="hoten">Họ tên: </label>
        <input type="text" id="hoten" v-model="hoten" :disabled="$route.params.id == undefined">
        <br>
        <label for="hoten">Ngày sinh: </label>
        <input type="text" id="hoten" v-model="ngaysinh" :disabled="$route.params.id == undefined">
        <br>
        <label for="hoten">Phái: </label>
        <input type="text" id="hoten" v-model="phai" :disabled="$route.params.id == undefined">
        <br>
        <label for="hoten">Địa chỉ: </label>
        <input type="text" id="hoten" v-model="diachi" :disabled="$route.params.id == undefined">
        <br>
        <button @click="login"><router-link>Login</router-link></button>
      </div>
      <hr>
      <button v-if="!registerShow" @click="toggleRegister">Không tìm thấy? Đăng ký ngay!</button>
      <button v-if="registerShow" @click="toggleRegister">Hủy</button>
      <div v-if="registerShow">
        <label for="newsdt">Số điện thoại: </label>
        <input type="text" id="newsdt" v-model="newDocGia.DienThoai">
        <br>
        <label for="newholot">Họ lót: </label>
        <input type="text" id="newhoten" v-model="newDocGia.HoLot" >
        <br>
        <label for="newten">Tên: </label>
        <input type="text" id="newten" v-model="newDocGia.Ten">
        <br>
        <label for="newNgaysinh">Ngày sinh: </label>
        <input type="date" id="newNgaysinh" v-model="newDocGia.NgaySinh">
        <br>
        <label for="newPhai">Phái: </label>
        <input type="text" id="newPhai" v-model="newDocGia.Phai" placeholder="Nam/Nữ/Khác">
        <br>
        <label for="newDC">Địa chỉ: </label>
        <input type="text" id="newDC" v-model="newDocGia.DiaChi">
        <br>
        <button @click="register"><router-link>Đăng ký</router-link></button>
      </div>
    </div>
    <hr>
    <div v-if="$route.params.id != undefined">
      Thay đổi thông tin cá nhân:
      <br>
        <label for="changesdt">Số điện thoại: </label>
        <input type="text" id="changesdt" v-model="newDocGia.DienThoai">
        <br>
        <label for="changeholot">Họ lót: </label>
        <input type="text" id="changehoten" v-model="newDocGia.HoLot">
        <br>
        <label for="changeten">Tên: </label>
        <input type="text" id="changeten" v-model="newDocGia.Ten">
        <br>
        <label for="changeNgaysinh">Ngày sinh: </label>
        <input type="date" id="changeNgaysinh" v-model="newDocGia.NgaySinh" >
        <br>
        <label for="changePhai">Phái: </label>
        <input type="text" id="changePhai" v-model="newDocGia.Phai">
        <br>
        <label for="changeDC">Địa chỉ: </label>
        <input type="text" id="changeDC" v-model="newDocGia.DiaChi">
        <br>
        <button @click="saveChange"><i class="fa-solid fa-save"></i></button>
    </div>
  </WelcomeItem>
</template>

<script>
  import DocGiaService from '@/services/docGia.service';
  import moment from 'moment';

  export default {
    data(){
      return {
        sdt:'',
        hoten: '',
        holot: '',
        ten: '',
        ngaysinh:'',
        phai:'',
        diachi:'',
        _id:'',
        newDocGia:{
          DienThoai:'',
          HoLot: '',
          Ten: '',
          NgaySinh:'',
          Phai:'',
          DiaChi:'',
        },
        showConfirmDialog:false,
        registerShow:false,
      }
    },
    async created() {
      await this.createDocGia();
      if(this.$route.params.id != undefined){
        this.autobind();
      }
    },
    methods: {
      async createDocGia(){
        if(this.$route.params.id != undefined){
          try {
            const docGia = await DocGiaService.get(this.$route.params.id);
            this.sdt=docGia.DienThoai;
            await this.fetchDocGia();
          }catch (err){
            console.log("Erorr when createDocGia:", err);
          }
        }
      },
      async fetchDocGia(){
        let docGia;
        if(this.sdt != ''){
          try{
            docGia = await DocGiaService.getBySDT(this.sdt);
            if (docGia != undefined){
              this.sdt=docGia.DienThoai;
              this.hoten=docGia.HoLot + ' ' + docGia.Ten;
              this.holot=docGia.HoLot;
              this.ten=docGia.Ten;
              this.ngaysinh=docGia.NgaySinh;
              this.phai=docGia.Phai;
              this._id=docGia._id;
              this.diachi=docGia.DiaChi;
            }
          }catch(err){
            console.log("Error when findbySDT:", err);
          }
        }
      },
      login(){
        window.location.href=`/${this._id}`;
      },
      toggleRegister(){
        if (this.registerShow){
          this.newDocGia={
            DienThoai:'',
            HoLot: '',
            Ten: '',
            NgaySinh:'',
            Phai:'',
            DiaChi:'',
          }
        }
        this.registerShow=!this.registerShow;
      },
      async register(){
        if(this.newDocGia.DienThoai != ''
        && this.newDocGia.HoLot != '' 
        && this.newDocGia.Ten != '' 
        && this.newDocGia.NgaySinh != ''
        && (this.newDocGia.Phai != "Nam" || this.newDocGia.Phai != "Nữ" || this.newDocGia.Phai != "Khác")
        && this.newDocGia.DiaChi != ''){
          try{
            const newDOcGia = await DocGiaService.create(this.newDocGia);
            if (confirm("Đăng ký thành công! Đăng nhập ngay?")){
              window.location.href=`/${newDOcGia._id}`;
            }else {
              this.toggleRegister();
              this.sdt=newDOcGia.DienThoai;
              await this.fetchDocGia();
            }
          }catch (err){
            console.log("Error when register:", err);
          }
        }else{
          alert("Thông tin không chính xác!");
        }
      },
      autobind(){
        this.newDocGia = {
          DienThoai: this.sdt,
          HoLot: this.holot,
          Ten: this.ten,
          NgaySinh: moment(this.ngaysinh, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          Phai: this.phai,
          DiaChi: this.diachi
        }
      },
      async saveChange(){
        if(this.newDocGia.DienThoai != ''
        && this.newDocGia.HoLot != '' 
        && this.newDocGia.Ten != '' 
        && this.newDocGia.NgaySinh != ''
        && (this.newDocGia.Phai != "Nam" || this.newDocGia.Phai != "Nữ" || this.newDocGia.Phai != "Khác")
        && this.newDocGia.DiaChi != ''){
          try {
            await DocGiaService.update(this.$route.params.id, this.newDocGia);
          }catch(err){
            console.log("Error when saveChange:", err);
          }
        }
        
      }
    }
  }

</script>

<style scoped>
.strong{
  font-weight: 500;
}
</style>
