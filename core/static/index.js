var isAdvancedUpload = function () {
    var div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

var tests = {
    filereader: typeof FileReader != 'undefined',
    dnd: 'draggable' in document.createElement('span'),
    formdata: !!window.FormData,
    progress: "upload" in new XMLHttpRequest
};

var supports = {
    FileReader: 'FileReader' in window // typeof FileReader != 'undefined'
};

// var support = {
// 	filereader	: document.getElementById('filereader'),
// 	formdata	: document.getElementById('formdata'),
// 	progress	: document.getElementById('progress')
// };
var acceptedTypes = {
    'application/pdf': true,
    'image/png': true,
    'image/jpeg': true,
    'image/gif': true
};

const acceptedMimeTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.rtf': 'text/rtf',
    '.xls': '',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.csv': 'text/csv',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.txt': 'text/plain'
};

var FileModel = Backbone.Model.extend({
    defaults: {
        name: null,
        type: null,
        size: null,
        data: null,
        lastModified: null,
        lastModifiedDate: null
    }
});

var FilesCollection = Backbone.Collection.extend({
    model: FileModel,
    url: null
});

var FileView = Marionette.ItemView.extend({
    tagName: 'tr',
    model: FileModel,
    // template	: _.template('<a href="<%= data %>" download="<%= name %>" target="_blank"><%= name %></a>'),
    // template	: _.template('<a href="<%= data %>" download="<%= name %>" target="_blank"><%= name %></a> <button class="btn btn--link js--remove-file"><i class="fa fa-times-circle"></i></button>'),
    template: '#document-item-view',

    ui: {
        btnRemoveFile: '.js--remove-file'
    },

    events: {
        'click @ui.btnRemoveFile': 'btnRemoveFileClicked'
    },

    initialize: function () {
        console.log("FileView :: initialize", this.options);
    },

    onRender: function () {
        console.log("FileView :: onRender", this.model.toJSON());
    },

    btnRemoveFileClicked: function () {
        this.triggerMethod("remove:file", this.model);
    }

});

var FilesListView = Marionette.CompositeView.extend({

    // tagName				: 'ul',
    // template			: '.js--upload-form',
    childViewContainer: '.js--files-list',
    childView: FileView,
    collection: FilesCollection,

    // 	template: _.template(''),

    // });

    // var FileUploaderView = Marionette.LayoutView.extend({

    template: '#file-uploader-template',
    // regions: {
    // 	fileUploader: '.js--uploaded-files'
    // },

    onRender: function () {
        // var fileUploader = new FilesListView({collection: new FilesCollection()});
        // this.showChildView('fileUploader', fileUploader);
    },

    ui: {
        basicUpload: '.js--basic-upload',
        advancedUpload: '.js--advanced-upload',
        form: '.js--upload-form',
        fileInput: 'input[type="file"]'
    },

    events: {
        'change @ui.fileInput': 'onFilesSelected',
        // 'drop @ui.form' : 'onFilesDropped'
    },

    // modelEvents: {
    // 	'change:data': 'reRenderCollection'
    // },

    // collectionEvents: {
    // 	add: 'onRenderCollection'
    // },

    initialize: function () {
        console.log("FilesListView :: initialize", this.options);
    },

    onChildviewRemoveFile: function (cv, model) {
        console.log("FilesListView :: onChildviewRemoveFile", cv, model);
        this.collection.remove(model);
    },

    onRender: function () {
        console.log("FilesListView :: onRender", this.collection.toJSON());

        if (isAdvancedUpload) {

            this.ui.advancedUpload.removeClass('hide');
            this.ui.basicUpload.addClass('hide');

            var $form = this.ui.form;
            $form
                .on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
                .on('dragover dragenter', function () {
                    $form.addClass('is-dragover');
                })
                .on('dragleave dragend drop', function () {
                    $form.removeClass('is-dragover');
                });

            $form.on('drop', this.onFilesDropped.bind(this));

        } else {

            this.ui.advancedUpload.addClass('hide');
            this.ui.basicUpload.removeClass('hide');

        }
    },

    // 	reRenderCollection: function() {
    // 		console.log("FilesListView :: reRenderCollection", this.collection.toJSON());
    // 		this.triggerMethod("render:collection");
    // 	},

    // 	onRenderCollection: function() {
    // 		console.log("FilesListView :: onRenderCollection", this.collection.toJSON());
    // 	},

    onFilesSelected: function (e) {
        console.debug("onFilesSelected", e);
        this.triggerMethod("read:files", e.currentTarget.files);
        // Get all elements with the class "drag-text"
        var elements = document.getElementsByClassName("drag-text");

        // Iterate through the elements and set their display property to "none"
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "none";
        }
    },

    onFilesDropped: function (e) {
        console.debug("onFilesDropped", e);
        // if (!tests.formdata) {
        // 	console.log("FormData is not supported in this browser");
        // 	return;
        // }
        this.triggerMethod("read:files", e.originalEvent.dataTransfer.files);

    },

    onReadFiles: function (files) {
        // var formData = tests.formdata ? new FormData() : null;
        // var filesCollection = new FilesCollection();
        for (var i = 0; i < files.length; i++) {
            var fileModel = new FileModel(files[i]);
            // this.collection.add(fileModel);
            // formData.append('file', files[i]);
            this.triggerMethod("read:file", files[i], fileModel);
        }
    },

    onReadFile: function (file, fileModel) {
        var self = this;
        // if (tests.filereader === true && acceptedTypes[file.type] === true) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var fileData = event.target.result;
            fileModel.set("data", fileData);
            console.log("fileModel:", fileModel.toJSON());
            self.collection.add(fileModel);
        };
        reader.readAsDataURL(file);
        // }  else {
        // 	// holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
        // 	console.log(file);
        // }
    }


})

var filesListView1 = new FilesListView({ el: '#file-uploader1', collection: new FilesCollection() });
var filesListView2 = new FilesListView({ el: '#file-uploader2', collection: new FilesCollection() });
filesListView1.render();
filesListView2.render();
