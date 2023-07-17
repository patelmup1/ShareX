var selectedFile = null;

// Add click event listener to each file item
var fileItems = document.querySelectorAll('.file-list li');
fileItems.forEach(function(item) {
    item.addEventListener('click', function() {
        // Remove the active class from all items
        fileItems.forEach(function(item) {
            item.classList.remove('active');
        });

        // Set the active class on the clicked item
        this.classList.add('active');

        // Set the selected file URL
        selectedFile = this.getAttribute('data-url');
    });
});

// Add click event listener to the download button
var downloadButton = document.getElementById('download-button');
downloadButton.addEventListener('click', function() {
    if (selectedFile) {
        // Create a temporary link element and click it to download the file
        var link = document.createElement('a');
        link.href = selectedFile;
        link.download = selectedFile.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        // Show an error message if no file is selected
        alert('Please select a file to download.');
    }
});