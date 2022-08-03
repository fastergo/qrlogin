function getAllUrlParams(e) {
    var t = e ? e.split("?")[1] : window.location.search.slice(1),
        a = {};
    if (t)
        for (var n = (t = t.split("#")[0]).split("&"), o = 0; o < n.length; o++) {
            var i = n[o].split("="),
                r = void 0,
                d = i[0].replace(/\[\d*\]/, function(e) {
                    return r = e.slice(1, -1), ""
                }),
                s = void 0 === i[1] || i[1];
            a[d = d.toLowerCase()] ? ("string" == typeof a[d] && (a[d] = [a[d]]), void 0 === r ? a[d].push(s) : a[d][r] = s) : a[d] = s
        }
    return a
}
var get_hotspot = getAllUrlParams().hotspot;
get_hotspot = decodeURI(get_hotspot), console.log(get_hotspot);
var gCtx = null,
    gCanvas = null,
    c = 0,
    stype = 0,
    gUM = !1,
    webkit = !1,
    moz = !1,
    v = null,
    imghtml = '<div id="qrfile"><canvas id="out-canvas" width="320" height="240"></canvas><div id="imghelp">drag and drop a QRCode here<br>or select a file<input type="file" onchange="handleFiles(this.files)"/></div></div>',
    vidhtml = '<video id="v" autoplay></video>';

function dragenter(e) {
    e.stopPropagation(), e.preventDefault()
}

function dragover(e) {
    e.stopPropagation(), e.preventDefault()
}

function drop(e) {
    e.stopPropagation(), e.preventDefault();
    var t = e.dataTransfer,
        a = t.files;
    a.length > 0 ? handleFiles(a) : t.getData("URL") && qrcode.decode(t.getData("URL"))
}

function handleFiles(e) {
    for (var t = 0; t < e.length; t++) {
        var a = new FileReader;
        a.onload = (e[t], function(e) {
            gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height), qrcode.decode(e.target.result)
        }), a.readAsDataURL(e[t])
    }
}

function initCanvas(e, t) {
    document.getElementById("nama_hotspot").innerHTML = get_hotspot, (gCanvas = document.getElementById("qr-canvas")).style.width = e + "px", gCanvas.style.height = t + "px", gCanvas.width = e, gCanvas.height = t, (gCtx = gCanvas.getContext("2d")).clearRect(0, 0, e, t)
}

function captureToCanvas() {
    if (1 == stype && gUM) try {
        gCtx.drawImage(v, 0, 0);
        try {
            qrcode.decode()
        } catch (e) {
            console.log(e), setTimeout(captureToCanvas, 500)
        }
    } catch (e) {
        console.log(e), setTimeout(captureToCanvas, 500)
    }
}

function htmlEntities(e) {
    return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function read(e) {
    document.getElementById("hasil").innerHTML = "SCAN BERHASIL, MENCOBA LOGIN ...", window.location = e
}

function isCanvasSupported() {
    var e = document.createElement("canvas");
    return !(!e.getContext || !e.getContext("2d"))
}

function success(e) {
    v.srcObject = e, v.play(), gUM = !0, setTimeout(captureToCanvas, 500)
}

function error(e) {
    gUM = !1
}

function load() {
    isCanvasSupported() && window.File && window.FileReader ? (initCanvas(800, 600), qrcode.callback = read, document.getElementById("mainbody").style.display = "inline", setwebcam()) : (document.getElementById("mainbody").style.display = "inline", document.getElementById("mainbody").innerHTML = '<p id="mp1">QR code scanner for HTML5 capable browsers</p><br><br><p id="mp2">sorry your browser is not supported</p><br><br><p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>')
}

function setwebcam() {
    var e = !0;
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) try {
        navigator.mediaDevices.enumerateDevices().then(function(t) {
            t.forEach(function(t) {
                "videoinput" === t.kind && t.label.toLowerCase().search("back") > -1 && (e = {
                    deviceId: {
                        exact: t.deviceId
                    },
                    facingMode: "environment"
                }), console.log(t.kind + ": " + t.label + " id = " + t.deviceId)
            }), setwebcam2(e)
        })
    } catch (e) {
        console.log(e)
    } else console.log("no navigator.mediaDevices.enumerateDevices"), setwebcam2(e)
}

function setwebcam2(e) {
    if (console.log(e), 1 != stype) {
        var t = navigator;
        document.getElementById("camera-inside").innerHTML = vidhtml, v = document.getElementById("v"), t.mediaDevices.getUserMedia ? t.mediaDevices.getUserMedia({
            video: e,
            audio: !1
        }).then(function(e) {
            success(e)
        }).catch(function(e) {
            e(e)
        }) : t.getUserMedia ? (webkit = !0, t.getUserMedia({
            video: e,
            audio: !1
        }, success, error)) : t.webkitGetUserMedia && (webkit = !0, t.webkitGetUserMedia({
            video: e,
            audio: !1
        }, success, error)), stype = 1, setTimeout(captureToCanvas, 500)
    } else setTimeout(captureToCanvas, 500)
}

function setimg() {
    if (document.getElementById("result").innerHTML = "", 2 != stype) {
        document.getElementById("camera-inside").innerHTML = imghtml, document.getElementById("qrimg").style.opacity = 1, document.getElementById("webcamimg").style.opacity = .2;
        var e = document.getElementById("qrfile");
        e.addEventListener("dragenter", dragenter, !1), e.addEventListener("dragover", dragover, !1), e.addEventListener("drop", drop, !1), stype = 2
    }
}
