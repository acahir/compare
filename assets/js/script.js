(function() {

  var maxColumns;

  document.addEventListener('DOMContentLoaded', function() {
    // set max number of columns once globally
    maxColumns = setMaxColumns();
    
    // load code theme preference
    loadTheme();

    // set column radio buttons based on current media query
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var numColumns = 1;
    if (vw > 1520) { numColumns = 3; }
    else if (vw > 1020) { numColumns = 2; }
  
    var elementID = 'num-columns-' + numColumns
    var numColumnsButton = document.getElementById(elementID);
    numColumnsButton.checked = true;
    changeNumColumns(numColumnsButton);
    
  }, false);

  function setMaxColumns() {
    var radioButtons = document.getElementsByClassName('number-of-comparison-radio');
    var max = 0;
    for (let e of radioButtons) {
      max = max > e.value ? max : e.value;
    }
    return max;
  }

  function selectChange(element) {
    let root = document.documentElement;
  
    var newSelectedLanguage = element.value;
    var selectedColumn = (parseInt(element.name) + 1).toString();
  
    // TODO - change storage of what language is currently displayed in a column
    //        to html data attribute, insted of unused css variable. 
  
    // Note - to get CSS variable values after page first loads:
    //  (after setting in JS, they can be accessed from:
    //   document.documentElement.style.getPropertyValue(), but this returns "" before0
    //   being set the first time in JS. So getComputedStyle is consistent)
    //  getComputedStyle(document.documentElement).getPropertyValue('--my-variable-name');
  
    // create css variable names
    var langVisibilityVariableName = '--' + element.value + '-visibility';
    var langColumnPropertyName = '--' + element.value + '-column';
    var columnLanguagePropertyName = '--column' + element.name;
  
    // cleanup from previous settings
    var menus = document.getElementsByTagName('select');
    for (menu of menus) {
      // clear any prev lang in current column
      if (menu == element) {
        var prevLanguage = root.style.getPropertyValue(columnLanguagePropertyName).trim();

        if (prevLanguage != '') {
          var prevLanguageVisibilityVariableName = '--' + prevLanguage + '-visibility';
          root.style.setProperty(prevLanguageVisibilityVariableName, 'none');
        }
        continue;
      }
    
      // clean up previous location, if currently displayed
      if (element.valeu != '' && menu.value === element.value) {
        var prevColumnLanguagePropertyName = '--column' + menu.name;
        root.style.setProperty(prevColumnLanguagePropertyName, '');
      
        menu.value = '';
      }
    }
  
    // set variables for new selection 
    root.style.setProperty(langVisibilityVariableName, 'block');
    root.style.setProperty(langColumnPropertyName, selectedColumn);
    root.style.setProperty(columnLanguagePropertyName, element.value);
  }	


  function collapseSection(element) {
    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = element.scrollHeight;
  
    // temporarily disable all css transitions
    var elementTransition = element.style.transition;
    element.style.transition = '';
  
    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we 
    // aren't transitioning out of 'auto'
    requestAnimationFrame(function() {
      element.style.height = sectionHeight + 'px';
      element.style.transition = elementTransition;
    
      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      requestAnimationFrame(function() {
        element.style.height = 0 + 'px';
      });
    });
  
    // mark the section as "currently collapsed"
    element.setAttribute('data-collapsed', 'true');
  }

  function expandSection(element) {
    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = element.scrollHeight;
  
    // have the element transition to the height of its inner content
    element.style.height = sectionHeight + 'px';

    // when the next css transition finishes (which should be the one we just triggered)
    element.addEventListener('transitionend', function(e) {
      // remove this event listener so it only gets triggered once
      element.removeEventListener('transitionend', arguments.callee);
    
      // remove "height" from the element's inline styles, so it can return to its initial value
      element.style.height = null;
    });
  
    // mark the section as "currently not collapsed"
    element.setAttribute('data-collapsed', 'false');
  }

  function showHide(target) {	
    var sectionName = target.value;
    var section = document.getElementById(sectionName);
  
    var isCollapsed = section.getAttribute('data-collapsed') === 'true';
  
    if (isCollapsed) {
      expandSection(section)
      section.setAttribute('data-collapsed', 'false');
    } else {
      collapseSection(section);
    }
  
    target.innerHTML = target.innerHTML == 'Hide' ? 'Show' : 'Hide';
  }

  function hasClass(element, className) {
      if (!element || !className) {
          return false;
      }

      var classString = element.className,
          nameIndex = classString.indexOf(className);
      return (nameIndex != -1);
  }

  function toggleMenu(showMenu) {
    var menuElement = document.getElementById('section-menu');
  
    if (showMenu) {
      menuElement.classList.add('open');
    } else {
      menuElement.classList.remove('open');
    }
  }

  // Event listeners
  // section show/hide buttons
  var sectionHideButtons = document.getElementsByClassName('section-hide');
  Array.prototype.forEach.call(sectionHideButtons, function (el, index, array) {
    el.addEventListener('click', function(event) {
      showHide(event.target);
    });
  });

  // show section menu
  document.getElementById('section-menu-toggle').addEventListener('mousedown', function(event) {
      toggleMenu(!hasClass(document.getElementById('section-menu'), 'open'));
      event.preventDefault();
  });

  // hide section menu
  var menuLinks = document.getElementsByClassName('section-link');
  Array.prototype.forEach.call(menuLinks, function (el, index, array) {
    el.addEventListener('click', function(event) {
      toggleMenu(false);
    });
  });

  // section link menu
  document.addEventListener('mousedown', function (event) {
    if (event.defaultPrevented) return;
  
    // if menu is open and click is outside of it, close it
    if (hasClass(document.getElementById('section-menu'), 'open') 
        && !(event.target.closest('#section-menu'))) {
      toggleMenu(false);
    }
  })
  
  
  // Number of Column radio button functions
  function changeNumColumns(target) {
    const newNumColumns = target.value;
    // clear up columns before decrease
    var menuId;
    var menuElement;
    var menuElementParent;
    
    // since we don't know previous value, just loop through all columns
    // higher and make sure they are set to none
    for (let i = maxColumns; i > newNumColumns; i--) {
      // first hide any items displayed:
      // set column select menu to ''; then call selectChange()
      menuId = 'column' + i.toString() + '-select';
      menuElement = document.getElementById(menuId);
      menuElementParent = document.getElementById(menuId + '-div');
      menuElement.value = '';
      selectChange(menuElement);
      menuElementParent.style.display = 'none';
    }
     
    // for increase & decrease, set new numColumns value
    // and display the select menus
    document.documentElement.style.setProperty('--numColumns', newNumColumns);
    for (let i = 1; i <= newNumColumns; i++) {
      menuId = 'column' + i.toString() + '-select';
      menuElement = document.getElementById(menuId);
      menuElementParent = document.getElementById(menuId + '-div');
      menuElementParent.style.display = 'inline-block';     
    }
  }
  
  // event listener for radio buttons
  var radioButtons = document.getElementsByClassName('number-of-comparison-radio');
  Array.prototype.forEach.call(radioButtons, function (el, index, arra) {
    el.addEventListener('change', function(event) {
      changeNumColumns(event.target);
    });
  });
  
  var selectMenus = document.getElementsByClassName('column-select');
  for (let e of selectMenus) {
    e.addEventListener('change', function(event) {
      selectChange(event.target);
    }); 
  }
  document.getElementById('column2-select').onchange = function() {
    selectChange(this);
  }
  document.getElementById('column3-select').onchange = function() {
    selectChange(this);
  }

  // Code Theme
  // add listener
  var themeButton = document.getElementById('code-theme-menu-toggle');
  themeButton.addEventListener('click', function(event) {
    toggleCodeTheme(event);
  });

  // toggle code theme
  function toggleCodeTheme(e) {		
    // temporariily set transition class on html element
    document.documentElement.classList.add('transition-theme')
  
    // change data-theme
    if (document.documentElement.getAttribute("data-code-theme") != "dark") {
      document.documentElement.setAttribute("data-code-theme", "dark")
      localStorage.setItem("code-theme", "dark")
    } else {
      document.documentElement.setAttribute("data-code-theme", "light")
      localStorage.setItem("code-theme", "light")
    }
  
    // remove transition class
    window.setTimeout(function() {
      document.documentElement.classList.remove('transition-theme')
    }, 1000)
  }

  // load theme from local storage to save "pref"
  function loadTheme() {
  	//var theme = localStorage.getItem("theme")
		var codeTheme =	localStorage.getItem("code-theme")
		
		//document.documentElement.setAttribute("data-theme", theme)
		if (codeTheme) {
  		document.documentElement.setAttribute("data-code-theme", codeTheme);
    }
  }

})();


