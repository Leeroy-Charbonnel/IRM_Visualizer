function removeBlack(imageData) {
    //p.blackThreshold = imageData.data[0] + 20
    for (var i = 0; i < imageData.data.length; i += 4) {
        //var average = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3
        if (imageData.data[i] < p.blackThreshold)
            if (imageData.data[i + 1] < p.blackThreshold)
                if (imageData.data[i + 2] < p.blackThreshold)
                    imageData.data[i + 3] = 0;
    }
    return imageData;
}

function coloriseImage(imageData) {
    var gradientData = ctxGrad.getImageData(0, 1, canvasGrad.width, 1).data
    for (var i = 0; i < imageData.data.length; i += 4) {
        //if (imageData.data[i + 3] < p.blackThreshold)
        //continue
        var val = imageData.data[i] //get between 0 and 255 for each pixel
        var x = Math.floor((val / 255) * (canvasGrad.width - 1)) //x on gradient
        var rgbIndex = x * 4 //Get color on gradient

        imageData.data[i] = gradientData[rgbIndex]
        imageData.data[i + 1] = gradientData[rgbIndex + 1]
        imageData.data[i + 2] = gradientData[rgbIndex + 2]
    }
    return imageData;
}


function update_textureAllPlane() {
    update_texturePlane(0, true)
}

function update_texturePlane(index, all) {

    if (index >= serieName[currentIndexSeries].size) {
        update_obsCanvas()
        return;
    }

    var planeTop = planeArray[index * 2]
    var planeBottom = planeArray[index * 2 + 1]

    var image = new Image()
    image.src = pathToSerie + `IM00${('0' + (index)).slice(-2)}.jpg`
    image.onload = () => {
        //Set canvasSize, Draw image and get data
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.filter = `contrast(${p.contrast}%) brightness(${p.brightness}%)`
        ctx.drawImage(image, 0, 0);

        var imageData = getImageData(canvas, ctx) //Get image data
        imageData = removeBlack(imageData) //Edit imageData

        if (p.colorize)
            imageData = coloriseImage(imageData)

        imageData = removeBlack(imageData) //Edit imageData


        ctx.putImageData(imageData, 0, 0) //Put it backon the canvas


        planeTop.material.map.image.src = canvas.toDataURL()
        planeBottom.material.map.image.src = canvas.toDataURL()

        planeTop.material.map.needsUpdate = true;
        planeBottom.material.map.needsUpdate = true;

        if (all)
            update_texturePlane(index + 1, true)
    };


}

function update_planeSpacing() {

    const serie = serieName[currentIndexSeries]
    const PIdiv2 = Math.PI / 2
    p.spacing = p.headHeight / serie.size


    console.log("update_planeSpacing");



    for (let index = 0; index < planeArray.length; index = index + 2) {
        var planeTop = planeArray[index]
        var planeBottom = planeArray[index + 1]

        switch (p.rotation) {
            //Horizontal
            case 0:
                //Position
                planeTop.position.set(0, index * p.spacing, 0)
                planeBottom.position.set(0, (index + 1) * p.spacing, 0)

                //Rotation
                planeTop.rotation.set(-PIdiv2, 0, -PIdiv2);
                planeBottom.rotation.set(-PIdiv2, 0, -PIdiv2);

                //Render Order
                planeTop.renderOrder = index;
                planeBottom.renderOrder = Math.abs(serie.size - index);
                break;

            case 1:
                //Vertical
                console.log("case1");
                //Position
                planeTop.position.set(0, serie.size / 2, (index * p.spacing) - p.headHeight)
                planeBottom.position.set(0, serie.size / 2, (index * p.spacing) - p.headHeight)


                //Rotation
                planeTop.rotation.set(0, Math.PI, 0);
                planeBottom.rotation.set(0, Math.PI, 0);


                //Render Order
                planeTop.renderOrder = serie.size - index;
                planeBottom.renderOrder = index;
                break;
        }



    }

}

function update_planeRotation() {
    p.rotation == 0 ? p.rotation = 1 : p.rotation = 0
    update_planeSpacing()
}

function drawImageOnCanvas(image) {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
}

function getImageData(canvas, ctx) {
    return ctx.getImageData(0, 0, canvas.width, canvas.height)
}