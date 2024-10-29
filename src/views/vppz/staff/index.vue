<template>
    <panel-head :route="route" />
    <div class="btns">
        <el-button :icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
        <!-- 批量删除 -->
        <el-popconfirm confirm-button-text="是" cancel-button-text="否" :icon="InfoFilled" icon-color="#626AEF"
            title="是否确认删除？" @confirm="confirmEvent">
            <template #reference>
                <el-button :icon="Delete" type="danger" size="small">删除</el-button>
            </template>
        </el-popconfirm>
    </div>
    <!-- 列表 -->
    <el-table :data="tableData.list" style="width: 100%;" @selection-change="handleSelectionChange">
        <!-- 选择框 -->
        <el-table-column type="selection" whidth="55" />
        <!-- 序号 -->
        <el-table-column prop="id" label="id" />
        <!-- 昵称 -->
        <el-table-column prop="name" label="昵称" />
        <!-- 头像 -->
        <el-table-column label="头像">
            <template #default="scope">
                <el-image style="width: 50px;
                height: 50px;" :src="scope.row.avatar" />
            </template>
        </el-table-column>
        <!-- 性别 -->
        <el-table-column prop="sex" label="性别">
            <template #default="scope">
                {{ scope.row.sex === '1' ? '男' : '女' }}
            </template>
        </el-table-column>
        <!-- 手机号 -->
        <el-table-column prop="mobile" label="手机号" />
        <!-- 状态 -->
        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? '正常' : '失效' }}</el-tag>
            </template>
        </el-table-column>
        <!-- 创建时间 -->
        <el-table-column label="创建时间">
            <template #default="scope">
                <div class="flex-box">
                    <el-icon>
                        <Clock />
                    </el-icon>
                    <span style="margin-left: 4px;">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-info">
        <el-pagination v-model:current-page="paginationData.pageNum" :page-size="paginationData.pageSize"
            :background="false" layout="total, prev, pager, next" :total="tableData.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" size="small" />
    </div>

    <!-- 新增培护士 -->
    <el-dialog v-model="dialogFormVisable" :before-close="beforeClose" title="陪护师" width="500">
        <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
            <el-form-item v-show="false" prop="id">
                <el-input v-model="form.id" />
            </el-form-item>

            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" placeholder="请输入昵称" />
            </el-form-item>

            <el-form-item label="头像" prop="avatar">
                <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisable = true">点击上传</el-button>
                <el-image v-else :src="form.avatar" style="width: 100px;
                height: 100px;" />
            </el-form-item>

            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="请选择性别">
                    <el-option label="男" value="1" />
                    <el-option label="女" value="2" />
                </el-select>
            </el-form-item>


            <el-form-item label="年龄" prop="age">
                <el-input-number v-model="form.age" :min="18" :max="64" />
            </el-form-item>

            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" placeholder="请输入手机号" />
            </el-form-item>

            <el-form-item label="是否生效" prop="active">
                <el-radio-group v-model="form.active">
                    <el-radio :value="1">生效</el-radio>
                    <el-radio :value="0">失效</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <!-- 表单底部按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 选择头像弹窗 -->
    <el-dialog v-model="dialogImgVisable" :before-close="beforeClose" title="选择图片" width="680">
        <div class="image-list">
            <div v-for="(item, index) in fileList" :key="item.name" class="img-box" @click="selectIndex = index">
                <div v-if="selectIndex === index" class="select">
                    <el-icon color="#fff">
                        <Check />
                    </el-icon>
                </div>
                <el-image style="width: 148px;
            height: 148px;" :src="item.url" />
            </div>
        </div>

        <!-- 表单底部按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirmImage">确认</el-button>
                <el-button @click="dialogImgVisable = false">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue';
import { Plus, InfoFilled, Delete } from '@element-plus/icons-vue';
import { photoList, companion, companionList, deleteCompanion } from '../../../api'
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';


const route = useRoute()
// 页面加载完成后，请求图片列表
onMounted(() => {
    photoList().then(({ data }) => {
        fileList.value = data.data
    })
    getListData()
})

// 切换页码
const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}
// 切换每页显示数量
const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()
}


const selectTableData = ref([])
// 选择数据
const handleSelectionChange = (val) => {
    selectTableData.value = val.map(item => ({ id: item.id }))
}

const confirmEvent = () => {
    //没有选择数据
    if (!selectTableData.value.length) {
        return ElMessage.warning('请选择至少一项数据')
    }
    deleteCompanion({ id: selectTableData.value }).then(({ data }) => {
        if (data.code === 10000) {
            getListData()
        }
    })
}

//列表数据
const paginationData = reactive({
    //页码
    pageNum: 1,
    //每页显示的数量
    pageSize: 10,
})

//分页数据
const tableData = reactive({
    list: [],
    total: 0,
})


const getListData = () => {
    // 获取列表数据
    companionList(paginationData).then(({ data }) => {
        const { list, total } = data.data
        tableData.list = list
        tableData.total = total
    })
}

//
const dialogFormVisable = ref(false)
const beforeClose = () => {
    // 关闭弹窗时重置表单
    dialogFormVisable.value = false
    // 重置表单
    formRef.value.resetFields()
}

const formRef = ref()
const form = reactive({
    id: '',
    name: '',
    mobile: '',
    age: '',
    active: '',
    avatar: '',
    sex: ''
})

// 表单校验规则
const rules = reactive({
    name: [{ required: true, trigger: 'blur', message: '请填写昵称' }],
    avatar: [{ required: true, message: '请上传头像' }],
    sex: [{ required: true, trigger: 'change', message: '请选择性别' }],
    mobile: [{ required: true, trigger: 'blur', message: '请填写手机号' }],

})

// 表单校验
const confirm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            companion(form).then(({ data }) => {
                if (data.code === 10000) {
                    ElMessage.success('操作成功')
                    beforeClose()
                    getListData()
                } else {
                    ElMessage.error(data.message)
                }
            })
        } else {
            console.log('error submit!!', fields);
        }
    })
}



// 打开新增陪护师弹窗
const open = (rowData) => {
    dialogFormVisable.value = true
    nextTick(() => {
        //如果是编辑
        if (rowData) {
            Object.assign(form, rowData)
        }
    })
}

//选择头像弹窗
const dialogImgVisable = ref(false)
const fileList = ref([])
const selectIndex = ref(0)
const confirmImage = () => {
    form.avatar = fileList.value[selectIndex.value].url
    dialogImgVisable.value = false
}
</script>

<style lang="less" scoped>
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}

.image-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .img-box {
        position: relative;

        .select {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 24px;
            height: 24px;
            background-color: #67c23a;
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .el-image {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}
</style>