<script setup>
import {onMounted, reactive, ref} from "vue";
import {
  createModel,
  deleteModel,
  getModel,
  getModelPage,
  getModelTypeList,
  updateModel,
  updateModelState
} from "@/api/model/model.js";

import {Delete, Edit, Plus, Refresh, Search} from '@element-plus/icons-vue'
import {getApiKeySimpleList, getPlatformList} from "@/api/model/apiKey.js";
import {ElMessage} from "element-plus";

const queryDTO = reactive({
  pageNum: 1,
  pageSize: 10,
  name: null,
  model: null,
  keyId: null,
  platform: null,
  type: null,
  stateFlag: null
})

const platformList = ref([])
const initPlatformList = async () => {
  const res = await getPlatformList()
  platformList.value = res.data.data
}

const modelTypeList = ref([])
const initModelTypeList = async () => {
  const res = await getModelTypeList()
  modelTypeList.value = res.data.data
}

const apiKeyList = ref([])
const initApiKeyList = async () => {
  const res = await getApiKeySimpleList()
  apiKeyList.value = res.data.data
}

const handleCurrentChange = (v) => {
  queryDTO.pageNum = v
  initModelPage()
}
const handleSizeChange = (v) => {
  queryDTO.pageSize = v
  initModelPage()
}

const loading = ref(false)
const list = ref([])
const total = ref(0)
const initModelPage = async () => {
  loading.value = true
  const {data} = await getModelPage(queryDTO)
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
  queryDTO.model = null
  queryDTO.keyId = null
  queryDTO.platform = null
  queryDTO.type = null
  queryDTO.stateFlag = null
  initModelPage()
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
  const res = await getModel(id)
  Object.assign(form.value, res.data.data)
  dialogVisible.value = true;
  title.value = "修改AI模型";
}

const form = ref({
  id: undefined,
  keyId: undefined,
  name: undefined,
  model: undefined,
  platform: undefined,
  type: undefined,
  stateFlag: undefined,
  sort: undefined,
  temperature: undefined,
  maxTokens: undefined,
  maxContexts: undefined,
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
    keyId: undefined,
    name: undefined,
    model: undefined,
    platform: undefined,
    type: undefined,
    stateFlag: undefined,
    sort: undefined,
    temperature: undefined,
    maxTokens: undefined,
    maxContexts: undefined,
  };
}

const rules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ],
};

const dialogVisible = ref(false)
const title = ref('新增AI模型')

const submitForm = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      if (form.value.id) {
        await updateModel(form.value)
      } else {
        await createModel(form.value)
      }
      dialogVisible.value = false;
      await initModelPage()
    }
  })
}

const handleDelete = async (id) => {
  const res = await deleteModel(id)
  if (res.data.code === 200) {
    await initModelPage()
  }
}

const handleStatusChange = async (row) => {
  await updateModelState({
    id: row.id,
    stateFlag: row.stateFlag
  })
  ElMessage.success("操作成功")
  await initModelPage()
}

const getPlatform = (platform) => {
  return platformList.value.find(item => item.value === platform).label
}

const getApiKeyByScope = (keyId) => {
  return apiKeyList.value.find(item => item.id === keyId).name
}

const getModelTypeByScope = (type) => {
  return modelTypeList.value.find(item => item.value === type).label
}

onMounted(() => {
  initPlatformList()
  initModelTypeList()
  initApiKeyList()
  initModelPage()
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
              @keyup.enter.native="initModelPage"
          />
        </el-form-item>
        <el-form-item label="标识" prop="model">
          <el-input
              v-model="queryDTO.model"
              placeholder="请输入标识"
              clearable
              @keyup.enter.native="initModelPage"
          />
        </el-form-item>
        <el-form-item label="密钥" prop="keyId">
          <el-select
              v-model="queryDTO.keyId"
              style="width: 200px"
              placeholder="请选择密钥"
              clearable
          >
            <el-option
                v-for="dict in apiKeyList"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-select
              v-model="queryDTO.platform"
              style="width: 200px"
              placeholder="请选择平台"
              clearable
          >
            <el-option
                v-for="dict in platformList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
              v-model="queryDTO.type"
              style="width: 200px"
              placeholder="请选择类型"
              clearable
          >
            <el-option
                v-for="dict in modelTypeList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
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
          <el-button type="primary" :icon="Search" @click="initModelPage">搜索</el-button>
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
      <el-table-column label="标识" prop="model" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="密钥" prop="apiKey" :show-overflow-tooltip="true" align="center">
        <template #default="scope">
          <el-tag type="primary">{{ getApiKeyByScope(scope.row.keyId) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="平台" prop="platform" :show-overflow-tooltip="true" align="center">
        <template #default="scope">
          <el-tag type="primary">{{ getPlatform(scope.row.platform) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" :show-overflow-tooltip="true" align="center">
        <template #default="scope">
          <el-tag type="primary">{{ getModelTypeByScope(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="温度参数" prop="temperature" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="Token" prop="maxTokens" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="上下文" prop="maxContexts" :show-overflow-tooltip="true"
                       align="center"/>
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
            <el-form-item label="标识" prop="model">
              <el-input v-model="form.model" placeholder="请输入标识"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="密钥" prop="keyId">
              <el-select
                  v-model="form.keyId"
                  placeholder="请选择密钥"
                  clearable
              >
                <el-option
                    v-for="dict in apiKeyList"
                    :key="dict.id"
                    :label="dict.name"
                    :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台" prop="platform">
              <el-select
                  v-model="form.platform"
                  placeholder="请选择平台"
                  clearable
              >
                <el-option
                    v-for="dict in platformList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select
                  v-model="form.type"
                  placeholder="请选择类型"
                  clearable
              >
                <el-option
                    v-for="dict in modelTypeList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
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
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number class="w-full" style="width: 100%" :min="0" v-model="form.sort"
                               placeholder="请输入排序"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="温度参数" prop="temperature">
              <el-input-number class="w-full" style="width: 100%" :min="0" :max="1" v-model="form.temperature"
                               :precision="2" :step="0.05"
                               placeholder="请输入温度参数"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Token" prop="maxTokens">
              <el-input-number class="w-full" style="width: 100%" :min="0" v-model="form.maxTokens"
                               placeholder="请输入单条回复的最大 Token 数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上下文" prop="maxContexts">
              <el-input-number class="w-full" style="width: 100%" :min="0" v-model="form.maxContexts"
                               placeholder="请输入上下文的最大 Message 数量"/>
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
