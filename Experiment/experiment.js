var clock;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 1000;
var mirror;
var centerDot;
var focusDot;
var poleDot;
var principalAxis;
var image;
var object;
var focus=7.5;
var length=3;
var ray=[];
var shinySurface=[];
var animateRays=[];
var speed=1;
var lastX=0;
var counter=1;
var tex;
var count1;
var objectTex;
var assessmentFlag=0;
var question=[];
var option1;
var option2;
var option3;
var option4;
var questionCounter=1;
var optionHit=0;
var objectDist=[];
var objectHeight=[];
var arrows=[];
//Initialising the scene
function initialiseScene()
{
    clock=new THREE.Clock();
    PIEscene.add(new THREE.AmbientLight(0x606060));
    PIEscene.background=new THREE.Color( 0xbfd1e5 );
    PIEsetCameraFOV(45);
    PIEsetCameraAspect(ASPECT);
    PIEsetCameraDepth(FAR);
    PIEadjustCamera(0,0,80);

    var principalAxisMaterial = new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
    var principalAxisGeometry = new THREE.Geometry();
    principalAxisGeometry.vertices.push(new THREE.Vector3( -50, 0, 0));
    principalAxisGeometry.vertices.push(new THREE.Vector3( 50, 0, 0));
    principalAxis=new THREE.Line( principalAxisGeometry, principalAxisMaterial );
    PIEaddElement(principalAxis);

    tex = THREE.ImageUtils.loadTexture( 'texture/concave.jpeg' );
    var mirrorMaterial=new THREE.MeshBasicMaterial(
      {
        shading: THREE.SmoothShading,
        map:tex,
        side: THREE.FrontSide,
        transparent: true,
        opacity: 0.8
      }
    );
    var mirrorGeometry = new THREE.RingGeometry( 15, 15.8, 30,8,-Math.PI/4,2*Math.PI/4 );
    //var mirrorMaterial = new THREE.MeshBasicMaterial( { color: "blue"}); //side: THREE.DoubleSide } );
    mirror=new THREE.Mesh( mirrorGeometry, mirrorMaterial );
    PIEaddElement(mirror);
    //PIEdragElement(mirror);

    var geometryDot = new THREE.CircleBufferGeometry( 0.3, 32 );
    var materialDot = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    centerDot = new THREE.Mesh( geometryDot, materialDot );
    centerDot.position.set(0,0,0);
    PIEaddElement( centerDot );

    focusDot=new THREE.Mesh( geometryDot, materialDot );
    focusDot.position.set(7.5,0,0);
    PIEaddElement(focusDot);

    poleDot=new THREE.Mesh( geometryDot, materialDot );
    poleDot.position.set(15,0,0);
    PIEaddElement(poleDot);

    var loader = new THREE.FontLoader();
    loader.load("optimer.json", function(response)
    {
        font = response;

        var geometry = new THREE.TextGeometry("C", {
            font : font,
            size : 1,
            height : 10,
            curveSegments : 3
        });

        labelC=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:"black"}));
        labelC.translation = geometry.center();

        PIEaddElement(labelC);
        labelC.position.set(centerDot.position.x,-1.5,0);
        labelC.lookAt(PIEcamera.position);

        var geometry = new THREE.TextGeometry("F", {
            font : font,
            size : 1,
            height : 10,
            curveSegments : 3
        });

        labelF=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:"black"}));
        labelF.translation = geometry.center();

        PIEaddElement(labelF);
        labelF.position.set(focusDot.position.x,-1.5,0);
        labelF.lookAt(PIEcamera.position);

        var geometry = new THREE.TextGeometry("P", {
            font : font,
            size : 1,
            height : 10,
            curveSegments : 3
        });

        labelP=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:"black"}));
        labelP.translation = geometry.center();

        PIEaddElement(labelP);
        labelP.position.set(poleDot.position.x,-1.5,0);
        labelP.lookAt(PIEcamera.position);

    });

    objectTex = THREE.ImageUtils.loadTexture( 'texture/candle.gif' );
    addObject(0,length,false);
    //object.position.x=0;
    PIEdragElement(object);
    PIEsetDragStart(object,function(){
      PIEremoveElement(image);
      PIErender();
      for(var i=ray.length-1;i>=0;i--)
      {
        PIEremoveElement(ray[i]);
        ray.pop();
      }
      for(var i=arrows.length-1;i>=0;i--)
      {
        PIEremoveElement(arrows[i]);
        arrows.pop();
      }
     });
    PIEsetDragEnd(object,function(){
          var d=object.position.x;
          PIEremoveDragElement(object);
          PIEremoveElement(object);
          addObject(d,length,false);
          PIEdragElement(object);
          PIEsetDragStart(object,function(){
            PIEremoveElement(image);
            PIErender();
            for(var i=ray.length-1;i>=0;i--)
            {
              PIEremoveElement(ray[i]);
              ray.pop();
            }
            for(var i=arrows.length-1;i>=0;i--)
            {
              PIEremoveElement(arrows[i]);
              arrows.pop();
            }
           });
          PIEsetDragEnd(object,function(){
            object.position.y=length/2;
              if(object.position.x>=poleDot.position.x-1)
              {
                object.position.x=poleDot.position.x-1;
              }
              PIEchangeInputSlider("Object Distance From Pole",Math.abs(object.position.x-poleDot.position.x));
              for(var i=ray.length-1;i>=0;i--)
              {
                PIEremoveElement(ray[i]);
                ray.pop();
              }
              for(var i=arrows.length-1;i>=0;i--)
              {
                PIEremoveElement(arrows[i]);
                arrows.pop();
              }
              //updateTable();
              PIErender();
              formRay();
              //showImageText();
              changeImageCoords();
          });
      object.position.y=length/2;
        if(object.position.x>=poleDot.position.x-1)
        {
          object.position.x=poleDot.position.x-1;
        }
        PIEchangeInputSlider("Object Distance From Pole",Math.abs(object.position.x-poleDot.position.x));
        for(var i=ray.length-1;i>=0;i--)
        {
          PIEremoveElement(ray[i]);
          ray.pop();
        }
        for(var i=arrows.length-1;i>=0;i--)
        {
          PIEremoveElement(arrows[i]);
          arrows.pop();
        }
        //updateTable();
        PIErender();
        formRay();
        //showImageText();
        changeImageCoords();
    });

    imageTex = THREE.ImageUtils.loadTexture( 'texture/candle.gif' );
    addImage(0,length,true);
    // setText();
    // setText1();
    // setTextC();
    // setTextF();
    // setTextP();
    //printText(0);
    //showImageText();
    formRay();
    //completeMirror();

    // var material=new THREE.LineBasicMaterial( { color: "green",linewidth:2} );
    // var geometry = new THREE.Geometry();
    // geometry.vertices.push(new THREE.Vector3(1,0,0));
    // geometry.vertices.push(new THREE.Vector3(1,0,0));
    // animateRays.push(new THREE.Line(geometry,material));
    // PIEaddElement(animateRays[animateRays.length-1]);

    PIEcreateTable("Observation Table", 7,6, true);
    var headerRow=["S.No."," Object </br>Position ","Size</br>of</br>Object"," Image </br>Position ","Size</br>of</br>Image","Focal</br>Length"];//" Nature </br>of</br> Image ", " Orientation </br>of</br> Image ", "Comparison </br>of Image</br>with object"];
    PIEupdateTableRow(0, headerRow);
    PIEupdateTableCell(1, 0, "1.");
    PIEupdateTableCell(1, 1, "15");
    PIEupdateTableCell(1, 2, length);
    PIEupdateTableCell(1, 3, "15");
    PIEupdateTableCell(1, 4, length);
    PIEupdateTableCell(1, 5, "7.5");
    // PIEupdateTableCell(1, 6, "Real");
    // PIEupdateTableCell(1, 7, "Inverted");
    // PIEupdateTableCell(1, 8, "Same Size");
    objectDist.push(15);
    objectHeight.push(length);
    row=document.getElementsByTagName('tr');
    for(var i=1;i<row.length;i++)
    {
      row[i].align='center';
    }
    counter+=1;
    // document.getElementById("F").innerHTML="<h2>F</h2>";
    // document.getElementById("C").innerHTML="<h2>C</h2>";
    // document.getElementById("P").innerHTML="<h2>P</h2>";
    loadTexture();
    PIErender();
}

