/*
   ----------------------------------------------------------------
   linkfustore Services
   ----------------------------------------------------------------
   */


/**
 * Add item to storage object (decorates item object as item)
 */
export function addItem(item) {

    var item = {

        id: Math.ceil(Math.random() * Date.now()),
        name: item.name,
        web_url: item.redirect_url,
        created_at: Date.now(),
        votes_count: 0,
        last_voted_at: null,
        current_user_voted: false

    };

    var appData = getAppData();

    appData.items.unshift(item);

    setAppData({ items: appData.items }, true);

    return item;

}

/**
 * Remove item from storage
 */
export function removeItem(item) {

    var appData = getAppData();

    appData.items.forEach(function (currentValue, index) {
        if (item.id === currentValue.id) {
            appData.items.splice(index, 1);
        }
    });

    setAppData({ items: appData.items }, true);

    return true;

}

/**
 * Increase item votes count
 * 
 * @return Updated item
 */
export function upVoteItem(item) {

    var appData = getAppData();

    var _item = null;

    appData.items.forEach(function (currentValue, index) {
        if (item.id === currentValue.id) {
            currentValue.votes_count++;
            currentValue.current_user_voted = true;
            currentValue.last_voted_at = new Date();
            _item = currentValue;
        }
    });

    setAppData({ items: appData.items }, true);

    return _item;

}

/**
 * Decrease item votes count
 */
export function downVoteItem(item) {

    var appData = getAppData();

    var _item = null;

    appData.items.forEach(function (currentValue, index) {
        if (item.id === currentValue.id) {
            currentValue.votes_count--;
            currentValue.current_user_voted = false;
            currentValue.last_voted_at = new Date();
            _item = currentValue;
        }
    });

    setAppData({ items: appData.items }, true);

    return _item;

}

/*
----------------------------------------------------------------
linkfustore Utilities
----------------------------------------------------------------
*/

/**
 * Initializes app localStorage object
 */
export function initAppData() {

    var appData = {

        items: [],

    };

    if (null === localStorage.getItem('linkfustore')) {
        localStorage.setItem('linkfustore', JSON.stringify(appData));
    }

}

/**
 * Get app localStorage data object
 */
export function getAppData() {

    return JSON.parse(localStorage.getItem('linkfustore'));

}

/**
 * Set app localStorage data object
 * `data` param expected as an object contains "items" array and "userCheated" flag
 * 
 * @param Object data
 * @param Boolean overwrite
 */
export function setAppData(data, overwrite) {

    // todo :: check availability again?

    var appData = getAppData();

    if (data.items) {
        appData.items = overwrite ? data.items : appData.items.concat(data.items);
    }

    localStorage.setItem('linkfustore', JSON.stringify(appData));

}