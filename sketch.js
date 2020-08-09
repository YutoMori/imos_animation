const W_BLOCK = 20 // ブロックの横幅 px
const H_BLOCK = 20 // ブロックの縦幅 px

const BLOCK_NUM_W = 20; // 横方向のブロックの個数
const BLOCK_NUM_H = 5; // 縦方向のブロックの個数

const LEFT_MARGIN = 35; // 左の空白
const TOP_MARGIN = 100; // 上の空白


// block color (https://www.schemecolor.com/new-media.php#download)
var color_block;

// tbl 20 × 5, -1 = nofill -1 != fill
var tbl = new Array(BLOCK_NUM_H);
for(let y = 0; y < BLOCK_NUM_W; y++) {
  tbl[y] = new Array(BLOCK_NUM_H).fill(-1);
}

var tbl_cache = new Array(BLOCK_NUM_H);
for(let y = 0; y < BLOCK_NUM_W; y++) {
  tbl_cache[y] = new Array(BLOCK_NUM_H).fill(-1);
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
var selected_color = 0;

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

function mouseGridToBlockGrid(input_mouseX, input_mouseY){ // マウス座標からブロック座標
  for (let i = 0; i < BLOCK_NUM_W; i++){
    for (let j = 0; j < BLOCK_NUM_H; j++){
      if (LEFT_MARGIN+i*W_BLOCK <= input_mouseX && input_mouseX < LEFT_MARGIN+(i+1)*W_BLOCK &&
      TOP_MARGIN+j*H_BLOCK <= input_mouseY && input_mouseY < TOP_MARGIN+(j+1)*H_BLOCK) {
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

// 色塗り用のパレット
function drawPalette(selected_color){
  // パレット
  text("Palette", 30, 40);
  for (let i = 0; i< 5; i++){
    fill(color_block[i]);
    rect(35+W_BLOCK*i, 50, W_BLOCK, H_BLOCK);
    if (mouseIsPressed){
      print("click test");
    }
  }

  // 現在選択している色
  fill(0);
  text("Selected", 200, 40);
  fill(color_block[selected_color]);
  rect(205, 50, W_BLOCK, H_BLOCK);
}

function setup() {  
  color_block = [color("#FF723D"), color("#FFD334"), color("#052F83"), color("#0776EC"), color("#4FEEE7")]
  createCanvas(500, 600);
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

  drawPalette(0);
  
  
  for (let i = 0; i < BLOCK_NUM_W; i++) {
    for (let j = 0; j < BLOCK_NUM_H; j++){
      if (tbl[i][j] == -1) {
        noFill();
      } else {
        fill(color_block[tbl[i][j]%5]); // tblを元に色塗り
      }
      rect(LEFT_MARGIN+i*W_BLOCK, TOP_MARGIN+j*H_BLOCK, W_BLOCK, H_BLOCK);

      // 下にimos配列
      noFill();
      rect(LEFT_MARGIN+i*W_BLOCK, TOP_MARGIN+j*H_BLOCK + 300, W_BLOCK, H_BLOCK);
      fill(0);
      text("+1", LEFT_MARGIN+i*W_BLOCK, TOP_MARGIN+j*H_BLOCK + 300, W_BLOCK, H_BLOCK);

      if (LEFT_MARGIN+i*W_BLOCK <= mouseX && mouseX < LEFT_MARGIN+(i+1)*W_BLOCK &&
      TOP_MARGIN+j*H_BLOCK <= mouseY && mouseY < TOP_MARGIN+(j+1)*H_BLOCK) {
        fill(0,0,0, 50);
        rect(LEFT_MARGIN+i*W_BLOCK, TOP_MARGIN+j*H_BLOCK, W_BLOCK, H_BLOCK); // 選択部分をハイライト
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