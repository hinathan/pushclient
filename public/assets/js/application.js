$(function(){
	window.prettyPrint && prettyPrint()
	var template = '<div class="row transforminfo" id="{{}}">	<div class="span6 cola rrec"></div><div class="span6 colc rrec"><table><thead><tr><td>Elapsed</td><td>Type</td><td>Message</td></tr></thead></table></div></div>'

	function addLogRow(id) {
		$('#here').after(template.replace('{{}}',id))
	}
	function routeMessage(id,col,msg) {
		var e = $('<div class="message fading">'+msg+'</div>').hide().fadeIn(200)
		$('#'+id).find('.' + col).append(e)
	}

	var transformtimes = {}

	window.rawmessage = function(event) {
		//console.log(event)
		var simpler_event = {message:event.message,message_type:event.message_type,task_id:event.task_id}

		var t1 = (new Date()).getTime()
		var delta = ((t1 - transformtimes[event.transform])/1000).toFixed(3)
		//var ts = time.toLocaleTimeString()
		//ts = event.ts
		var row = $('<tr><td class="ts">'+delta+'</td><td>'+event.message_type+'</td><td>'+event.message+'</td></tr>')
		$('#'+event.transform).find('.colc thead').after(row)


		if(event.message == 'output-delivered') {
			if(event.done_url.match(/pdf$/)) {
				var icon_src = '/assets/img/pdf-icon.png'
				var img = $('<img>').attr('src',icon_src).css({'max-height':'64px','max-width':'64px'})
				var link = $('<a>').attr('href',event.done_url).attr('target','_blank')
				link.append($('<span>').addClass('resulturl').html(event.done_url).append('<br>'))
				link.append(img)
				$('#'+event.transform).find('.cola').append(link)
				//var iframe = $('<iframe>').attr('src',event.done_url).css({width:'100%',height:'100%'})
				//$('#'+event.transform).find('.cola').append(iframe)
			} else if(event.done_url.match(/jpg$/)) {
				var img = $('<img>').attr('src',event.done_url)
				var link = $('<a>').attr('href',event.done_url).attr('target','_blank')
				link.append($('<span>').addClass('resulturl').html(event.done_url).append('<br>'))
				link.append(img)
				$('#'+event.transform).find('.cola').append(link)
			}
			$('#'+event.transform).find('.progress').parent().hide()
			var canreset = true
			$('.progress').each(function(i,e) {
				if($(e).is(':visible')) {
					canreset = false
				}
			})
			if(canreset) {
				$('#reset').removeClass('hidden')
			} else {
				$('#reset').addClass('hidden')
			}
		}

	}

	window.uploadComplete = function(response) {
		var input_url = null
		var done_url = null
		var transform = null
		var inp = 'http://push.lensu.com/input/' + response.saved
		var out = 'http://push.lensu.com/output/' + response.saved
		if(response.saved.match(/\.key$/)) {
			input_url = inp
			done_url = out + '.key.jpg'
			transform = 'keynotetojpg'
			do_transform(input_url,done_url,transform)
			input_url = inp
			done_url = out + '.key.pdf'
			transform = 'keynotetopdf'
			do_transform(input_url,done_url,transform)
		} else if(response.saved.match(/\.pages$/)) {
			input_url = inp
			done_url = out + '.pages.jpg'
			transform = 'pagestojpg'
			do_transform(input_url,done_url,transform)
			input_url = inp
			done_url = out + '.pages.preview.pdf'
			transform = 'pagestopreviewpdf'
			do_transform(input_url,done_url,transform)
			input_url = inp
			done_url = out + '.pages.pdf'
			transform = 'pagestopdf'
			do_transform(input_url,done_url,transform)
		} else if(response.saved.match(/\.pdf$/)) {
			input_url = inp
			done_url = out + '.ocr.pdf'
			transform = 'pdftoocrpdf'
			do_transform(input_url,done_url,transform)
		} else {
			alert('unknown file type')
		}
		if(transform) {
			$('#drop-div').hide()
		        $('#explain').slideDown(1000)
			$('#explain').removeClass('hidden')

		}
	}

	function do_transform(input_url,done_url,transform) {
		var post = {ref:window.ref,type:transform,input_url:input_url,done_url:done_url}
		transformtimes[transform] = (new Date).getTime()
		addLogRow(transform)
		routeMessage(transform,'cola','<h3>'+transform+'</h3>')
		routeMessage(transform,'cola','<img src="/assets/img/progress.gif" class="progress" />')
		console.log(post)
		$.ajax({
			url:'/ajaxnew.php',
			'type':'POST',
			data:post,
			async:false,
			success:function(data) { console.log("posted to ajaxnew"); console.log(data) },
			error:function(data) { console.log("error from ajaxnew "); console.log(data) },
		})
	}


	$('#reset').on('click',function() {
		 $('.transforminfo').each(function(i,e) {
	          var el = $(e)
		  el.slideUp(500,function() { el&&el.remove() })
		})
		setTimeout(function() { $('#drop-div').fadeIn(100) },600)
		  $('#reset').addClass('hidden')
		    $('#explain').slideUp(1000)
	})
})
