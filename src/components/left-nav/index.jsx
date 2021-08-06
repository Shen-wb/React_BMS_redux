import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import {connect} from 'react-redux'
import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig'
import {setHeadTitle} from '../../redux/actions'

const { SubMenu } = Menu;
class LeftNav extends Component {

  /*
    根据menu的数据数组生成对应的标签数组
    使用map + 递归调用
  */
  getMenuNodes_map = (menuList) =>{
    return menuList.map(item=>{
      if(!item.children){
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item> 
        )
      } else{
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes_map(item.children)}
          </SubMenu>
        )
      }
    })
  }

  hasAuth =(item)=>{
    const key = item.key
    const {username} = this.props.user
    const menus = this.props.user.role.menus
    if(username==='admin' || item.isPublic || menus.indexOf(key)!==-1){
      return true
    } else if(item.children){
      return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
    }
    return false
  }

  //使用reduce() + 递归调用
  getMenuNodes = (menuList) =>{
    const path = this.props.location.pathname
    return menuList.reduce((pre,item)=>{
      if(this.hasAuth(item)){
        if(item.key===path || path.indexOf(item.key)===0){
          this.props.setHeadTitle(item.title)
        }
        if(!item.children){
          pre.push((
            <Menu.Item key={item.key}>
              <Link to={item.key} onClick={()=>this.props.setHeadTitle(item.title)}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else{
          //查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
          if(cItem) this.openKey = item.key
          pre.push((
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      }
      return pre
    },[])
  }

  //第一次render（）之前执行一次
  //为第一个render准备数据（必须同步的）
  componentWillMount(){
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {
    let path = this.props.location.pathname
    if(path.indexOf('/product')===0){
      path = '/product'
    }
    const openKey = this.openKey

    return (
      <div>
        <div className="left-nav">
          <Link to="/" className="left-nav-header">
            <img src={logo} alt="logo"/>
            <h1>SHEN</h1>
          </Link>
        </div>
        <section>
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[path]}
            defaultOpenKeys={[openKey]}
          >
            {
              this.menuNodes
            }
          </Menu>
        </section>
      </div>
    )
  }
}

export default connect(
  state =>({user:state.user}),
  {
    setHeadTitle
  }
)(withRouter(LeftNav))
