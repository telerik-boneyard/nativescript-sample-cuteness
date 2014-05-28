
function JSToNSDictionary(obj) {
    if (obj) {
        var dict = new Foundation.NSMutableDictionary();
        for (var id in obj) {
            try {
                if (typeof (obj[id]) !== 'function') {
                    dict.setObjectForKey(obj[id], id);
                }
            } catch (err) {
            }
        }
        return dict;
    }
    return null;
}

function decodeHtml(str)
{
    return str.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"');
}

module.exports = {
    'JSToNSDictionary' : JSToNSDictionary,
    'decodeHtml': decodeHtml
};
