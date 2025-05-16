<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Welcome</template>
    <p class="strong">Ứng dụng quản lý thư viện</p>
    <p>DEV quốc phong</p>
    <p>MSSV: 1150080153</p>
    <p>DEV hoàng nam</p>
    <p>MSSV: 1150080149</p>
    <p>Học phần: mã nguồn mở</p>
  </WelcomeItem>
</template>

<style scoped>
.strong{
  font-weight: 500;
}
</style>
