/*
  包含应用中所有接口请求函数的模块
  每个函数的返回值都是Promise
*/
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

const BASE = '/api'

//登录
export const reqLogin = (username,password) => ajax(BASE + '/login',{username,password},'POST')

//添加用户
export const reqAddOrUpdateUser = (userObj) => ajax(BASE + '/manage/user/'+(userObj._id ? 'update':'add'),userObj,'POST')

//天气状况请求
export const reqWeather = (cityAdcode)=>{
  return new Promise((resolve,reject)=>{
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=dfed40b87ba641a24e99f8b768067107&city=${cityAdcode}&extensions=base&output=json`
    jsonp(url,{},(err,data)=>{
      if(!err && data.status === '1'){
        const {weather} = data.lives[0]
        resolve(weather)
      } else{
        message.error('天气信息获取失败！')
      }
    })
  })
}

//获取一级/二级分类的列表
export const reqCategorys = (parentId)=> ajax(BASE + '/manage/category/list',{parentId},'GET')

//添加分类
export const reqAddCategory = (categoryName,parentId) => ajax(BASE + '/manage/category/add',{categoryName,parentId},'POST')

//更新分类
export const reqUpdateCategory = ({categoryId,categoryName})=>ajax(BASE + '/manage/category/update',{categoryId,categoryName},'POST')

//获取商品分页列表
export const reqProducts = (pageNum,pageSize)=> ajax(BASE + '/manage/product/list',{pageNum,pageSize},'GET')

//搜索商品分页列表(更具商品名称/描述)
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType})=> ajax(BASE + '/manage/product/search',{
  pageNum,
  pageSize,
  [searchType]:searchName,
})

//获取一个分类
export const reqCategory = (categoryId)=>ajax(BASE + '/manage/category/info',{categoryId},'GET')

//更新商品上架/下架状态
export const reqUpdateStatus = (productId,status)=>ajax(BASE + '/manage/product/updateStatus',{productId,status},'POST')

//删除图片
export const reqRemovePic = (name)=>ajax(BASE + '/manage/img/delete',{name},'POST')

//添加商品
export const reqAddOrUpdateProduct = (product)=>ajax(BASE + '/manage/product/' + (product._id ? 'update':'add'),product,'POST')

//更新商品
//export const reqUpdateProduct = (product)=>ajax('/manage/product/update',product,'POST')

//获取所有角色的列表
export const reqRoles = ()=>ajax(BASE + '/manage/role/list')

//添加角色
export const reqAddRole = (roleName)=>ajax(BASE + '/manage/role/add',{roleName},'POST')

//更新角色权限
export const reqUpdateRole = (role)=>ajax(BASE + '/manage/role/update',role,'POST')

//获取用户列表
export const reqUsers = () =>ajax(BASE + '/manage/user/list')

//删除用户
export const reqDeleteUser = (userId) =>ajax(BASE + '/manage/user/delete',{userId},'POST')
