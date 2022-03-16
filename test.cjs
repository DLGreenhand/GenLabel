(async()=>{
    var promise=new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log("fc1")
        },1000)
    })
    return promise
})().then((async()=>{
    var promise=new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log("fc2")
        },2000)
    })
    return promise
})().then((async()=>{
    var promise=new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log("fc3")
        },3000)
    })
    return promise
})()))
    