function loadExperimentElements()
{
    PIEsetExperimentTitle("Image formation by a concave mirror");
    PIEsetDeveloperName("Rahul Raj");
    document.title = "Image formation by a concave mirror";
    PIEsetAreaOfInterest(-60, 30, 60, -30);
    //PIEhideControlElement();
    initialiseHelp();
    initialiseInfo();
    //updateExperimentElements();
    initialiseScene();
    initialiseControls();
    //updateExperimentElements();
    //resetExperiment();
}

function loadTexture()
{
  id=requestAnimationFrame(loadTexture);
  if(count1>=25)
  {
    count1=0;
    cancelAnimationFrame(id);
  }
  count1++;
  PIErender();
}

function updateExperimentElements(t,dt)
{

  // PIEremoveElement(animateRays[0]);
  // animateRays.pop();
  // PIErender();
  //
  // var material=new THREE.LineBasicMaterial( { color: "green",linewidth:2} );
  // var geometry = new THREE.Geometry();
  // var newX=lastX+speed*dt/1000;
  // lastX=newX;
  // geometry.vertices.push(new THREE.Vector3(object.position.x,length+1,0));
  // geometry.vertices.push(new THREE.Vector3(newX,length+1,0));
  // animateRays.push(new THREE.Line(geometry,material));
  // PIEaddElement(animateRays[animateRays.length-1]);

}

function setText()
{
  var bb3="font-family:Monospace; color:#000000; margin:0px; overflow:hidden;font-size:20px;"
  var text=document.createElement("p");
  text.setAttribute("id","hello");
  text.style=bb3;
  document.body.appendChild(text);
  text.style.position="absolute";
  text.style.left=15+'%';
  text.style.top=75+'%';
}

function setTextF()
{
  var bb3="font-family:Monospace; color:black; margin:0px; overflow:hidden;font-size:15px;"
  var text=document.createElement("p");
  text.setAttribute("id","F");
  text.style=bb3;
  document.body.appendChild(text);
  text.style.position="absolute";
  text.style.left=58+'%';
  text.style.top=50+'%';
}

function setTextC()
{
  var bb3="font-family:Monospace; color:black; margin:0px; overflow:hidden;font-size:15px;"
  var text=document.createElement("p");
  text.setAttribute("id","C");
  text.style=bb3;
  document.body.appendChild(text);
  text.style.position="absolute";
  text.style.left=50+'%';
  text.style.top=50+'%';
}

function setTextP()
{
  var bb3="font-family:Monospace; color:black; margin:0px; overflow:hidden;font-size:15px;"
  var text=document.createElement("p");
  text.setAttribute("id","P");
  text.style=bb3;
  document.body.appendChild(text);
  text.style.position="absolute";
  text.style.left=66+'%';
  text.style.top=50+'%';
}

function setText1()
{
  var bb3="font-family:Monospace; color:#000000; margin:0px; overflow:hidden;font-size:20px;"
  var text=document.createElement("p");
  text.setAttribute("id","hello1");
  text.style=bb3;
  document.body.appendChild(text);
  text.style.position="absolute";
  text.style.left=10+'%';
  text.style.top=82+'%';
}

function showImageText()
{
  var v=findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus);
  var imageHeight=findImageSize(Math.abs(object.position.x-poleDot.position.x),length);
  v=v-poleDot.position.x;
  if(v==Infinity)
  {
    document.getElementById("hello1").innerHTML="<h2>Image is formed at infinity in the same side as that of object.</h2>";
  }
  else
  {
    if(v<0)
    {
        document.getElementById("hello1").innerHTML="<h2>Image is formed at a distance of "+Math.round(Math.abs(v)*100)/100+" units as the same side as that of object.</h2>";
    }
    else
    {
        document.getElementById("hello1").innerHTML="<h2>Image is formed at a distance of "+Math.round(v*100)/100+" units in the mirror.</h2>";
    }
  }
}

function findImageCoord(u,f)
{
  u=(-1)*u;
  f=(-1)*f;
  var v;
  v=u*f/(u-f);
  v=v+poleDot.position.x;
  return v;
}

function findImageSize(u,length)
{
  var v=findImageCoord(u,focus);
  u=(-1)*u;
  v=v-poleDot.position.x;
  var m=(-1)*v/u;
  return m*length;
}

function addImage(posX,length,inverted)
{
 // var material=new THREE.LineBasicMaterial( { color: "red",linewidth:2} );
 // var geometry=findGeometry(length,inverted);
 // image=new THREE.Line(geometry,material);
 // image.position.x=posX;
 // PIEaddElement(image);
 var imageMaterial=new THREE.MeshBasicMaterial(
   {
     shading: THREE.SmoothShading,
     map:imageTex,
     side: THREE.FrontSide,
     transparent: true,
     opacity: 1
   }
 );
 var len;
 if(length<0)
 {
   len=(-1)*length;
 }
 else {
   len=length;
 }
 var imageGeometry=new THREE.PlaneGeometry(1.5,len);
 image=new THREE.Mesh(imageGeometry, imageMaterial);
 image.position.x=posX;
 if(inverted==true)
 {
  image.position.y=(-1)*len/2;
  image.rotation.z=180*Math.PI/180;
 }
 else
 {
   image.position.y=len/2;
   image.rotation.z=0*Math.PI/180;
 }
 PIEaddElement(image);
}

function addObject(posX,length,inverted)
{
  // var material=new THREE.LineBasicMaterial( { color: "red",linewidth:2} );
  // var geometry=findGeometry(length,inverted);
  // object=new THREE.Line(geometry,material);
  // object.position.x=posX;
  // PIEaddElement(object);
  var objectMaterial=new THREE.MeshBasicMaterial(
    {
      shading: THREE.SmoothShading,
      map:objectTex,
      side: THREE.FrontSide,
      transparent: true,
      opacity: 1
    }
  );
  var len;
  if(length<0)
  {
    len=(-1)*length;
  }
  else {
    len=length;
  }
  var objectGeometry=new THREE.PlaneGeometry(1.5,len);
  object=new THREE.Mesh(objectGeometry, objectMaterial);
  object.position.x=posX;
  if(inverted==true)
  {
   object.position.y=(-1)*len/2;
   object.rotation.z=180*Math.PI/180;
  }
  else
  {
    object.position.y=len/2;
    object.rotation.z=0*Math.PI/180;
  }
  PIEaddElement(object);
}

