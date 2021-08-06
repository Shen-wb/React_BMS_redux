import React, { Component } from 'react'
import {connect} from 'react-redux'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import {Card,Button,Table,Modal, message} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import AddForm from './add-form'
import AuthForm from './auth-form'
import {formateData} from '../../utils/dataUtils'
import {logout} from '../../redux/actions'

//角色管理路由
class Role extends Component {

  state = {
    roles:[],
    role:{},
    isShowAdd:false,
    isShowAuth:false
  }

  constructor(props){
    super(props)
    this.auth = React.createRef()
  }

  initColumn = ()=>{
    this.columns = [
      {
        title:'角色名称',
        dataIndex:'name'
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        render:formateData
      },
      {
        title:'授权时间',
        dataIndex:'auth_time',
        render:formateData
      },
      {
        title:'授权人',
        dataIndex:'auth_name'
      },
    ]
  }

  getRoles = async ()=>{
    const result = await reqRoles()
    if(result.status===0){
      const roles = result.data
      this.setState({roles})
    }
  }

  onRow = (role)=>{
    return {
      onClick:event=>{
        this.setState({role})
      }
    }
  }

  addRole = ()=>{
    this.form.validateFields(async(err,values)=>{
      if(!err){
        const roleName = values.roleName
        const result = await reqAddRole(roleName)
        this.form.resetFields()
        if(result.status===0){
          this.setState({isShowAdd:false})
          message.success('角色添加成功！')
          const role = result.data
          this.setState(state=>({
            roles:[...state.roles,role]
          }))
        } else{
          message.error(result.msg)
        }
      }
    })
  }

  updateRole = async ()=>{
    const role = this.state.role
    const menus = this.auth.current.getMenus()
    role.auth_name = this.props.user.username
    role.menus = menus
    const result = await reqUpdateRole(role)
    if(result.status===0){
      if(role._id === this.props.user.role_id){
        this.props.logout()
        this.props.history.replace('/login')
        message.info('当前角色权限已修改，请重新登录！')
      }else{
        message.success('权限设置成功！')
        this.getRoles()
      }
      
    }
    this.setState({isShowAuth:false})
  }

  handleCancel = ()=>{
    this.setState({isShowAdd:false})
    this.form.resetFields()
  }

  componentWillMount(){
    this.initColumn()
  }

  componentDidMount(){
    this.getRoles()
  }

  render() {
    const {roles,role,isShowAdd,isShowAuth} = this.state
    const title = (
      <span>
        <Button type="primary" style={{marginRight:10}} onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>
        <Button type="primary" disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          onRow={this.onRow}
          rowSelection={{
            type:'radio', 
            selectedRowKeys:[role._id],
            onSelect:(role)=>{
              this.setState({role})
            }
          }}
          columns={this.columns}
          dataSource={roles}
          pagination={{defaultPageSize:PAGE_SIZE}}
        />

        <Modal
          title='添加角色'
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={this.handleCancel}
        >
          <AddForm setForm={(form)=>{this.form = form}}/>
        </Modal>

        <Modal
          title='设置角色权限'
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={()=>{this.setState({isShowAuth:false})}}
        >
          <AuthForm role={role} ref={this.auth}/>
        </Modal>
      </Card>
    )
  }
}

export default connect(
  state=>({user:state.user}),
  {logout}
)(Role)