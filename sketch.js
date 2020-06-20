const w_block = 20 // ブロックの横幅 px
const h_block = 20 // ブロックの縦幅 px

const block_num_w = 20; // 横方向のブロックの個数
const block_num_h = 5; // 縦方向のブロックの個数

// block color (https://www.schemecolor.com/new-media.php#download)
var color_block;

// tbl 20 × 5, 0 = nofill 1 = fill
var tbl = new Array(block_num_h);
for(let y = 0; y < block_num_w; y++) {
  tbl[y] = new Array(block_num_h).fill(0);
}

// mouse
var mouse_count = 0;
var over_mouse = false;
var mouse_start = [0, 0]; // マウスのスタート位置
var mouse_end = [0, 0]; // マウスのエンド位置

var locked = false;

function setup() {  
  color_block = [color("#FF723D"), color("#FFD334"), color("#052F83"), color("#0776EC"), color("#4FEEE7")]
  createCanvas(500, 500);
}
/*
function mouseReleased() {
  locked = false;
}*/

function mouseClicked(){
  if (over_mouse){ // マウスクリック後に離した場合
    paintBlock(mouse_start, mouse_end);
    mouse_count += 1;
    over_mouse = false;
  }
}

/*
function mousePressed() {
  if (over_mouse) {
    locked = true;
  } else {
    locked = false;
  }
}
*/
/*
function mouseDragged() {
  if (locked) {
    mouse_end = mouseGridToBlockGrid(mouseX, mouseY);
  }
}
*/

function mouseGridToBlockGrid(input_mouseX, input_mouseY){ // マウス座標からブロック座標
  for (let i = 0; i < block_num_w; i++){
    for (let j = 0; j < block_num_h; j++){
      if (35+i*w_block <= input_mouseX && input_mouseX < 35+(i+1)*w_block &&
          30+j*h_block <= input_mouseY && input_mouseY < 30+(j+1)*h_block) {
        return [i, j];
      }
    }
  }
}

function paintBlock(mouse_start, mouse_end){
  // マウスの移動範囲で長方形に色塗り
  let upper_left = min(mouse_start[0], mouse_end[0]);
  let upper_right = max(mouse_start[0], mouse_end[0]);
  
  let lower_left = min(mouse_start[1], mouse_end[1]);
  let lower_right = max(mouse_start[1], mouse_end[1]);
  for (let i = upper_left; i < upper_right+1; i++){
    for (let j = lower_left; j < lower_right+1; j++){
      tbl[i][j] = 1;
    }
  }
}

function draw() {
  print(mouse_start, mouse_end);
  background(220);
  strokeWeight(0.4);
  for (let i = 0; i < block_num_w; i++) {
    for (let j = 0; j < block_num_h; j++){
      if (tbl[i][j] == 0) {
        noFill()
      } else {
        // fill(0,0,0, 50);
        fill(color_block[0]);
      }
      rect(35+i*w_block, 30+j*h_block, w_block, h_block);
      if (35+i*w_block <= mouseX && mouseX < 35+(i+1)*w_block &&
          30+j*h_block <= mouseY && mouseY < 30+(j+1)*h_block) {
        fill(0,0,0, 50);
        rect(35+i*w_block, 30+j*h_block, w_block, h_block);
        if (mouseIsPressed){
          if (tbl[i][j] == 0 ) {
            if (over_mouse == false) { // 最初のマウスクリック
              mouse_start = [i, j];
            }
            over_mouse = true;
          }
          //tbl[i][j] = 1; // 色塗り
          mouse_end = [i, j];
          //paintBlock(mouse_start, mouse_end);
        }
      }
    }
  }
}