new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve(1);
    }, 2000);
})
.then(result => {
    console.log(result);
    return result + 10;
})
.then(result => {
    console.log(result);
    return result + 20;
})
.then(result => {
    console.log(result);
})