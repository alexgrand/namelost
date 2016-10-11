$(function(){
  var tank = $('#playerTank');
  var obstacles = {};
  // помещаю препятствия. пока вручную/
  putProp(obstacles,'gameWindow',$('.gameWindow'));
  putProp(obstacles,'block',$('#b0'));
  putProp(obstacles,'block',$('#b1'));
  putProp(obstacles,'block',$('#b2'));
  putProp(obstacles,'block',$('#b3'));


  $('html').keydown(function(eventObject){
    var keyPress = eventObject.which;
    var keys = {
      movements: [37,38,39,40],
      pause: [19]
    };
    for(var k in keys){
      for(var i=0;i<keys[k].length;i++){
        if(keyPress==keys[k][i]){
         if(k=='movements'){
           tankMove(keyPress,tank);
         }
        }
      }
    }
  });
  function checkProp(obj,prop){
    for(var key in obj){
      if (key==prop){
        return true;
      }
    }
    return false;
  }
  function putProp (obj,prop,value){
    var i = 0;
    var propName = prop;
    while(checkProp(obj,prop)){
      prop=propName;
      i++;
      prop+=i;
    }
    obj[prop]=value;
  }
  function permissionMove(tank,tankPos) {
    var permission = [true,true,true,true];
    var tankSides=[tankPos.left,tankPos.top,
        (tankPos.left+tank.width()),
        (tankPos.top+tank.height())];
    for (var key in obstacles){
      var obs = obstacles[key];
      var obsPos = obs.position();
      var obSides=[(obsPos.left+obs.width()),(obsPos.top+obs.height()),obsPos.left,obsPos.top];
      if(key=='gameWindow'){
        var windowSides = [obSides[2],obSides[3],obSides[0],obSides[1]];
        for(var i=0;i<permission.length;i++){
          if(tankSides[i]===windowSides[i]){
            permission[i]=false;
          }
        }
      } else  {
        var sidesLR = (tankSides[1]<=obSides[1])&&
              (tankSides[3]>=obSides[3])||
              (tankSides[1]>=obSides[3])&&
              (tankSides[1]<=obSides[3]);
        var sidesTB = (tankSides[0]<=obSides[0])&&
              (tankSides[2]>=obSides[2])||
              (tankSides[0]>=obSides[2])&&
              (tankSides[0]<=obSides[2]);
        for (var z = 0; z < permission.length; z++) {
          if (z===0||z===2) {
            if (tankSides[z]===obSides[z]) {
              if (sidesLR) {
                permission[z]=false;
              }
            }
          } else if(z===1||z===3){
            if (tankSides[z]===obSides[z]){
              if (sidesTB) {
                permission[z]=false;
              }
            }
          }
        }
      }
    }
    return permission;
  }
  function tankMove (keyPress,tank){
    var key = [37,38,39,40];
    var tankPos = tank.position();
    var tankMove = [
      ['left',(tankPos.left-1)],
      ['top',(tankPos.top-1)],
      ['left',(tankPos.left+1)],
      ['top',(tankPos.top+1)]
    ];
    var permMove = permissionMove(tank,tankPos);
    for(var y=0;y<permMove.length; y++){
      if(permMove[y]===false){
        key[y]='';
      }
    }
    for(var i=0; i<key.length; i++){
      if(keyPress===key[i]){
        tank.css(tankMove[i][0],tankMove[i][1]);
      }
    }
  }
});
