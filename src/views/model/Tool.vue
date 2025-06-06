<script setup>
import {onMounted, reactive, ref} from "vue";
import {
  createTool,
  deleteTool,
  getTool,
  getToolPage,
  updateTool,
  updateToolState
} from "@/api/model/tool.js";

import {Delete, Edit, Plus, Refresh, Search} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

const queryDTO = reactive({
  pageNum: 1,
  pageSize: 10,
  name: null,
  stateFlag: null
})

const handleCurrentChange = (v) => {
  queryDTO.pageNum = v
  initToolPage()
}
const handleSizeChange = (v) => {
  queryDTO.pageSize = v
  initToolPage()
}

const loading = ref(false)
const list = ref([])
const total = ref(0)
const initToolPage = async () => {
  loading.value = true
  const {data} = await getToolPage(queryDTO)
  list.value = data.data.rows
  total.value = data.data.total
  loading.value = false
}

const stateFlagEnum = [
  {
    label: "正常",
    value: '0'
  },
  {
    label: "禁用",
    value: '1'
  }
]

const resetQuery = () => {
  queryDTO.pageNum = 1
  queryDTO.pageSize = 10
  queryDTO.name = null
  queryDTO.stateFlag = null
  initToolPage()
}

const multiple = ref(true)
const single = ref(true)
// 选中数组
const ids = ref([])

const handleSelectionChange = (selection) => {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset()
  form.value.stateFlag = '0'
  dialogVisible.value = true;
  title.value = "新增AI模型";
}
/** 修改按钮操作 */
const handleUpdate = async (id) => {
  reset()
  const res = await getTool(id)
  Object.assign(form.value, res.data.data)
  dialogVisible.value = true;
  title.value = "修改AI模型";
}

const form = ref({
  id: undefined,
  name: undefined,
  description: undefined,
  stateFlag: undefined
})
const formRef = ref()
const reset = () => {
  // 清除表单校验
  if (formRef.value) {
    formRef.value.clearValidate();
  }
  // 重置 form 为空
  form.value = {
    id: undefined,
    name: undefined,
    description: undefined,
    stateFlag: undefined
  };
}

const rules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ],
};

const dialogVisible = ref(false)
const title = ref('新增 AI Tool')

const submitForm = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      if (form.value.id) {
        await updateTool(form.value)
      } else {
        await createTool(form.value)
      }
      dialogVisible.value = false;
      await initToolPage()
    }
  })
}

const handleDelete = async (id) => {
  const res = await deleteTool(id)
  if (res.data.code === 200) {
    await initToolPage()
  }
}

const handleStatusChange = async (row) => {
  await updateToolState({
    id: row.id,
    stateFlag: row.stateFlag
  })
  ElMessage.success("操作成功")
  await initToolPage()
}

onMounted(() => {
  initToolPage()
})
</script>

<template>
  <div class="  p-4" style="width: calc(100% - 200px)">
    <div class="flex flex-row justify-between">
      <el-form :model="queryDTO" ref="queryForm" :inline="true">
        <el-form-item label="名称" prop="name">
          <el-input
              v-model="queryDTO.name"
              placeholder="请输入名称"
              clearable
              @keyup.enter.native="initToolPage"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
              v-model="queryDTO.description"
              placeholder="请输入描述"
              clearable
              @keyup.enter.native="initToolPage"
          />
        </el-form-item>
        <el-form-item label="状态" prop="stateFlag">
          <el-select
              v-model="queryDTO.stateFlag"
              style="width: 120px"
              placeholder="状态"
              clearable
          >
            <el-option
                v-for="dict in stateFlagEnum"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="initToolPage">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              :icon="Plus"
              @click="handleAdd"
          >新增
          </el-button>
        </el-col>
        <!--      <el-col :span="1.5">-->
        <!--        <el-button-->
        <!--            type="warning"-->
        <!--            plain-->
        <!--            :icon="Edit"-->
        <!--            :disabled="multiple"-->
        <!--            @click="handleUpdate"-->
        <!--        >修改-->
        <!--        </el-button>-->
        <!--      </el-col>-->
        <!--      <el-col :span="1.5">-->
        <!--        <el-button-->
        <!--            type="danger"-->
        <!--            plain-->
        <!--            :icon="Delete"-->
        <!--            :disabled="single"-->
        <!--            @click="handleDelete"-->
        <!--        >删除-->
        <!--        </el-button>-->
        <!--      </el-col>-->
      </el-row>
    </div>
    <!-- 数据 -->
    <el-table v-loading="loading" :data="list" border @selectionChange="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="描述" prop="description" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="状态" prop="stateFlag" align="center" width="120">
        <template #default="scope">
          <el-switch
              v-model="scope.row.stateFlag"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" sortable prop="createTime" align="center" width="240"/>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="success" circle :icon="Edit" @click="handleUpdate(scope.row.id)">
          </el-button>
          <el-popconfirm
              title="确认删除？"
              placement="top"
              @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button circle :icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <el-pagination v-show="total>0"
                   class="mt-4 float-right"
                   :total="total"
                   background
                   layout="total, sizes, prev, pager, next, jumper"
                   :page-sizes="[10, 20, 50]"
                   v-model:current-page="queryDTO.pageNum"
                   v-model:page-size="queryDTO.pageSize"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"/>

    <el-dialog :title="title" v-model="dialogVisible" width="50%">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" prop="description">
              <el-input v-model="form.description" placeholder="请输入描述"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="状态" prop="stateFlag">
              <el-radio-group v-model="form.stateFlag">
                <el-radio
                    v-for="dict in stateFlagEnum"
                    border
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="submitForm" type="primary">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>
