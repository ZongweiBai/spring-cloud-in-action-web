<template>
  <div>
    <el-form :model="datasourceForm" :rules="rules" ref="datasourceForm">
      <el-form-item label="数据源名称" prop="name">
          <el-input v-model="datasourceForm.name"></el-input>
      </el-form-item>
      <el-form-item label="驱动(eg: com.mysql.jdbc.Driver)" prop="driver">
          <el-input v-model="datasourceForm.driver"></el-input>
      </el-form-item>
      <el-form-item label="JDBC Url (eg: jdbc:mysql://hostname:port/db)" prop="jdbcurl">
          <el-input v-model="datasourceForm.jdbcurl"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
          <el-input v-model="datasourceForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
          <el-input v-model="datasourceForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="是否使用连接池" prop="pooled">
          <el-checkbox v-model="datasourceForm.pooled"></el-checkbox>
      </el-form-item>
      <el-form-item label="Aggregatable DataProvider" prop="aggregateProvider">
          <el-checkbox v-model="datasourceForm.aggregateProvider"></el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'JdbcForm',
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
        driver: '',
        jdbcurl: '',
        username: '',
        password: '',
        pooled: false,
        aggregateProvider: false
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        driver: [
          { required: true, message: '请输入driver', trigger: 'blur' }
        ],
        jdbcurl: [
          { required: true, message: '请输入URL', trigger: 'blur' }
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