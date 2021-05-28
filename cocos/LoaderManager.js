/*
 * 脚本放在/Script下就可以无需挂载，无需require
 * 为了和本来的cc.loader.load保持一致
 * 加载的远程资源直接使用Loader.load(url,function);
 * 进度加载使用Loader.getProgress(),此方法返回一个x，x为当前加载成功文件数和文件总数的比值
 * 进度条的变化请放在update()或者自己写的帧检测函数里面保证条进度的流畅性
 */

let loadertype = cc.Class({
    extends: cc.Component,

    properties: {
        minIndex:0,
        maxIndex:0,
    },
    /**
    * 需要添加初始化参数的在这里写
    * ctor(){
      },
    */
    
    /**
     * @param {加载链接 string||array||object} url 
     * @param {完成回调函数} onComplete 
     */
    load(url,onComplete){
        if(typeof onComplete !='function' || (typeof url !='string' && typeof url != 'object')){
            if(typeof onComplete !='function')
                throw new Error("Loader.load调用出错 \n 第二个参数必须是函数");  
            else
                throw new Error("Loader.load调用出错 \n 第二个参数必须是字符||对象||数组");  
        }else{
            if(typeof url =='object' && url.type == null ){
                for(let urlchildren of url){
                    Loader.maxIndex++;
                    cc.loader.load(urlchildren,function(err,data){
                        onComplete(err,data);
                        Loader.minIndex++;
                    });
                }
            }else{
                Loader.maxIndex++;
                cc.loader.load(url,function(err,data){
                    onComplete(err,data);
                    Loader.minIndex++;
                });
            }
        }
       
    },
    /**
     * @param {加载完成文件数} completedCount 
     * @param {总文件数} totalCount 
     * @returns 返回区间[0,1]
     */
    getProgress(completedCount = Loader.minIndex ,totalCount = Loader.maxIndex){
        return completedCount / totalCount;
    }
});
// 加载用法示例，可自行删除
// url字符链接
// Loader.load("h.png",(err,typedata)=>{
//     let data = typedata
// })
// [url]链接数组
// Loader.load(["h.png","t.mp3"],(err,typedata)=>{
//     let data = typedata
// })
// {url}链接对象
// Loader.load({ url1:"h.png",url2:"t.mp3"},(err,typedata)=>{
//     let data = typedata
// })
// 进度监听用法示例，可自行删除
// update (dt) {
//     if(Loader.getProgress()<1){
//         cc.slider.progress = Loader.getProgress();
//     }else{
//         cc.slider.progress = 1;
//         this.complete();
//     }
// },
let loader = new loadertype();
window['Loader'] = loader;