function updateTable()
{
  if(object.position.x<poleDot.position.x && object.position.x>focusDot.position.x)
  {
    //console.log("Between F and P");
    // document.getElementById("update").innerHTML="Between";
    // document.getElementById("update2").innerHTML="F and P";
    // document.getElementById("update3").innerHTML="In the";
    // document.getElementById("update4").innerHTML="Mirror";
    PIEupdateTableCell(counter, 0,counter+".");
    PIEupdateTableCell(counter, 1,Math.abs(Math.round((object.position.x-poleDot.position.x)*10)/10));
    PIEupdateTableCell(counter, 2,Math.round(length*10)/10);
    PIEupdateTableCell(counter, 3,Math.round((findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus)-poleDot.position.x)*100)/100);
    PIEupdateTableCell(counter, 4,Math.round(findImageSize(Math.abs(object.position.x-poleDot.position.x),length)*100)/100 );
    PIEupdateTableCell(counter, 5,focus );
    // PIEupdateTableCell(counter, 6, "Virtual");
    // PIEupdateTableCell(counter, 7, "Erect");
    // PIEupdateTableCell(counter, 8, "Magnified");
    counter++;
  }
  else
  {
    if(object.position.x==focusDot.position.x)
    {
      //console.log("At F");
      // document.getElementById("update").innerHTML="At F";
      // document.getElementById("update2").innerHTML="";
      // document.getElementById("update3").innerHTML="At Infinity";
      // document.getElementById("update4").innerHTML="";
      //PIEupdateTableCell(1, 1, "At F");
      //PIEupdateTableCell(1, 2, "At Infinity");
      // PIEupdateTableCell(1, 3, "Real");
      // PIEupdateTableCell(1, 4, "Inverted");
      // PIEupdateTableCell(1, 5, "Magnified");
      PIEupdateTableCell(counter, 0,counter+".");
      PIEupdateTableCell(counter, 1,Math.abs(Math.round((object.position.x-poleDot.position.x)*10)/10));
      PIEupdateTableCell(counter, 2,Math.round(length*10)/10);
      PIEupdateTableCell(counter, 3,"Infinity");
      PIEupdateTableCell(counter, 4,findImageSize(Math.abs(object.position.x-poleDot.position.x),length) );
      PIEupdateTableCell(counter, 5,focus );
      // PIEupdateTableCell(counter, 6, "Real");
      // PIEupdateTableCell(counter, 7, "Inverted");
      // PIEupdateTableCell(counter, 8, "Magnified");
      counter++;
    }
    else
    {
      if(object.position.x<focusDot.position.x && object.position.x>centerDot.position.x)
      {
        //console.log("Between F and C");
        // document.getElementById("update").innerHTML="Between";
        // document.getElementById("update2").innerHTML="F and C";
        // document.getElementById("update3").innerHTML="Beyond C";
        // document.getElementById("update4").innerHTML="";
        //PIEupdateTableCell(1, 1, "Between \nF and C");
        //PIEupdateTableCell(1, 2, "Beyond C");
        // PIEupdateTableCell(1, 3, "Real");
        // PIEupdateTableCell(1, 4, "Inverted");
        // PIEupdateTableCell(1, 5, "Magnified");
        PIEupdateTableCell(counter, 0,counter+".");
        PIEupdateTableCell(counter, 1,Math.abs(Math.round((object.position.x-poleDot.position.x)*10)/10));
        PIEupdateTableCell(counter, 2,Math.round(length*10)/10);
        PIEupdateTableCell(counter, 3,Math.abs(Math.round((findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus)-poleDot.position.x)*100)/100));
        PIEupdateTableCell(counter, 4,Math.abs(Math.round(findImageSize(Math.abs(object.position.x-poleDot.position.x),length)*100)/100));
        PIEupdateTableCell(counter, 5,focus );
        // PIEupdateTableCell(counter, 6, "Real");
        // PIEupdateTableCell(counter, 7, "Inverted");
        // PIEupdateTableCell(counter, 8, "Magnified");
        counter++;
      }
      else
      {
        if(object.position.x==centerDot.position.x)
        {
          //console.log("At C");
          // document.getElementById("update").innerHTML="At C";
          // document.getElementById("update2").innerHTML="";
          // document.getElementById("update3").innerHTML="At C";
          // document.getElementById("update4").innerHTML="";
          // //PIEupdateTableCell(1, 1, "At C");
          // //PIEupdateTableCell(1, 2, "At C");
          // PIEupdateTableCell(1, 3, "Real");
          // PIEupdateTableCell(1, 4, "Inverted");
          // PIEupdateTableCell(1, 5, "Same Size");
          PIEupdateTableCell(counter, 0,counter+".");
          PIEupdateTableCell(counter, 1,Math.abs(Math.round((object.position.x-poleDot.position.x)*10)/10));
          PIEupdateTableCell(counter, 2,Math.round(length*10)/10);
          PIEupdateTableCell(counter, 3,Math.abs(Math.round((findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus)-poleDot.position.x)*100)/100));
          PIEupdateTableCell(counter, 4,Math.abs(Math.round(findImageSize(Math.abs(object.position.x-poleDot.position.x),length)*100)/100));
          PIEupdateTableCell(counter, 5,focus );
          // PIEupdateTableCell(counter, 6, "Real");
          // PIEupdateTableCell(counter, 7, "Inverted");
          // PIEupdateTableCell(counter, 8, "Same Size");
          counter++;
        }
        else
        {
          if(object.position.x<centerDot.position.x)
          {
            //console.log("Beyond C");
            // document.getElementById("update").innerHTML="Beyond C";
            // document.getElementById("update2").innerHTML="";
            // document.getElementById("update3").innerHTML="Between";
            // document.getElementById("update4").innerHTML="F and C";
            // //PIEupdateTableCell(1, 1, "Beyond C");
            // //PIEupdateTableCell(1, 2, "Between F and C");
            // PIEupdateTableCell(1, 3, "Real");
            // PIEupdateTableCell(1, 4, "Inverted");
            // PIEupdateTableCell(1, 5, "Diminished");
            PIEupdateTableCell(counter, 0,counter+".");
            PIEupdateTableCell(counter, 1,Math.abs(Math.round((object.position.x-poleDot.position.x)*10)/10));
            PIEupdateTableCell(counter, 2,Math.round(length*10)/10);
            PIEupdateTableCell(counter, 3,Math.abs(Math.round((findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus)-poleDot.position.x)*100)/100));
            PIEupdateTableCell(counter, 4,Math.abs(Math.round(findImageSize(Math.abs(object.position.x-poleDot.position.x),length)*100)/100));
            PIEupdateTableCell(counter, 5,focus );
            // PIEupdateTableCell(counter, 6, "Real");
            // PIEupdateTableCell(counter, 7, "Inverted");
            // PIEupdateTableCell(counter, 8, "Diminished");
            counter++;
          }
          // else
          // {
          //   PIEupdateTableCell(1, 1, "At Infinity");
          //   PIEupdateTableCell(1, 2, "At F");
          //   PIEupdateTableCell(1, 3, "Real");
          //   PIEupdateTableCell(1, 4, "Inverted");
          //   PIEupdateTableCell(1, 5, "Highly </br>Diminished");
          // }
        }
      }
    }
  }
  PIErender();
}

