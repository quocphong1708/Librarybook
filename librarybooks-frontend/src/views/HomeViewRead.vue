<script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <TheWelcome :reader="reader_name"/>
  </main>
</template>

<script>
  import DocGiaService from '@/services/docGia.service';

  export default {
    data(){
      return {
        reader_name:'Guess'
      }
    },
    async created(){
      await this.fetchName();
    },
    methods: {
      async fetchName() {
        let docGia;
        if (this.$route.params.id != undefined){
          try {
            docGia = await DocGiaService.get(this.$route.params.id)
            this.reader_name=docGia.HoLot + ' ' + docGia.Ten;
          }catch(err){
            console.log("Err when fetching Name:", err);
          }
        }
      }
    }
  }
</script>