<template>
  <CommonPage show-footer title="字典管理">
    <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新建字典
      </n-button>
    </template>

    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :extra-params="extraParams"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.getDicts"
      @on-checked="onChecked"
    >
      <template #queryBar>
        <QueryBarItem label="搜索值" :label-width="50">
          <n-input
            v-model:value="queryItems.val"
            type="text"
            placeholder="可以根据key、值和描述搜索"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
    <!-- 新增/编辑/查看 -->
    <CrudModal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :loading="modalLoading"
      :show-footer="modalAction !== 'view'"
      @on-save="handleSave"
    >
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >

      <n-form-item
          label="类型"
          path="dictType"
          :rule="{
            required: true,
            message: '请输入类型',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.dictType" placeholder="请输入类型" />
        </n-form-item>

        <n-form-item
          label="key"
          path="dictName"
          :rule="{
            required: true,
            message: '请输入key',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input 
            v-model:value="modalForm.dictName" 
            placeholder="请输入key" 
            type="textarea"
            :autosize="{
              minRows: 1,
            }" 
          />
        </n-form-item>

        <n-form-item
          label="值"
          path="dictVal"
          :rule="{
            required: true,
            message: '请输入值',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input 
            v-model:value="modalForm.dictVal" 
            placeholder="请输入值" 
            type="textarea"
            :autosize="{
              minRows: 1,
            }" 
          />
        </n-form-item>

        <n-form-item
          label="描述"
          path="dictDesc"
        >
          <n-input 
            v-model:value="modalForm.dictDesc" 
            placeholder="请输入描述"
            type="textarea"
            :autosize="{
              minRows: 1,
            }" 
          />
        </n-form-item>

        <n-form-item
          label="权重"
          path="weight"
        >
          <n-input v-model:value="modalForm.weight" placeholder="请输入权重" />
        </n-form-item>
      </n-form>
    </CrudModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NSwitch } from 'naive-ui'
import { formatDateTime, renderIcon, isNullOrUndef } from '@/utils'
import { useCRUD } from '@/composables'
import api from './api'

defineOptions({ name: 'Container' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/** 补充参数（可选） */
const extraParams = ref({})

onActivated(() => {
  $table.value?.handleSearch()
})

const columns = [
  { type: 'selection', fixed: 'left' },
  {
    title: '序号',
    key: 'index',
    minWidth: 60,
    align: 'center',
    render: (_, index) => {
        return `${index + 1}`;
    },
  },
  {
    title: '状态',
    key: 'status',
    minWidth: 60,
    align: 'center',
    fixed: 'left',
    render(row) {
      return h(NSwitch, 
      {
        size: 'medium',
        checkedValue: 'ENABLE',
        uncheckedValue: 'DISABLE',
        rubberBand: true,
        value: row['status'],
        loading: !!row.publishing,
        onUpdateValue: () => handlePublish(row),
      },
      {
        checked: ()=> '启用',
        unchecked: ()=> '禁用'
      })
    },
  },
  { title: '类型', key: 'dictType', minWidth: 100, align: 'left' },
  { title: 'key', key: 'dictName', minWidth: 80 },
  {
    title: '值',
    key: 'dictVal',
    minWidth: 60,
    render: (row) => {
        return row['dictVal'];
    },
  },
  {
    title: '描述',
    key: 'dictDesc',
    minWidth: 60,
    render: (row) => {
        return row['dictDesc'];
    },
  },
  {
    title: '权重',
    key: 'weight',
    minWidth: 60,
    align: 'center',
    render(row) {
      return row['weight'];
    },
  },
  { title: '创建时间', key: 'createTime', minWidth: 120, align: 'center'},
  { title: '更新时间', key: 'updateTime', minWidth: 120, align: 'center'},
  {
    title: '操作',
    key: 'actions',
    minWidth: 160,
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            circle: true,
            size: 'small',
            type: 'primary',
            secondary: true,
            onClick: () => handleView(row),
          },
          {  icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
        h(
          NButton,
          {
            circle: true,
            size: 'small',
            type: 'primary',
            style: 'margin-left: 15px;',
            onClick: () => handleEdit(row),
          },
          { icon: renderIcon('material-symbols:edit-outline', { size: 14 }) }
        ),

        h(
          NButton,
          {
            circle: true,
            size: 'small',
            type: 'error',
            style: 'margin-left: 15px;',
            onClick: () => handleDelete(row.id),
          },
          { icon: renderIcon('material-symbols:delete-outline', { size: 14 }) }
        ),
      ]
    },
  },
]

// 选中事件
function onChecked(rowKeys) {
  if (rowKeys.length) $message.info(`选中${rowKeys.join(' ')}`)
}

// 发布
function handlePublish(row) {
  if (isNullOrUndef(row.id)) return
  console.log(row.status)
  row.publishing = true
  row['status'] = row['status']==='ENABLE'?'DISABLE':'ENABLE'
  api.updateDict(row)
  .then(resp=>{
    row.publishing = false
    $message?.success(row['status']==='ENABLE' ? '已启用' : '已禁用')
  }).catch(err=>{
    row.publishing = false
  })
}

const {
  modalVisible,
  modalAction,
  modalTitle,
  modalLoading,
  handleAdd,
  handleDelete,
  handleEdit,
  handleView,
  handleSave,
  modalForm,
  modalFormRef,
} = useCRUD({
  name: '文章',
  initForm: { },
  doCreate: api.addDict,
  doDelete: api.deleteDict,
  doUpdate: api.updateDict,
  refresh: () => $table.value?.handleSearch(),
})
</script>
