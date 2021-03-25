/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = true

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

let count = 0;
var subscription;
let data;
let arraydata = {};
function connectCallback() {
  // document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
  subscription = client.subscribe("/fx/prices", callback);
  
}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
});



callback = function(message) {
  // called when the client receives a STOMP message from the server
  if (message.body) {
    // console.log("got message with body " + message.body)
    var quote = JSON.parse(message.body);
    data = quote;
    pushOnHtml();
  } else {
    console.log("got empty message");
  }
}

function pushOnHtml(){
  let tbody = document.getElementById('table_body');
  let tr1 = document.createElement('tr');
  let keys = Object.keys(data);
  let tr;
  for(let i=0;i<keys.length;i++){
      tr = document.getElementById(data['name']);
      if(tr==null){
        let td = document.createElement('td');
        td.setAttribute('id',data.name+'_'+keys[i]);
        tr1.setAttribute('id',data['name']);
        td.innerHTML = data[keys[i]];
        tr1.appendChild(td);
      }
      else{
        let td = document.getElementById(data.name+'_'+keys[i]);
        td.innerHTML = data[keys[i]];
      }
  }

  if(tr!==null){
    appendsparkline(tbody,tr);
  }
  else{
    appendsparkline(tbody,tr1);
  }

  
}

function appendsparkline(tbody,tr){
  let midPrice = (data.bestBid + data.bestAsk)/2;


  if(arraydata[data.name]===undefined || arraydata[data.name]===null ){
    arraydata[data.name] = [];
  }

  if(arraydata[data.name].length<30 || arraydata[data.name].length==0){
    arraydata[data.name].push(midPrice);}
  else{
    arraydata[data.name].shift();
    arraydata[data.name].push(midPrice);
  }

  let sparkEle = document.getElementById(data.name+'_sparkline');
  if(sparkEle!==null)
    {
      Sparkline.draw(sparkEle, arraydata[data.name]);
      tr.appendChild(sparkEle);
    }
  else
  {
    const sparks = document.createElement('td');
    sparks.setAttribute('id',data.name+'_sparkline')
    Sparkline.draw(sparks, arraydata[data.name]);
    tr.appendChild(sparks);
  }

  tbody.appendChild(tr);

  sortTable(tr);
}
function sortNumber(a, b) {
  return b - a;
}
function sortNumberVal(a, b) {
  return sortNumber(a.value, b.value);
}

function sortTable(){
  var values = [];
  var rows = document.querySelectorAll("table.sortable > tbody > tr");
  for(let index=0;index<rows.length;index++){
    var node = rows[index].cells[6].innerHTML;
    values.push({ value: node, row: rows[index] });
  }
  values.sort(sortNumberVal);

  for (var idx = 0; idx < values.length; idx++) {
    document.getElementById('table_body').appendChild(values[idx].row);
}

}



const exampleSparkline = document.getElementById('example-sparkline')
Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3])