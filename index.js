const addbut = document.getElementById('Add');
addbut.addEventListener('click', ()=>{
   const newone = document.createElement('li');
   const te = document.getElementById('task');
   newone.innerText =  te.value.trim();
   te.innerText = '';
   const myt = document.getElementById('mylist');
   myt.appendChild(newone);
});
