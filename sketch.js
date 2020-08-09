const w_block = 20 // ブロックの横幅 px
const h_block = 20 // ブロックの縦幅 px

const block_num_w = 20; // 横方向のブロックの個数
const block_num_h = 5; // 縦方向のブロックの個数

const left_margin = 35; // 左の空白
const top_margin = 100; // 上の空白


// block color (https://www.schemecolor.com/new-media.php#download)
var color_block;

// tbl 20 × 5, -1 = nofill -1 != fill
var tbl = new Array(block_num_h);
for(let y = 0; y < block_num_w; y++) {
  tbl[y] = new Array(block_num_h).fill(-1);
}

var tbl_cache = new Array(block_num_h);
for(let y = 0; y < block_num_w; y++) {
  tbl_cache[y] = new Array(block_num_h).fill(-1);
}

// mouse
var mouse_count = 0;
var over_mouse = false;
var mouse_start = [0, 0]; // マウスのスタート位置
var mouse_end = [0, 0]; // マウスのエンド位置

var upper_left;
var upper_right;

var lower_left;
var lower_right;

var locked = false;

var selected_x, selected_y;

function setup() {  
  color_block = [color("#FF723D"), color("#FFD334"), color("#052F83"), color("#0776EC"), color("#4FEEE7")]
  createCanvas(500, 500);
}
/*
function mouseReleased() {
  locked = false;
}


function mouseClicked(){
  if (over_mouse){ // マウスクリック後に離した場合
    paintBlock(upper_left, upper_right, lower_left, lower_right, tbl);
    mouse_count += 1;
    over_mouse = false;
  }
}


function mousePressed() {
  if (over_mouse) {
    locked = true;
  } else {
    locked = false;
  }
}
*/

function mouseGridToBlockGrid(input_mouseX, input_mouseY){ // マウス座標からブロック座標
  for (let i = 0; i < block_num_w; i++){
    for (let j = 0; j < block_num_h; j++){
      if (left_margin+i*w_block <= input_mouseX && input_mouseX < left_margin+(i+1)*w_block &&
      top_margin+j*h_block <= input_mouseY && input_mouseY < top_margin+(j+1)*h_block) {
        return [i,j];
      }
    }
  }
  return [-1,-1];
}

function paintBlock(upper_left, upper_right, lower_left, lower_right, table){
  // マウスの移動範囲で長方形に色塗り
  for (let i = upper_left; i < upper_right+1; i++){
    for (let j = lower_left; j < lower_right+1; j++){
      table[i][j] = mouse_count;
    }
  }
}

function draw() {
  //print(mouse_start, mouse_end);
  //print(tbl); 
  //print(mouse_count%5);
  if (mouseIsPressed){
    [selected_x,selected_y] = mouseGridToBlockGrid(mouseX, mouseY);
    if (selected_x != -1){
      tbl[selected_x][selected_y] = 10;
    }
  }
  
  //print(mouseGridToBlockGrid(mouseX, mouseY));
  //print(locked);
  background(220);
  strokeWeight(0.4);
  
  for (let i = 0; i < block_num_w; i++) {
    for (let j = 0; j < block_num_h; j++){
      if (tbl[i][j] == -1) {
        noFill();
      } else {
        // fill(0,0,0, 50);
        fill(color_block[tbl[i][j]%5]); // tblを元に色塗り
      }
      rect(left_margin+i*w_block, top_margin+j*h_block, w_block, h_block);

      // 下にimos配列
      noFill();
      rect(left_margin+i*w_block, top_margin+j*h_block + 300, w_block, h_block);
      fill(0);
      text("+1", left_margin+i*w_block, top_margin+j*h_block + 300, w_block, h_block);

      if (left_margin+i*w_block <= mouseX && mouseX < left_margin+(i+1)*w_block &&
      top_margin+j*h_block <= mouseY && mouseY < top_margin+(j+1)*h_block) {
        fill(0,0,0, 50);
        rect(left_margin+i*w_block, top_margin+j*h_block, w_block, h_block); // 選択部分をハイライト
        if (mouseIsPressed){
          upper_left = min(mouse_start[0], mouse_end[0]);
          upper_right = max(mouse_start[0], mouse_end[0]);
          
          lower_left = min(mouse_start[1], mouse_end[1]);
          lower_right = max(mouse_start[1], mouse_end[1]);
          if (tbl[i][j] == -1 ) {
            if (over_mouse == false) { // 最初のマウスクリック
              mouse_start = [i, j];
            }
            over_mouse = true;
          }
          //tbl[i][j] = 1; // 色塗り
          mouse_end = [i, j];
          paintBlock(upper_left, upper_right, lower_left, lower_right, tbl_cache);
          //print(tbl_cache);
        }
      }
    }
  }
}