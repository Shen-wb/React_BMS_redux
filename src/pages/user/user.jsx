import React, { Component } from 'react'
import {Card,Table,Button,Modal, message} from 'antd'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import {formateData} from '../../utils/dataUtils'
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api'
import AddUser from './user-form'

//用户路由
export default class User extends Component {

  state = {
    users:[],
    roles:[],
    isShow:false,
  }

  initColumn = ()=>{
    this.columns = [
      {
        title:'用户名',
        dataIndex:'username'
      },
      {
        title:'邮箱',
        dataIndex:'email',
      },
      {
        title:'电话',
        dataIndex:'phone',
      },
      {
        title:'注册时间',
        dataIndex:'create_time',
        render:formateData
      },
      {
        title:'所属角色',
        dataIndex:'role_id',
        render:(role_id) => this.roleNames[role_id]
      },
      {
        title:'操作',
        render:(user)=>(
            <span>
              <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
              <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
            </span>
          )
        
      },
    ]
  }

  initRoleNames = (roles)=>{
    const roleNames = roles.reduce((pre,role)=>{
      pre[role._id] = role.name
      return pre
    },{})
    this.roleNames = roleNames
  }

  addOrUpdateUser = ()=>{
    this.form.validateFields(async(err,values)=>{
      if(!err){
        if(this.user){
          values._id = this.user._id 
        }
        const result = await reqAddOrUpdateUser(values)
        this.form.resetFields()
        if(result.status === 0){
          message.success(`${this.user ? '修改' : '添加'}用户成功`)
          this.setState({isShow:false})
          this.getUsers()
        } else{
          message.error(`${this.user ? '修改' : '添加'}用户失败`)
        }
      }
    })
  }

  showAdd = ()=>{
    this.user = null
    this.setState({isShow:true})
  }

  showUpdate = (user) =>{
    this.user = user
    this.setState({isShow:true})
  }

  deleteUser = (user)=>{
    Modal.confirm({
      title:`确认删除用户${user.username}吗？`,
      onOk:async() => {
        const result = await reqDeleteUser(user._id)
        if(result.status===0){
          message.success('用户删除成功！')
          this.getUsers()
        } else{
          message.error('用户删除失败！')
        }
      },
    })
  }

  getUsers = async ()=>{
    const result = await reqUsers()
    if(result.status===0){
      const {users,roles} = result.data
      this.initRoleNames(roles)
      this.setState({users,roles})
    }
  }

  componentWillMount(){
    this.initColumn()
  }
  
  componentDidMount(){
    this.getUsers()
  }

  render() {

    const {users,roles,isShow} = this.state
    const user = this.user

    const title = (
      <Button type="primary" onClick={this.showAdd}>创建用户</Button>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          columns={this.columns}
          dataSource={users}
          pagination={{defaultPageSize:PAGE_SIZE}}
        />

        <Modal
          title={user ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={()=>{
            this.setState({isShow:false})
            this.form.resetFields()
          }}
        >
          <AddUser setForm={(form)=>{this.form = form}} roles={roles} user={user}/>
        </Modal>
      </Card>
    )
  }
}
