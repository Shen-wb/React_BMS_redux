import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import PropTypes from 'prop-types'
import {reqRemovePic} from '../../api'
import {IMG_URL} from '../../utils/constants'


function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs:PropTypes.array
  }

  constructor(props){
    super(props)
    let fileList = []
    const {imgs} = this.props
    if(imgs && imgs.length > 0){
      fileList = imgs.map((img,index)=>({
        uid:-index,
        name:img,
        status:'done',
        url:IMG_URL+img
      }))
    }
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList,
    }
  }

  getImgs = ()=>{
    return this.state.fileList.map(file =>file.name)
  }
  
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({ file, fileList }) => {
    if(file.status==='done'){
      const result = file.response
      if(result.status===0){
        message.success('图片上传成功!')
        const {name,url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      } else{
        message.error('图片上传失败！')
      }
    } else if(file.status==='removed'){
      const result = await reqRemovePic(file.name)
      if(result.status===0){
        message.success('图片删除成功！')
        console.log(file.name)
      } else{
        message.error('图片删除失败！')
      }
    }
    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"
          accept='image/*'
          listType="picture-card"
          name='image' //请求参数名，必须按照接口文档指定
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}