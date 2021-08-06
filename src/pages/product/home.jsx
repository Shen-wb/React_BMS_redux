import React, { Component } from 'react'
import {Card,Select,Input,Button,Icon,Table, message} from 'antd'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import {reqSearchProducts,reqUpdateStatus,reqProducts} from '../../api'
import memoryUtils from '../../utils/memoryUtils'

const Option = Select.Option
//Product的默认子路由组件
export default class ProductHome extends Component {

  state = {
    total:0,
    products:[],
    loading:false,
    searchName:'',
    searchType:'productName',
    status:1,
  }

  getProducts = async(pageNum)=>{
    this.pageNum = pageNum
    this.setState({loading:true})
    const {searchName,searchType} = this.state
    let result
    if(searchName){
      result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
    } else{
      result = await reqProducts(pageNum,PAGE_SIZE)
    }
    if(result.status === 0){
      const {total,list} = result.data
      this.setState({total,products:list})
    }
    this.setState({loading:false})
  }

  showDetail = (product)=>{
    memoryUtils.product = product
    this.props.history.push('/product/detail')
  }

  showUpdate = (product)=>{
    memoryUtils.product = product
    this.props.history.push('/product/addupdate')
  }

  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    this.getProducts(1)
  }

  initColumns = ()=>{
    this.columns = [
      {
        title: '商品名称',
        width:200,
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        width:80,
        dataIndex: 'price',
        render:(price)=> '¥' + price //当前指定了对应的属性，传入的是对应的属性值
      },
      {
        title: '状态',
        width:100,
        render:(product)=> {
          return (
            <span>
              <Button type='primary' onClick={()=>{this.updateStatus(product)}}>
                {
                  product.status === 1 ? '下架' : '上架'
                }  
              </Button><br/>
              <span>
                {
                  product.status === 1 ? '在售' : '已下架'
                }
              </span>
            </span> 
          )
        }
      },
      {
        title: '操作',
        width:100,
        render:(product)=>{
          return (
            <span>
              <LinkButton onClick={()=>this.showDetail(product)}>详情</LinkButton>
              <LinkButton onClick={()=>this.showUpdate(product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ];    
  }

  updateStatus = async(product)=>{
    const productId = product._id
    const status = product.status === 1 ? 2 : 1
    const result = await reqUpdateStatus(productId,status)
    if(result.status === 0){
      message.success('商品状态更新成功！')
      this.getProducts(this.pageNum)
    }else{
      message.error('商品状态更新失败！')
    }
    
  }
  
  render() {

    const {products,total,searchName,searchType} = this.state

    const title = (
      <span>
        <Select value={searchType} onChange={value=>this.setState({searchType:value})}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input placeholder='关键字' style={{width:150,margin:'0 15px'}} value={searchName} onChange={event=>this.setState({searchName:event.target.value})}/>
        <Button type='primary' onClick={()=>{this.getProducts(1)}}>搜索</Button>
      </span>
    )

    const extra = (
      <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
        <Icon type='plus'></Icon>
        添加商品
      </Button>
    )
    
    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey='_id'
          bordered
          loading= {this.state.loading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            current:this.pageNum,
            total,
            defaultPageSize:PAGE_SIZE,
            showQuickJumper:true,
            onChange:this.getProducts
          }}
        >

        </Table>
      </Card>
    )
  }
}
