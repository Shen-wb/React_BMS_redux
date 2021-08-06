import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import {connect} from 'react-redux'
import {reqWeather} from '../../api'
import {formateData} from '../../utils/dataUtils'
import LinkButton from '../../components/link-button'
import menuList from '../../config/menuConfig'
import {logout} from '../../redux/actions'
import './index.less'

class Header extends Component {

  state = {
    weather:'',
    currentTime:formateData(Date.now())
  }

  async componentDidMount(){
    //实时显示时间
    this.interval = setInterval(()=>{
      this.setState({currentTime:formateData(Date.now())})
    },1000)

    //动态显示天气
    const weather = await reqWeather('330106');
    this.setState({weather})
  }

  componentWillUnmount(){
    clearInterval(this.interval)
  }

  getTitle = ()=>{
    const path = this.props.location.pathname
    let title
    menuList.forEach(item=>{
      if(item.key === path){
        title = item.title 
      } else if(item.children){
        const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
        if(cItem){
          title = cItem.title
        }
      }
    }) 
    return title
  }

  logout = ()=>{
    Modal.confirm({
      title:'确定要退出登录吗',
      onOk:()=> {
        this.props.logout()
      },
      onCancel() {
        console.log('取消')
      },
    })
  }

  render() {

    const {weather,currentTime} = this.state
    const {username} = this.props.user
    const title = this.props.headTitle

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="weather"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({headTitle:state.headTitle, user:state.user}),
  {logout}
)(withRouter(Header))
