var asyncAdd = (a,b) =>{
    return new Promise((good, bad) =>{
        setTimeout(() => {
            if(typeof a === 'number' && typeof b === 'number'){
                good(a + b);
            }else{
                bad('Invalid Input!')
            }
        }, 3000);
    });
}

var myPromise = new Promise((good, bad) =>{
    setTimeout(()=>{
        good('Yes!');
    }, 2500);
});

myPromise.then((goodNews)=>{
        console.log(goodNews);
    }, (badNews) => {
        console.log(badNews);
    }
);


asyncAdd(5,7).then((goodNews)=>{
        console.log(goodNews);
    }, (badNews) => {
        console.log(badNews);
    }
);