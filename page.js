(function($){
var res = '';
function parserGo(counter){
  var b = $.ajax({
		url: 'https://www.tumblr.com/dashboard',
		cache: false});
  b.done(function (d) {
    analysisSite(d, 0);
  });
  b.fail(function (e, g, f) {
    alert("Post error tumblr: " + f);
  })
  
  var c = $.ajax({
		url: 'http://www.deviantart.com/browse/all/',
		cache: false});
  c.done(function (d) {
    analysisSite(d, 1);
  });
  c.fail(function (e, g, f) {
    alert("Post error devian: " + f);
  })
  
   //сайт динамически подгружается :(
  
   // var z = $.ajax({url: 'https://www.artstation.com/artwork?sorting=trending'
   // });
   // z.done(function (d) {
       // $('#siteloader').append(d);
    // });
   // z.fail(function (e, g, f) {
      // alert("Post error artstation: " + f);
    // })
  //callAjax();
  
  var z = $.ajax({url: 'http://imgur.com/'});
  z.done(function (d) {
	   //ищем все элементы, содержащие гифки и картинки на сайте
       $imgs = $(d).find('a.image-list-link');
	   for(var i = 0; i < $imgs.length; i++)
	   {
		   var arrayOfStrings = $imgs[i].href.split('/');
		   //заменяем название нашего расширения в полученных адресах на сайт
		   var newUrl = 'http://imgur.com/' + arrayOfStrings[arrayOfStrings.length - 2] + '/' + arrayOfStrings[arrayOfStrings.length - 1];
		   //console.log(newUrl);
		   //переходим на отдельную страницу для найденного изображения или гифки
		   var z2 = $.ajax({url: newUrl});
		   z2.done(function (d2) {
			   $imgs2 = $(d2).find('source');
			   //console.log($imgs2[0].src);
			   var getAttr = $imgs2[0];
			   var attr = $(getAttr).attr('src');
			   //если на новой странице нету ничего содержащего <source src='xxx'> - не будем парсить дальше
			   if (typeof attr !== typeof undefined && attr !== false) {
				    //иначе, опять избавляемся от названия нашего расширения
					arrayOfStrings = $imgs2[0].src.split('/');			  
					var gifUrl = arrayOfStrings[arrayOfStrings.length - 1];
					//console.log(gifUrl);
					arrayOfStrings = gifUrl.split('.');
					gifUrl = 'http://i.imgur.com/' + arrayOfStrings[arrayOfStrings.length - 2] + '.gif';
					var jpgUrl = 'http://i.imgur.com/' + arrayOfStrings[arrayOfStrings.length - 2] + 'b.jpg'	
					//добавляем новый элемент, отображающий статичную картинку (для ускорения загрузки), но содержащий ссылку на гифку
					res+='<div class="img"><a target="_blank" href="'+gifUrl+'"><img src="'+jpgUrl+'"width="300" height="200"></a></div>';
					$('#resultbox').html(res);
				}			   
		   })
	   }
    });
    z.fail(function (e, g, f) {
      alert("Post error imgur: " + f);
    })
	
	var n = $.ajax({url: 'http://giphy.com/'});
    n.done(function (d) {
       $imgs = $(d).find('img.gif');
	   var l = $imgs[0].getAttribute('data-animated'); 
	   for(var i = 0; i < $imgs.length; i++)
	   {
		   res+='<div class="img"><a target="_blank" href="'+$imgs[i].getAttribute('data-animated')+'"><img src="'+$imgs[i].src+'"width="300" height="200"></a></div>';	   
	   }
	   $('#resultbox').html(res);
    });
   n.fail(function (e, g, f) {
      alert("Post error imgur: " + f);
    })
	
	//не работает, потому что не отдаются нормально картинки без аутентификации
	
	// var m = $.ajax({url: 'https://vk.com/albums-43234662'});
    // m.done(function (d) {
	   // //var photCont = $(d).find('div#photos_container');
       // var photCont = $(d).find('div#photos_container');
	   // $imgs = photCont.find('div.photo_row')
	   // alert("vk - " + $imgs.length);
	   // for(var i = 0; i < $imgs.length; i++)
	   // {
		   // var getDiv = $imgs[i];
		   // var getA = $(getDiv).find('a');
		   // var arrayOfStrings = getA[0].href.split('/');
		   // var newUrl = 'http://m.vk.com/' + arrayOfStrings[arrayOfStrings.length - 1];
		   // console.log("vk - " + newUrl);
		   // var m2 = $.ajax({url: newUrl});
		   // m2.done(function (d3) {
			   // //getA = $(d2).find('a#pv_photo');
			   // //console.log("vk - " + getA.length);
			   // var getImg = $(d3).find('img');
			   // console.log("vk - " + getImg.length);
			   // var imgSrc = getImg[0].src; 
			   // res+='<div class="img"><a target="_blank" href="'+imgSrc+'"><img src="'+imgSrc+'"width="300" height="200"></a></div>';
			   // $('#resultbox').html(res);
		   // })
	   // }
    // });
    // m.fail(function (e, g, f) {
      // alert("Post error vk: " + f);
    // })
}
function analysisSite(data, counter){
  if (counter == 0) $imgs = $(data).find('img.post_media_photo');
  if (counter == 1) $imgs = $(data).find('img');
  if (counter == 2) $imgs = $(data).find('img');
  if (counter == 3) $imgs = $(data).find('a.image-list-link');
  if( $imgs.length && counter != 3){
	requrs($imgs,$imgs.length-1, counter);
  }
  if( $imgs.length && counter == 3){
	flicrkrequrs($imgs,$imgs.length-1);
  }
}
function requrs(data,index, counter){
  res+='<div class="img"><a target="_blank" href="'+data[index].src+'"><img src="'+data[index].src+'"width="300" height="200"></a></div>';
  if( index>0 )requrs(data,index-1);else 
	if(counter == 0) parserGo(1); 
		else $('#resultbox').html(res);
}
function flicrkrequrs(data, index)
{
  if($imgs[index].href)
  {
	  var arrayOfStrings = $imgs[index].href.split('/');
	  var newUrl = 'http://imgur.com/' + arrayOfStrings[arrayOfStrings.length - 2] + '/' + arrayOfStrings[arrayOfStrings.length - 1];
	  console.log(newUrl);
	  if( index>0 )flicrkrequrs(data,index-1);else 
			$('#resultbox').html(res);
	  // var z = $.ajax({url: newUrl
	  // });
	  // z.done(function (data2) {
		   // $imgs = $(data2).find('video');	
		   // console.log($imgs[0]);
		   // //res+=$imgs[0];
		   // if( index>0 )flicrkrequrs(data,index-1);else 
			// $('#resultbox').html(res);
		// });
	  // z.fail(function (e, g, f) {
		  // alert("imgur: " + f);
		// })
  }
}
function callAjax() {
   // var z = $.ajax({
      // url: 'https://www.artstation.com/artwork?sorting=trending'
        // success: function() {
           // setTimeout(callAjax, 2000);
   // });
	// $.when($.ajax({url: 'https://www.artstation.com/artwork?sorting=trending'}) ).done(function (d) {
       // analysisSite(d, 2);
    // });
    // z.fail(function (e, g, f) {
      // alert("Post error artstation: " + f);
    // })
	// $.get('https://www.artstation.com/artwork?sorting=trending', function(data) {
    // $('#siteloader').html(data);
  // });
}
$(function(){
  $('#progress').hide();
  $('#starter').click(parserGo(0));
});
})(jQuery);