function FullPic(sourceFile) {

    this.sourceFile = sourceFile.src;
    this.caption = sourceFile.alt;

}

FullPic.prototype.open = function () {

    //This element gets appended before lightbox is faded in so that
    //elements with high z-index don't cover lightbox during fade.
    this.lightboxWrapper = document.createElement('div');
    this.lightboxWrapper.className = 'lightbox-wrapper';
    this.lightbox = document.createElement('div');
    var overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlay';
    var image = document.createElement('img');
    image.className = 'expanded';
    image.src = this.sourceFile;
    var captionDiv = document.createElement('div');
    captionDiv.className = 'caption';
    var captionText = document.createTextNode(this.caption);
    captionDiv.appendChild(captionText);
    var columnWrapper = document.querySelector('#column-wrapper');
    this.lightbox.appendChild(overlayDiv);
    this.lightbox.appendChild(image);
    this.lightbox.appendChild(captionDiv);

    //Fade in lightbox overlay and image.
    document.body.insertBefore(this.lightboxWrapper, columnWrapper);
    this.lightbox.style.opacity = 0;
    this.lightboxWrapper.appendChild(this.lightbox);  //Appended first for z-index fix (see comment above).
    var counter = 0;
    var lightBox = this.lightbox;  //Otherwise "this" in callback function would refer to call function rather than FullPic property.
    var fadeInt = setInterval(function () {
        if (counter < 1.05) {
            lightBox.style.opacity = counter;
            counter += 0.05;
        } else {
            clearInterval(fadeInt);
        }
    }, 15);

    //Without passing "this" to "self", "this" would refer to
    //event listener in callback function.
    var self = this;
    overlayDiv.addEventListener('click', function () {
        self.close();
    });

};

FullPic.prototype.close = function () {

    var counter = 1;
    var lightBox = this.lightbox;
    var lightWrap = this.lightboxWrapper;
    var fadeInt = setInterval(function () {
        if (counter > 0) {
            lightBox.style.opacity = counter;
            counter -= 0.05;
        } else {
            clearInterval(fadeInt);
            document.body.removeChild(lightWrap);
        }
    }, 15);

};

const createLegend = (photo, n) => {
    var p = document.createElement('p');
    p.innerHTML = `fig-${n}: ${photo.alt}`
    var parent = document.querySelector('.caption-image');
    parent.appendChild(p)
}

//Adds event listener to each thumbnail with 'lightbox-photo' class on page

function initLightbox() {
    var photos = Array.prototype.slice.call(document.querySelectorAll('.lightbox-photo'));

    var n = 1;
    photos.forEach(function (photo) {
        createLegend(photo, n)
        n++;
        photo.addEventListener('click', function () {

            var currentPhoto = new FullPic(photo);
            currentPhoto.open();

        });

    });


}
window.onload = initLightbox;