function findGeometry(length,inverted)
{
  var geometry = new THREE.Geometry();
  var x;
  //var Ilength;
  if(length<1)
  {
    x=0;
  }
  else
  {
    x=0.5;
  }

  geometry.vertices.push(new THREE.Vector3( 0, 0, 0));
  if(inverted==false)
  {
    geometry.vertices.push(new THREE.Vector3( 0, length, 0));
    geometry.vertices.push(new THREE.Vector3( -x, length-1, 0));
    geometry.vertices.push(new THREE.Vector3( 0, length, 0));
    geometry.vertices.push(new THREE.Vector3( x, length-1, 0));
    geometry.vertices.push(new THREE.Vector3( 0, length, 0));
  }
  else
  {
    if(length<1)
    {
        geometry.vertices.push(new THREE.Vector3( 0, (-1)*length, 0));
        geometry.vertices.push(new THREE.Vector3( 0, 0, 0));
    }
    else
    {
      geometry.vertices.push(new THREE.Vector3( 0, (-1)*length, 0));
      geometry.vertices.push(new THREE.Vector3( -x, (-1)*(length-1), 0));
      geometry.vertices.push(new THREE.Vector3( 0, (-1)*length, 0));
      geometry.vertices.push(new THREE.Vector3( x, (-1)*(length-1), 0));
      geometry.vertices.push(new THREE.Vector3( 0, (-1)*length, 0));
    }
  }
  return geometry;
}

function makeRay1()
{
  var material=new THREE.LineBasicMaterial( { color: "green",linewidth:2} );
  var geometry = new THREE.Geometry();
  var r=poleDot.position.x;
  var a=1;
  var b=0;
  var c1=length*length-r*r;
  var x1=(-b+Math.sqrt(b*b-4*a*c1))/2*a;
  var x2=(-b-Math.sqrt(b*b-4*a*c1))/2*a;
  var x=Math.max(x1,x2);
  geometry.vertices.push(new THREE.Vector3( object.position.x, length, 0));
  geometry.vertices.push(new THREE.Vector3( x, length, 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (2*object.position.x+x)/3, length, 0));
  geometry.vertices.push(new THREE.Vector3( (2*object.position.x+x)/3-0.5, length+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (2*object.position.x+x)/3, length, 0));
  geometry.vertices.push(new THREE.Vector3( (2*object.position.x+x)/3-0.5, length-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);

  var material=new THREE.LineBasicMaterial( { color: "orange",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( x, length, 0));
  geometry.vertices.push(new THREE.Vector3( findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus), findImageSize(Math.abs(object.position.x-poleDot.position.x),length), 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus);
  var y1=findImageSize(Math.abs(object.position.x-poleDot.position.x),length);
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (2*x+x1)/3, (2*length+y1)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x+x1)/3+0.5, (2*length+y1)/3+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x+x1)/3, (2*length+y1)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x+x1)/3+0.5, (2*length+y1)/3-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);
}

