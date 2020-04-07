(function() {

  var maxColumns;

  document.addEventListener('DOMContentLoaded', function() {
    // set max number of columns once globally
    maxColumns = getComputedStyle(document.documentElement).getPropertyValue('--max-columns');
    
    // load code theme & and last settings preference
    loadSettings();

    // set column radio buttons based on localStorage if present, else current media query
    var numComparisons = localStorage.getItem("--num-comparisons");
    
    if (!numComparisons) {
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      numComparisons = 1;
      if (vw > 1520) { numComparisons = 3; }
      else if (vw > 1020) { numComparisons = 2; }   
    }
      
    var elementID = 'num-comparisons-' + numComparisons
    var numComparisonsButton = document.getElementById(elementID);
    numComparisonsButton.checked = true;
    changeNumColumns(numComparisonsButton);
    
  }, false);

  // init functions

  // load theme from local storage to save "pref"
  function loadSettings() {
  	// load code theme
		var codeTheme =	localStorage.getItem("code-theme")		
		if (codeTheme) { document.documentElement.setAttribute("data-code-theme", codeTheme);}
		
		// get current number of visible columns
		var numColumns = getComputedStyle(document.documentElement).getPropertyValue('--num-comparisons') + 1;
		
		// load column settings
		for (let i = 1; i <= numColumns; i++) {
		  var itemStr = '--column' + i.toString() + '-item';
		  var colItem = localStorage.getItem(itemStr);
		  if (colItem) {
		    var menuElementID = 'column' + i + '-select';
		    var menuElement = document.getElementById(menuElementID);
		    if (menuElement) {
		      menuElement.value = colItem;
		      selectChange(menuElement);
		    }
		  }
		}
  }


  function selectChange(element) {
    let root = document.documentElement;
  
    var newSelectedItem = element.value;  // ex: swift
    var selectedColumn = element.name;  // ex: 2
  
    // generate variable names (using css style for everywhere)
    var itemVisibilityVarStr = '--' + newSelectedItem + '-visibility'; // ex: --swift-visibility
    var itemColumnVarStr = '--' + newSelectedItem + '-column'; // ex: --swift-column

    // not DRY, but need to look up what's in specific column ex column1: swift
    // not used in CSS
    var columnItemVarStr = '--column' + selectedColumn + '-item'; // ex: --column2-item

    // cleanup from previous settings
    var menus = document.getElementsByClassName('column-select');
    for (menu of menus) {
      // menu is same as event.target: clean up previous settings
      if (menu == element) {
        var prevItem = getComputedStyle(document.documentElement).getPropertyValue(columnItemVarStr).trim();
        if (prevItem != '') {
          var prevItemVisibilityVarStr = '--' + prevItem + '-visibility';
          root.style.setProperty(prevItemVisibilityVarStr, 'none');
        }
        continue;
      }
    
      // clean up previous location settings, if item was displayed
      if (element.value != '' && menu.value === newSelectedItem) {
        var prevColumnItemVarStr = '--column' + menu.name + '-item';
        root.style.setProperty(prevColumnItemVarStr, '');
        menu.value = '';
        localStorage.setItem(prevColumnItemVarStr, '');
      }
    }
  
    // set variables for new selection 
    root.style.setProperty(itemVisibilityVarStr, 'block');
    root.style.setProperty(itemColumnVarStr, selectedColumn);
    root.style.setProperty(columnItemVarStr, newSelectedItem);
    
    // save to localStorage as well
    localStorage.setItem(columnItemVarStr, newSelectedItem);
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
    // UI is selecting number of comparisons, so to get to number of columns add 1
    const newNumComparisons = target.value;
    const newNumColumns = (parseInt(target.value) + 1).toString();
    
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
    document.documentElement.style.setProperty('--num-comparisons', newNumComparisons);
    for (let i = 2; i <= newNumColumns; i++) {
      menuId = 'column' + i.toString() + '-select';
      menuElement = document.getElementById(menuId);
      menuElementParent = document.getElementById(menuId + '-div');
      menuElementParent.style.display = 'inline-block';     
    }
    
    localStorage.setItem("--num-comparisons", newNumComparisons);
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

})();


