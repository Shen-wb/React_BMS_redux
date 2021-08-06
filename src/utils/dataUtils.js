export function formateData(time){
  if(!time) return ''
  let data = new Date(time)
  let year = data.getFullYear();
  let month = data.getMonth()+1;
  let date = data.getDate();
  let hours = data.getHours();
  let minutes = data.getMinutes();
  let seconds = data.getSeconds();
  if(minutes<10){
    minutes = '0' + minutes
  }

  if(seconds<10){
    seconds = '0' + seconds
  }
  //return data.getFullYear() + '-' + (data.getMonth()+1) +'-'+data.getDate()+' ' + data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds()
  return year + '年' + month + '月' + date + '日 ' + hours + ':' + minutes + ':' + seconds
}