function makeRay2()
{
  var material=new THREE.LineBasicMaterial( { color: "green",linewidth:2} );
  var geometry = new THREE.Geometry();
  var slope=-length/(centerDot.position.x-object.position.x);
  var x=Math.abs(object.position.x-centerDot.position.x);
  var cos=x/Math.sqrt(x*x+length*length);
  var r=poleDot.position.x;
  geometry.vertices.push(new THREE.Vector3( object.position.x, length, 0));
  geometry.vertices.push(new THREE.Vector3(r*cos,slope*r*cos, 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=object.position.x;
  var y1=length;
  var x2=r*cos;
  var y2=slope*r*cos;
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3-0.5, (2*y1+y2)/3+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3-0.5, (2*y1+y2)/3-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);

  var material=new THREE.LineBasicMaterial( { color: "orange",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( r*cos,slope*r*cos, 0));
  geometry.vertices.push(new THREE.Vector3( findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus), findImageSize(Math.abs(object.position.x-poleDot.position.x),length), 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=r*cos;
  var y1=slope*r*cos;
  var x2=findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus);
  var y2=findImageSize(Math.abs(object.position.x-poleDot.position.x),length);
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3+0.5, (2*y1+y2)/3+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3+0.5, (2*y1+y2)/3-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);
}

function makeRay3()
{
  var material=new THREE.LineBasicMaterial( { color: "green",linewidth:2} );
  var geometry = new THREE.Geometry();
  var m=-length/(focusDot.position.x-object.position.x);
  var c=-m*focusDot.position.x;
  var r=poleDot.position.x;
  geometry.vertices.push(new THREE.Vector3( object.position.x, length, 0));
  geometry.vertices.push(new THREE.Vector3((findImageSize(Math.abs(object.position.x-poleDot.position.x),length)-c)/m,findImageSize(Math.abs(object.position.x-poleDot.position.x),length), 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=object.position.x;
  var y1=length;
  var x2=(findImageSize(Math.abs(object.position.x-poleDot.position.x),length)-c)/m;
  var y2=findImageSize(Math.abs(object.position.x-poleDot.position.x),length);
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3-0.5, (2*y1+y2)/3+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3-0.5, (2*y1+y2)/3-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);

  var material=new THREE.LineBasicMaterial( { color: "orange",linewidth:2} );
  var geometry1 = new THREE.Geometry();
  geometry1.vertices.push(new THREE.Vector3( (findImageSize(Math.abs(object.position.x-poleDot.position.x),length)-c)/m,findImageSize(Math.abs(object.position.x-poleDot.position.x),length), 0));
  geometry1.vertices.push(new THREE.Vector3( findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus), findImageSize(Math.abs(object.position.x-poleDot.position.x),length), 0));
  ray.push(new THREE.Line(geometry1,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=(findImageSize(Math.abs(object.position.x-poleDot.position.x),length)-c)/m;
  var y1=findImageSize(Math.abs(object.position.x-poleDot.position.x),length);
  var x2=findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus);
  var y2=findImageSize(Math.abs(object.position.x-poleDot.position.x),length);
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3+0.5, (2*y1+y2)/3+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3+0.5, (2*y1+y2)/3-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);
}

function formRay()
{
  // console.log("o"+object.position.x);
  // console.log("f"+focusDot.position.x);
  var d=Math.abs(object.position.x-poleDot.position.x);
  //console.log("d "+d);
  if(d>Math.abs(focusDot.position.x-poleDot.position.x))
  {
    if(Math.abs(object.position.x-centerDot.position.x)>length)
    {
      if(d<Math.abs(centerDot.position.x-poleDot.position.x))
      {
          makeRay1();
          makeRay2();
      }
      else
      {
        makeRay1();
        makeRay2();
        makeRay3();
      }
    }
    else
    {
      makeRay1();
      makeRay3();
    }
  }
  else
  {
    if(object.position.x==focusDot.position.x)
    {
      //console.log(object.position.x);
      //console.log(focusDot.position.x);
      makeParallelRays();
    }
    else
    {
      makeVirtualRay();
    }
  }
}

function makeParallelRays()
{
  var material=new THREE.LineBasicMaterial( { color: "green",linewidth:2} );
  var geometry = new THREE.Geometry();
  var r=poleDot.position.x;
  var a=1;
  var b=0;
  var c1=length*length-r*r;
  var x1=(-b+Math.sqrt(b*b-4*a*c1))/2*a;
  var x2=(-b-Math.sqrt(b*b-4*a*c1))/2*a;
  var x=Math.max(x1,x2);
  geometry.vertices.push(new THREE.Vector3( object.position.x, length, 0));
  geometry.vertices.push(new THREE.Vector3( x, length, 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=object.position.x;
  var y1=length;
  var x2=x;
  var y2=length;
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (3*x1+x2)/4, (3*y1+y2)/4, 0));
  geometry.vertices.push(new THREE.Vector3( (3*x1+x2)/4-0.5, (3*y1+y2)/4+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (3*x1+x2)/4, (3*y1+y2)/4, 0));
  geometry.vertices.push(new THREE.Vector3( (3*x1+x2)/4-0.5, (3*y1+y2)/4-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);

  var material=new THREE.LineBasicMaterial( { color: "orange",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( x, length, 0));
  var m=length/(x-focusDot.position.x);
  var c2=(-1)*m*focusDot.position.x;
  geometry.vertices.push(new THREE.Vector3(centerDot.position.x ,m*centerDot.position.x+c2 , 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=x;
  var y1=length;
  var x2=centerDot.position.x;
  var y2=m*centerDot.position.x+c2;
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3+0.5, (2*y1+y2)/3+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3+0.5, (2*y1+y2)/3-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);

  var material=new THREE.LineBasicMaterial( { color: "green",linewidth:2} );
  var geometry = new THREE.Geometry();
  var slope=-length/(centerDot.position.x-object.position.x);
  var x=Math.abs(object.position.x-centerDot.position.x);
  var cos=x/Math.sqrt(x*x+length*length);
  var r=poleDot.position.x;
  geometry.vertices.push(new THREE.Vector3( object.position.x, length, 0));
  geometry.vertices.push(new THREE.Vector3(r*cos,slope*r*cos, 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=object.position.x;
  var y1=length;
  var x2=r*cos;
  var y2=slope*r*cos;
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3-0.5, (2*y1+y2)/3+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3-0.5, (2*y1+y2)/3-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);

  var material=new THREE.LineBasicMaterial( { color: "orange",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( r*cos,slope*r*cos, 0));
  geometry.vertices.push(new THREE.Vector3( centerDot.position.x, 0, 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=r*cos;
  var y1=slope*r*cos;
  var x2=centerDot.position.x;
  var y2=0;
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3+0.5, (2*y1+y2)/3+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3+0.5, (2*y1+y2)/3-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);
}

function makeVirtualRay()
{
  var material=new THREE.LineBasicMaterial( { color: "green",linewidth:2} );
  var geometry = new THREE.Geometry();
  var r=poleDot.position.x;
  var a=1;
  var b=0;
  var c1=length*length-r*r;
  var x1=(-b+Math.sqrt(b*b-4*a*c1))/2*a;
  var x2=(-b-Math.sqrt(b*b-4*a*c1))/2*a;
  var x=Math.max(x1,x2);
  geometry.vertices.push(new THREE.Vector3( object.position.x, length, 0));
  geometry.vertices.push(new THREE.Vector3( x, length, 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=object.position.x;
  var y1=length;
  var x2=x;
  var y2=length;
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (3*x1+x2)/4, (3*y1+y2)/4, 0));
  geometry.vertices.push(new THREE.Vector3( (3*x1+x2)/4-0.5, (3*y1+y2)/4+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (3*x1+x2)/4, (3*y1+y2)/4, 0));
  geometry.vertices.push(new THREE.Vector3( (3*x1+x2)/4-0.5, (3*y1+y2)/4-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);

  var material=new THREE.LineBasicMaterial( { color: "orange",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( x, length, 0));
  var m=length/(x-focusDot.position.x);
  var c2=(-1)*m*focusDot.position.x;
  geometry.vertices.push(new THREE.Vector3(centerDot.position.x ,m*centerDot.position.x+c2 , 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=x;
  var y1=length;
  var x2=centerDot.position.x;
  var y2=m*centerDot.position.x+c2;
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3+0.5, (2*y1+y2)/3+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3+0.5, (2*y1+y2)/3-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);

  var material=new THREE.LineBasicMaterial( { color: "pink",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(x, length, 0));
  geometry.vertices.push(new THREE.Vector3(findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus), findImageSize(Math.abs(object.position.x-poleDot.position.x),length), 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var material=new THREE.LineBasicMaterial( { color: "green",linewidth:2} );
  var geometry = new THREE.Geometry();
  var slope=-length/(centerDot.position.x-object.position.x);
  var x=Math.abs(object.position.x-centerDot.position.x);
  var cos=x/Math.sqrt(x*x+length*length);
  var r=poleDot.position.x;
  geometry.vertices.push(new THREE.Vector3( object.position.x, length, 0));
  geometry.vertices.push(new THREE.Vector3(r*cos,slope*r*cos, 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=object.position.x;
  var y1=length;
  var x2=r*cos;
  var y2=slope*r*cos;
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3-0.5, (2*y1+y2)/3+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3-0.5, (2*y1+y2)/3-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);

  var material=new THREE.LineBasicMaterial( { color: "orange",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( r*cos,slope*r*cos, 0));
  geometry.vertices.push(new THREE.Vector3( centerDot.position.x, 0, 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);

  var x1=r*cos;
  var y1=slope*r*cos;
  var x2=centerDot.position.x;
  var y2=0;
  var material=new THREE.LineBasicMaterial( { color: "black",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3+0.5, (2*y1+y2)/3+0.5, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3, (2*y1+y2)/3, 0));
  geometry.vertices.push(new THREE.Vector3( (2*x1+x2)/3+0.5, (2*y1+y2)/3-0.5, 0));
  arrows.push(new THREE.Line(geometry,material));
  PIEaddElement(arrows[arrows.length-1]);

  var material=new THREE.LineBasicMaterial( { color: "pink",linewidth:2} );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( r*cos,slope*r*cos, 0));
  geometry.vertices.push(new THREE.Vector3( findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus), findImageSize(Math.abs(object.position.x-poleDot.position.x),length), 0));
  ray.push(new THREE.Line(geometry,material));
  PIEaddElement(ray[ray.length-1]);
}

function printText(v)
{
  var s;
  if(v==Infinity)
  {
    s="at Infinity";
  }
  else
  {
    if((v-poleDot.position.x)>0)
    {
      s="in the mirror";
    }
    else
    {
      if((focus-poleDot.position.x)<(v-poleDot.position.x) && (v-poleDot.position.x)<0)
      {
        s="between pole and focus";
      }
      else
      {
        if((v-poleDot.position.x)==(focus-poleDot.position.x))
        {
          s="at the focus";
        }
        else
        {
          if(((centerDot.position.x-poleDot.position.x)<(v-poleDot.position.x)) && (v-poleDot.position.x)<(focus-poleDot.position.x))
          {
            s="between center of curvature and focus";
          }
          else
          {
            if((v-poleDot.position.x)==(centerDot.position.x-poleDot.position.x))
            {
              s="at the center of curvature";
            }
            else
            {
              s="beyond center of curvature";
            }
          }

        }
      }
    }
  }
  document.getElementById("hello").innerHTML="<h2>Image is formed "+s+".</h2>";
}
//It initialize the controls
function initialiseControls()
{
  PIEaddInputSlider("Object Distance From Pole", 15, function(){
    if(assessmentFlag==0)
    {
      var d=PIEgetInputSlider("Object Distance From Pole");
      object.position.x=poleDot.position.x-d;
      //showImageText();
      for(var i=ray.length-1;i>=0;i--)
      {
        PIEremoveElement(ray[i]);
        ray.pop();
      }
      for(var i=arrows.length-1;i>=0;i--)
      {
        PIEremoveElement(arrows[i]);
        arrows.pop();
      }
      //updateTable();
      PIErender();
      formRay();
      PIEremoveElement(image);
      PIErender();
      changeImageCoords();
    }
  }, 1, 50, 0.1);
  PIEaddInputSlider("Change Radius of curvature",15,function(){
    if(assessmentFlag==0)
    {
      poleDot.position.x=PIEgetInputSlider("Change Radius of curvature");
      focusDot.position.x=poleDot.position.x/2;
      focus=focusDot.position.x;
      var d=PIEgetInputSlider("Object Distance From Pole");
      object.position.x=poleDot.position.x-d;
      PIEremoveElement(image);
      PIErender();
      changeImageCoords();
      for(var i=ray.length-1;i>=0;i--)
      {
        PIEremoveElement(ray[i]);
        ray.pop();
      }
      for(var i=arrows.length-1;i>=0;i--)
      {
        PIEremoveElement(arrows[i]);
        arrows.pop();
      }
      //updateTable();
      labelF.position.x=focusDot.position.x;
      labelF.lookAt(PIEcamera.position);
      labelP.position.x=poleDot.position.x;
      labelP.lookAt(PIEcamera.position);
      //completeMirror();
      // var p=Math.abs(centerDot.position.x-focusDot.position.x);
      // var p1=2*p;
      // p=50+p+1;
      // p1=50+p1+2;
      // document.getElementById("F").style.left=p+"%";
      // document.getElementById("P").style.left=p1+"%";
      PIErender();
      formRay();
      PIEremoveElement(mirror);
      tex = THREE.ImageUtils.loadTexture( 'texture/concave.jpeg' );
      var mirrorMaterial=new THREE.MeshBasicMaterial(
        {
          shading: THREE.SmoothShading,
          map:tex,
          side: THREE.FrontSide,
          transparent: true,
          opacity: 0.8
        }
      );
      var mirrorGeometry = new THREE.RingGeometry(poleDot.position.x,poleDot.position.x+1, 30,8,-Math.PI/4,2*Math.PI/4 );
      //var mirrorMaterial = new THREE.MeshBasicMaterial( { color: "blue"}); //side: THREE.DoubleSide } );
      mirror=new THREE.Mesh( mirrorGeometry, mirrorMaterial );
      PIEremoveElement(poleDot);
      PIEaddElement(mirror);
      PIEaddElement(poleDot);
      PIEchangeDisplaySlider("Focal length",focus);
      //showImageText();
      PIErender();
    }
  },10,30,5);
  PIEaddDisplaySlider("Focal length", focus, 7.5, 15, 0.5);
  PIEaddInputSlider("Height of Object",length,function(){
    if(assessmentFlag==0)
    {
      length=PIEgetInputSlider("Height of Object");
      //showImageText();
      var d=object.position.x;
      PIEremoveDragElement(object);
      PIEremoveElement(object);
      addObject(d,length,false);
      PIEdragElement(object);
      PIEsetDragStart(object,function(){
        PIEremoveElement(image);
        PIErender();
        for(var i=ray.length-1;i>=0;i--)
        {
          PIEremoveElement(ray[i]);
          ray.pop();
        }
        for(var i=arrows.length-1;i>=0;i--)
        {
          PIEremoveElement(arrows[i]);
          arrows.pop();
        }
       });
      PIEsetDragEnd(object,function(){
        object.position.y=length/2;
          if(object.position.x>=poleDot.position.x-1)
          {
            object.position.x=poleDot.position.x-1;
          }
          PIEchangeInputSlider("Object Distance From Pole",Math.abs(object.position.x-poleDot.position.x));
          for(var i=ray.length-1;i>=0;i--)
          {
            PIEremoveElement(ray[i]);
            ray.pop();
          }
          for(var i=arrows.length-1;i>=0;i--)
          {
            PIEremoveElement(arrows[i]);
            arrows.pop();
          }
          //updateTable();
          PIErender();
          formRay();
          //showImageText();
          changeImageCoords();
      });
      for(var i=ray.length-1;i>=0;i--)
      {
        PIEremoveElement(ray[i]);
        ray.pop();
      }
      for(var i=arrows.length-1;i>=0;i--)
      {
        PIEremoveElement(arrows[i]);
        arrows.pop();
      }
      //updateTable();
      PIErender();
      formRay();
      PIEremoveElement(image);
      PIErender();
      changeImageCoords();
    }
  },2,3,0.1);
  //PIEaddInputCommand("Assessment", function () {
  //   PIEremoveElement(principalAxis);
  //   PIEremoveElement(image);
  //   PIEremoveDragElement(object);
  //   PIEremoveElement(object);
  //   PIEremoveElement(labelC);
  //   PIEremoveElement(labelF);
  //   PIEremoveElement(labelP);
  //   for(var i=ray.length-1;i>=0;i--)
  //   {
  //     PIEremoveElement(ray[i]);
  //     ray.pop();
  //   }
  //   PIEremoveElement(mirror);
  //   PIEremoveElement(focusDot);
  //   PIEremoveElement(centerDot);
  //   PIEremoveElement(poleDot);
  //   PIEshowDisplayPanel();
  //   var li=document.getElementsByTagName("li");
  //   li[18].style.display='none';
  //   assessmentFlag=1;
  //   var div=document.getElementsByTagName("div");
  //   div[36].style.visibility='hidden';
  //   questionFunc();
  //   PIErender();
  // });
  PIEaddInputCommand("Note Reading", function (){
    var flag=0;
    for(var i=0;i<objectDist.length;i++)
    {
      if((objectDist[i]==PIEgetInputSlider("Object Distance From Pole"))&&(objectHeight[i]==PIEgetInputSlider("Height of Object")))
      {
        flag=1;
        break;
      }
    }
    if(flag==0)
    {
      objectDist.push(PIEgetInputSlider("Object Distance From Pole"));
      objectHeight.push(PIEgetInputSlider("Height of Object"));
      updateTable();
    }
    console.log("counter:",counter);
  });
  PIEaddInputCommand("Clear Table", function(){
    for(var i=1;i<=counter-1;i++)
    {
      PIEupdateTableCell(i,0,"");
      PIEupdateTableCell(i,1,"");
      PIEupdateTableCell(i,2,"");
      PIEupdateTableCell(i,3,"");
      PIEupdateTableCell(i,4,"");
      PIEupdateTableCell(i,5,"");
    }
    //console.log(angles);
    // for(var j=0;j<angles.length;j++)
    // {
    //   angles.pop();
    // }
    var j=objectDist.length-1;
    while(j>=0)
    {
      objectDist.pop();
      objectHeight.pop();
      j--;
    }
    //console.log(angles);
    counter=1;
  });

}

function changeImageCoords()
{
  var v=findImageCoord(Math.abs(object.position.x-poleDot.position.x),focus);
  var imageHeight=findImageSize(Math.abs(object.position.x-poleDot.position.x),length);
  //console.log(v-poleDot.position.x);
  // PIEremoveElement(image);
  // PIErender();
  if(imageHeight>0)
  {
    addImage(v,imageHeight,false);
  }
  else
  {
    addImage(v,-imageHeight,true);
  }
  //printText(v);
  PIErender();
}

function completeMirror()
{
  for(var i=shinySurface.length-1;i>=0;i--)
  {
    PIEremoveElement(shinySurface[i]);
    shinySurface.pop();
  }
  var r=Math.abs(poleDot.position.x-centerDot.position.x);
  for(var theta=-Math.PI/4;theta<=Math.PI/4+2*Math.PI/180;theta+=2*Math.PI/180)
  {
    if(theta>0)
    {
      var material=new THREE.LineBasicMaterial( { color: "blue",linewidth:2} );
      var geometry=new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3((r*Math.cos(theta)),(r*Math.sin(theta)),0));
      geometry.vertices.push(new THREE.Vector3((r*Math.cos(theta))+0.75,(r*Math.sin(theta))+0.75,0));
      shinySurface.push(new THREE.Line(geometry,material));
      PIEaddElement(shinySurface[shinySurface.length-1]);
    }
    else
    {
      var material=new THREE.LineBasicMaterial( { color: "blue",linewidth:2} );
      var geometry=new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3((r*Math.cos(theta)),(r*Math.sin(theta)),0));
      geometry.vertices.push(new THREE.Vector3(((r+0.5)*Math.cos(theta))+0.5,((r+0.5)*Math.sin(theta))+0.5,0));
      shinySurface.push(new THREE.Line(geometry,material));
      PIEaddElement(shinySurface[shinySurface.length-1]);
    }
  }
  var material=new THREE.LineBasicMaterial( { color: "blue",linewidth:2} );
  var geometry=new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(r,0,0));
  geometry.vertices.push(new THREE.Vector3(r+0.78,0.5,0));
  shinySurface.push(new THREE.Line(geometry,material));
  PIEaddElement(shinySurface[shinySurface.length-1]);
  PIErender();
}

function resetExperiment()
{
  if(assessmentFlag==0)
  {
    // for(var i=1;i<=6;i++)
    // {
    //     PIEupdateTableCell(i,0,'');
    //     PIEupdateTableCell(i,1,'');
    //     PIEupdateTableCell(i,2,'');
    //     PIEupdateTableCell(i,3,'');
    //     PIEupdateTableCell(i,4,'');
    //     PIEupdateTableCell(i,5,'');
    //     // PIEupdateTableCell(i,6,'');
    //     // PIEupdateTableCell(i,7,'');
    //     // PIEupdateTableCell(i,8,'');
    // }
    // counter=1;
  }
  else
  {
    //initialiseAfterAssessment();
    assessmentFlag=0;
    PIErender();
  }
}

function initialiseAfterAssessment()
{
  PIEaddElement(mirror);
  PIEaddElement(principalAxis);
  PIEaddElement(focusDot);
  PIEaddElement(centerDot);
  PIEaddElement(poleDot);
  addObject(0,length,false);
  PIEdragElement(object);
  PIEsetDragStart(object,function(){
    PIEremoveElement(image);
    PIErender();
    for(var i=ray.length-1;i>=0;i--)
    {
      PIEremoveElement(ray[i]);
      ray.pop();
    }
   });
  PIEsetDragEnd(object,function(){
        var d=object.position.x;
        PIEremoveDragElement(object);
        PIEremoveElement(object);
        addObject(d,length,false);
        PIEdragElement(object);
        PIEsetDragStart(object,function(){
          PIEremoveElement(image);
          PIErender();
          for(var i=ray.length-1;i>=0;i--)
          {
            PIEremoveElement(ray[i]);
            ray.pop();
          }
         });
        PIEsetDragEnd(object,function(){
          object.position.y=length/2;
            if(object.position.x>=poleDot.position.x-1)
            {
              object.position.x=poleDot.position.x-1;
            }
            PIEchangeInputSlider("Object Distance From Pole",Math.abs(object.position.x-poleDot.position.x));
            for(var i=ray.length-1;i>=0;i--)
            {
              PIEremoveElement(ray[i]);
              ray.pop();
            }
            //updateTable();
            PIErender();
            formRay();
            //showImageText();
            changeImageCoords();
        });
    object.position.y=length/2;
      if(object.position.x>=poleDot.position.x-1)
      {
        object.position.x=poleDot.position.x-1;
      }
      PIEchangeInputSlider("Object Distance From Pole",Math.abs(object.position.x-poleDot.position.x));
      for(var i=ray.length-1;i>=0;i--)
      {
        PIEremoveElement(ray[i]);
        ray.pop();
      }
      //updateTable();
      PIErender();
      formRay();
      //showImageText();
      changeImageCoords();
  });
  addImage(0,length,true);
  formRay();
  PIEaddElement(labelC);
  PIEaddElement(labelF);
  PIEaddElement(labelP);
  PIEshowDisplayPanel();
  var li=document.getElementsByTagName("li");
  li[18].style.display='';
  var div=document.getElementsByTagName("div");
  div[36].style.visibility='';
  for(var i=1;i<=6;i++)
  {
      PIEupdateTableCell(i,0,'');
      PIEupdateTableCell(i,1,'');
      PIEupdateTableCell(i,2,'');
      PIEupdateTableCell(i,3,'');
      PIEupdateTableCell(i,4,'');
      PIEupdateTableCell(i,5,'');
      // PIEupdateTableCell(i,6,'');
      // PIEupdateTableCell(i,7,'');
      // PIEupdateTableCell(i,8,'');
  }
  counter=1;
  PIEupdateTableCell(1, 0, "1.");
  PIEupdateTableCell(1, 1, "-15");
  PIEupdateTableCell(1, 2, length);
  PIEupdateTableCell(1, 3, "-15");
  PIEupdateTableCell(1, 4, "-"+length);
  PIEupdateTableCell(1, 5, "-7.5");
  counter++;
  PIEshowInputPanel();
}

function questionFunc()
{
  var loader = new THREE.FontLoader();
  loader.load("optimer.json", function(response)
  {
      font = response;
      var geometry = new THREE.TextGeometry("Q. A 10 mm long awl pin is placed vertically in front of a concave mirror.", {
          font : font,
          size : 1.3,
          height : 0,
          curveSegments : 3
      });

      question.push(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:"black"})));
      //question[question.length-1].translation = geometry.center();

      PIEaddElement(question[question.length-1]);
      question[question.length-1].position.set(-35,10,0);
      //question1.lookAt(PIEcamera.position);
      //PIEdragElement(question[question.length-1]);
      var geometry = new THREE.TextGeometry("A 5 mm long image of the awl pin is formed at 30 cm in front of the mirror.", {
          font : font,
          size : 1.3,
          height : 0,
          curveSegments : 3
      });

      question.push(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:"black"})));
      //question[question.length-1].translation = geometry.center();

      PIEaddElement(question[question.length-1]);
      question[question.length-1].position.set(-35,7.5,0);

      var geometry = new THREE.TextGeometry("The focal length of this mirror is", {
          font : font,
          size : 1.3,
          height : 0,
          curveSegments : 3
      });

      question.push(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:"black"})));
      //question[question.length-1].translation = geometry.center();

      PIEaddElement(question[question.length-1]);
      question[question.length-1].position.set(-35,5,0);

      var tex = THREE.ImageUtils.loadTexture( 'texture/Number_1.png' );
      var material=new THREE.MeshBasicMaterial(
        {
          shading: THREE.SmoothShading,
          map:tex,
          side: THREE.FrontSide,
          transparent: true,
          opacity:0.8
        }
      );
      var geometry=new THREE.PlaneGeometry(2,2);
      option1=new THREE.Mesh(geometry, material);
      option1.rotation.x=0*Math.PI/180;
      option1.position.x=-31;
      option1.position.y=2.5;
      PIEaddElement(option1);

      var geometry = new THREE.TextGeometry("-30 cm", {
          font : font,
          size : 1.2,
          height : 0,
          curveSegments : 3
      });

      question.push(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:"black"})));
      //question[question.length-1].translation = geometry.center();

      PIEaddElement(question[question.length-1]);
      question[question.length-1].position.set(-29,2,0);

      var tex = THREE.ImageUtils.loadTexture( 'texture/Number_2.png' );
      var material=new THREE.MeshBasicMaterial(
        {
          shading: THREE.SmoothShading,
          map:tex,
          side: THREE.FrontSide,
          transparent: true,
          opacity:0.8
        }
      );
      var geometry=new THREE.PlaneGeometry(2,2);
      option2=new THREE.Mesh(geometry, material);
      option2.rotation.x=0*Math.PI/180;
      option2.position.x=-31;
      option2.position.y=0;
      PIEaddElement(option2);

      var geometry = new THREE.TextGeometry("-20 cm", {
          font : font,
          size : 1.2,
          height : 0,
          curveSegments : 3
      });

      question.push(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:"black"})));
      //question[question.length-1].translation = geometry.center();

      PIEaddElement(question[question.length-1]);
      question[question.length-1].position.set(-29,-0.5,0);

      var tex = THREE.ImageUtils.loadTexture( 'texture/Number_3.png' );
      var material=new THREE.MeshBasicMaterial(
        {
          shading: THREE.SmoothShading,
          map:tex,
          side: THREE.FrontSide,
          transparent: true,
          opacity:0.8
        }
      );
      var geometry=new THREE.PlaneGeometry(2,2);
      option3=new THREE.Mesh(geometry, material);
      option3.rotation.x=0*Math.PI/180;
      option3.position.x=-31;
      option3.position.y=-2.5;
      PIEaddElement(option3);

      var geometry = new THREE.TextGeometry("-40 cm", {
          font : font,
          size : 1.2,
          height : 0,
          curveSegments : 3
      });

      question.push(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:"black"})));
      //question[question.length-1].translation = geometry.center();

      PIEaddElement(question[question.length-1]);
      question[question.length-1].position.set(-29,-3,0);

      var tex = THREE.ImageUtils.loadTexture( 'texture/Number_4.png' );
      var material=new THREE.MeshBasicMaterial(
        {
          shading: THREE.SmoothShading,
          map:tex,
          side: THREE.FrontSide,
          transparent: true,
          opacity:0.8
        }
      );
      var geometry=new THREE.PlaneGeometry(2,2);
      option4=new THREE.Mesh(geometry, material);
      option4.rotation.x=0*Math.PI/180;
      option4.position.x=-31;
      option4.position.y=-5;
      PIEaddElement(option4);

      var geometry = new THREE.TextGeometry("-60 cm", {
          font : font,
          size : 1.2,
          height : 0,
          curveSegments : 3
      });

      question.push(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:"black"})));
      //question[question.length-1].translation = geometry.center();

      PIEaddElement(question[question.length-1]);
      question[question.length-1].position.set(-29,-5.5,0);

      questionCounter++;

      var tex = THREE.ImageUtils.loadTexture( 'texture/next.jpg' );
      var material=new THREE.MeshBasicMaterial(
        {
          shading: THREE.SmoothShading,
          map:tex,
          side: THREE.FrontSide,
          transparent: true,
          opacity:0.8
        }
      );
      var geometry=new THREE.PlaneGeometry(6,4);
      nextButton=new THREE.Mesh(geometry, material);
      nextButton.rotation.x=0*Math.PI/180;
      nextButton.position.x=-0;
      nextButton.position.y=-8;
      PIEaddElement(nextButton);

  });
  PIErender();
}


