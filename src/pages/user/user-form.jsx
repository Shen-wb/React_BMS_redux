import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {Form,Input,Select} from 'antd'


const Option = Select.Option

const Item = Form.Item
class UserForm extends PureComponent {

  static propTypes = {
    setForm:PropTypes.func.isRequired,
    roles:PropTypes.array.isRequired,
    user:PropTypes.object
  }

  componentWillMount(){
    this.props.setForm(this.props.form)
  }

  validatePwd = (rule,value,callback)=>{
    if(value.length<4){
      callback('密码长度不能小于4位！')
    } else if(value.length>12){
      callback('密码长度不能大于12位！')
    } else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('密码必须是英文、数字或下划线组成！')
    } else{
      callback()
    }
  }
  
  render() {
    const {roles} = this.props
    const user = this.props.user || {}
    const {getFieldDecorator} = this.props.form
    const formItemLayout={
      labelCol:{span:4},
      wrapperCol:{span:20},
    }
    return (
      <Form {...formItemLayout}>
        <Item label='用户名'>
          {
            getFieldDecorator('username',{
              initialValue:user.username,
              rules:[
                {required:true,message:'角色名称必须输入！'},
                {whitespace:true,message:'用户名不能存在空格！'},
                {min:4, message:'用户名最少4位'},
                {max:12,  message:'用户名最多12位'},
              ]
            })( 
                <Input placeholder='请输入用户名'></Input>
            )
          }
        </Item>
        {
          user._id ? null :(
            <Item label='密码'>
              {
                getFieldDecorator('password',{
                  initialValue:'',
                  rules:[
                    {required:true,message:'角色名称必须输入！'},
                    {whitespace:true,message:'密码不能存在空格！'},
                    {validator:this.validatePwd}
                  ]
                })( 
                    <Input type='password' placeholder='请输入密码'></Input>
                )
              }
            </Item>
          )
        }
        <Item label='手机号'>
          {
            getFieldDecorator('phone',{
              initialValue:user.phone,
              rules:[
                {len:11, message:'请正确输入手机号！'},
                {enum:'number'}
              ]
            })( 
                <Input placeholder='请输入手机号'></Input>
            )
          }
        </Item>
        <Item label='邮箱'>
          {
            getFieldDecorator('email',{
              initialValue:user.email,
            })( 
                <Input placeholder='请输入邮箱'></Input>
            )
          }
        </Item>
        <Item label='角色'>
          {
            getFieldDecorator('role_id',{
              initialValue:user.role_id,
            })( 
                <Select>
                  {
                    roles.map(role=><Option key={role._id} value={role._id}>{role.name}</Option>)
                  }
                </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)