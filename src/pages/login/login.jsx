import React, { Component } from 'react'
import { Form, Icon, Input, Button} from 'antd';
import {connect} from 'react-redux'
import './login.less'
import logo from '../../assets/images/logo.png'
import { Redirect } from 'react-router-dom';
import {login} from '../../redux/actions'

class Login extends Component {

  handleSubmit = (event)=>{
    //阻止事件的默认行为
    event.preventDefault();

    //对所有表单字段进行校验
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const {username,password} = values
        this.props.login(username,password)
      } else{
        alert('校验失败！')
      }
    });
  }

  validatePwd = (rule,value,callback)=>{
    if(!value){
      callback('密码必须输入')
    } else if(value.length<4){
      callback('密码长度不能小于4位')
    } else if(value.length>12){
      callback('密码长度不能大于12位')
    } else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('密码必须是英文、数字或下划线组成')
    } else{
      callback()
    }
  }

  render() {
    
    //如果用户已经登录，自动跳转到管理界面
    const user = this.props.user
    if(user && user._id){
      return <Redirect to='/home'/>
    }

    const errorMsg = this.props.user.errorMsg

    const form = this.props.form
    const { getFieldDecorator } = form;

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
          <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{errorMsg}</div>
          <h2>用户登录</h2>
          <div>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item>
                {getFieldDecorator('username', {
                  initialValue: 'admin',
                  //申明式验证：直接使用别人定义好的验证规则进行验证
                  rules:[
                    {required:true, whitespace:true, message:'用户名必须输入'},
                    {min:4, message:'用户名最少4位'},
                    {max:12,  message:'用户名最多12位'},
                    {pattern:/^[a-zA-Z0-9_]+$/, message:'用户名必须是英文、数字或下划线组成'}
                  ],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules:[
                    {validator:this.validatePwd}
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
              </Form.Item>
            </Form>
          </div>
        </section>
      </div>
    )
  }
}

const WrapLogin = Form.create()(Login)

export default connect(
  state=>({user:state.user}),
  {login}
)(WrapLogin)

