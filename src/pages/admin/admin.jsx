import React, { Component } from 'react'
import { Redirect,Route,Switch } from 'react-router-dom'
import { Layout } from 'antd';
import {connect} from 'react-redux'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import management from '../order/order'
import NotFound from '../not-found'

const { Footer, Sider, Content } = Layout;
class Admin extends Component {
  render() {
    const user = this.props.user
    if(!user || !user._id){
      //如果内存中没用存储user ==》 当前没有登录
      return <Redirect to='/login'/>
    }
    return (
        <Layout style={{minHeight:'100%'}}>
          <Sider>
            <LeftNav/>
          </Sider>
          <Layout>
            <Header>Header</Header>
            <Content style={{margin:20, backgroundColor:'white'}}>
              <Switch>
                <Redirect exact from='/' to='/home'/>
                <Route path='/home' component={Home}/>
                <Route path='/category' component={Category}/>
                <Route path='/product' component={Product}/>
                <Route path='/role' component={Role}/>
                <Route path='/user' component={User}/>
                <Route path='/charts/bar' component={Bar}/>
                <Route path='/charts/line' component={Line}/>
                <Route path='/charts/pie' comp onent={Pie}/>
                <Route path='/order' component={management}/>
                <Route component={NotFound}/>
              </Switch>
            </Content>
            <Footer style={{textAlign:'center', color:'#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
          </Layout>
        </Layout>
    )
  }
}

export default connect(
  state=>({user:state.user}),
  {}
)(Admin)