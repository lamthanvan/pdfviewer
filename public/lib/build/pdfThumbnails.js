function getAllUrlParams(url) {
    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}
/**
 * Find all img elements with data-pdf-thumbnail-file attribute,
 * then load pdf file given in the attribute,
 * then use pdf.js to draw the first page on a canvas, 
 * then convert it to base64,
 * then set it as the img src.
 */

var createPDFThumbnails = function(){

    var worker = null;
    var loaded = false;
    var renderQueue = [];

    // bind data attribute for image from url
    document.querySelector('img[data-pdf-thumbnail-file]').setAttribute('data-pdf-thumbnail-file',encodeURI(getAllUrlParams().file));
    // select all img elements with data-pdf-thumbnail-file attribute

    var nodesArray = Array.prototype.slice.call(document.querySelectorAll('img[data-pdf-thumbnail-file]'));
    if (!nodesArray.length) {
        // No PDF found, don't load PDF.js
        return;
    }

    if (!loaded && typeof(pdfjsLib) === 'undefined') {
        var src = document.querySelector('script[data-pdfjs-src]').getAttribute('data-pdfjs-src');

        if (!src) {
            throw Error('PDF.js URL not set in "data-pdfjs-src" attribute: cannot load PDF.js');
        }

        var script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script).onload = renderThumbnails;
        loaded = true;
    }
    else {
        renderThumbnails();
    }

    function renderThumbnails() {
        if (!pdfjsLib) {
            throw Error("pdf.js failed to load. Check data-pdfjs-src attribute.");
        }

        nodesArray.forEach(function(element) {
            if (null === worker) {
                worker = new pdfjsLib.PDFWorker();
            }

            var filePath = encodeURI(getAllUrlParams().file);
            var imgWidth = element.getAttribute('data-pdf-thumbnail-width');
            var imgHeight = element.getAttribute('data-pdf-thumbnail-height');

            pdfjsLib.getDocument({url: filePath, worker: worker}).promise.then(function (pdf) {
                pdf.getPage(1).then(function (page) {

                    var canvas = document.createElement("canvas");
                    var viewport = page.getViewport({scale: 1.0});
                    var context = canvas.getContext('2d');

                    if (imgWidth) {
                        viewport = page.getViewport({scale: imgWidth / viewport.width});
                    } else if (imgHeight) {
                        viewport = page.getViewport({scale: imgHeight / viewport.height});
                    }

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise.then(function () {
                        element.src = canvas.toDataURL();
                    });
                }).catch(function() {
                    console.log("pdfThumbnails error: could not open page 1 of document " + filePath + ". Not a pdf ?");
                });
            }).catch(function() {
                console.log("pdfThumbnails error: could not find or open document " + filePath + ". Not a pdf ?");
            });
        });
    }
};

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    createPDFThumbnails();
} else {
    document.addEventListener("DOMContentLoaded", createPDFThumbnails);
}
