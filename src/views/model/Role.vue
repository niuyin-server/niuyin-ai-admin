<script setup>
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import {
  createModelRole,
  deleteModelRole,
  getModelRole,
  getModelRolePage,
  updateModelRole,
  updateModelRoleState
} from "@/api/model/role.js";
import {Delete, Edit, Plus, Refresh, Search} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import {getModelSimpleList} from "@/api/model/model.js";
import {getToolSimpleList} from "@/api/model/tool.js";
import {getModelAgentCategorySimpleList} from "@/api/model/agentCategory.js";

const queryDTO = reactive({
  pageNum: 1,
  pageSize: 10,
  name: null,
  categoryIds: null,
  publicFlag: null,
  stateFlag: null
})

const modelList = ref([])
const initModelList = async () => {
  const res = await getModelSimpleList()
  modelList.value = res.data.data
}

const handleCurrentChange = (v) => {
  queryDTO.pageNum = v
  initModelRolePage()
}
const handleSizeChange = (v) => {
  queryDTO.pageSize = v
  initModelRolePage()
}
const loading = ref(false)
const list = ref([])
const total = ref(0)
const initModelRolePage = async () => {
  loading.value = true
  const {data} = await getModelRolePage(queryDTO)
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

const publicFlagEnum = [
  {
    label: "私有",
    value: '0'
  },
  {
    label: "公开",
    value: '1'
  }
]

const resetQuery = () => {
  queryDTO.pageNum = 1
  queryDTO.pageSize = 10
  queryDTO.name = null
  queryDTO.category = null
  queryDTO.publicFlag = null
  queryDTO.stateFlag = null
  initModelRolePage()
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
  form.value.publicFlag = '1'
  dialogVisible.value = true;
  title.value = "新增AI角色";
}
/** 修改按钮操作 */
const handleUpdate = async (id) => {
  reset()
  const res = await getModelRole(id)
  Object.assign(form.value, res.data.data)
  dialogVisible.value = true;
  title.value = "修改AI角色";
}

const form = ref({
  id: undefined,
  modelId: undefined,
  name: undefined,
  avatar: undefined,
  categoryIds: undefined,
  description: undefined,
  systemMessage: undefined,
  chatPrologue: undefined,
  publicFlag: undefined,
  stateFlag: undefined,
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
    modelId: undefined,
    name: undefined,
    avatar: undefined,
    categoryIds: undefined,
    description: undefined,
    systemMessage: undefined,
    chatPrologue: undefined,
    publicFlag: undefined,
    stateFlag: undefined,
    sort: undefined
  };
}

const rules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ],
  modelId: [
    {required: true, message: '请选择模型', trigger: 'change'}
  ],
  categoryIds: [
    {required: true, message: '请选择类别', trigger: 'change'}
  ],
  systemMessage: [
    {required: true, message: '请输入系统上下文', trigger: 'blur'}
  ]
};

const dialogVisible = ref(false)
const title = ref('新增AI角色')

const submitForm = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      if (form.value.id) {
        await updateModelRole(form.value)
      } else {
        await createModelRole(form.value)
      }
      dialogVisible.value = false;
      await initModelRolePage()
    }
  })
}

const handleDelete = async (id) => {
  const res = await deleteModelRole(id)
  if (res.data.code === 200) {
    await initModelRolePage()
  }
}

const handleStatusChange = async (row) => {
  await updateModelRoleState({
    id: row.id,
    stateFlag: row.stateFlag
  })
  ElMessage.success("操作成功")
  await initModelRolePage()
}

const getModelByScope = (modelId) => {
  return modelList.value.find(item => item.id === modelId)?.name
}

const toolOptions = ref(null)
const initToolSimpleList = async () => {
  const res = await getToolSimpleList()
  toolOptions.value = res.data.data
}

const agentCategoryOptions = ref([])
const initAgentCategorySimpleList = async () => {
  const res = await getModelAgentCategorySimpleList()
  agentCategoryOptions.value = res.data.data
}

