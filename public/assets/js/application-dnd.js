$(function() {

	$.fn.dropzone.uploadStarted = function(fileIndex, file) {
		// upload of file with given index has started
		$('#drop-div').removeClass('hovered')
		$('#drop-div').removeClass('droppable')
		var fnsafe = file.name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
		$('#drop-info').html('uploading ' + fnsafe + '<div><div id="progressbar"></div></div>')
		$('#progressbar').reportprogress(0);
	}
	$.fn.dropzone.uploadFinished = function(fileIndex, file, time) {
		// upload of file with given index has finished; upload took *time* mili seconds
		$('#drop-div').addClass('droppable')
		var fnsafe = file.name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
		$('#drop-info').html('uploaded ' + fnsafe)
		$('#drop-div').addClass('upload-wait-response')
	}
	$.fn.dropzone.fileUploadProgressUpdated = function(fileIndex, file, newProgress) {
		// progress of given file has changed to *newProgress* percent
		$('#progressbar').reportprogress(newProgress);
	}
	$.fn.dropzone.uploadResponse = function(xhr) {
		var response = jQuery.parseJSON(xhr.response)
		window.uploadComplete(response)
		$('#drop-info').html('')
		$('#drop-div').removeClass('upload-wait-response')
	}

	$('#drop-div').on('dragenter',function() { $('#drop-div').addClass('hovered') })
	$('#drop-div').on('dragleave',function() { $('#drop-div').removeClass('hovered') })
	$("#drop-div").dropzone(
		{
			url : '/upload.php?ref=' + window.ref,
		}
	)
})