var helpContent;
//Help content
function initialiseHelp()
{
    helpContent="";
    helpContent = helpContent + "<h2>Image formation by a concave mirror</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>The experiment shows the images formation of a concave mirrors.</p>";
    helpContent = helpContent + "<h3>The setup stage</h3>";
    helpContent = helpContent + "<p>The initial state is setup stage. In this stage, you can see a mirror and a object and a image,the ray diagram and observation table.";
    helpContent = helpContent + "The rules of the experiment are given below.</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li>The incident ray is shown in green colour.";
    helpContent = helpContent + "<li>The reflected ray is shown in orange colour.";
    helpContent = helpContent + "<li>The backward traced ray is shown in pink colour.(Virtual image formation)";
    helpContent = helpContent + "<li>The object can be dragged.";
    helpContent = helpContent + "<li>The distance of object from the mirror can also be changed from slider.";
    helpContent = helpContent + "<li>The range of position of object slider is from 1 to 50.";
    helpContent = helpContent + "<li>The height of object can also be changed by the slider.";
    helpContent = helpContent + "<li>The range of height of object slider is from 2 to 3.";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>The minus sign before size of image shows that image is inverted(considering the universal sign convention).</p>";
    helpContent = helpContent + "<p>The minus sign before position of image shows that image is real or images is formed at the same side of object(considering the universal sign convention).</p>";
    helpContent = helpContent + "<p>The distance of image from mirror can also be seen in the observation table as the image forms.</p>";
    helpContent = helpContent + "<p>The observations can be recorded by clicking on the note reading on the control panel.</p>";
    helpContent = helpContent + "<p>The records of the observation table can be cleared by clicking on the clear table on the control panel.</p>";
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";
    PIEupdateHelp(helpContent);
}
//Initialise Info
var infoContent;
function initialiseInfo()
{
    infoContent =  "";
    infoContent = infoContent + "<h2>Image formation by a concave mirror</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>The experiment shows the image formation by a concave mirror.</p>";
    infoContent = infoContent + "<p>The distance of image from the mirror is found out using Mirrors Formula.</p>";
    infoContent = infoContent + "<p>The image formation at different position are given below.</p>";
    infoContent = infoContent + "<ul>";
    infoContent = infoContent + "<li>When the object is kept between F and P,the virtual,erect and magnified image is formed in the mirror";
    infoContent = infoContent + "<li>when the object is kept at F,the real,inverted and magnified image is formed at infinity on the screen";
    infoContent = infoContent + "<li>when the object is kept between F and C,the real,inverted and magnified image is formed beyond C on the screen";
    infoContent = infoContent + "<li>When the object is kept at C,the real,inverted and same size image (as that of object) at C on the screen";
    infoContent = infoContent + "<li>When the object is kept beyond C,the real,inverted and diminished image is formed in between F and C on the screen";
    infoContent = infoContent + "<li>When the object is kept at infinity,the real,inverted and highly diminished image is formed at F on the screen";
    infoContent = infoContent + "</ul>";
    infoContent = infoContent + "<p>When the incident ray is parallel to the principal axis,the reflected ray is passed through the focus(F)</p>";
    infoContent = infoContent + "<p>When the incident ray is passed through the focus(F) then the reflected ray is parallel to the principal axis</p>";
    infoContent = infoContent + "<p>When the incident ray is passed through the center of curvature(C) then the reflected ray is passed through the center of curvature(C)</p>";
    infoContent = infoContent + "<p>When the incident ray makes some angle with the principal axis and passes through the pole of the mirror(P) then the reflected ray passes with the same angle with the principal axis </p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}