onBeforeMount(() => {
  initAgentCategorySimpleList()
  initToolSimpleList()
  initModelList()
})

onMounted(() => {
  initModelRolePage()
})

import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import {useDark} from "@vueuse/core";

const onVue3EmojiPicker = (emoji) => {

  console.log(emoji)
  form.value.avatar = emoji.i
  /* 结果示例
  {
      i: "ernes", // 表情图标
      n: ["kissing face"],
      r: "1f61a", // 包含肤色
      t: "neutral", // 肤色
      u: "1f61a" // 不带肤色
  }
  */
};

const isDark = useDark();
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
              @keyup.enter.native="initModelRolePage"
          />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-input
              v-model="queryDTO.category"
              placeholder="请输入类别"
              clearable
              @keyup.enter.native="initModelRolePage"
          />
        </el-form-item>
        <el-form-item label="是否公开" prop="publicFlag">
          <el-select
              v-model="queryDTO.publicFlag"
              style="width: 120px"
              placeholder="是否公开"
              clearable
          >
            <el-option
                v-for="dict in publicFlagEnum"
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
          <el-button type="primary" :icon="Search" @click="initModelRolePage">搜索</el-button>
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
      <el-table-column label="模型" prop="modelId" :show-overflow-tooltip="true" align="center">
        <template #default="scope">
          <el-tag>{{ getModelByScope(scope.row.modelId) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="图标" prop="avatar" width="100" align="center"/>
      <!--        <template #default="scope">-->

      <!--          <el-avatar :size="50" :src="scope.row.avatar">-->
      <!--            <img-->
      <!--                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"-->
      <!--                alt=""/>-->
      <!--          </el-avatar>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="类别" prop="categoryIds" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="描述" prop="description" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="对话开场白" prop="chatPrologue" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="上下文" prop="systemMessage" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="是否公开" prop="publicFlag" align="center" width="120">
        <template #default="scope">
          <el-switch
              v-model="scope.row.publicFlag"
              active-value="1"
              inactive-value="0"
              disabled
          ></el-switch>
        </template>
      </el-table-column>
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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标" prop="avatar">
              <el-popover
                  trigger="hover"
                  placement="bottom-start"
                  width="302"
              >
                <EmojiPicker :native="true" @select="onVue3EmojiPicker" :theme="isDark?'dark':'light'"/>
                <template #reference>
                  <el-input style="width: 42px" v-model="form.avatar" disabled/>
                </template>
              </el-popover>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="模型" prop="modelId">
              <el-select
                  v-model="form.modelId"
                  placeholder="请选择模型"
                  clearable
              >
                <el-option
                    v-for="dict in modelList"
                    :key="dict.id"
                    :label="dict.name"
                    :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类别" prop="categoryIds">
              <el-select v-model="form.categoryIds" multiple placeholder="请选择类别">
                <el-option
                    v-for="dict in agentCategoryOptions"
                    :key="dict.id"
                    :label="dict.name"
                    :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="是否公开" prop="publicFlag">
              <el-radio-group v-model="form.publicFlag" disabled>
                <el-radio
                    v-for="dict in publicFlagEnum"
                    border
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
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
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述" type="textarea" show-word-limit
                    maxlength="200"/>
        </el-form-item>
        <el-form-item label="上下文" prop="systemMessage">
          <el-input v-model="form.systemMessage" placeholder="请输入角色上下文" type="textarea" show-word-limit
                    maxlength="1024"/>
        </el-form-item>
        <el-form-item label="对话开场白" prop="chatPrologue">
          <el-input v-model="form.chatPrologue" placeholder="请输入对话开场白" type="textarea" show-word-limit
                    maxlength="200"/>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="工具" prop="toolIds">
              <el-select
                  v-model="form.toolIds"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  placeholder="请选择工具"
                  style="width: 100%"
              >
                <el-option
                    v-for="item in toolOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
              </el-select>
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
