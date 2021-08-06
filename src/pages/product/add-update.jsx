import React, { Component } from 'react'
import {Card,Form,Input,Cascader,Button,Icon, message} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api'
import PicturesWall from '../product/pictures-wall'
import RichTextEditor from '../product/rich-text-editor'
import memoryUtils from '../../utils/memoryUtils'

const {Item} = Form
const {TextArea}=Input

//Product的添加和更新的子路由组件
class ProductAddUpdate extends Component {

  state = {
    options:[],
  }

  constructor(props){
    super(props)
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  initOptions = async (categorys)=>{
    const options = categorys.map(c=>({
      value:c._id,
      label:c.name,
      isLeaf:false
    }))

    const {isUpdate,product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId!=='0'){
      const subCategorys = await this.getCategorys(pCategoryId)
      const childOptions = subCategorys.map(c=>({
        value:c._id,
        label:c.name,
        isLeaf:true
      }))
      const targetOption = options.find(option=>option.value===pCategoryId)
      targetOption.children = childOptions
    }

    this.setState({options})
  }

  getCategorys = async (parentId)=>{
    const result = await reqCategorys(parentId)
    if(result.status === 0){
      const categorys = result.data
      if(parentId==='0'){
        this.initOptions(categorys)
      } else{
        return categorys
      }
    } else{
      message.error('数据请求失败！')
    }
  }

  componentDidMount(){
    this.getCategorys('0')
  }

  componentWillMount(){
    const product = memoryUtils.product
    this.isUpdate = !!product._id
    this.product = product || {}
  }

  componentWillUnmount(){
    memoryUtils.product = {}
  }

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;

    const subCategorys = await this.getCategorys(targetOption.value)
    if(subCategorys && subCategorys.length>0){
      const cOptions = subCategorys.map(c=>({
        value:c._id,
        label:c.name,
        isLeaf:true
      }))
      targetOption.children = cOptions
    } else{
      targetOption.isLeaf = true
    }
    targetOption.loading = false;
    this.setState({
      options: [...this.state.options],
    });
  };

  submit = ()=>{
    this.props.form.validateFields(async(err,values)=>{
      if(!err){
        const {name,desc,price,categoryIds} = values
        let categoryId,pCategoryId
        if(categoryIds.length===1){
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else{
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        const product = {name,desc,price,imgs,detail,pCategoryId,categoryId}
        if(this.isUpdate){
          product._id = this.product._id
        }
        const result = await reqAddOrUpdateProduct(product)
        if(result.status === 0){
          message.success(`${this.isUpdate ? '更新数据成功！' : '更新商品成功！'}`)
          this.props.history.goBack()
        } else{
          message.error(`${this.isUpdate ? '更新数据失败！' : '更新商品失败！'}`)
        }
      }
    })
  }

  validatePrice = (rule,value,callback)=>{
    if(value*1>0){
      callback()
    } else{
      callback('价格必须大于0！')
    }
  }

  render() {
    const {isUpdate,product} = this
    const {pCategoryId,categoryId,imgs,detail} = product
    const formItemLayout={
      labelCol:{span:2},
      wrapperCol:{span:8},
    }

    const categoryIds = [] //用来接受级联分类ID的数组
    if(isUpdate){
      if(pCategoryId==='0'){
        categoryIds.push(categoryId)
      } else{
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    const title=(
      <span>
        <LinkButton onClick={()=>this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize:15}}></Icon>
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )

    const {getFieldDecorator} = this.props.form

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='商品名称'>
            {
              getFieldDecorator('name',{
                initialValue:product.name,
                rules:[
                  {required:true, message:'商品名称必须输入！'}
                ]
              })(<Input placeholder='请输入商品名称'/> )
            }
          </Item>
          <Item label='商品描述'>
            {
              getFieldDecorator('desc',{
                initialValue:product.desc,
                rules:[
                  {required:true, message:'商品描述必须输入！'}
                ]
              })(<TextArea placeholder='请输入商品描述' autosize={{minRows:1,maxRows:6}}/>)
            }
          </Item>
          <Item label='商品价格'>
            {
              getFieldDecorator('price',{
                initialValue:product.price,
                rules:[
                  {required:true, message:'商品价格必须输入！'},
                  {validator:this.validatePrice}
                ]
              })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'/> )
            }
          </Item>
          <Item label='商品分类'>
            {
              getFieldDecorator('categoryIds',{
                initialValue:categoryIds,
                rules:[
                  {required:true, message:'商品分类必须选择！'},
                ]
              })(
                <Cascader
                placeholder='请指定商品分类'
                options={this.state.options} //需要显示的列表数据
                loadData={this.loadData} //当选择某个列表项，加载下一级列表的监听回调
                />
              )
            }
          </Item>
          <Item label='商品图片'>
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label='商品详情' labelCol={{span:2}} wrapperCol={{span:15}}>
            <RichTextEditor ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)

