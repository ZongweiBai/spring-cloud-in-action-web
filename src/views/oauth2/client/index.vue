<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增客户端
      </el-button>
    </div>

    <el-table :key="tableKey" :data="list"
      v-loading="listLoading" border fit
      highlight-current-row style="width: 100%;" >
      <el-table-column label="客户端ID" prop="client_id" align="center" width="80" >
        <template slot-scope="{row}">
          <span>{{ row.client_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权模式" align="center">
        <template slot-scope="{row}">
          <el-tag style="margin-top:4px;margin-left:4px;" v-for="(value, index) in row.authorized_grant_types" :key="index">{{ value }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="重定向URL" align="center">
        <template slot-scope="{row}">
          <span v-for="(value, index) in row.redirect_uri" :key="index" >{{ value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作用域" width="110px" align="center">
        <template slot-scope="{row}">
            <el-tag style="margin-top:4px;margin-left:4px;" v-for="(value, index) in row.scope" :key="index">{{ value }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Token有效期" align="center" >
        <template slot-scope="{row}">
          <span v-if="row.access_token_validity===-1">永久有效</span>
          <span v-else>{{ row.access_token_validity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Token重置有效期" align="center" >
        <template slot-scope="{row}">
          <span v-if="row.refresh_token_validity===-1">永久有效</span>
          <span v-else>{{ row.refresh_token_validity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="small" @click="handlePatch(row)">
            重置Secret
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 600px; ">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户端ID" prop="client_id">
              <el-input v-model="temp.client_id" :disabled="dialogStatus==='update'" placeholder="请填写客户端ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权模式" prop="authorized_grant_types">
              <el-select
                v-model="temp.authorized_grant_types"
                multiple
                collapse-tags
                placeholder="请选择">
                <el-option
                  v-for="item in grantTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="dialogStatus==='create'">
          <el-col :span="12">
            <el-form-item label="客户端Secret" prop="client_secret">
              <el-input type='password' auto-complete="new-password" v-model="temp.client_secret" placeholder="请填写客户端Secret" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认Secret" prop="client_secret_repeat">
              <el-input type='password' auto-complete="new-password" v-model="temp.client_secret_repeat" placeholder="请再次输入客户端Secret" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="重定向URL" prop="redirect_uri_copy">
              <el-input v-model="temp.redirect_uri_copy" placeholder="请填写URL，多个逗号分割" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作用域" prop="scope">
              <el-select
                v-model="temp.scope"
                multiple
                collapse-tags
                placeholder="请选择">
                <el-option
                  v-for="item in scopes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="Token有效期" prop="access_token_validity">
              <el-input v-model="temp.access_token_validity" placeholder="请填写Token有效期（单位秒）" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重置有效期" prop="refresh_token_validity">
              <el-input v-model="temp.refresh_token_validity" placeholder="请填写Token重置有效期（单位秒）" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogSecretVisible" title="重置客户端Secret" style="width: 70%;margin-left: 15%;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; ">
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户端Secret" prop="access_token_validity">
              <el-input v-model="temp.client_secret" placeholder="请填写客户端Secret" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="请重复输入" prop="refresh_token_validity">
              <el-input v-model="temp.client_secret_repeart" placeholder="请输入相同的客户端Secret" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSecretVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="patchData()">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createClient, deleteClient, updateClient, patchClient } from '@/api/oauthClient'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

export default {
  name: 'OAuth2Client',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      temp: {
      },
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response

        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {}
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.redirect_uri = this.temp.redirect_uri_copy.split(',').map(x => x.trim())
          createClient(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.redirect_uri_copy = this.temp.redirect_uri.join(',')
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.redirect_uri = this.temp.redirect_uri_copy.split(',').map(x => x.trim())
          updateClient(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该Client信息, 是否继续?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteClient(row).then(() => {
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
    handlePatch(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogSecretVisible = true
    },
    patchData() {
      patchClient(this.temp).then(() => {
        this.dialogSecretVisible = false
        this.$notify({
          title: 'Success',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
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