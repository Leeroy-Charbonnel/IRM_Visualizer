function setup_scene() {
    container = document.getElementById('container')
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '0px';
    container.appendChild(stats.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    camera.position.x = 30;
    camera.position.z = 0;
    camera.position.y = 5;


    scene.add(camera);
    controls = new THREE.OrbitControls(camera);
}



$(document).ready(function() {
    init();
})

//==========================================================================//
//							    	MAIN     								//
//==========================================================================//
function init() {
    getSerie();
}

function setupAll() {
    setup_scene()
    setup_baseplane()
    setup_slideScan()
    setup_serieList()
    setup_datGui()
    setup_eventOrbit()
    setup_handleColorGradient()
    animate()
    showGradient(false)
}

function getSerie() {

    var resultsArray = fs.readdirSync(pathToSerie);
    serieNumber = resultsArray.length;
    resultsArray.forEach(element => {
        var childrenArray = fs.readdirSync(pathToSerie + element);
        serieName.push(new Serie(element, childrenArray.length));
    });



    console.log("setupAll");
    setupAll()
}

function animate() {
    requestAnimationFrame(animate)
    render()
};

function render() {

    controls.update()
    stats.update();
    renderer.render(scene, camera);
}

//==========================================================================//
//							    	SET     								//
//==========================================================================//

function set_handleCursor(cursor) {
    $("#slider-handle").css("cursor", cursor)
}

function set_serie(serie) {
    console.log(serie);
    var currentSerie = serie.split("-")
    var index = currentSerie[0]
    var currentName = currentSerie[1]

    var absolutePath = path.resolve(pathBase);
    pathToSerie = absolutePath + "\\" + currentName + "\\";

    currentIndexSeries = index;
    currentHideIndex = serieName[currentIndexSeries].size - 1

    destroyAllPlane()

    setup_planes()
    fillImageSlider()
    fillNbIndicationSlider()

    update_selectedItemMenu()
    update_sliderScan()
    update_info()
}

function set_handlePosition() {
    var width = $("#slider").width() - ($("#slider-handle").width() + 2) //100%
    var percent = currentHideIndex / (serieName[currentIndexSeries].size - 1)

    $("#slider-handle").css("left", percent * width)


}

function set_randomColorGrad() {
    for (let index = 0; index < colorHandleNb; index++) {
        var h = Math.random() * 360
        colorHandle[index] = `hsl(${h}, 100%, 50%)`
        set_colorPreview(index, h)
    }

    p.colorize = true
    resetDatGui(false)
    update_gradient();
}

function set_natural_Grad() {
    for (let index = 0; index < colorHandleNb; index++) {
        var h = (index / colorHandleNb) * 360
        colorHandle[index] = `hsl(${h}, 100%, 50%)`
        set_colorPreview(index, h)
    }

    p.colorize = true
    resetDatGui(false)
    update_gradient();
}

function set_colorPreview(index, h) {
    var rgb = HSLToRGB(h, 100, 50)
    var hex = rgbToHex(rgb[0], rgb[1], rgb[2])

    $(`#colorPreview${index}`).css("background", colorHandle[index])
    $("#colorHandle" + index).val(hex)
}

//==========================================================================//
//							    	ACTION    								//
//==========================================================================//

function hidePlane(index) {

    for (let i = 0; i < serieName[currentIndexSeries].size * 2; i++)
        planeArray[i].visible = true

    for (let i = serieName[currentIndexSeries].size * 2 - 1; i > (index * 2) + 1; i--)
        planeArray[i].visible = false

    update_obsCanvas()
}

function fillImageSlider() {
    $(".slider-image_holder").empty()
    var nbImage = Math.floor($("#slider").width() / $("#slider").height())


    for (let index = 1; index < nbImage; index++) {
        var imgIndexNb = Math.floor((index * serieName[currentIndexSeries].size) / nbImage)
        var imgIndex = `IM00${('0' + imgIndexNb).slice(-2)}.jpg`
        var path = pathToSerie + imgIndex
        $(".slider-image_holder").append(`<img src="${path}" alt="${imgIndex}">`)

    }
}

function createItemList(index) {
    if (index >= serieNumber) {
        $("#serieItem1").click();
        return
    }

    setTimeout(function() {
        $(".seriesList").append(`<li id="serieItem${index + 1}" class="serieItem" onclick="set_serie('${index}-${serieName[index].name}')">${serieName[index].name}</li>`)
        createItemList(index + 1);
    }, 100)
}

function checkHideIndex() {
    var left = $("#slider-handle").position().left
    var width = $("#slider").width() - ($("#slider-handle").width() * 2)
    var percent = left / width
    var index = Math.floor(percent * serieName[currentIndexSeries].size - 1)

    index = (index < 0) ? 0 : index
    index = (index > serieName[currentIndexSeries].size - 1) ? serieName[currentIndexSeries].size - 1 : index

    if (currentHideIndex == index)
        return;
    else
        currentHideIndex = index
    hidePlane(index);
    update_info()
}

function destroyAllPlane() {
    planeArray.forEach(element => {
        scene.remove(element);
    });
    planeArray = new Array()
}

function fillNbIndicationSlider() {
    $('.info_imageNb > #content').empty()

    var length = serieName[currentIndexSeries].size + 1
    var increment = (length > 50) ? 3 : 1;

    for (let index = 1; index < length; index += increment) {

        var x = `${(index / length) * 100}%`

        var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        newLine.setAttribute('id', 'line2');
        newLine.setAttribute('x1', x);
        newLine.setAttribute('x2', x);

        newLine.setAttribute('y1', '60%');
        newLine.setAttribute('y2', '85%');
        newLine.setAttribute("class", "line_sub")


        var newText = document.createElementNS('http://www.w3.org/2000/svg', "text");
        var textNode = document.createTextNode(index);
        newText.setAttributeNS(null, "x", x);
        newText.setAttributeNS(null, "y", "50%");
        newText.setAttributeNS(null, "class", "text");
        newText.setAttributeNS(null, "text-anchor", "middle");


        newText.appendChild(textNode);



        $('.info_imageNb > #content').append(newLine)
        $('.info_imageNb > #content').append(newText)

    }

}

function showGradient(bool) {
    if (bool)
        $(".gradientContainer").css("right", "100px")
    else
        $(".gradientContainer").css("right", "-300%")

}

function resetDatGui(resetP) {
    if (resetP)
        p = Object.assign({}, baseP)


    gui.removeFolder(colorFolder);
    gui.removeFolder(imgFolder);
    gui.removeFolder(transfromFolder);
    setup_datGui()
    setup_planes()
}

function open_colorPick(index) {
    $("#colorHandle" + index).trigger('click')

}
//==========================================================================//
//							    	UPDATE    								//
//==========================================================================//


function update_info() {
    $("#info_NumeroSerie").text(textNumeroSerie + " " + currentSerie);
    $("#info_NumeroImage").text(textNumeroImage + " " + (currentHideIndex + 1));

}

function update_planeTransparency() {
    planeArray.forEach(element => {
        element.material.opacity = p.transparency;
    });
}

function update_sliderScan() {
    set_handlePosition()
    fillImageSlider()
}

function update_selectedItemMenu() {
    if (menuSelectedItem != null)
        menuSelectedItem.removeClass("itemActive")

    menuSelectedItem = $(`#serieItem${currentIndexSeries + 1}`)
    menuSelectedItem.addClass("itemActive")
}

function update_obsCanvas() {
    var image = new Image()
    image.src = planeArray[currentHideIndex * 2].material.map.image.src

    image.onload = () => {
        canvasObs.width = image.width;
        canvasObs.height = image.height;
        ctxObs.drawImage(image, 0, 0);
    }
}

function update_gradient() {
    var width = $("#handleContainer").width()
    var grd = ctxGrad.createLinearGradient(0, 0, width, 0);

    for (let index = 0; index < colorHandleNb; index++) {
        var left = $('#handle' + index).position().left
        var percent = left / width
        grd.addColorStop(percent, colorHandle[index]);
    }
    ctxGrad.fillStyle = grd;
    ctxGrad.fillRect(0, 0, 1000, 1000);
}

function update_changeHandeNb(amount) {
    colorHandleNb += amount;
    colorHandleNb = (colorHandleNb < 1) ? 1 : colorHandleNb
    $("#gradHandleNb").text(colorHandleNb)

    setup_handleColorGradient()
}

//==========================================================================//
//							    	SETUP    								//
//==========================================================================//



function setup_eventOrbit() {
    $("#canvasObservDiv").draggable({
        containment: 'body'
    }).resizable({
        aspectRatio: true
    });

    $(".gradientContainer").draggable({
        containment: 'body',
        cancel: false
    })

    $(".gradientContainer").on("dragstart", function() {
        setOrbitControl(false);
    })
    $(".gradientContainer").on("dragstop", function() {
        setOrbitControl(true);
    })

    $("#canvasObservDiv").on("dragstart", function() {
        setOrbitControl(false);
    })
    $("#canvasObservDiv").on("dragstop", function() {
        setOrbitControl(true);
    })


    $("#canvasObservDiv").on("resize", function() {
        setOrbitControl(false);
    })
    $(document).mouseup(function() {
        setOrbitControl(true);
    });


    $(".dg.ac").on("mouseover", function() {
        setOrbitControl(false);
    })
    $(".dg.ac").on("mouseout", function() {
        setOrbitControl(true);
    })
}

function setup_datGui() {

    colorFolder = gui.addFolder("Color")
    imgFolder = gui.addFolder("Image Edition")
    transfromFolder = gui.addFolder("Transform")

    colorFolder.add(p, "colorize").name("Colorize").onChange(function() {
        update_textureAllPlane()
    })

    imgFolder.add(p, "contrast").name("Contrast").min(0).max(300).step(1).onChange(function() {
        update_textureAllPlane()
    }).listen();

    imgFolder.add(p, "brightness").name("Brightness").min(0).max(300).step(1).onChange(function() {
        update_textureAllPlane()
    }).listen();

    imgFolder.add(p, "transparency").name("Transparency").min(0).max(1).onChange(function() {
        update_planeTransparency()
    }).listen();


    transfromFolder.add(p, "headHeight").name("Head Height").min(0.1).max(20).onChange(function() {
        update_planeSpacing()
    }).listen();



    var updateAll = { add: function() { update_textureAllPlane() } };
    var gradient = { add: function() { showGradient(true) } };
    var randomGrad = { add: function() { set_randomColorGrad() } };
    var natGrad = { add: function() { set_natural_Grad() } };
    var reset = { add: function() { resetDatGui(true) } };
    var changeOrientation = {
        add: function() {
            update_planeRotation()
        }
    };

    colorFolder.add(gradient, 'add').name("Open Gradient");
    colorFolder.add(randomGrad, 'add').name("Random Color");
    colorFolder.add(natGrad, 'add').name("Natural Gradient");
    colorFolder.add(updateAll, 'add').name("Update All");
    colorFolder.add(reset, 'add').name("Reset");

    transfromFolder.add(changeOrientation, 'add').name("ChangeRotation");

    gui.__folders["Color"].open()
    gui.__folders["Image Edition"].open()
    gui.__folders["Transform"].open()

}

function setup_baseplane() {

    const gridHelper = new THREE.GridHelper(basePlaneSize, basePlaneSegment);
    scene.add(gridHelper);
}

function setup_serieList() {
    serieName.sort((a, b) => (parseInt(a.name.substring(2)) > parseInt(b.name.substring(2))) ? 1 : ((parseInt(b.name.substring(2)) > parseInt(a.name.substring(2))) ? -1 : 0))
    createItemList(0)
}

function setup_slideScan() {
    $("#slider-handle").draggable({
        axis: "x",
        containment: '#slider'
    });
    $("#slider-handle").on("drag", function() { checkHideIndex() })
    $("#slider-handle").on("dragstart", function() {
        setOrbitControl(false);
        set_handleCursor("grabbing")
    })
    $("#slider-handle").on("dragstop", function() {
        setOrbitControl(true);
        set_handleCursor("grab")
    })


    $(".canvasObsDrop").droppable({
        over: function(event, ui) {
            $(this).addClass("droppable-over")
        },

        out: function(event, ui) {
            $(this).removeClass("droppable-over")

        },
        drop: function(event, ui) {
            $(ui.draggable).css('top', $(this).position().top);
            $(ui.draggable).css('left', $(this).position().left);
            $(ui.draggable).css('width', $(this).width());
            $(ui.draggable).css('height', $(this).height());
        }
    });

    set_handlePosition()
}

function setup_handleColorGradient() {
    colorHandle = new Array()
    $("#handleContainer").empty()
    var width = $("#handleContainer").width()
    var spacing = width / colorHandleNb


    for (let index = 0; index < colorHandleNb; index++) {
        var h = (index / colorHandleNb) * 360
        var color = `hsl(${h}, 100%, 50%)`
        var rgb = HSLToRGB(h, 100, 50)
        var hex = rgbToHex(rgb[0], rgb[1], rgb[2])
        colorHandle[index] = color

        $("#handleContainer").append(`
            <div id="handle${index}" class="gradient_handle" style="left:${(spacing * index) + (spacing / 2)}px;" >
                <input type="color" class="inputColor" id="colorHandle${index}" value="${hex}" onchange="set_handleColor(${index})" >
                <div id="colorPreview${index}" class="colorPreview"  onclick="open_colorPick(${index})"></div>
            </div>  
        `)
        set_colorPreview(index, h)
        $("#handle" + index).draggable({
            axis: "x",
            containment: '#handleContainer'
        });

        $("#handle" + index).on("drag", function() {
            console.log('drag, update_gradient');
            update_gradient()
        })

        $("#handle" + index).on("dragstop", function() {
            console.log("update_texturePlane");
            update_texturePlane(currentHideIndex, false)
        })



    }



    update_gradient()
}

function set_handleColor(index) {
    var color = $("#colorHandle" + index).val()
    colorHandle[index] = color
    set_colorPreview(index)
    update_gradient()
}