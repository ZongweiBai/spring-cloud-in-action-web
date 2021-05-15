<!-- 数据集管理页面 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 目录面板 -->
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>数据集</span>
            <el-button
              style="float: right; padding: 0px 0; font-size: 18px"
              type="text"
            >
              <i class="el-icon-circle-plus" @click="add"></i>
            </el-button>
          </div>
          <div>
            <el-tree
              :data="mainTreeData"
              :props="mainTreeProps"
              @node-click="handleNodeClick"
            ></el-tree>
          </div>
        </el-card>
      </el-col>

      <!-- 数据源面板 -->
      <el-col :span="18" v-if="datasetConfigVisible">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="currentDataset.name" style="font-weight: bold">
              {{ currentDataset.name }}
            </span>
            <span v-else> 新增数据集 </span>
          </div>
          <div class="box">
            <div class="box-body">
              <!-- Name -->
              <div class="el-form-item">
                <label class="el-form-item__label">数据集名称:</label>
                <div class="el-form-item__content">
                  <el-input
                    v-model="currentDataset.name"
                    placeholder="Dataset Name"
                  ></el-input>
                </div>
              </div>

              <!-- Category Name -->
              <div class="el-form-item">
                <label class="el-form-item__label">分类:</label>
                <div class="el-form-item__content">
                  <el-input
                    v-model="currentDataset.categoryName"
                    placeholder="Category Name"
                  ></el-input>
                </div>
              </div>

              <!-- Datasource -->
              <div class="el-form-item">
                <label class="el-form-item__label">数据源:</label>
                <div class="el-form-item__content">
                  <el-select
                    v-model="currentDataset.data.datasource"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="datasource in datasourceList"
                      :key="datasource.id"
                      :label="datasource.name + ' (' + datasource.type + ')'"
                      :value="datasource.id"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>

              <!-- SQL Text -->
              <div class="el-form-item">
                <label class="el-form-item__label">SQL定义:</label>
                <div class="el-form-item__content">
                  <el-input
                    v-model="currentDataset.data.query.sql"
                    type="textarea"
                    :rows="8"
                    placeholder="input SQL Text"
                  ></el-input>
                  <el-button type="primary" size="small" @click="loadData"
                    >载入数据</el-button
                  >
                </div>
              </div>

              <el-row :gutter="20">
                <div class="row">
                  <el-col :span="12">
                    <div class="col-md-6">
                      <div class="dashed-box dataset-collection">
                        <span
                          v-for="item in datasetCollection"
                          :key="item.name"
                          :class="{ selected: item.selected }"
                          @click="selectDataset(item)"
                          >{{ item.name }}</span
                        >
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="col-md-6">
                      <div class="dashed-box dataset-tree">
                        <dimension-tree
                          v-model="currentDimension"
                          :treeData="currentDataset.data.schema.dimension"
                          :options="dimensionOptions"
                          :edit="true"
                        ></dimension-tree>
                        <measure-tree
                          v-model="currentMeasure"
                          :treeData="currentDataset.data.schema.measure"
                          :options="measureOptions"
                        ></measure-tree>
                      </div>
                    </div>
                  </el-col>
                </div>
              </el-row>

              <div class="row">
                <div
                  class="col-md-12"
                  style="margin-top: 20px; float: right; margin-bottom: 20px"
                >
                  <el-button
                    type="primary"
                    size="small"
                    class="pull-right"
                    @click="save"
                    >保存</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  deleteDataset,
  updateDataset,
  saveDataset,
} from "@/api/cboard/dataset";
export default {
  name: "DatasetConfig",
  components: {
    DimensionTree: () =>
      import("@/components/cboard/dataset/DimensionTree.vue"),
    MeasureTree: () => import("@/components/cboard/dataset/MeasureTree.vue"),
  },
  created() {
    this.$store.dispatch("cboardDataset/getDatasetList");
    this.$store.dispatch("cboardDatasource/getDatasourceList");
  },
  data() {
    return {
      mainTreeProps: {
        label: "name",
      },
      currentDimension: [],
      currentMeasure: [],
      dimensionOptions: {
        animation: 0,
        group: "valueGroup",
      },
      measureOptions: {
        animation: 0,
        group: "valueGroup",
      },
      datasetConfigVisible: false, //配置面板的隐藏和显示
      currentDataset: {
        data: {
          query: {},
        },
      }, //当前的 dataset，点击左侧目录node获得
      allDataset: [], //通过请求返回的所有的 dataset 字段
      flag: "update", // save 按钮基于 flag 的值判断是更新还是新增操作。update-更新，add-新增
    };
  },
  computed: {
    datasetList() {
      return this.$store.state.cboardDataset.datasetList;
    },
    datasourceList() {
      return this.$store.state.cboardDatasource.datasourceList;
    },
    /*右侧主目录数据*/
    mainTreeData() {
      let treeData = [];
      console.log("======================");
      console.log(this.datasetList);
      this.datasetList.forEach((dataset) => {
        let item = categoryInArray(dataset.categoryName, treeData);
        if (item === null) {
          item = {
            name: dataset.categoryName,
            children: [],
          };
          item.children.push(dataset);
          treeData.push(item);
        } else {
          item.children.push(dataset);
        }
      });

      function categoryInArray(categoryName, array) {
        let result = null;
        array.forEach((item) => {
          if (item.name === categoryName) result = item;
        });
        return result;
      }

      return treeData;
    },
    datasetSelected() {
      let schema = this.currentDataset.data.schema;
      let selects = [];
      selects = selects.concat(schema.measure);
      schema.dimension.forEach((e) => {
        if (e.type == "level") {
          e.columns.forEach((c) => {
            selects.push(c);
          });
        } else {
          selects.push(e);
        }
      });
      return selects;
    },
    datasetCollection() {
      //点击 Load Data 加载后，虚线框内获得的字段
      let collection = [];
      let datasetSelected = this.datasetSelected;
      this.allDataset.forEach((item) => {
        let obj = { name: item };
        if (existInSelected(item, datasetSelected)) {
          obj.selected = true;
        } else {
          obj.selected = false;
        }
        collection.push(obj);
      });

      function existInSelected(name, datasetSelected) {
        for (let i = 0; i < datasetSelected.length; i++) {
          if (name === datasetSelected[i].column) {
            return true;
          }
        }
        return false;
      }

      return collection;
    },
  },
  methods: {
    handleNodeClick(node) {
      if (node.children) {
        return;
      }
      this.flag = "update";
      this.datasetConfigVisible = true;
      this.currentDataset = node;
      this.allDataset = [];
      console.log(node);
    },
    add() {
      this.flag = "add";
      let datasourceId = this.datasetList[0] ? this.datasourceList[0].id : -1;
      this.currentDataset = {
        categoryName: "Default Category",
        name: "",
        data: {
          expressions: [],
          filters: [],
          schema: {
            dimension: [],
            measure: [],
          },
          query: {},
          datasource: datasourceId,
        },
      };
      this.datasetConfigVisible = true;
    },
    del() {
      this.$confirm("是否删除该数据集?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
        customClass: "preview-config-modal",
      })
        .then(() => {
          deleteDataset({ id: this.currentDataset.id })
            .then((res) => {
              console.log(res);
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.datasetConfigVisible = false;
              this.$store.dispatch("cboardDataset/getDatasetList");
            })
            .catch((err) => {
              console.log(err);
              this.$message({
                type: "error",
                message: "删除失败",
              });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadData() {
      if (
        !this.currentDataset ||
        !this.currentDataset.data ||
        !this.currentDataset.data.query ||
        !this.currentDataset.data.query.sql
      ) {
        this.$message.error("请填写SQL语句");
        return;
      }
      /* const temp_sql = `SELECT    
       b.the_year + 5 AS the_year, b.month_of_year, b.day_of_month,
       date_add(b.the_date, interval 5 year) AS the_date,
       r.SALES_DISTRICT, r.SALES_REGION, r.SALES_COUNTRY,
       d.yearly_income, d.total_children, d.member_card, d.num_cars_owned, d.gender,
       a.store_sales, a.store_cost, a.unit_sales
  FROM foodmart2.sales_fact_sample a
  JOIN foodmart2.time_by_day b ON a.time_id = b.time_id
  JOIN foodmart2.store c ON a.store_id = c.store_id
  JOIN foodmart2.region r ON c.REGION_ID = r.REGION_ID
  JOIN foodmart2.customer d ON a.CUSTOMER_ID = d.CUSTOMER_ID
 WHERE SALES_COUNTRY IS NOT NULL` // 线上预览，写死该语句。*/
      let params = {
        datasourceId: this.currentDataset.data.datasource,
        query: JSON.stringify({ sql: this.currentDataset.data.query.sql }),
        //query: JSON.stringify( {sql: temp_sql} ) // 线上预览，写死该语句。
      };
      console.log(params);
      this.$store.dispatch("cboardDataset/getColumns", params).then((data) => {
        this.allDataset = data;
      });
    },
    selectDataset(dataset) {
      if (dataset.selected) {
        return;
      } else {
        let id = this.generateUUID;
        let item = {
          column: dataset.name,
          type: "column",
          id: id,
        };
        this.currentDataset.data.schema.dimension.push(item);
        dataset.selected = true;
      }
    },
    generateUUID() {
      var d = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    },
    save() {
      this.currentDataset.data.schema.dimension = this.currentDimension;
      this.currentDataset.data.schema.measure = this.currentMeasure;

      let message = {};
      if (this.flag === "update") {
        message = { success: "保存成功", error: "保存失败" };
      } else if (this.flag === "add") {
        message = { success: "新增成功", error: "新增失败" };
      }

      let params = {
        json: JSON.stringify(this.currentDataset),
      };

      if (this.flag === "update") {
        updateDataset(params)
          .then(() => {
            this.$message({
              type: "success",
              message: message.success,
            });
            this.$store.dispatch("config/getDatasetList");
          })
          .catch((err) => {
            console.log("err", err);
            this.$message({
              type: "error",
              message: message.error,
            });
          });
      } else {
        saveDataset(params)
          .then((res) => {
            console.log('新增成功')
            console.log(res)
            this.$message({
              type: "success",
              message: message.success,
            });
            this.$store.dispatch("config/getDatasetList");
          })
          .catch((err) => {
            console.log("err", err);
            this.$message({
              type: "error",
              message: message.error,
            });
          });
      }
    },
  },
};
</script>

<style scoped>
.panel-body {
  padding: 10px 20px;
}
.box-tools {
  top: 11px !important;
}
.box-tools i {
  font-size: 16px;
  cursor: pointer;
}
.box-header .el-icon-delete {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
/*表单样式*/
.el-form-item__label {
  font-weight: bold;
  width: 130px;
}
.el-form-item__content {
  overflow: hidden;
}
.dataset-collection span {
  display: inline-block;
  font-size: 12px;
  vertical-align: middle;
  margin: 3px 3px;
  padding: 5px 10px;
  background-color: #fbfcfd;
  color: #333;
  border: 1px solid #d9e3ec;
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
}
.dataset-collection span.selected {
  background-color: #3497db;
  color: #fff;
}
.dashed-box {
  border: 2px dashed #d2d6de;
  min-height: 200px;
  padding: 0;
}
</style>
