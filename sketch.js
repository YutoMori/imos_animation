const W_BLOCK = 20 // ブロックの横幅 px
const H_BLOCK = 20 // ブロックの縦幅 px

const BLOCK_NUM_W = 20; // 横方向のブロックの個数
const BLOCK_NUM_H = 5; // 縦方向のブロックの個数

const LEFT_MARGIN = 60; // 左の空白
const TOP_MARGIN = 100; // 上の空白


// block color (https://www.schemecolor.com/new-media.php#download)
var color_block;

// tbl 20 × 5, -1 = nofill -1 != fill
var tbl = new Array(BLOCK_NUM_H);
for(let y = 0; y < BLOCK_NUM_W; y++) {
  tbl[y] = new Array(BLOCK_NUM_H).fill(-1);
}

// mouse
var mouse_count = 0;
var over_mouse = false;
var mouse_start = [0, 0]; // マウスのスタート位置
var mouse_end = [0, 0]; // マウスのエンド位置

var selected_x, selected_y;
var selected_color = 0;

// class palette
var palette;
var naiveCount;

class Palette{
  constructor(margin_x, margin_y){
    this.text_x = margin_x;
    this.text_y = margin_y;
    this.palette_x = margin_x;
    this.palette_y = margin_y + 10;
    this.selected_palette_x = margin_x + 165;
    this.selected_palette_y = margin_y;
  }

  draw(){
    // Palette
    fill(0);
    text("Palette", this.text_x, this.text_y);
    for(let i=0; i<5;i++){
      fill(color_block[i]);
      rect(this.palette_x+W_BLOCK*i, this.palette_y, W_BLOCK, H_BLOCK);
    }
    
    // Selected
    fill(0);
    text("Selected", this.selected_palette_x, this.selected_palette_y);
    fill(color_block[selected_color]);
    rect(this.selected_palette_x, this.selected_palette_y+10, W_BLOCK, H_BLOCK);
  }

  click(){
    for(let i=0; i<5; i++){
      if (this.palette_x+W_BLOCK*i <= mouseX &&
          mouseX < this.palette_x+(i+1)*W_BLOCK &&
          this.palette_y <= mouseY &&
          mouseY < this.palette_y+H_BLOCK){
            selected_color = i;
      }
    }
  }
}

class NaiveCount{
  constructor(x, y){
    this.count_table_x = x - 35;
    this.count_table_y = y;
    this.palette_x = x;
    this.palette_y = y;
  }

  draw(){
    // sub palette
    for (let i=0; i<5; i++){
      fill(color_block[i]);
      rect(this.count_table_x, this.palette_y+H_BLOCK*i, W_BLOCK, H_BLOCK);
    }

    // count table
    for (let i = 0; i < BLOCK_NUM_W; i++) {
      var color_stack = [0, 0, 0, 0, 0];
      for (let j = 0; j < BLOCK_NUM_H; j++){ // num color
        noFill();
        rect(this.palette_x+i*W_BLOCK, this.palette_y+j*H_BLOCK, W_BLOCK, H_BLOCK);
        
        if (tbl[i][j] == 0) {
          color_stack[0] += 1
          fill(0);
          text(tbl[i][j], this.palette_x+i*W_BLOCK+6, this.palette_y+3, W_BLOCK, H_BLOCK);
        }
      }
    }
  }
}


function mouseClicked(){
  // パレット
  palette.click();
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


function setup() {  
  color_block = [color("#FF723D"), color("#FFD334"), color("#052F83"), color("#0776EC"), color("#4FEEE7")]
  createCanvas(500, 600);
  palette = new Palette(60, 40);
  naiveCount = new NaiveCount(60, 400);
}

function draw() {
  background(220);
  strokeWeight(0.4);

  palette.draw();
  naiveCount.draw();

  // point table
  if (mouseIsPressed){
    [selected_x,selected_y] = mouseGridToBlockGrid(mouseX, mouseY);
    if (selected_x != -1){
      tbl[selected_x][selected_y] = selected_color;
    }
  }

  // paint block
  for (let i = 0; i < BLOCK_NUM_W; i++) {
    for (let j = 0; j < BLOCK_NUM_H; j++){
      if (tbl[i][j] == -1) {
        noFill();
      } else {
        fill(color_block[tbl[i][j]]); // tblを元に色塗り
      }
      rect(LEFT_MARGIN+i*W_BLOCK, TOP_MARGIN+j*H_BLOCK, W_BLOCK, H_BLOCK);

      // 選択部分をハイライト
      if (LEFT_MARGIN+i*W_BLOCK <= mouseX &&
          mouseX < LEFT_MARGIN+(i+1)*W_BLOCK &&
          TOP_MARGIN+j*H_BLOCK <= mouseY &&
          mouseY < TOP_MARGIN+(j+1)*H_BLOCK) {
        fill(0,0,0, 50);
        rect(LEFT_MARGIN+i*W_BLOCK, TOP_MARGIN+j*H_BLOCK, W_BLOCK, H_BLOCK);
      }
    }
  }
}