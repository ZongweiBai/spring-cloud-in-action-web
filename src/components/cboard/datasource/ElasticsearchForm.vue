<template>
  <div>
    <el-form :model="datasourceForm" :rules="rules" ref="datasourceForm">
      <el-form-item label="数据源名称" prop="name">
        <el-input v-model="datasourceForm.name"></el-input>
      </el-form-item>
      <el-form-item label="数据源IP" prop="server">
        <el-input v-model="datasourceForm.server"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="datasourceForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="datasourceForm.password"></el-input>
      </el-form-item>
      <el-form-item label="编码(default: utf-8)" prop="charset">
        <el-input v-model="datasourceForm.charset"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ElasticsearchForm",
  props: {
    value: Object,
  },
  watch: {
    value(val) {
      this.datasourceForm = val;
    },
    datasourceForm: {
      handler(val, oldVal) {
        console.log(oldVal);
        this.$emit("input", val);
      },
      deep: true,
    },
  },
  created() {
    this.datasourceForm = this.value;
  },
  data() {
    return {
      datasourceForm: {
        name: "",
        server: "",
        username: "",
        password: "",
        charset: "",
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        server: [{ required: true, message: "请输入server", trigger: "blur" }],
      },
    };
  },
};
</script>

<style scoped>
</style>