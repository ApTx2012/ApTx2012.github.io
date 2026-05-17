document.addEventListener('click',e=>{
  let r=document.createElement('div');
  r.className='ripple';
  r.style.left=e.clientX+'px';
  r.style.top=e.clientY+'px';
  r.style.width='40px';
  r.style.height='40px';
  document.body.appendChild(r);
  setTimeout(()=>r.remove(),600);
})