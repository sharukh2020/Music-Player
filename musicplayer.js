// getting list-section,player-section and audio,image,title-element,artist-element inside player section
var list=document.getElementById('list-section')
var player=document.getElementById('player-section')
var playerAudioSong=document.getElementById('player-audio')
var playerImage=document.getElementById('player-image')
var playerTitle=document.getElementById('player-title')
var playerArtist=document.getElementById('player-artist')

// function to upadte src of audio and img ,innerText of title-element and artist-element
function playerDataUpdate(obj){

    timeUpdtShower.style.width="0px"
    playerAudioSong.src=obj.file
    playerImage.src=obj.albumCover
    playerTitle.innerText=obj.track
    playerArtist.innerText=obj.artist
    var currentObjPosToBeStoredInLs=Number(obj.id)-1
    localStorage.setItem("current-obj-pos",currentObjPosToBeStoredInLs)
   
}

// function to create list-elements inside list-section
function createListElems(obj){

   var listElem=document.createElement('div')
   listElem.className='list-elems'
   listElem.id=obj.id
    
   var listElemImage=document.createElement('img')
   listElemImage.src=obj.albumCover
   listElem.appendChild(listElemImage)

   var listTextElems=document.createElement('div')
   listElem.appendChild(listTextElems)

   var listElemTitle=document.createElement('h4')
   listElemTitle.innerText=obj.track
   listTextElems.appendChild(listElemTitle)

   var listElemArtist=document.createElement('p')
   listElemArtist.innerText=obj.artist
   listTextElems.appendChild(listElemArtist)

   listElemImage.onclick=function(){
        playerDataUpdate(obj)
        playerAudioSong.play()
        playAndpause("none","inline")
   }

   return listElem
}

// getting data from backend and using it for creating list-elems inside list-section
var ListDetails;

var xhttp=new XMLHttpRequest()
xhttp.open("GET","https://5dd1894f15bbc2001448d28e.mockapi.io/playlist",true)
xhttp.onreadystatechange=function(){

    if(this.readyState===4){

        ListDetails=JSON.parse(this.responseText)

        playerDataUpdate(ListDetails[0])

         for(var i=0;i<ListDetails.length;i++){
            list.appendChild(createListElems(ListDetails[i]))
        }
    }
}
xhttp.send()

// <---------------------functionality for connecting the time-update-shower movement and audio-curentTime----------------> 
// <---------------------functionality for audio to be played after current-audio ends------------------------>

var timeUpdtShowerContainer=document.getElementById('time-update-shower-container')
var timeUpdtShower=document.getElementById('time-update-shower')
var widthOfTUSC=Number(window.getComputedStyle(timeUpdtShowerContainer,null).getPropertyValue('width').split("p")[0])

playerAudioSong.ontimeupdate=function(){

   // movement of time-upadte-shower with respect to the audio-currentTime  
    timeUpdtShower.style.width=((playerAudioSong.currentTime/playerAudioSong.duration)*(widthOfTUSC))+"px"

    // audio to be played after current-audio ends
    if(playerAudioSong.currentTime===playerAudioSong.duration){

         var currentSongId=localStorage.getItem("current-obj-pos")
         playerDataUpdate(ListDetails[Number(currentSongId)+1])
         displayValueOfControlBtns([4,"inline"],[3,"none"])
         playerAudioSong.play()

    }

// when onclick event is triggerred for time-upadte-shower-container, width of time-update-shower will be changed   
    timeUpdtShowerContainer.onclick=function(e){

        timeUpdtShower.style.width=e.offsetX+"px"

        // change of audio-currentTime with respect to the changing width of time-update-shower
        var widthOfTUS=Number(window.getComputedStyle(timeUpdtShower,null).getPropertyValue('width').split("p")[0])
        playerAudioSong.currentTime=(widthOfTUS/widthOfTUSC)*playerAudioSong.duration

    }
}

// <----------------------------------functionality for player control buttons------------------------------------>

// getting control buttons
var getcontrolBtns=document.getElementsByTagName('i')

// function to change display-values of control buttons when onclick event is triggerred for one of them
function displayValueOfControlBtns(){
    var argumentsArr=[]
    for(var i=0;i<arguments.length;i++){
          argumentsArr.push(arguments[i])
    }
    for(var i=0;i<argumentsArr.length;i++){
        getcontrolBtns[argumentsArr[i][0]].style.display=argumentsArr[i][1]
    }
}

function playAndpause(play,pause){
    displayValueOfControlBtns([3,play],[4,pause])
}

// this is play button
getcontrolBtns[3].onclick=function(){
    playerAudioSong.play()
    playAndpause("none","inline")
}

// this is pause button
getcontrolBtns[4].onclick=function(){
    playerAudioSong.pause()
    playAndpause("inline","none")
}

// function for audio to be played when onclick function is triggerred for next and prev buttons
function audioToBePlayedOnClick(num){
    var currentSongId=localStorage.getItem("current-obj-pos")
    playerDataUpdate(ListDetails[Number(currentSongId)+num])
    playerAudioSong.play()
}

// this is next button
getcontrolBtns[5].onclick=function(){
    displayValueOfControlBtns([4,"inline"],[3,"none"])
    audioToBePlayedOnClick(1)
}

// this is prev button
getcontrolBtns[2].onclick=function(){
    displayValueOfControlBtns([4,"inline"],[3,"none"])
    audioToBePlayedOnClick(-1)
}

// function for audio to be played when repeat button has been clicked and current-audio ends
function audioToPlayafterOneAudioEnd (num){
    playerAudioSong.ontimeupdate=function(){
        if(playerAudioSong.currentTime===playerAudioSong.duration){
           audioToBePlayedOnClick(num)
       }
     }   
}

// this is repeat buttton
getcontrolBtns[0].onclick=function(){
    displayValueOfControlBtns([0,"none"],[1,"inline"],[6,"inline"],[7,"none"])
    audioToPlayafterOneAudioEnd(0)
}

// this is cancel-repeat button 
getcontrolBtns[1].onclick=function(){
    displayValueOfControlBtns([0,"inline"],[1,"none"])
    audioToPlayafterOneAudioEnd(1)
}

// this is shuffle button
getcontrolBtns[6].onclick=function(){
    displayValueOfControlBtns([6,"none"],[7,"inline"],[0,'inline'],[1,"none"])
    playerAudioSong.ontimeupdate=function(){
       if(playerAudioSong.currentTime===playerAudioSong.duration){
        playerDataUpdate(ListDetails[Math.floor(Math.random()*9)])
        playerAudioSong.play()
      }
    }   
}

// this is cancel-shuffle button
getcontrolBtns[7].onclick=function(){
    displayValueOfControlBtns([6,"inline"],[7,"none"])
    audioToPlayafterOneAudioEnd(1)
}

