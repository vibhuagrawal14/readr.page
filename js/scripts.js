var bod = document.getElementsByTagName('body')[0]
var head = document.getElementsByTagName('h1')[0]
var sources = {"machinelearning":"reddit", "hackernews":"hn", "programming":"reddit"}
var keys = Object.keys(sources)
if(readCookie('sources'))
  sources = JSON.parse(readCookie('sources'));
if(readCookie('keys'))
  keys = JSON.parse(readCookie('keys'));

function changeColor(color){
  document.documentElement.style.setProperty('--colorOne', color);
  createCookie('textColorOne', color, 10 * 365 * 24 * 60 * 60);
}



var modal = document.getElementById("feed-selector-model");
var btn = document.getElementById("feed-selector-open");
var span = document.getElementsByClassName("done")[0];
btn.onclick = function() {
  modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
  window.location.reload();
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    window.location.reload();
  }
}


var myNodelist = document.getElementsByTagName("li");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("span");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}
function populateInitialList(){
  for (i=0;i<keys.length;i++){
    ul_element = document.getElementById("feeds")
    listItem = document.createElement('li');
    listItem.className = "feed-li"
    listItem.innerHTML = keys[i];
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.addEventListener("click", deleteElement);
    span.appendChild(txt);
    listItem.appendChild(span);
    ul_element.appendChild(listItem);
  }
}
populateInitialList();


function deleteElement(){
    var div = this.parentElement;
    txt = div.innerText;
    txt = txt.substring(0, txt.length-2);
    delete sources[txt];
    keys.splice(keys.findIndex(obj => obj==txt), 1);
    div.style.display = "none";
    createCookie("sources",JSON.stringify(sources), 100)
    createCookie("keys",JSON.stringify(keys), 100)
  }

// Create a new list item when clicking on the "Add" button
function newElement() {
  var inputValue = document.getElementById("feed-text-box").value;
    if (inputValue === '') {
    alert("Please enter hackernews or a subreddit's name");
  } 
  else if (keys.includes(inputValue)){
    alert(inputValue + " already exists!");
  }
  else {
  var li = document.createElement("li");
  li.className = "feed-li"
  var t = document.createTextNode(inputValue);
  keys.push(inputValue);
  if (inputValue!="hackernews")
    sources[inputValue] = "reddit";
  else
    sources[inputValue] = "hn";
  li.appendChild(t);
    document.getElementById("feeds").appendChild(li);
  }
  document.getElementById("feed-text-box").value = "";

  var span = document.createElement("span");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  span.addEventListener("click", deleteElement);
  createCookie("sources",JSON.stringify(sources), 100);
  createCookie("keys",JSON.stringify(keys), 100)
}

function buildFeedContainers() {
  for(var i=0;i<keys.length;i++){
    var feedBox = document.createElement('div')
    feedBox.className = "feedBox"
    
    var feedTitle = document.createElement('div')
    feedTitle.id = keys[i]
    feedTitle.className = "feedTitle"
    feedTitle.innerHTML = keys[i]
    
    var feed = document.createElement('div')
    feed.className = "feed"
    feed.id = keys[i]+"feed"
    bod.appendChild(feedBox).append(feedTitle,feed)
  }  
}
buildFeedContainers()

var footer = document.createElement('div')
footer.className = "footer"
footer.id = "footer"
bod.appendChild(footer)

footer = document.getElementById('footer')
var madeWithLove = document.createElement('span')
madeWithLove.className = "footer-text"
madeWithLove.innerHTML = "made with <3 by <a href='https://www.vibhuagrawal.com'>vibhu agrawal</a><br>"
footer.appendChild(madeWithLove);

appendCirclesTo = document.getElementById('footer')

var colors = ["mediumseagreen", "tomato", "cornflowerblue", "orchid"]
var circleDiv = document.createElement('div');
circleDiv.className = "circle-div";
circleDiv.style["margin-top"] = "0.5vh"
appendCirclesTo.appendChild(circleDiv);

