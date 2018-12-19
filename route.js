var fs = require('fs');
var express = require('express')
var router = express.Router();
var goods = [];
var list = [];
var newdata = {};
var d = {};  //文件数据
// 获取商品列表
router.get('/', function(req, res) {
    fs.readFile('../bsVue-master/build/jsever.json', function(err, data) {
        if (err) {
            return console.log('error，读取失败！')
        }
        d = data.toString(); //将二进制的数据转换为字符串
        d = JSON.parse(d); //将字符串转换为json对象
        newdata = d;        //newdata乱操作后提交的新数据
        list = d.goodslist; //list用于表格的展示
        
        list.forEach((item, index) => {
            var itemid = item.id;
            item.total = d[itemid]['total'];
            //console.log(d[itemid])

            item.addTime = d[itemid].addTime;
            item.attr = d[itemid].attr;
        })
        
        //console.log(d.goodslist)
        res.send(list)
    });
})
// 删除某件商品
router.post('/delete', function(req, res) {
    goods = newdata.goodslist;   //goodslist 用来做商品的增删改
    var id = req.body.id;
    goods.forEach((item, index) => {
        if(item.id == id){
            goods.splice(index,1)
            delete(newdata[id])
        }
    })
    //  console.log(newdata.goodslist);
    newdata = JSON.stringify(newdata)//写入只能是字符串或二进制数
  
    fs.writeFile('../bsVue-master/build/jsever.json', newdata,function(err) {
        if(err){
            console.log('delete error')
        }
        console.log('delete success')
    })
    res.send({
        'success':true
    })
})
// 新增某件商品
router.post('/add', function(req, res) {
    goods = newdata.goodslist;   //goodslist 用来做商品的增删改
    var adddata = req.body;     //获取表单的商品信息
    var id = adddata.id;
    adddata['attr'] = Array.from(adddata['attr'].split(','))//转换为数组
    newdata['goodslist'].push(adddata)

    goods = Array.from(goods)
    goods.push(adddata)     //存入到商品信息列表中
    //console.log(newdata.goodslist);
    newdata[id] = adddata;
    newdata[id]['idnum'] = id;
    newdata = JSON.stringify(newdata)//写入只能是字符串或二进制数
    fs.writeFile('../bsVue-master/build/jsever.json', newdata,function(err) {
        if(err){
            console.log('add error')
        }
        console.log('add success')
    })
    res.send({
        'success':true
    })
})
// 修改某件商品
router.post('/edit', function(req, res) {
    goods = newdata.goodslist;   //goodslist 用来做商品的增删改
    var req = req.body;
    goods.forEach((item, index) => {
        if(item.id == req.id){
            item.total = req.total;
            item.price = req.price;
        }
    })
    //更新详情页
    newdata[req.id]['total'] = req.total;
    newdata[req.id]['price'] = req.price;

    //console.log(goods);
    newdata = JSON.stringify(newdata);//写入只能是字符串或二进制数
  
    fs.writeFile('../bsVue-master/build/jsever.json', newdata,function(err) {
        if(err){
            console.log('edit error')
        }
        console.log('edit success')
    });
    res.send({
        'success':true
    })
})

module.exports = router;