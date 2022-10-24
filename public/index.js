const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})




$(function() {
  $('.map-card button').hover(function() {
    $('.map-img').css('transform', 'scale(1.1)');
  }, function() {
    // on mouseout, reset the background colour
    $('.map-img').css('transform', 'scale(1)');
  });
});
 
const navbar = document.querySelector('.navbar');
navbar.addEventListener('click',()=>{
  navbar.classList.toggle('dark');
})

$(window).on("load",function(){
  $(".loader-wrapper").delay(1000).fadeOut("slow");
});