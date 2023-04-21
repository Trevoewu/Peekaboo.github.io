/* global NexT, CONFIG, Velocity */

NexT.boot = {};

NexT.boot.registerEvents = function() {

  NexT.utils.registerScrollPercent();
  NexT.utils.registerCanIUseTag();

  // Mobile top menu bar.
  document.querySelector('.site-nav-toggle .toggle').addEventListener('click', () => {
    event.currentTarget.classList.toggle('toggle-close');
    var siteNav = document.querySelector('.site-nav');
    var animateAction = siteNav.classList.contains('site-nav-on') ? 'slideUp' : 'slideDown';

    if (typeof Velocity === 'function') {
      Velocity(siteNav, animateAction, {
        duration: 200,
        complete: function() {
          siteNav.classList.toggle('site-nav-on');
        }
      });
    } else {
      siteNav.classList.toggle('site-nav-on');
    }
  });

  var TAB_ANIMATE_DURATION = 200;
  document.querySelectorAll('.sidebar-nav li').forEach((element, index) => {
    element.addEventListener('click', event => {
      var item = event.currentTarget;
      var activeTabClassName = 'sidebar-nav-active';
      var activePanelClassName = 'sidebar-panel-active';
      if (item.classList.contains(activeTabClassName)) return;

      var targets = document.querySelectorAll('.sidebar-panel');
      var target = targets[index];
      var currentTarget = targets[1 - index];
      window.anime({
        targets : currentTarget,
        duration: TAB_ANIMATE_DURATION,
        easing  : 'linear',
        opacity : 0,
        complete: () => {
          // Prevent adding TOC to Overview if Overview was selected when close & open sidebar.
          currentTarget.classList.remove(activePanelClassName);
          target.style.opacity = 0;
          target.classList.add(activePanelClassName);
          window.anime({
            targets : target,
            duration: TAB_ANIMATE_DURATION,
            easing  : 'linear',
            opacity : 1
          });
        }
      });

      [...item.parentNode.children].forEach(element => {
        element.classList.remove(activeTabClassName);
      });
      item.classList.add(activeTabClassName);
    });
  });

  window.addEventListener('resize', NexT.utils.initSidebarDimension);

  window.addEventListener('hashchange', () => {
    var tHash = location.hash;
    if (tHash !== '' && !tHash.match(/%\S{2}/)) {
      var target = document.querySelector(`.tabs ul.nav-tabs li a[href="${tHash}"]`);
      target && target.click();
    }
  });
};

NexT.boot.refresh = function() {

  /**
   * Register JS handlers by condition option.
   * Need to add config option in Front-End at 'layout/_partials/head.swig' file.
   */
  CONFIG.fancybox && NexT.utils.wrapImageWithFancyBox();
  CONFIG.mediumzoom && window.mediumZoom('.post-body :not(a) > img, .post-body > img');
  CONFIG.lazyload && window.lozad('.post-body img').observe();
  CONFIG.pangu && window.pangu.spacingPage();

  CONFIG.exturl && NexT.utils.registerExtURL();
  CONFIG.copycode.enable && NexT.utils.registerCopyCode();
  NexT.utils.registerTabsTag();
  NexT.utils.registerActiveMenuItem();
  NexT.utils.registerLangSelect();
  NexT.utils.registerSidebarTOC();
  NexT.utils.wrapTableWithBox();
  NexT.utils.registerVideoIframe();
};

NexT.boot.motion = function() {
  // Define Motion Sequence & Bootstrap Motion.
  if (CONFIG.motion.enable) {
    NexT.motion.integrator
      .add(NexT.motion.middleWares.logo)
      .add(NexT.motion.middleWares.menu)
      .add(NexT.motion.middleWares.postList)
      .add(NexT.motion.middleWares.sidebar)
      .bootstrap();
  }
  NexT.utils.updateSidebarPosition();
};

document.addEventListener('DOMContentLoaded', () => {
  NexT.boot.registerEvents();
  NexT.boot.refresh();
  NexT.boot.motion();
});
// img 路径替换脚本 来源:
//  http://songpengpeng.com/2022/05/09/%E6%97%A5%E5%B8%B8%E8%BE%93%E5%87%BA/07-Hexo%E7%9A%84%E6%9C%AC%E5%9C%B0%E5%9B%BE%E7%89%87%E9%97%AE%E9%A2%98/
var images = document.getElementsByTagName("img");
var loHref = window.location.href
let baseHref = loHref.substring(0,loHref.lastIndexOf("/")+1)
for (let i = 0; i <images.length; i++) {
    let executeNum = 0;
    let src = images[i]['src']
    let img = new Image();
    img.src = src
    img.onload= ()=> {
    }
    img.onerror= ()=> {
        executeNum ++ ;
        handAMark(src)
        if(executeNum>3){
            return;
        }
        let fileName = src.substring(src.lastIndexOf("/")+1);
        images[i].src= baseHref+fileName
    }
}



function  handAMark(src){
    var as = document.getElementsByClassName("fancybox");
    for (let i = 0; i <as.length; i++) {
        let executeNum = 0;
        let href = as[i]['href']
        if(href==src){
            let img = new Image();
            img.src = src

            img.onload= ()=> {
            }
            img.onerror= ()=> {
                executeNum ++ ;
                if(executeNum>3){
                    return;
                }
                let fileName = src.substring(src.lastIndexOf("/")+1);
                as[i].href= baseHref+fileName
            }
        }

    }

}

