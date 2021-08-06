import React, { Component } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import './product.less'

import ProductHome from './home'
import ProductAddUpdate from  './add-update'
import ProductDetail from './detail'

export default class Product extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/product' component={ProductHome}/>
          <Route exact path='/product/addupdate' component={ProductAddUpdate}/>
          <Route exact path='/product/detail' component={ProductDetail}/>
          <Redirect to='/product'/>
        </Switch>
      </div>
    )
  }
}
