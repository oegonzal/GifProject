import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

import gifshot from '../imports/gifshot.js';
import api from '../imports/api/uploads.js';


// var imageStore = new FS.Store.GridFS("images", {
//   // mongoUrl: 'mongodb://127.0.0.1:27017/test/', // optional, defaults to Meteor's local MongoDB
//   // mongoOptions: {...},  // optional, see note below
//   // transformWrite: myTransformWriteFunction, //optional
//   // transformRead: myTransformReadFunction, //optional
//   // maxTries: 1, // optional, default 5
//   // chunkSize: 1024*1024  // optional, default GridFS chunk size in bytes (can be overridden per file).
//                         // Default: 2MB. Reasonable range: 512KB - 4MB
// });


// Images = new FS.Collection("images", {
//   // stores: [new FS.Store.FileSystem("images", { path: "~/uploads" })]
//   stores: [imageStore]
// });

let images = [];

Template.gifmaker.events({
	'change input': 
	function (event) {
		const files = event.target.files;
    
		for (let i = 0, ln = files.length; i < ln; i++) {
			const currFile = new FS.File(files[i]);
			Images.insert(currFile, function (error, fileObj) {
				if (error) console.error(error);
				else {
					console.log('Picture has been added successfully');
				}
			});
		}
		// var files = ev.target.files;
		// console.log(files);
		// for (var i = 0, ln = files.length; i < ln; i++) {
		// 	Images.insert(files[i], function (error, fileObj) {
		// 		// Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
		// 		if(error) console.log(error);
		// 		else console.log(fileObj);
		// 	});
		// }
		// _.each(ev.target.files, function(file) {
		//   // TODO TEST DIFFERENT TYPES OF PICTURES
		//   // console.log(file);  
		//   saveFile(file, file.name);
		//   // TODO save the file in collections for this session
		// });

	},
	// TODO on submit click get all images for session and call imported gif file function,
	// use the interval to make gif, download gif as well 
});

Template.body.events({
	'submit .gifform'(event) {
		// Prevent default browser form submit
		event.preventDefault();
		console.log(`hello`);
		makeGif(images);
	},
});

Template.imageView.helpers({
  images: function () {
    return Images.find(); // Where Images is an FS.Collection instance
  }
});

function saveFile(blob, name, path, type, callback) {
	var fileReader = new FileReader(),
		method, encoding = 'binary', type = type || 'binary';
	switch (type) {
		case 'image/png':
		case 'image/jpeg':
		case 'binary':
			method = 'readAsBinaryString';
			encoding = 'binary';
			break;
		default:
			method = 'readAsBinaryString';
			encoding = 'binary';
			break;
	}
	fileReader.onload = function (file) {
		console.log(file);
		// TODO save file to db or locally
		images.push(file.target);
		debugger;
	}
	fileReader[method](blob);
}

function makeGif(images = []) {
	gifshot.createGIF({
		gifWidth: 200,
		gifHeight: 200,
		images: Images,
		interval: 0.1,
		numFrames: 10,
		frameDuration: 1,
		fontWeight: 'normal',
		fontSize: '16px',
		fontFamily: 'sans-serif',
		fontColor: '#ffffff',
		textAlign: 'center',
		textBaseline: 'bottom',
		sampleInterval: 10,
		numWorkers: 2
	}, function (obj) {
		if (!obj.error) {
			var image = obj.image, animatedImage = document.createElement('img');
			animatedImage.src = image;
			document.body.appendChild(animatedImage);
		}
	});
	debugger;
}