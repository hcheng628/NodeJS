console.log('Starting App');

setTimeout(()=>{
  console.log('Inside of Callback');
},2000)

setTimeout(()=>{
  console.log('Inside of Callback #2');
},100);


console.log('Finishing App');
