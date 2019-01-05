//Nav menu animation
$('.headerMenu').on('click', function(){
  $('.headingLogo').toggleClass('hide');
  $('nav').toggleClass('hide');
  if($(window).width() >= 814){
    if($('.navMenu').css('left') == '-200px'){
      $('.navMenu').css('left', '110px');
    }
    else if($('.navMenu').css('left') == '110px' ){
      $('.navMenu').css('left', '-200px');
    }
  }
  else{
    if($('.navMenu').css('top') == '-500px'){
      $('.navMenu').css('top', '60px');
    }
    else if($('.navMenu').css('top') == '60px' ){
      $('.navMenu').css('top', '-500px');
    }
  }
});


//Scroll Reveal
ScrollReveal().reveal('.scrollReveal', {delay: 350});
