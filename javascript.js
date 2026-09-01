const board = document.getElementById("board");
const addNoteBtn = document.getElementById("addNoteBtn");
const addImageBtn = document.getElementById("addImageBtn");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const itemCount = document.getElementById("itemCount");

const colors = ["color1","color2","color3","color4","color5","color6"];
const sampleImages = [
  "assets/task-planning.png","assets/focus-session.png",
  "assets/project-ideas.png","assets/final-check.png"
];
const sampleQuotes = [
  "Dobar plan pretvara veliku obavezu u male korake.",
  "Ne moraš završiti sve danas — važno je da znaš šta je sljedeće.",
  "Fokus na jednu stvar je često brži put do cilja."
];

function updateCount(){
  const count = board.querySelectorAll(":scope > div").length;
  itemCount.textContent = count + (count === 1 ? " stavka" : " stavki");
}

function makeDraggable(el){
  let offsetX=0, offsetY=0, dragging=false;

  const delBtn=document.createElement("button");
  delBtn.textContent="×";
  delBtn.className="delete-btn";
  delBtn.title="Obriši stavku";
  el.appendChild(delBtn);

  delBtn.addEventListener("click",(e)=>{
    e.stopPropagation();
    el.remove();
    updateCount();
  });

  el.addEventListener("mousedown",(e)=>{
    if(e.target===delBtn) return;
    dragging=true;
    const rect=el.getBoundingClientRect();
    const boardRect=board.getBoundingClientRect();
    offsetX=e.clientX-rect.left;
    offsetY=e.clientY-rect.top;
    el.style.left=(rect.left-boardRect.left)+"px";
    el.style.top=(rect.top-boardRect.top)+"px";
    document.addEventListener("mousemove",drag);
    document.addEventListener("mouseup",stopDrag,{once:true});
  });

  function drag(e){
    if(!dragging) return;
    const r=board.getBoundingClientRect();
    let x=e.clientX-r.left-offsetX;
    let y=e.clientY-r.top-offsetY;
    x=Math.max(0,Math.min(x,board.clientWidth-el.offsetWidth));
    y=Math.max(0,Math.min(y,board.clientHeight-el.offsetHeight));
    el.style.left=x+"px";
    el.style.top=y+"px";
  }
  function stopDrag(){
    dragging=false;
    document.removeEventListener("mousemove",drag);
  }
}

function addNote(){
  const note=document.createElement("div");
  note.className="note "+colors[Math.floor(Math.random()*colors.length)];
  note.contentEditable="true";
  note.textContent="Klikni ovdje i napiši obavezu...";
  note.style.left=(80+Math.random()*350)+"px";
  note.style.top=(100+Math.random()*280)+"px";
  makeDraggable(note); board.appendChild(note); updateCount();
}

function addImage(){
  const div=document.createElement("div");
  div.className="pinned-img";
  div.style.left=(80+Math.random()*500)+"px";
  div.style.top=(90+Math.random()*300)+"px";
  const img=document.createElement("img");
  img.src=sampleImages[Math.floor(Math.random()*sampleImages.length)];
  img.alt="Studentski planer";
  div.appendChild(img);
  makeDraggable(div); board.appendChild(div); updateCount();
}

function addQuote(){
  const q=document.createElement("div");
  q.className="quote";
  q.contentEditable="true";
  q.textContent=sampleQuotes[Math.floor(Math.random()*sampleQuotes.length)];
  q.style.left=(120+Math.random()*450)+"px";
  q.style.top=(120+Math.random()*300)+"px";
  makeDraggable(q); board.appendChild(q); updateCount();
}

function saveBoard(){
  const items=[...board.children].map(el=>({
    className:el.className,
    html:el.innerHTML,
    left:el.style.left,
    top:el.style.top
  }));
  localStorage.setItem("campusPlannerItems",JSON.stringify(items));
  alert("Tabla je sačuvana u ovom pregledniku.");
}

function loadBoard(){
  const saved=localStorage.getItem("campusPlannerItems");
  if(!saved) return;
  try{
    JSON.parse(saved).forEach(item=>{
      const div=document.createElement("div");
      div.className=item.className;
      div.style.left=item.left; div.style.top=item.top;
      div.innerHTML=item.html;
      if(div.classList.contains("note")||div.classList.contains("quote"))
        div.contentEditable="true";
      makeDraggable(div); board.appendChild(div);
    });
  }catch(e){ localStorage.removeItem("campusPlannerItems"); }
}

addNoteBtn.addEventListener("click",addNote);
addImageBtn.addEventListener("click",addImage);
addQuoteBtn.addEventListener("click",addQuote);
saveBtn.addEventListener("click",saveBoard);
clearBtn.addEventListener("click",()=>{
  if(confirm("Da li želiš ukloniti sve stavke sa table?")){
    board.innerHTML="";
    localStorage.removeItem("campusPlannerItems");
    updateCount();
  }
});

loadBoard();
board.querySelectorAll(":scope > div").forEach(makeDraggable);
updateCount();
