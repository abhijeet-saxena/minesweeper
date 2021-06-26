class e{constructor(e,t,s){this.ROWS=e,this.COLUMNS=t,this.board=[],this.mines=s,this.mineLocations=new Set}init(){for(;this.mineLocations.size!==this.mines;)this.mineLocations.add(Math.floor(Math.random()*this.ROWS*this.COLUMNS));for(let e=0;e<this.ROWS;e++){const t=[];for(let s=0;s<this.COLUMNS;s++)t.push({x:e,y:s,isMine:this.mineLocations.has(this.ROWS*e+s),isRevealed:!1,value:null});this.board.push(t)}for(let e=0;e<this.ROWS;e++)for(let t=0;t<this.COLUMNS;t++)this.board[e][t].isMine||(this.board[e][t].value=this.getValueAtCell(e,t))}printBoard(){for(let e=0;e<this.ROWS;e++){let t="";for(let s=0;s<this.COLUMNS;s++)t+=`  ${this.board[e][s].isMine?"X":this.board[e][s].value}  `;console.log(`${t}\n`)}}getValueAtCell(e,t){let s=0;for(let i=-1;i<2;i++){const n=this.board[e+i];n&&(n[t-1]&&n[t-1].isMine&&(s+=1),n[t]&&n[t].isMine&&(s+=1),n[t+1]&&n[t+1].isMine&&(s+=1))}return s}getAdjacentCells(e,t){const s=[];for(let i=-1;i<2;i++){const n=this.board[e+i];if(n){let e=n[t-1],l=n[t],r=n[t+1];e&&!e.isMine&&s.push(e),0!==i&&l&&!l.isMine&&s.push(l),r&&!r.isMine&&s.push(r)}}return s}recursivelyOpenCells(e,t){let s=[],i=[this.board[e][t]];for(;i.length;){const e=i.shift(),t=this.getAdjacentCells(e.x,e.y);for(let n of t)n.isRevealed||(s.push(n),0===n.value&&i.push(n),n.isRevealed=!0)}return s}openCell(e,t){const{isMine:s,value:i,x:n,y:l}=this.board[e][t];if(s)return{gameOver:!0,revealed:[...this.mineLocations]};if(0!==i)return this.board[e][t].isRevealed=!0,{gameOver:!1,revealed:[{value:i,x:n,y:l}]};return{gameOver:!1,revealed:[{value:i,x:n,y:l},...this.recursivelyOpenCells(e,t)]}}}const t={easy:{rows:10,columns:10,mines:10},medium:{rows:15,columns:15,mines:40},hard:{rows:20,columns:20,mines:99}},{rows:s,columns:i,mines:n}=t.easy;let l=new e(s,i,n);l.init(),window.onload=function(){const s=document.querySelector("#difficulty"),i=document.querySelector("#board"),n=(e,t)=>{let s="";for(let i of e)s+=`<div class="cell" data-x="${i.x}" data-y="${i.y}"></div>`;i.innerHTML=s,i.style.width=`calc(${t*document.querySelector(".cell").clientWidth}px + ${4*(t-1)}px)`,l.printBoard()};n(l.board.flat(),l.COLUMNS),i.addEventListener("click",(({target:e})=>{if(!e.classList.contains("cell"))return;const{x:t,y:s}=e.dataset,{revealed:n,gameOver:r}=l.openCell(parseInt(t,10),parseInt(s,10));if(r)return e.dataset.val="💣",e.innerHTML="💣",void n.forEach(((e,t)=>{const s=i.querySelector(`:nth-child(${e+1})`);setTimeout((()=>{s.dataset.val="💣",s.innerHTML="💣",t>=n.length-1&&alert("Game Over")}),200*t)}));l.board.flat().reduce(((e,t)=>e+(t.isRevealed?1:0)),0);for(let a of n){const e=i.querySelector(`:nth-child(${a.x*l.ROWS+a.y+1})`);e.dataset.val=a.value,e.innerHTML=a.value||""}})),s.addEventListener("change",(({target:{value:s}})=>{const{rows:i,columns:r,mines:a}=t[s];l=new e(i,r,a),l.init(),n(l.board.flat(),r)}))};
