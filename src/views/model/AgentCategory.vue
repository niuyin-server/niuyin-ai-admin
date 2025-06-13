<script setup>
import {onMounted, reactive, ref} from "vue";
import {
  createModelAgentCategory,
  deleteModelAgentCategory,
  getModelAgentCategory,
  getModelAgentCategoryPage,
  updateModelAgentCategory
} from "@/api/model/agentCategory.js";
import {Delete, Edit, Plus, Refresh, Search} from '@element-plus/icons-vue'

const queryDTO = reactive({
  pageNum: 1,
  pageSize: 10,
  name: null,
  category: null,
  publicFlag: null,
  stateFlag: null
})

const handleCurrentChange = (v) => {
  queryDTO.pageNum = v
  initModelAgentCategoryPage()
}
const handleSizeChange = (v) => {
  queryDTO.pageSize = v
  initModelAgentCategoryPage()
}
const loading = ref(false)
const list = ref([])
const total = ref(0)
const initModelAgentCategoryPage = async () => {
  loading.value = true
  const {data} = await getModelAgentCategoryPage(queryDTO)
  list.value = data.data.rows
  total.value = data.data.total
  loading.value = false
}

const resetQuery = () => {
  queryDTO.pageNum = 1
  queryDTO.pageSize = 10
  queryDTO.name = null
  initModelAgentCategoryPage()
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
  dialogVisible.value = true;
  title.value = "新增AI智能体分类";
}
/** 修改按钮操作 */
const handleUpdate = async (id) => {
  reset()
  const res = await getModelAgentCategory(id)
  Object.assign(form.value, res.data.data)
  dialogVisible.value = true;
  title.value = "修改AI智能体分类";
}

const form = ref({
  id: undefined,
  name: undefined,
  icon: undefined,
  sort: undefined
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
    icon: undefined,
    sort: undefined
  };
}

const rules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ],
};

const dialogVisible = ref(false)
const title = ref('新增AI智能体分类')

const submitForm = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      if (form.value.id) {
        await updateModelAgentCategory(form.value)
      } else {
        await createModelAgentCategory(form.value)
      }
      dialogVisible.value = false;
      await initModelAgentCategoryPage()
    }
  })
}

const handleDelete = async (id) => {
  const res = await deleteModelAgentCategory(id)
  if (res.data.code === 200) {
    await initModelAgentCategoryPage()
  }
}

const getModelByScope = (modelId) => {
  return modelList.value.find(item => item.id === modelId)?.name
}

onMounted(() => {
  initModelAgentCategoryPage()
})
</script>

<template>
  <div class="p-4" style="width: calc(100% - 200px)">
    <div class="flex flex-row justify-between">
      <el-form :model="queryDTO" ref="queryForm" :inline="true">
        <el-form-item label="名称" prop="name">
          <el-input
              v-model="queryDTO.name"
              placeholder="请输入名称"
              clearable
              @keyup.enter.native="initModelAgentCategoryPage"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="initModelAgentCategoryPage">搜索</el-button>
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
      </el-row>
    </div>
    <!-- 数据 -->
    <el-table v-loading="loading" :data="list" border @selectionChange="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="icon" prop="icon" width="100" align="center">
        <template #default="scope">
          <i :class="`iconfont icon-${scope.row.icon}`"/>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" align="center" width="120"/>
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
            <el-form-item label="icon" prop="icon">
              <el-input v-model="form.icon" placeholder="请输入icon"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number :min="0" style="width: 100%" v-model="form.sort" placeholder="请输入排序"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
