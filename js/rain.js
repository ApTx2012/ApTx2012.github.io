document.addEventListener('DOMContentLoaded',()=>{
  let r=document.createElement('div');r.className='rain';document.body.prepend(r);
  for(let i=0;i<60;i++){
    let d=document.createElement('div');d.className='drop';
    d.style.left=Math.random()*100+'%';
    d.style.height=Math.random()*15+8+'px';
    d.style.animationDuration=(Math.random()*0.8+0.4)+'s';
    r.appendChild(d);
  }
})