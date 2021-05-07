<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 目录面板 -->
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>数据源</span>
            <el-button
              style="float: right; padding: 0px 0; font-size: 18px"
              type="text"
            >
              <i class="el-icon-circle-plus" @click="add"></i>
            </el-button>
          </div>
          <div
            v-for="datasource in datasourceList"
            :key="datasource.id"
            class="text item"
          >
            <span>{{ datasource.name }}</span>
            <span class="pull-right">
              <el-button
                style="float: right; padding: 3px 0; font-size: 18px"
                type="text"
              >
                <i class="el-icon-edit-outline" @click="edit(datasource)"></i>
              </el-button>
              <el-button
                style="float: right; padding: 3px 0; font-size: 18px"
                type="text"
              >
                <i class="el-icon-delete" @click="del(datasource)"></i>
              </el-button>
            </span>
          </div>
        </el-card>
      </el-col>

      <!-- 数据源面板 -->
      <el-col :span="18" v-show="showDatasourceArea">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="datasourceForm.name" style="font-weight: bold">
              {{ datasourceForm.name }}
            </span>
            <span v-else> 请选择并填写数据源名称 </span>
          </div>
          <div class="box">
            <label class="el-form-item__label">数据源类型</label>
            <div class="el-form-item__content">
              <el-select
                placeholder="请选择"
                v-model="type"
                :disabled="!eidtable"
                style="width: 100%; margin-bottom: 22px"
              >
                <el-option
                  v-for="provider in providerList"
                  :key="provider"
                  :label="provider"
                  :value="provider"
                ></el-option>
              </el-select>
              <!-- <jdbc-form v-model="datasourceForm" ref="datasourceForm"></jdbc-form> -->
              <component
                :is="currentForm"
                v-model="datasourceForm"
                v-show="type !== ''"
                ref="datasourceForm"
              ></component>
              <div class="el-form-item">
                <el-button
                  @click="save"
                  style="float: right; margin-left: 10px"
                  type="primary"
                  >保存</el-button
                >
                <el-button @click="test" style="float: right">测试</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="测试数据库连接"
      @close="closeTestHandler"
      :visible.sync="isTestShow"
      :modal-append-to-body="false"
    >
      <div class="test-content">
        <div class="test-input">
          <el-input
            v-model="testSql"
            type="textarea"
            :rows="2"
            placeholder="请输入SQL语句"
          ></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelTest">取消</el-button>
        <el-button type="primary" @click="submitTest">测试</el-button>
      </div>
      <el-alert
        @close="closeAlerteHandler"
        v-if="testResponse.visible"
        :title="testResponse.title"
        :type="testResponse.type"
      >
      </el-alert>
    </el-dialog>
  </div>
</template>

