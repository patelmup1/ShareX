function scanQRCode() {
    // Get the video element
    var video = document.createElement('video');
    video.autoplay = true;

    // Get the media devices
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream;

        // Get the canvas element
        var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Get the context of the canvas
        var context = canvas.getContext('2d');

        // Draw the video to the canvas
        setInterval(function() {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Decode the QR code from the canvas
            var codeReader = new ZXing.BrowserQRCodeReader();
            codeReader.decodeFromCanvas(canvas).then(function(result) {
                console.log(result.text);
                stream.getTracks().forEach(function(track) {
                    track.stop();
                });
            }).catch(function(error) {
                console.log('Error decoding QR code', error);
            });
        }, 1000);
    }).catch(function(error) {
        console.log('Error opening camera', error);
    });
}