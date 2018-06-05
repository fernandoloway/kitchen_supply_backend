

var port='7000'
var filepath=`http://localhost:${port}/uploads/`

function addImageUrl (data){
    data.map((item) => {
        item.prod_image_url= filepath+item.product_image;
        return item;
    })
}

function addSingleImageUrl (data){
    return data.prod_image_url= filepath+data.product_image;
}

function addCatBgImgUrl (data){
    return data.cat_bg_img_url= filepath+data.cat_image;
}

module.exports = {
    many: addImageUrl,
    one: addSingleImageUrl,
    bgImg: addCatBgImgUrl
}