for (var i=0;i<colors.length/2;i++){
  var circle = document.createElement('span')
  circle.className = "dot"
  circle.style["background-color"] = colors[i];
  circle.addEventListener("click", function(){changeColor(this.style["background-color"])});
  circleDiv.appendChild(circle);
}

var githubIconDiv = document.createElement('button');
var githubIcon = document.createElement('i');
githubIcon.className = "fa fa-github";
githubIcon.style["font-size"] = "2em";
githubIcon.style["color"] = "white";
githubIcon.onclick = function(){location.href='https://github.com/vibhuagrawal14/readr.page';}
if(window.innerHeight < window.innerWidth){
  githubIcon.style["font-size"] = "1.3em";
}
githubIconDiv.appendChild(githubIcon);
circleDiv.appendChild(githubIconDiv);

for (var i=colors.length/2;i<colors.length;i++){
  var circle = document.createElement('span')
  circle.className = "dot"
  circle.style["background-color"] = colors[i];
  circle.addEventListener("click", function(){changeColor(this.style["background-color"])});
  circleDiv.appendChild(circle);
}



function getRedditData(j){
  listData[j] = [];
  linkData[j] = [];
  commentData[j] = [];
  upsData[j] = [];
  url = "https://www.reddit.com/r/"+keys[j]+".json?limit=25&after=" + redditAfter[j];
  if (sources[keys[j]]=="reddit"){
    fetch(url, requestOptionsReddit)
    .then(response => response.text())
    .then(result => {obj = JSON.parse(result);})
    .then(() => {for (let i=0;i<obj.data.children.length; i++){
      if(!obj.data.children[i].data.stickied){
        listData[j].push(obj.data.children[i].data.title);
        linkData[j].push(obj.data.children[i].data.url);
        commentData[j].push("https://reddit.com"+obj.data.children[i].data.permalink);
        upsData[j].push(obj.data.children[i].data.ups);
        redditAfter[j]=obj.data.after; }
      }})
    .then(()=>{makeRedditList(j, keys[j]+"feed", listData[j], linkData[j],commentData[j], upsData[j]);})}
}

function makeRedditList(j, id, listTitles, listLinks, listComments, listUpvotes) {
  loadMoreButton = document.getElementById(id+"loadMoreButton"+String(j));
    //remove current load more button. add one at the end.
  if(loadMoreButton){
    loadMoreButton.parentElement.removeChild(loadMoreButton);
    listElement = document.getElementById("ul-container" + id + String(j));
  }
  else
  {
    listElement = document.createElement('ul');
    listElement.id = "ul-container" + id + String(j);
  }
  listContainer = document.createElement('div');
  numberOfListItems = listTitles.length;

  document.getElementById(id).appendChild(listContainer);
  listContainer.appendChild(listElement);

  for (k = 0; k < numberOfListItems; ++k) {
    listItem = document.createElement('li');
    listItem.innerHTML = "<div class='redditindex'>"+ numToStr(listUpvotes[k]) +"</div><div class ='reddittext'><a href='"+listLinks[k]+"' target='_blank'>" + listTitles[k]+"</a></div>"
    + " <div class='redditcomment'><a href='"+ listComments[k]+"' target='_blank'>\"</a></div><div style=\"clear:both; font-size:1px;\"></div>";

    listElement.appendChild(listItem);
  }

  loadMoreButton = document.createElement('button')
  loadMoreButton.innerHTML = "load more";
  loadMoreButton.id = id+"loadMoreButton"+String(j)
  loadMoreButton.style["text-align"] = "center";
  loadMoreButton.style["padding-bottom"] = "5px";
  loadMoreButton.style["margin"] = "0px";
  loadMoreButton.addEventListener("click", function(){getRedditData(j)});
  listElement.appendChild(loadMoreButton);
}

