import React, { Component } from 'react'
import {Card,Icon,List} from 'antd'
import LinkButton from '../../components/link-button'
import {IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import './product.less'

const Item = List.Item
//Product的详情组路由组件
export default class ProductDetail extends Component {

  state = {
    cName1:'',
    cName2:'',
  }

  async componentDidMount(){
    const {pCategoryId, categoryId} = memoryUtils.product
    if(pCategoryId==='0'){
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    }else{
      const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({cName1,cName2})
    }
  }

  componentWillUnmount(){
    memoryUtils.product = {}
  }

  render() {
    const {name, desc, price, detail, imgs} = memoryUtils.product
    const title = (
      <span>
        <LinkButton onClick={()=>{this.props.history.goBack()}}>
          <Icon type='arrow-left' style={{fontSize:15}}></Icon>
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    const {cName1,cName2} = this.state

    return (
      <div>
        <Card title={title} className="product-detail">
          <List>
            <Item>
              <span className='left'>商品名称：</span>
              <span>{name}</span>
            </Item>
            <Item>
              <span className='left'>商品描述：</span>
              <span>{desc}</span>
            </Item>
            <Item>
              <span className='left'>商品价格：</span>
              <span>{price}元</span>
            </Item>
            <Item>
              <span className='left'>所属分类：</span>
              <span>{cName1} {cName2 ? '-->'+cName2 : ''}</span>
            </Item>
            <Item>
              <span className='left'>商品图片：</span>
              <span>
                {
                  imgs.map(img => (
                    <img
                      key={img}
                      src={IMG_URL + img}
                      className="product-img"
                      alt="img"
                    />
                  ))
                }
              </span>
            </Item>
            <Item>
              <span className='left'>商品详情：</span>
              <span dangerouslySetInnerHTML={{__html:detail}}></span>
            </Item>
          </List>
        </Card>
      </div>
    )
  }
}
