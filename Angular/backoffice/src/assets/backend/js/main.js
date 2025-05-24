function slideToggle(t, e, o) {
  0 === t.clientHeight ? j(t, e, o, !0) : j(t, e, o);
}
function slideUp(t, e, o) {
  j(t, e, o);
}
function slideDown(t, e, o) {
  j(t, e, o, !0);
}
function j(t, e, o, i) {
  if (!t) return;
  void 0 === e && (e = 400), void 0 === i && (i = !1);
  t.style.overflow = "hidden", i && (t.style.display = "block");
  let p, l = window.getComputedStyle(t),
      n = parseFloat(l.getPropertyValue("height")),
      a = parseFloat(l.getPropertyValue("padding-top")),
      s = parseFloat(l.getPropertyValue("padding-bottom")),
      r = parseFloat(l.getPropertyValue("margin-top")),
      d = parseFloat(l.getPropertyValue("margin-bottom")),
      g = n / e, y = a / e, m = s / e, u = r / e, h = d / e;
  window.requestAnimationFrame(function l(x) {
      void 0 === p && (p = x);
      let f = x - p;
      i ? (t.style.height = g * f + "px", t.style.paddingTop = y * f + "px", t.style.paddingBottom = m * f + "px", t.style.marginTop = u * f + "px", t.style.marginBottom = h * f + "px") : (t.style.height = n - g * f + "px", t.style.paddingTop = a - y * f + "px", t.style.paddingBottom = s - m * f + "px", t.style.marginTop = r - u * f + "px", t.style.marginBottom = d - h * f + "px");
      f >= e ? (t.style.height = "", t.style.paddingTop = "", t.style.paddingBottom = "", t.style.marginTop = "", t.style.marginBottom = "", t.style.overflow = "", i || (t.style.display = "none"), "function" == typeof o && o()) : window.requestAnimationFrame(l);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  let sidebar = document.getElementById('sidebar');
  if (sidebar) {
      let w = window.innerWidth;
      if (w < 1200) sidebar.classList.remove('active');
  }
});

window.addEventListener('resize', () => {
  let sidebar = document.getElementById('sidebar');
  if (sidebar) {
      let w = window.innerWidth;
      if (w < 1200) sidebar.classList.remove('active');
      else sidebar.classList.add('active');
  }
});

document.querySelectorAll('.burger-btn, .sidebar-hide').forEach(button => {
  button.addEventListener('click', () => {
      let sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.toggle('active');
  });
});

let sidebarItems = document.querySelectorAll('.sidebar-item.has-sub');
sidebarItems.forEach(sidebarItem => {
  let sidebarLink = sidebarItem.querySelector('.sidebar-link');
  if (sidebarLink) {
      sidebarLink.addEventListener('click', function (e) {
          e.preventDefault();
          let submenu = sidebarItem.querySelector('.submenu');
          if (!submenu) return;

          if (submenu.classList.contains('active')) submenu.style.display = "block";
          submenu.classList.toggle('active');
          slideToggle(submenu, 300);
      });
  }
});

// Perfect Scrollbar Init
if (typeof PerfectScrollbar == 'function') {
  let container = document.querySelector(".sidebar-wrapper");
  if (container) {
      new PerfectScrollbar(container, {
          wheelPropagation: false
      });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  let sidebarItems = document.querySelectorAll('.sidebar-item.has-sub');

  sidebarItems.forEach(sidebarItem => {
      let link = sidebarItem.querySelector('.sidebar-link');
      let submenu = sidebarItem.querySelector('.submenu');

      link.addEventListener('click', function (e) {
          e.preventDefault();

          // Vérifie si le sous-menu est actif
          if (submenu.classList.contains('active')) {
              submenu.classList.remove('active');
              submenu.style.display = "none";
          } else {
              // Fermer tous les autres sous-menus ouverts
              document.querySelectorAll('.submenu.active').forEach(activeSubmenu => {
                  activeSubmenu.classList.remove('active');
                  activeSubmenu.style.display = "none";
              });

              // Ouvre le sous-menu cliqué
              submenu.classList.add('active');
              submenu.style.display = "block";
          }
      });
  });
});


// Scroll into active sidebar item if exists
let activeSidebarItem = document.querySelector('.sidebar-item.active');
if (activeSidebarItem) activeSidebarItem.scrollIntoView(false);