<script>
import {
  deleteDatasource,
  updateDatasource,
  saveDatasource,
  testDatasource,
} from "@/api/cboard/datasource";
export default {
  name: "DatasourceConfig",
  created() {
    this.$store.dispatch("cboardDatasource/getDatasourceList");
    this.$store.dispatch("cboardDatasource/getProviderList");
  },
  components: {
    JdbcForm: () => import("@/components/cboard/datasource/JdbcForm"),
    SolrForm: () => import("@/components/cboard/datasource/SolrForm"),
    ElasticsearchForm: () =>
      import("@/components/cboard/datasource/ElasticsearchForm"),
    SaikuForm: () => import("@/components/cboard/datasource/SaikuForm"),
    TextfileForm: () => import("@/components/cboard/datasource/TextfileForm"),
    KylinForm: () => import("@/components/cboard/datasource/KylinForm"),
  },
  data() {
    return {
      showDatasourceArea: false,
      visible: false,
      eidtable: false,
      type: "",
      datasourceForm: {},
      flag: "edit", // 用于判断 save 按钮执行的是【添加】还是【更新】
      isTestShow: false,
      testSql: "",
      testResponse: {
        title: "",
        type: "",
        visible: false,
      },
    };
  },
  computed: {
    datasourceList() {
      return this.$store.state.cboardDatasource.datasourceList;
    },
    providerList() {
      return this.$store.state.cboardDatasource.providerList;
    },
    currentForm() {
      switch (this.type) {
        case "Elasticsearch":
          return "ElasticsearchForm";
        case "Solr":
          return "SolrForm";
        case "saiku":
          return "SaikuForm";
        case "TextFile":
          return "TextfileForm";
        case "jdbc":
          return "JdbcForm";
        case "kylin":
          return "KylinForm";
        default:
          return "JdbcForm";
      }
    },
  },
  methods: {
    add() {
      this.showDatasourceArea = true;
      this.visible = true;
      this.eidtable = true;
      this.type = "";
      this.flag = "add";
      this.currentDatasource = {};
      this.datasourceForm = {};
    },
    edit(datasource) {
      this.showDatasourceArea = true;
      this.visible = true;
      this.eidtable = false;
      this.flag = "edit";
      this.type = datasource.type;
      this.currentDatasource = datasource;

      // 给 datasourceForm 赋值
      let _temp = {};
      for (let prop in datasource.config) {
        _temp[prop] = datasource.config[prop];
      }
      _temp.name = datasource.name;
      this.datasourceForm = _temp;
    },
    del(datasource) {
      this.$confirm("是否删除该数据源？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
        customClass: "preview-config-modal",
      })
        .then(() => {
          deleteDatasource({ id: datasource.id })
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.$store.dispatch("cboardDatasource/getDatasourceList");
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败",
              });
            });
        })
        .catch(() => {});
    },
    save() {
      if (this.type === "") {
        return;
      }
      this.$refs["datasourceForm"].$children[0].validate((valid) => {
        if (valid) {
          this.datasourceForm.type = this.type;
          this.currentDatasource.config = this.datasourceForm;
          this.currentDatasource.name = this.datasourceForm.name;
          this.currentDatasource.type = this.datasourceForm.type;
          let params = {
            json: JSON.stringify(this.currentDatasource),
          };
          if (this.flag === "add") {
            saveDatasource(params)
              .then(() => {
                this.$message({
                  type: "success",
                  message: "新增成功",
                });
                this.$store.dispatch("cboardDatasource/getDatasourceList");
              })
              .catch(() => {
                this.$message({
                  type: "error",
                  message: "新增失败",
                });
              });
          } else {
            updateDatasource(params)
              .then(() => {
                this.$message({
                  type: "success",
                  message: "更新成功",
                });
                this.$store.dispatch("cboardDatasource/getDatasourceList");
              })
              .catch(() => {
                this.$message({
                  type: "error",
                  message: "更新失败",
                });
              });
          }
        }
      });
    },
    // 弹出 Test 窗口
    test() {
      this.$refs["datasourceForm"].$children[0].validate((valid) => {
        if (valid) {
          this.resetTest();
          this.isTestShow = true;
          this.currentDatasource.config = this.datasourceForm;
          this.currentDatasource.name = this.datasourceForm.name;
          this.currentDatasource.type = this.datasourceForm.type;
        }
      });
    },
    // 提交 test
    submitTest() {
      let sqlObj = {
        sql: this.testSql,
      };
      let params = {
        datasource: JSON.stringify(this.currentDatasource),
        query: JSON.stringify(sqlObj),
      };

      testDatasource(params)
        .then((res) => {
          console.log(res);
          if (res.status === "1") {
            this.testResponse.title = "Success";
            this.testResponse.type = "success";
          } else {
            this.testResponse.title = res.msg;
            this.testResponse.type = "error";
          }
          this.testResponse.visible = true;
        })
        .catch((err) => {
          console.log(err);
          this.testResponse.title = "Error";
          this.testResponse.type = "error";
          this.testResponse.visible = true;
        });
    },
    // 关闭 Test 窗口
    cancelTest() {
      this.isTestShow = false;
    },
    closeTestHandler() {
      this.isTestShow = false;
    },
    closeAlerteHandler() {
      this.testResponse.visible = false;
    },
    // 重置 Test 窗口的值
    resetTest() {
      this.testSql = "";
      this.testResponse.visible = false;
    },
  },
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