function getHackerNewsData(){
  listUpvotes = {};
  listLinks = {};
  listTitles = {};
  listComments = {};
  ids = {};
  var promises = [];
  var indexVar = 0;
  for (k = 0; k < 15; ++k) {
    var obj1;
    promises.push(fetch("https://hacker-news.firebaseio.com//v0/item/" +String(hnItems[hnCurrIndex+k]) + ".json", firebaseConfig)
    .then(response => response.text())
    .then(result => {obj1 = JSON.parse(result);})
    .then(()=>{listUpvotes[obj1.id]=obj1.score;
               listTitles[obj1.id]=obj1.title;
               listLinks[obj1.id]=obj1.url;
               ids[obj1.id]=obj1.id;
               listComments[obj1.id]="https://news.ycombinator.com/item?id="+String(obj1.id);
                if(listLinks[obj1.id]==null) listLinks[obj1.id]=listComments[obj1.id];}));
  }
  Promise.all(promises)
  .then(()=>{makeHackerNewsList(listUpvotes, listLinks, listTitles, listComments, ids)});
}

function makeHackerNewsList(listUpvotes, listLinks, listTitles, listComments, ids) {
  loadMoreButton = document.getElementById("hn" + "loadMoreButton");
    //remove current load more button. add one at the end.
  if(loadMoreButton){
    loadMoreButton.parentElement.removeChild(loadMoreButton);
    listElement = document.getElementById("ul-container" + "hn");
  }
  else
  {
    listElement = document.createElement('ul');
    listElement.id = "ul-container" + "hn";
  }
  listContainer = document.createElement('div');
  numberOfListItems = 15;

  document.getElementById("hackernewsfeed").appendChild(listContainer);
  listContainer.appendChild(listElement);
  for (k = 0; k < numberOfListItems; ++k) {
    listItem = document.createElement('li');
    listItem.innerHTML = "<div class='redditindex'>"+ numToStr(listUpvotes[hnItems[hnCurrIndex+k]]) +"</div><div class ='reddittext'><a href='"+listLinks[hnItems[hnCurrIndex+k]]+"' target='_blank'>" + listTitles[hnItems[hnCurrIndex+k]]+"</a></div>"
    + " <div class='redditcomment'><a href='"+ listComments[hnItems[hnCurrIndex+k]]+"' target='_blank'>\"</a></div><div style=\"clear:both; font-size:1px;\"></div>";
    listElement.appendChild(listItem);
  }


  loadMoreButton = document.createElement('button')
  loadMoreButton.innerHTML = "load more";
  loadMoreButton.id = "hn" + "loadMoreButton";
  loadMoreButton.style["text-align"] = "center";
  loadMoreButton.style["padding-bottom"] = "5px";
  loadMoreButton.style["margin"] = "0px";
  loadMoreButton.addEventListener("click", function(){getHackerNewsData()});
  listElement.appendChild(loadMoreButton);
  hnCurrIndex += numberOfListItems;

}

var requestOptionsReddit = {
  method: 'GET',
  redirect: 'follow'
};
var firebaseConfig = {
  apiKey: "AIzaSyBzMQ6H_p_idy5d8AfUPryi--lz0Tyx9uQ",
  authDomain: "onepagehn.firebaseapp.com",
  databaseURL: "https://onepagehn.firebaseio.com",
  projectId: "onepagehn",
  storageBucket: "onepagehn.appspot.com",
  messagingSenderId: "815262719331",
  appId: "1:815262719331:web:1bc09bb406c915f6a54756"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var obj;
var obj1;
var hnItems;
var hnCurrIndex=0;
listData={};
linkData={};
commentData={};
upsData={}
numComments={};
redditAfter={};

for (let j=0; j<keys.length; j++) {
  if (sources[keys[j]]=="reddit"){
    redditAfter[j]=null;
    getRedditData(j);
  }
  else if (sources[keys[j]]=="hn"){
    fetch("https://hacker-news.firebaseio.com//v0/topstories.json", firebaseConfig)
    .then(response => response.text())
    .then(result => {hnItems = JSON.parse(result)})
    .then(() => {getHackerNewsData()});
    
  }
}

function numToStr(num){
  if (num<=999)
    return String(num);
  else{
    num = Math.round(num/1000);
    num = String(num);
    return num+ "k" ;
  }
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name,"",-1);
}


if(readCookie('textColorOne'))
  changeColor(readCookie("textColorOne"))
