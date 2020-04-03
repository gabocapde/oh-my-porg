/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];

    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

/**
 * Change the images of the current page for Porg images.
 *
 * @param {string} color The Porg image index.
 */
function showPorgImages(index) {
  chrome.tabs.executeScript(null, {
    code: 'var index = ' + index + ';'
  }, function() {
      chrome.tabs.executeScript(null, {file: 'show-me-the-porgs.js'});
  });
}

/**
 * Gets the saved Porg image index for url.
 *
 * @param {string} url URL whose Porg Image Index is to be retrieved.
 * @param {function(string)} callback called with the saved Porg Image Index for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedPorgImageIndex(url, callback) {
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

/**
 * Sets the given Porg Image Index for url.
 *
 * @param {string} url URL for which Porg Image Index is to be saved.
 * @param {string} the Porg Image Index to be saved.
 */
function savePorgImageIndex(url, color) {
  var items = {};
  items[url] = color;

  chrome.storage.sync.set(items);
}

/**
 * Sets the overlay for the selected image in the menu.
 *
 * @param {int} index of the selected image to overlay.
 */
function setOverlaySelectedPorg(index) {
  var porgSelectors = document.getElementsByClassName('porg-selector');
  for (var i = 0; i < porgSelectors.length; i++) {
    porgSelectors[i].classList.remove("porg-selector-selected");
  }

  var porgSelectorToSelect = document.getElementById('porg-selector-' + index);
  porgSelectorToSelect.classList.add("porg-selector-selected");
}


// This extension loads the saved Porg image for the current tab if one
// exists. The user can select a new Porg Image Index for the
// current page, and it will be saved as part of the extension's isolated storage.
document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    // Load the saved Porg Image Index for this page and modify the dropdown
    // value, if needed.
    getSavedPorgImageIndex(url, (savedIndex) => {
      if (savedIndex) {
        showPorgImages(savedIndex);
        setOverlaySelectedPorg(savedIndex);
      }
    });

    var porgSelectors = document.getElementsByClassName('porg-selector');
    // Ensure the Porg Image Index is changed and saved when one selector is clicked
    // selection changes.
    for (var i = 0; i < porgSelectors.length; i++) {
      porgSelectors[i].addEventListener('click',  (elem) => {
        var index = parseInt(elem.currentTarget.dataset.index);
        
        //Arrange porg-selector-selected class for fixed overlay
        setOverlaySelectedPorg(parseInt(elem.currentTarget.dataset.index));

        //Call the replacer
        showPorgImages(index);
        savePorgImageIndex(url, index);
      });
    }

  });
});
