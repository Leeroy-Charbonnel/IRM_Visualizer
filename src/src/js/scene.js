function setup_planes() {
    destroyAllPlane()
    planeArray = new Array()
    for (let index = 0; index < serieName[currentIndexSeries].size; index++) {
        create_plane(index);
    }

    update_textureAllPlane()
    update_planeSpacing()
}

function create_plane(index) {
    const texture = new THREE.TextureLoader().load(base64OneWhitePixel);
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
    const material = new THREE.MeshBasicMaterial({ map: texture, opacity: p.transparency, transparent: true })


    planeTop = new THREE.Mesh(geometry, material.clone());
    planeBottom = new THREE.Mesh(geometry, material.clone());
    scene.add(planeTop);
    scene.add(planeBottom);

    planeBottom.material.side = THREE.BackSide

    planeArray.push(planeTop)
    planeArray.push(planeBottom)

}