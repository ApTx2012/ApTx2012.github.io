document.addEventListener('DOMContentLoaded',()=>{
  let box=document.createElement('div');
  box.className='stars-bg';
  document.body.prepend(box);
  for(let i=0;i<80;i++){
    let s=document.createElement('div');
    s.className='star';
    let size=Math.random()*3+1;
    s.style.width=size+'px';
    s.style.height=size+'px';
    s.style.left=Math.random()*100+'%';
    s.style.top=Math.random()*100+'%';
    s.style.animationDuration=(Math.random()*15+10)+'s';
    box.appendChild(s);
  }
})