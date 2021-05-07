<template>
  <div>
    <el-form :model="datasourceForm" :rules="rules" ref="datasourceForm">
      <el-form-item label="数据源名称" prop="name">
          <el-input v-model="datasourceForm.name"></el-input>
      </el-form-item>
      <el-form-item label="服务器地址(http://domain:port)" prop="server">
          <el-input v-model="datasourceForm.server"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="datasourceForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
          <el-input v-model="datasourceForm.password" type="password"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SaikuForm',
  props: {
    value: Object
  },
  watch: {
    value(val) {
      this.datasourceForm = val;
    },
    datasourceForm: {
      handler(val, oldVal) {
        console.log(oldVal)
        this.$emit('input', val);
      },
      deep: true
    }
  },
  created() {
    this.datasourceForm = this.value;
  },
  data() {
    return {
      datasourceForm: {
        name: '',
        server: '',
        username: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        server: [
          { required: true, message: '请输入server', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
}
</script>

<style scoped>

</style>