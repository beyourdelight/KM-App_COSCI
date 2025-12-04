
  (function ($) {
  
  "use strict";

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });
    
    // CUSTOM LINK
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      var header_height = $('.navbar').height();
  
      scrollToDiv(elWrapped,header_height);
      return false;
  
      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-navheight;
  
        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });

    $(window).on('scroll', function(){
      function isScrollIntoView(elem, index) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(window).height()*.5;
        if(elemBottom <= docViewBottom && elemTop >= docViewTop) {
          $(elem).addClass('active');
        }
        if(!(elemBottom <= docViewBottom)) {
          $(elem).removeClass('active');
        }
        var MainTimelineContainer = $('#vertical-scrollable-timeline')[0];
        var MainTimelineContainerBottom = MainTimelineContainer.getBoundingClientRect().bottom - $(window).height()*.5;
        $(MainTimelineContainer).find('.inner').css('height',MainTimelineContainerBottom+'px');
      }
      var timeline = $('#vertical-scrollable-timeline li');
      Array.from(timeline).forEach(isScrollIntoView);
    });
  
  })(window.jQuery);


function triggerTab(tabId) {
    // 1. หาปุ่ม Tab ด้วย ID
    var tabTrigger = document.querySelector('#' + tabId); 
    
    // 2. ถ้าเจอปุ่ม ให้สั่งกดและเปลี่ยน Tab
    if (tabTrigger) {
        // เรียกใช้ Bootstrap Tab API
        var tabInstance = new bootstrap.Tab(tabTrigger);
        tabInstance.show();
        
        // (Optional) สั่งให้เลื่อนหน้าจอลงมาหา Tab นั้น
        tabTrigger.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        console.error('ไม่พบ Tab ID: ' + tabId);
    }
}