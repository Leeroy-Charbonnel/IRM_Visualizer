var fs = require('fs');
var path = require("path");
var scene
var camera
var mirrorCamera
var renderer
var stats
var container
var p = {
    blackThreshold: 50,
    colorize: false,
    contrast: 100,
    brightness: 100,
    transparency: 0.5,
    headHeight: 10,
    spacing: 1,
    rotation: 0
}
var baseP = Object.assign({}, p)
var serieNumber = 0;

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var currentSerie = "";
var pathToSerie = "./src/ressource/images/";
var pathBase = "./src/ressource/images/";

var planeSize = 30;


var canvasObs = document.getElementById('canvasObserv');
var ctxObs = canvasObs.getContext('2d');
var w = window.innerWidth
var h = window.innerHeight

var controls;

var basePlaneSize = 30;
var basePlaneSegment = 30;
var currentHideIndex = 0;
var currentIndexSeries = 0

var planeArray = new Array()

var serieName = new Array()
var _orientation = 0 //0 = horizontal | 1 = vertical
var menuSelectedItem = null

var textNumeroSerie = 'Serie n\u00B0';
var textNumeroImage = 'Image n\u00B0';

var gui = new dat.GUI();
var colorFolder
var imgFolder
var base64OneWhitePixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII="


var colorHandle = new Array()
var colorHandleNb = 3
var canvasGrad = document.getElementById("gradientCanvas");
var ctxGrad = canvasGrad.getContext("2d");

class Serie {
    constructor(name, size) {
        this.name = name;
        this.size = size;
        this.rotation = 0;
    }
}