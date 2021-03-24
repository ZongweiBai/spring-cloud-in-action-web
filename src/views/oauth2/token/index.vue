<template>
  <div class="app-container">
    <div class="filter-container">
       <el-select v-model="temp.client_id" placeholder="请选择客户端">
          <el-option
            v-for="item in clientInfos"
            :key="item.client_id"
            :label="item.client_id"
            :value="item.client_id">
          </el-option>
        </el-select>
      <el-button v-waves class="filter-item" style="margin-bottom: 5px; margin-left: 10px;" type="primary" icon="el-icon-search" @click="getList">
        查询
      </el-button>
    </div>

    <el-table :key="tableKey" :data="list"
      v-loading="listLoading" border fit
      highlight-current-row style="width: 100%;" >
      <el-table-column label="AccessToken" prop="client_id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.access_token }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Token类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.token_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="RefreshToken" align="center">
        <template slot-scope="{row}">
          <span>{{ row.refresh_token }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作用域" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.scope }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Token有效期(秒)" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.expires_in }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="danger" size="small" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList } from '@/api/oauthClient'
import { fetchTokenByClient, revokeToken } from '@/api/oauthToken'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

export default {
  name: 'OAuth2Token',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      clientInfos: [],
      temp: {
        client_id: ''
      },
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogSecretVisible: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      grantTypes: [{
          value: 'refresh_token',
          label: 'refresh_token'
        }, {
          value: 'password',
          label: 'password'
        }, {
          value: 'authorization_code',
          label: 'authorization_code'
        }],
      scopes: [{
          value: 'all',
          label: 'all'
        }, {
          value: 'read',
          label: 'read'
        }, {
          value: 'write',
          label: 'write'
        }]
    }
  },
  created() {
    this.getClientList()
  },
  methods: {
    getClientList() {
      fetchList().then(response => {
        this.clientInfos = response
        if (this.clientInfos) {
          this.temp.client_id = this.clientInfos[0].client_id
          fetchTokenByClient(this.clientInfos[0]).then(response => {
            this.list = response
          })
        }
      })
    },
    getList() {
      this.listLoading = true
      fetchTokenByClient(this.temp).then(response => {
        this.list = response

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {}
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该Token信息, 是否继续?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          revokeToken(row).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          })
        }).catch(() => {
          // 取消删除
        });
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>