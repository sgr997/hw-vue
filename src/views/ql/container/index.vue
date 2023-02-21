<template>
  <CommonPage show-footer title="面板管理">
    <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新建面板
      </n-button>
    </template>

    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :extra-params="extraParams"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.getContainers"
      @on-checked="onChecked"
    >
      <template #queryBar>
        <QueryBarItem label="面板名" :label-width="50">
          <n-input
            v-model:value="queryItems.name"
            type="text"
            placeholder="请输入面板名"
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
          label="面板名"
          path="name"
          :rule="{
            required: true,
            message: '请输入面板名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" placeholder="请输入面板名" />
        </n-form-item>

        <n-form-item
          label="面板地址"
          path="url"
          :rule="{
            required: true,
            message: '请输入面板地址',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.url" placeholder="请输入面板地址" />
        </n-form-item>

        <n-form-item
          label="clientId"
          path="clientId"
          :rule="{
            required: true,
            message: '请输入clientId',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.clientId" placeholder="请输入clientId" />
        </n-form-item>

        <n-form-item
          label="密钥"
          path="clientSecret"
          :rule="{
            required: true,
            message: '请输入clientSecret',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.clientSecret" placeholder="请输入clientSecret" />
        </n-form-item>

        <n-form-item
          label="版本"
          path="version"
          :rule="{
            required: true,
            message: '请输入版本',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.version" placeholder="请输入版本" />
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
  { title: '名称', key: 'name', width: 100, align: 'center' },
  { title: 'url', key: 'url', minWidth: 80, align: 'center' },
  {
    title: 'clientId',
    key: 'clientId',
    align: 'center',
    minWidth: 60,
    render: (row) => {
        return row['clientId'];
    },
  },
  {
    title: 'clientSecret',
    key: 'clientSecret',
    align: 'center',
    minWidth: 60,
    render: (row) => {
        return row['clientSecret'];
    },
  },
  {
    title: '版本',
    key: 'version',
    width: 80,
    align: 'center',
    render(row) {
      return h('span', row['version']==='OLD'?'旧版':'新版')
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
  // setTimeout(() => {
  //   row.isPublish = !row.isPublish
  //   row.publishing = false
  //   $message?.success(row.isPublish ? '已发布' : '已取消发布')
  // }, 1000)
  row['status'] = row['status']==='ENABLE'?'DISABLE':'ENABLE'
  api.updateContainer(row)
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
  doCreate: api.addContainer,
  doDelete: api.deleteContainer,
  doUpdate: api.updateContainer,
  refresh: () => $table.value?.handleSearch(),
})
</script>
