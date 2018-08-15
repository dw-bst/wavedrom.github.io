(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

function appendSaveAsDialog (index, output) {
    var div;
    var menu;

    function closeMenu(e) {
        var left = parseInt(menu.style.left, 10);
        var top = parseInt(menu.style.top, 10);
        if (
            e.x < left ||
            e.x > (left + menu.offsetWidth) ||
            e.y < top ||
            e.y > (top + menu.offsetHeight)
        ) {
            menu.parentNode.removeChild(menu);
            document.body.removeEventListener('mousedown', closeMenu, false);
        }
    }

    div = document.getElementById(output + index);

    div.childNodes[0].addEventListener('contextmenu',
        function (e) {
            var list, savePng, saveSvg;

            menu = document.createElement('div');

            menu.className = 'wavedromMenu';
            menu.style.top = e.y + 'px';
            menu.style.left = e.x + 'px';

            list = document.createElement('ul');
            savePng = document.createElement('li');
            savePng.innerHTML = 'Save as PNG';
            list.appendChild(savePng);

            saveSvg = document.createElement('li');
            saveSvg.innerHTML = 'Save as SVG';
            list.appendChild(saveSvg);

            //var saveJson = document.createElement('li');
            //saveJson.innerHTML = 'Save as JSON';
            //list.appendChild(saveJson);

            menu.appendChild(list);

            document.body.appendChild(menu);

            savePng.addEventListener('click',
                function () {
                    var html, firstDiv, svgdata, img, canvas, context, pngdata, a;

                    html = '';
                    if (index !== 0) {
                        firstDiv = document.getElementById(output + 0);
                        html += firstDiv.innerHTML.substring(166, firstDiv.innerHTML.indexOf('<g id="waves_0">'));
                    }
                    html = [div.innerHTML.slice(0, 166), html, div.innerHTML.slice(166)].join('');
                    svgdata = 'data:image/svg+xml;base64,' + btoa(html);
                    img = new Image();
                    img.src = svgdata;
                    canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context = canvas.getContext('2d');
                    context.drawImage(img, 0, 0);

                    pngdata = canvas.toDataURL('image/png');

                    a = document.createElement('a');
                    a.href = pngdata;
                    a.download = 'wavedrom.png';
                    a.click();

                    menu.parentNode.removeChild(menu);
                    document.body.removeEventListener('mousedown', closeMenu, false);
                },
                false
            );

            saveSvg.addEventListener('click',
                function () {
                    var html,
                        firstDiv,
                        svgdata,
                        a;

                    html = '';
                    if (index !== 0) {
                        firstDiv = document.getElementById(output + 0);
                        html += firstDiv.innerHTML.substring(166, firstDiv.innerHTML.indexOf('<g id="waves_0">'));
                    }
                    html = [div.innerHTML.slice(0, 166), html, div.innerHTML.slice(166)].join('');
                    svgdata = 'data:image/svg+xml;base64,' + btoa(html);

                    a = document.createElement('a');
                    a.href = svgdata;
                    a.download = 'wavedrom.svg';
                    a.click();

                    menu.parentNode.removeChild(menu);
                    document.body.removeEventListener('mousedown', closeMenu, false);
                },
                false
            );

            menu.addEventListener('contextmenu',
                function (ee) {
                    ee.preventDefault();
                },
                false
            );

            document.body.addEventListener('mousedown', closeMenu, false);

            e.preventDefault();
        },
        false
    );
}

module.exports = appendSaveAsDialog;

/* eslint-env browser */

},{}],2:[function(require,module,exports){
'use strict';

var // obj2ml = require('./obj2ml'),
    jsonmlParse = require('./jsonml-parse');

// function createElement (obj) {
//     var el;
//
//     el = document.createElement('g');
//     el.innerHTML = obj2ml(obj);
//     return el.firstChild;
// }

module.exports = jsonmlParse;
// module.exports = createElement;

/* eslint-env browser */

},{"./jsonml-parse":22}],3:[function(require,module,exports){
'use strict';

var eva = require('./eva'),
    renderWaveForm = require('./render-wave-form');

function editorRefresh () {
    // var svg,
    // 	ser,
    // 	ssvg,
    // 	asvg,
    // 	sjson,
    // 	ajson;

    renderWaveForm(0, eva('InputJSON_0'), 'WaveDrom_Display_');

    /*
    svg = document.getElementById('svgcontent_0');
    ser = new XMLSerializer();
    ssvg = '<?xml version='1.0' standalone='no'?>\n' +
    '<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>\n' +
    '<!-- Created with WaveDrom -->\n' +
    ser.serializeToString(svg);

    asvg = document.getElementById('download_svg');
    asvg.href = 'data:image/svg+xml;base64,' + window.btoa(ssvg);

    sjson = localStorage.waveform;
    ajson = document.getElementById('download_json');
    ajson.href = 'data:text/json;base64,' + window.btoa(sjson);
    */
}

module.exports = editorRefresh;

},{"./eva":4,"./render-wave-form":36}],4:[function(require,module,exports){
'use strict';

function eva (id) {
    var TheTextBox, source;

    function erra (e) {
        return { signal: [{ name: ['tspan', ['tspan', {class:'error h5'}, 'Error: '], e.message] }]};
    }

    TheTextBox = document.getElementById(id);

    /* eslint-disable no-eval */
    if (TheTextBox.type && TheTextBox.type === 'textarea') {
        try { source = eval('(' + TheTextBox.value + ')'); } catch (e) { return erra(e); }
    } else {
        try { source = eval('(' + TheTextBox.innerHTML + ')'); } catch (e) { return erra(e); }
    }
    /* eslint-enable  no-eval */

    if (Object.prototype.toString.call(source) !== '[object Object]') {
        return erra({ message: '[Semantic]: The root has to be an Object: "{signal:[...]}"'});
    }
    if (source.signal) {
        if (Object.prototype.toString.call(source.signal) !== '[object Array]') {
            return erra({ message: '[Semantic]: "signal" object has to be an Array "signal:[]"'});
        }
    } else if (source.assign) {
        if (Object.prototype.toString.call(source.assign) !== '[object Array]') {
            return erra({ message: '[Semantic]: "assign" object hasto be an Array "assign:[]"'});
        }
    } else if (source.reg) {
        // test register
    } else if(source.fsm) {
        if (Object.prototype.toString.call(source.fsm) !== '[object Array]') {
            return erra({message:'[Semantic]: "fsm" object has to be an Array "fsm:[]"'});
        }
    } else {
        return erra({ message: '[Semantic]: "signal:[...]", "assign:[...]" or "fsm:[...]" property is missing inside the root Object'});
    }
    return source;
}

module.exports = eva;

/* eslint-env browser */

},{}],5:[function(require,module,exports){
'use strict';

function findLaneMarkers (lanetext) {
    var gcount = 0,
        lcount = 0,
        ret = [];

    lanetext.forEach(function (e) {
        if (
            (e === 'vvv-2') ||
            (e === 'vvv-3') ||
            (e === 'vvv-4') ||
            (e === 'vvv-5')
        ) {
            lcount += 1;
        } else {
            if (lcount !== 0) {
                ret.push(gcount - ((lcount + 1) / 2));
                lcount = 0;
            }
        }
        gcount += 1;

    });

    if (lcount !== 0) {
        ret.push(gcount - ((lcount + 1) / 2));
    }

    return ret;
}

module.exports = findLaneMarkers;

},{}],6:[function(require,module,exports){
'use strict';

function createDataCont(source)
{
    function createTrArray(this_link, start_state, states, transitions, tmp)
    {
        var linked_state = [];
        
        if (Array.isArray(this_link.state) && this_link.state.length)
        {
            for (var scounter_i = 0; scounter_i < this_link.state.length; scounter_i++)
            {
                linked_state.push(getStateByRefId(states, this_link.state[scounter_i]));
            }
        }
        else if (this_link.state && !Array.isArray(this_link.state))
        {
            linked_state.push(getStateByRefId(states, this_link.state));
        }
        else
        {
            linked_state.push(start_state);
        }
        
        if (linked_state.length)
        {
            {
                var t = {}, tcounter = [], tsame = [];
                
                t.id = tmp.tid++;
                
                t.p = {};
                
                t.start = start_state;
                t.p.pse0 = { 'x':0, 'y':0 };
                t.p.psh0 = { 'x':0, 'y':0 };
                
                if (linked_state.length > 1)
                {
                    t.p.pmhs = { 'x':0, 'y':0 };
                    t.p.pm = { 'x':0, 'y':0 };
                    t.p.pmhe = { 'x':0, 'y':0 };
                }
                
                t.end = [];
                
                for (var link_i = 0; link_i < linked_state.length; link_i++)
                {
                    t.end.push(linked_state[link_i]);
                    t.p['peh' + link_i] = { 'x':0, 'y':0 };
                    t.p['pea' + link_i] = { 'x':0, 'y':0 };
                    t.p['pee' + link_i] = { 'x':0, 'y':0 };
                }
                
                setProps(propSynonyms, 't', customProps, this_link, t);
                
                t.drawn = false;
                
                states[start_state.id].links.push(t);
                for (var link_i = 0; link_i < linked_state.length; link_i++)
                {
                    states[linked_state[link_i].id].links.push(t);
                }
                transitions.push(t);
                
                tcounter = getTransitionByRefId(transitions, linked_state, start_state.refid);
                
                if (tcounter.length)
                {
                    for (var tcounter_i = 0; tcounter_i < tcounter.length; tcounter_i++)
                    {
                        tcounter[tcounter_i].pair = true;
                        t.pair = true;
                    }
                }
                else
                {
                    t.pair = false;
                }
                
                tsame = getTransitionByRefId(transitions, start_state.refid, linked_state);
                
                if (tsame.length)
                {
                    for (var tsame_i = 0; tsame_i < tsame.length; tsame_i++)
                    {
                        tsame[tsame_i].tsame = tsame;
                    }
                }
            }
        }
    }
    
    function stringToObject(str, style, dst)
    {
        function createLineElem(content, fontObj)
        {
            if (content)
            {
                var lineelem = {'content': content};
                
                for (var fp in fontObj)
                {
                    if (fontObj[fp].type == 'simple')
                    {
                        lineelem[fp] = fontObj[fp].level ? true : false;
                    }
                    else if (fontObj[fp].type == 'option')
                    {
                        lineelem[fp] = fontObj[fp].data[fontObj[fp].level];
                    }
                }
                
                return lineelem;
            }
        }
        
        if (str)
        {
            var cnt = 0;
            var from = 0;
            var cmdinitchar = ':';
            var cmd = [];
            var fontprop = {
                                    'bf': { 'level':0, 'type':'simple' },
                                    'it': { 'level':0, 'type':'simple' },
                                    'fs': { 'level':0, 'type':'option', 'data':[null] }
                                };
            var lines = [];
            var line = [];
            
            //set global style
            if (dst)
            {
                if (dst.textstyle && dst.textstyle.bf || dst[style] && dst[style].bf) fontprop.bf.level++;
                if (dst.textstyle && dst.textstyle.it || dst[style] && dst[style].it) fontprop.it.level++;
                if (dst.textstyle && dst.textstyle.fs) fontprop.fs.data[fontprop.fs.level] = dst.textstyle.fs;
                if (dst[style] && dst[style].fs) fontprop.fs.data[fontprop.fs.level] = dst[style].fs;
            }
            
            while (cnt < str.length)
            {
                if (str[cnt] == cmdinitchar)
                {
                    cnt++;
                    
                    for (var prop in fontprop)
                    {
                        if (str.substr(cnt, prop.length) == prop)
                        {
                            var le = createLineElem(str.substring(from, cnt - 1), fontprop);
                            var setle = false;
                            
                            if (fontprop[prop].type == 'simple' && str[cnt + prop.length] == '{')
                            {
                                setle = true;
                                fontprop[prop].level++;
                                cmd.push(prop);
                                from = cnt = cnt + prop.length + 1;
                            }
                            else if (fontprop[prop].type == 'option' && str[cnt + prop.length] == '(')
                            {
                                var option = str.substr(cnt + prop.length).match(/\((.*?)\)\{/);
                                
                                if (option && !(option.index))
                                {
                                    switch(prop)
                                    {
                                        case 'fs':
                                            if (!isNaN(option[1]))
                                            {
                                                setle = true;
                                                fontprop[prop].level++;
                                                fontprop[prop].data.push(parseInt(option[1]));
                                                cmd.push(prop);
                                                from = cnt = cnt + prop.length + option[0].length;
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }
                            
                            if (le && setle)
                            {
                                line.push(le);
                                break;
                            }
                        }
                    }
                }
                else if (str[cnt] == '}')
                {
                    cnt++;
                    
                    var latestcmd = cmd.pop();
                    
                    if (latestcmd)
                    {
                        var le = createLineElem(str.substring(from, cnt - 1), fontprop);
                        
                        if (le) line.push(le);
                        
                        fontprop[latestcmd].level--;
                        if (fontprop[latestcmd].type == 'option') fontprop[latestcmd].data.pop();
                        
                        from = cnt;
                    }
                }
                else if (str[cnt] == '\n')
                {
                    cnt++;
                    
                    var le = createLineElem(str.substring(from, cnt - 1), fontprop);
                    
                    if (le) line.push(le);
                    else if (!line.length) line.push({ 'content':' ' });
                    
                    lines.push(line);
                    
                    line = [];
                    
                    from = cnt;
                }
                else
                {
                    cnt++;
                }
            }
            
            var le = createLineElem(str.substring(from, str.length), fontprop);
            if (le) line.push(le);
            lines.push(line);
            
            return lines;
        }
        else return;
    }
    
    function styleArrayToObject(arr, obj)
    {
        if (arr)
        {
            var array = arrayify(arr);
            
            if (!obj) obj = {};
            
            for (var arr_i = 0; arr_i < array.length; arr_i++)
            {
                var option = array[arr_i].match(/(.*)\((.*?)\)|(.*)/);
                
                if (option[1])//group 1 ... (option)
                {
                    switch(option[1])
                    {
                        case 'fs':
                            if (!obj.hasOwnProperty(option[1])) obj[option[1]] = option[2];
                            break;
                        default:
                            break;
                    }
                }
                else if (option[3])//group 3 ... simple
                {
                    switch(option[3])
                    {
                        case 'bf':
                        case 'it':
                            if (!obj.hasOwnProperty(option[3])) obj[option[3]] = true;
                            break;
                        default:
                            break;
                    }
                }
            }
            
            return obj;
        }
        
        return obj;
    }
    
    function setProps(synArr, type, propsObj, src, dst)
    {
        function createTrTextArray(src, newKey, style, dst)
        {
            var returnArray = [];
            
            if (dst.pt) returnArray = dst.pt;
            
            if (src)
            {
                if (Array.isArray(src))
                {
                    for (var s_i = 0; s_i < src.length; s_i++)
                    {
                        if (s_i < (dst.end.length > 1 ? dst.end.length + 1 : dst.end.length))
                        {
                            if (typeof src[s_i] === 'undefined')
                            {
                                if (typeof returnArray[s_i] === 'undefined')
                                {
                                    returnArray.push(null);
                                }
                            }
                            else
                            {
                                if (typeof returnArray[s_i] === 'undefined' || returnArray[s_i] === null)
                                {
                                    var textObj = {
                                        'x':0,
                                        'y':0,
                                        'xoff':0,
                                        'yoff':0
                                        };
                                    textObj[newKey] = stringToObject(src[s_i], style, dst);
                                    returnArray[s_i] = textObj;
                                }
                                else
                                {
                                    returnArray[s_i][newKey] = stringToObject(src[s_i], style, dst);
                                }
                            }
                        }
                        else
                        {
                            break;
                        }
                    }
                }
                else
                {
                    if (typeof src === 'undefined')
                    {
                        returnArray[0] = null;
                    }
                    else
                    {
                        if (typeof returnArray[0] === 'undefined' || returnArray[0] === null)
                        {
                            var textObj = {
                                    'x':0,
                                    'y':0,
                                    'xoff':0,
                                    'yoff':0
                                };
                            textObj[newKey] = stringToObject(src, style, dst);
                            returnArray[0] = textObj;
                        }
                        else
                        {
                            returnArray[0][newKey] = stringToObject(src, style, dst);
                        }
                    }
                }
            }
            
            return returnArray;
        }
        
        function getKeyVal(type, synArrProp, propsObj, src)
        {
            var result, midResult;
            var propsEnd = 0;
            
            if (src.def && propsObj)
            {
                var sepProps = arrayify(src.def);
                
                propsEnd = sepProps.length;
            }
            
            for (var props_i = -1; props_i < propsEnd; props_i++)
            {
                result = undefined;
                
                for (var syn_i = 1; syn_i < synArrProp.length; syn_i++)
                {
                    var syn = synArrProp[syn_i];
                    
                    if (props_i < 0)
                    {
                        if (syn in src)
                        {
                            result = src[syn];
                            break;
                        }
                        else
                        {
                            var id;
                            
                            switch(type)
                            {
                                case 's':
                                    id = 'state';
                                    break;
                                case 't':
                                    break;
                                case 'n':
                                    id = 'id';
                                    break;
                                default:
                                    break;
                            }
                            
                            if (propsObj && src[id] && (src[id] in propsObj) && (syn in propsObj[src[id]]))
                            {
                                result = propsObj[src[id]][syn];
                                break;
                            }
                        }
                    }
                    else
                    {
                        if (propsObj && (sepProps[props_i] in propsObj) && (syn in propsObj[sepProps[props_i]]))
                        {
                            result = propsObj[sepProps[props_i]][syn];
                            break;
                        }
                    }
                }
                
                if (result)
                {
                    if (synArrProp[0].match(/.*style$/))
                    {
                        midResult = styleArrayToObject(result, midResult);
                    }
                    else break;
                }
            }
            
            return midResult ? midResult : result;
        }
        
        function validTextColour(stringToTest)//Wk_of_Angmar - https://stackoverflow.com/questions/6386090/validating-css-color-names
        {
            //Alter the following conditions according to your need.
            if (stringToTest === '') { return false; }
            if (stringToTest === 'inherit') { return false; }
            if (stringToTest === 'transparent') { return false; }

            var image = document.createElement('img');
            image.style.color = 'rgb(0, 0, 0)';
            image.style.color = stringToTest;
            if (image.style.color !== 'rgb(0, 0, 0)') { return true; }
            image.style.color = 'rgb(255, 255, 255)';
            image.style.color = stringToTest;
            return image.style.color !== 'rgb(255, 255, 255)';
        }
        
        for (var prop_i = 0; prop_i < synArr[type].length; prop_i++)
        {
            var prop = synArr[type][prop_i][0];
            var keyVal = getKeyVal(type, synArr[type][prop_i], propsObj, src);
            var style = '';
            
            switch(prop)
            {
                case 'name':
                    if (!style) style = 'namestyle';
                    if (!keyVal) keyVal = src.state;
                case 'action':
                    if (!style) style = 'actionstyle';
                case 'cond':
                    if (!style) style = 'conditionstyle';
                    if (type == 't')
                    {
                        if (keyVal) dst.pt = createTrTextArray(keyVal, prop, style, dst);
                        break;
                    }
                case 'text':
                    if (Array.isArray(keyVal) && type == 's') keyVal = keyVal[0];
                    dst[prop] = stringToObject(keyVal, style, dst);
                    break;
                case 'fill':
                case 'basecolor':
                case 'textcolor':
                case 'namecolor':
                case 'linecolor':
                case 'actioncolor':
                case 'conditioncolor':
                    if (!validTextColour(keyVal))
                    {
                        if (typeof customColors != 'undefined')
                        {
                            for (var colorSet in customColors)
                            {
                                if (keyVal in customColors[colorSet])
                                {
                                    dst[prop] = customColors[colorSet][keyVal];
                                    break;
                                }
                            }
                            
                            if (!dst[prop]) dst[prop] = undefined;
                            
                            break;
                        }
                    }
                default:
                    dst[prop] = keyVal;
                    break;
            }
        }
    }
    
    function getTransitionByRefId(transitions, srefid1, srefid2)
    {
        var t = [], s1a = [], tsa = [], s2a = [], tse = [];
        
        if (Array.isArray(srefid1)) s1a = srefid1;
        else s1a.push({'refid':srefid1});
        
        if (Array.isArray(srefid2)) s2a = srefid2;
        else s2a.push({'refid':srefid2});
        
        for (var t_i = 0; t_i < transitions.length; t_i++)
        {
            var sc = 0, ec = 0;
            
            if (Array.isArray(transitions[t_i].start)) tsa = transitions[t_i].start;
            else tsa.push({'refid':transitions[t_i].start.refid});
            
            if (Array.isArray(transitions[t_i].end)) tse = transitions[t_i].end;
            else tse.push({'refid':transitions[t_i].end.refid});
            
            if (s1a.length == tsa.length && s2a.length == tse.length)
            {
                for (var a_i = 0; a_i < s1a.length; a_i++)
                {
                    if (s1a[a_i] == tsa[a_i]) sc++;
                }
                
                if (sc == s1a.length)
                {
                    for (var a_i = 0; a_i < s2a.length; a_i++)
                    {
                        if (s2a[a_i] == tse[a_i]) ec++;
                    }
                    
                    if (ec == s2a.length)
                    {
                        t.push(transitions[t_i]);
                    }
                }
            }
        }

        return t;
    }

    function getStateByRefId(states, refid)
    {
        for (var state_i = 0; state_i < states.length; state_i++)
        {
            if (states[state_i].refid== refid)
            {
                return states[state_i];
            }
        }
        
        return false;
    }
    
    function arrayify(arr)
    {
        var returnArray = [];
        
        if (Array.isArray(arr))
        {
            returnArray = arr;
        }
        else
        {
            returnArray.push(arr);
        }
        
        return returnArray;
    }
    
    var propSynonyms = {//order is relevant (e.g. styles before strings)
                                s: [
                                        ['textstyle','textstyle'],
                                        ['namestyle','namestyle'],
                                        ['actionstyle','actionstyle','actstyle'],
                                        ['name','name'],
                                        ['action','action'],
                                        ['fill','fill'],
                                        ['basecolor','color'],
                                        ['textcolor','textcolor'],
                                        ['namecolor','namecolor'],
                                        ['linecolor','linecolor'],
                                        ['actioncolor','actioncolor','actcolor']
                                    ],
                                t: [
                                        ['textstyle','textstyle'],
                                        ['conditionstyle','conditionstyle','condstyle'],
                                        ['actionstyle','actionstyle','actstyle'],
                                        ['cond','condition','cond'],
                                        ['action','action'],
                                        ['basecolor','color'],
                                        ['textcolor','textcolor'],
                                        ['conditioncolor','conditioncolor','condcolor'],
                                        ['linecolor','linecolor'],
                                        ['actioncolor','actioncolor','actcolor']
                                    ],
                                n: [
                                        ['text','text'],
                                        ['fill','fill'],
                                        ['textcolor','textcolor']
                                    ]
                            };
    
    var states = [];
    var transitions = [];
    var tmp = { tid:0 };
    var notes = [];
    var coord = {};
    var customProps = source.def;
    
    for (var state_i = 0; state_i < source.fsm.length; state_i++)
    {
        var s = {};
        var this_state = source.fsm[state_i];
        
        s.id = state_i;
        s.refid = this_state.state;
        s.zerostate = (this_state.state == 0 || this_state.state == '0') ? true : false;
        s.links = [];
        
        setProps(propSynonyms, 's', customProps, this_state, s);
        
        states.push(s);
    }
    
    for (var state_i = 0; state_i < source.fsm.length; state_i++)
    {
        var this_state = source.fsm[state_i];
        var start_state = getStateByRefId(states, this_state.state);
            
        if (this_state.next)
        {
            var linkArray = arrayify(this_state.next);
            
            for (var next_i = 0; next_i < linkArray.length; next_i++)
            {
                var this_link = linkArray[next_i];
                
                createTrArray(this_link, start_state, states, transitions, tmp);
            }
        }
    }
    
    if (source.notes)
    {
        for (var note_i = 0; note_i < source.notes.length; note_i++)
        {
            var n = {};
            var this_note = source.notes[note_i];
            
            n.id = note_i;
            n.refid = this_note.id;
            n.pc = {};
            n.pp = {};
            
            setProps(propSynonyms, 'n', customProps, this_note, n);
            
            notes.push(n);
        }
    }
    
    if (source.coord) coord = source.coord;
    
    return { 'states':states, 'transitions':transitions, 'notes':notes, 'coordinates':coord };
}

module.exports = createDataCont;

},{}],7:[function(require,module,exports){
'use strict';

var d3 = Object.assign(require('d3-selection'), require('d3-array')),
	gridw_g = 10,
	gridw_main_g = 50,
	gridw_text_g = 100;

function getGridData(d3svgdata)
{
    var originline_x = ((d3svgdata.vb.y <= 0) && ((d3svgdata.vb.y + d3svgdata.vb.height) >= 0)) ? true : false;
    var originline_y = ((d3svgdata.vb.x <= 0) && ((d3svgdata.vb.x + d3svgdata.vb.width) >= 0)) ? true : false;
    var mainline_num_x = Math.floor(d3svgdata.vb.height / gridw_main_g + 1);
    var mainline_num_y = Math.floor(d3svgdata.vb.width / gridw_main_g + 1);
    var textline_num_x = Math.floor(d3svgdata.vb.height / gridw_text_g + 1);
    var textline_num_y = Math.floor(d3svgdata.vb.width / gridw_text_g + 1);
    var line_num_x = d3svgdata.vb.height / gridw_g + 1 - mainline_num_x;
    var line_num_y = d3svgdata.vb.width / gridw_g + 1 - mainline_num_y;
    var c;
    
    c = d3svgdata.vb.y;
    
    var line_data_x = d3.range(line_num_x)
        .map(function (d)
        {
            var ypos;
            
            if (!(c % gridw_main_g)) c += gridw_g;
            ypos = c;
            c += gridw_g;
            
            return { x1:(d3svgdata.vb.x) , y1:(ypos), x2:(d3svgdata.vb.x + d3svgdata.vb.width), y2:(ypos) };
        });
    
    c = d3svgdata.vb.x;
    
    var line_data_y = d3.range(line_num_y)
        .map(function (d)
        {
            var xpos;
            
            if (!(c % gridw_main_g)) c += gridw_g;
            xpos = c;
            c += gridw_g;
            
            return { x1:(xpos) , y1:(d3svgdata.vb.y), x2:(xpos), y2:(d3svgdata.vb.y + d3svgdata.vb.height) };
        });
    
    c = d3svgdata.vb.y;
    while (c % gridw_main_g) c+= gridw_g;
    
    var mainline_data_x = d3.range(mainline_num_x)
        .map(function (d)
        {
            var ypos;
            
            if (!c) c += gridw_main_g;
            if (originline_x && (d >= mainline_num_x - 1)) c = 0;
            
            ypos = c;
            c += gridw_main_g;
            
            return { x1:(d3svgdata.vb.x) , y1:(ypos), x2:(d3svgdata.vb.x + d3svgdata.vb.width), y2:(ypos) };
        });
    
    c = d3svgdata.vb.x;
    while (c % gridw_main_g) c+= gridw_g;
    
    var mainline_data_y = d3.range(mainline_num_y)
        .map(function (d)
        {
            var xpos;
            
            if (!c) c += gridw_main_g;
            if (originline_y && (d >= mainline_num_y - 1)) c = 0;
            
            xpos = c;
            c += gridw_main_g;
            
            return { x1:(xpos) , y1:(d3svgdata.vb.y), x2:(xpos), y2:(d3svgdata.vb.y + d3svgdata.vb.height) };
        });
    
    c = d3svgdata.vb.y;
    while (c % gridw_text_g) c+= gridw_g;
    
    var textline_data_x = d3.range(textline_num_x)
        .map(function (d)
        {
            var ypos;
            
            if (!c) c += gridw_text_g;
            if (originline_x && (d >= textline_num_x - 1)) c = 0;
            
            ypos = c;
            c += gridw_text_g;
            
            return { x1:(d3svgdata.vb.x) , y1:(ypos), x2:(d3svgdata.vb.x + d3svgdata.vb.width), y2:(ypos) };
        });
    
    c = d3svgdata.vb.x;
    while (c % gridw_text_g) c+= gridw_g;
    
    var textline_data_y = d3.range(textline_num_y)
        .map(function (d)
        {
            var xpos;
            
            if (!c) c += gridw_text_g;
            if (originline_y && (d >= textline_num_y - 1)) c = 0;
            
            xpos = c;
            c += gridw_text_g;
            
            return { x1:(xpos) , y1:(d3svgdata.vb.y), x2:(xpos), y2:(d3svgdata.vb.y + d3svgdata.vb.height) };
        });
    
    return { 'ldx':line_data_x, 'ldy':line_data_y, 'mldx':mainline_data_x, 'mldy':mainline_data_y, 'oldx':originline_x, 'oldy':originline_y, 'tldx':textline_data_x, 'tldy':textline_data_y };
}

function createGridLines(d3svg)
{
    var d3svgdata = d3svg.datum();
    var svg_id = d3svg.attr('id');
    var linedata = getGridData(d3svgdata);
    var lastxelem, lastyelem;
    
    d3.select('#' + svg_id).selectAll('g').remove();//removeChildNodes(document.getElementById(svg_id));
    
    var gr = d3svg.append('g')
        .attr('id', svg_id + '_reg');
    
    var gm = d3svg.append('g')
        .attr('id', svg_id + '_main');
    
    var gt = d3svg.append('g')
        .attr('id', svg_id + '_text');
    
    gr.selectAll('line:not(.gridyelem)')
        .data(linedata.ldx)
        .enter()
        .append('line')
            .classed('gridxelem', true);
    
    gr.selectAll('line:not(.gridxelem)')
        .data(linedata.ldy)
        .enter()
        .append('line')
            .classed('gridyelem', true);
        
    gm.selectAll('line:not(.gridyelem)')
        .data(linedata.mldx)
        .enter()
        .append('line')
            .classed('gridxelem', true);
    
    gm.selectAll('line:not(.gridxelem)')
        .data(linedata.mldy)
        .enter()
        .append('line')
            .classed('gridyelem', true);
    
    gm.selectAll('line.gridxelem')
        .filter(function (d,i)
        {
            return (i == (gm.selectAll('line.gridxelem').size() - 1));
        })
        .raise();
    
    gm.selectAll('line.gridyelem')
        .filter(function (d,i)
        {
            return (i == (gm.selectAll('line.gridyelem').size() - 1));
        })
        .raise();
    
    gt.selectAll('text:not(.gridyelem)')
        .data(linedata.tldx)
        .enter()
        .append('text')
            .classed('gridxelem', true);
    
    gt.selectAll('text:not(.gridxelem)')
        .data(linedata.tldy)
        .enter()
        .append('text')
            .classed('gridyelem', true);
    
    updateGridLines(d3svg);
}

function updateGridLines(d3svg)
{
    var d3svgdata = d3svg.datum();
    var svg_id = d3svg.attr('id');
    var linedata = getGridData(d3svgdata);
    
    var gr = d3svg.select('#'+svg_id + '_reg');
    var gm = d3svg.select('#'+svg_id + '_main');
    var gt = d3svg.select('#'+svg_id + '_text');
    
    gr.selectAll('line.gridxelem')
        .data(linedata.ldx)
        .attr('x1', function (d) { return d.x1; } )
        .attr('y1', function (d) { return d.y1; } )
        .attr('x2', function (d) { return d.x2; } )
        .attr('y2', function (d) { return d.y2; } );
    
    gr.selectAll('line.gridyelem')
        .data(linedata.ldy)
        .attr('x1', function (d) { return d.x1; } )
        .attr('y1', function (d) { return d.y1; } )
        .attr('x2', function (d) { return d.x2; } )
        .attr('y2', function (d) { return d.y2; } );
    
    gm.selectAll('line.gridxelem')
        .data(linedata.mldx)
        .attr('x1', function (d) { return d.x1; } )
        .attr('y1', function (d) { return d.y1; } )
        .attr('x2', function (d) { return d.x2; } )
        .attr('y2', function (d) { return d.y2; } )
        .each(function (d)
        {
            if (linedata.oldx && !(d.y1))
            {
                d3.select(this).classed('gridorigin', true);
            }
            else
            {
                d3.select(this).classed('gridorigin', false);
            }
        });
    
    gm.selectAll('line.gridyelem')
        .data(linedata.mldy)
        .attr('x1', function (d) { return d.x1; } )
        .attr('y1', function (d) { return d.y1; } )
        .attr('x2', function (d) { return d.x2; } )
        .attr('y2', function (d) { return d.y2; } )
        .each(function (d)
        {
            if (linedata.oldy && !(d.x1))
            {
                d3.select(this).classed('gridorigin', true);
            }
            else
            {
                d3.select(this).classed('gridorigin', false);
            }
        });
    
    gt.selectAll('text.gridxelem')
        .data(linedata.tldx)
        .attr('x', function (d) { return d.x1 + 5; } )
        .attr('y', function (d) { return d.y1; } )
        .text(function (d) { return d.y1; })
        .each(function (d)
        {
            if (linedata.oldx && !(d.y1))
            {
                d3.select(this).classed('gridorigin', true);
            }
            else
            {
                d3.select(this).classed('gridorigin', false);
            }
        });
    
    gt.selectAll('text.gridyelem')
        .data(linedata.tldy)
        .attr('x', function (d) { return d.x1; } )
        .attr('y', function (d) { return d.y1; } )
        .text(function (d) { return d.x1; })
        .each(function (d)
        {
            if (linedata.oldy && !(d.x1))
            {
                d3.select(this).classed('gridorigin', true);
            }
            else
            {
                d3.select(this).classed('gridorigin', false);
            }
        });
}

module.exports = {
	create: createGridLines,
	update: updateGridLines,
	grid: { widthMin:gridw_g,
		widthMain:gridw_main_g,
		widthText:gridw_text_g
	}
};

},{"d3-array":45,"d3-selection":48}],8:[function(require,module,exports){
'use strict';

var jsonmlParse = require('./create-element'),
    w3 = require('./w3'),
    d3 = Object.assign(require('d3-selection'), require('d3-drag')),
    fsmGrid = require('./fsm-gen-grid'),
	fsmJsonUpdate = require('./fsm-json-update');
    
function isEmpty(obj)
{
    for(var prop in obj)
    {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function getCoordOnGrid(gw, x, y)
{
    var nx, ny;
    
    nx = Math.round(x / gw) * gw;
    ny = Math.round(y / gw) * gw;
    
    return { 'x':nx, 'y':ny };
}

function insertSVGTemplateFsm (index, parent, dc)
{
    function dragDragSVG(d)
    {
        var c;
        
        d.x -= d3.event.dx;
        d.y -= d3.event.dy;
        
        c = getCoordOnGrid(fsmGrid.grid.widthMin, d.x, d.y);
        
        d3.select(parent)
            .selectAll('svg')
                .each(function (dd)
                {
                    dd.x = d.x;
                    dd.y = d.y;
                    dd.vb.x = c.x;
                    dd.vb.y = c.y;
                    
                    d3.select(this)
                        .attr('viewBox', function (ddd) { return ddd.vb.x + ' ' + ddd.vb.y + ' ' + ddd.vb.width + ' ' + ddd.vb.height; });
                    
                    if (/^svggrid_/.test(d3.select(this).attr('id')))
                    {
                        fsmGrid.update(d3.select(this));
                    }
                });
    }
    
    function dragEndSVG(d)
    {
        fsmJsonUpdate(index, parent, !isEmpty(dc.coordinates));
    }
    
    var node,
        e,
        offset = { 'x':0, 'y':0 },
        svgdata,
        d3svggrid,
        d3svgcontent,
        stylevalue,
        d3defs,
        filter_array,
		d3g;
    
    // cleanup
    while (parent.childNodes.length) {
        parent.removeChild(parent.childNodes[0]);
    }
    
    d3.select(parent)
        .style('position', 'relative')
        .style('width', '100%')
        .style('height', '100%');
    
    if (dc.coordinates && dc.coordinates.offset)
    {
        offset = { 'x':((dc.coordinates.offset.length > 0) ? dc.coordinates.offset[0] : 0), 'y':((dc.coordinates.offset.length > 1) ? dc.coordinates.offset[1] : 0) };
    }
    
    svgdata = { 'x':offset.x, 'y':offset.y, vb:{ 'x':offset.x, 'y':offset.y, 'width':0, 'height':0 } };
    
    d3svggrid = d3.select(parent).append('svg')
        .datum(svgdata)
        .attr('id', 'svggrid_' + index)
        .attr('xmlns', w3.svg)
        .attr('xmlns:xlink', w3.xlink)
        .attr('width', function (d) { return d.vb.width; })
        .attr('height', function (d) { return d.vb.height; })
        .attr('viewBox', function (d) { return d.vb.x + ' ' + d.vb.y + ' ' + d.vb.width + ' ' + d.vb.height; })
        .style('position', 'absolute')
        .style('top', 0)
        .style('left', 0);
    
    stylevalue = '/*<![CDATA[*/ \
    line { stroke-width: 1; } \
	g[id$=_reg] line { stroke: rgb(240,240,240); } \
	g[id$=_main] line { stroke-width: 2; stroke: rgb(208,208,208); } \
	g[id$=_main] line.gridorigin { stroke: #ff8000; } \
	g[id^=svghelp_] line.gridcrossstate { stroke: red !important; } \
	g[id$=_text] text { font-size: 16px; paint-order: stroke; fill: rgb(160,160,160); stroke: white; stroke-width: 3; } \
	g[id$=_text] text.gridorigin { fill: #ff8000; } \
	g[id$=_text] text.gridxelem { dominant-baseline: central; text-anchor: start; } \
	g[id$=_text] text.gridyelem { dominant-baseline: text-before-edge; text-anchor: middle; }';

	stylevalue += '/*]]>*/';
	
	d3svggrid.append('style')
        .html(stylevalue);
    
	d3svgcontent = d3.select(parent).append('svg')
        .datum(svgdata)
        .attr('id', 'svgcontent_' + index)
        .attr('xmlns', w3.svg)
        .attr('xmlns:xlink', w3.xlink)
        .attr('width', function (d) { return d.vb.width; })
        .attr('height', function (d) { return d.vb.height; })
        .attr('viewBox', function (d) { return d.vb.x + ' ' + d.vb.y + ' ' + d.vb.width + ' ' + d.vb.height; })
        .call(d3.drag()
            .subject(function (d) { return d; })
            .on('drag', dragDragSVG)
            .on('end', dragEndSVG))
        .style('position', 'absolute')
        .style('top', 0)
        .style('left', 0);
    
    stylevalue = '/*<![CDATA[*/ \
    .state {  } \
    .state ellipse {  } \
    .state text { text-anchor: middle; font-family: Arial, Gadget, sans-serif; font-size: 21px; } \
    .state text:not(:first-of-type) { font-size: 16px; } \
    .state text > tspan > tspan { dominant-baseline: alphabetic; } \
    .state line { stroke: black; stroke-width: 1; stroke-linecap: round; } \
    .statezero ellipse { fill: none; } \
    .statezero text { fill: rgb(128,128,128); /*paint-order: stroke; stroke: white; stroke-width: 3;*/ } \
    .statezeroact ellipse {  } \
    .statezeroact text { fill: red; } \
    .statezeroactc ellipse {  } \
    .statereg ellipse { fill: #FFF; stroke: black; stroke-width: 1; } \
    .statereg text { fill: black; } \
    .stateregact ellipse { /*fill: rgb(255,239,239);*/ stroke: red; stroke-width: 2; } \
    .stateregact text { fill: red; } \
    .stateregact line { stroke: red; } \
    .transition path { fill: none; stroke-width: 3; stroke-linecap: round; } \
    .transition rect { fill: #FFF; fill-opacity: 0.9; } \
    .transition text { text-anchor: middle; font-family: Arial, Gadget, sans-serif; font-size: 16px; /*paint-order: stroke; stroke: white; stroke-width: 3;*/ } \
    .transition text > tspan > tspan { dominant-baseline: alphabetic; } \
    .transition line { stroke: black; stroke-width: 1; stroke-linecap: round; } \
    .transitionzero path { marker-end: url(#trmarker_' + index + '_zero); stroke: rgb(128,128,128); } \
    .transitionreg path { stroke: black; } \
    .transitionreg path:only-of-type, .transitionreg path:not(:first-of-type):not(:only-of-type) { marker-end: url(#trmarker_' + index + '_reg); } \
    .transitionact path { stroke: red; } \
    .transitionact path:only-of-type, .transitionact path:not(:first-of-type):not(:only-of-type) { marker-end: url(#trmarker_' + index + '_act); } \
    .transitionact text { fill: red; } \
    .transitionact line { stroke: red; } \
    .transitionactc path:only-of-type, .transitionactc path:not(:first-of-type):not(:only-of-type) { marker-end: url(#trmarker_' + index + '_actc); } \
    #trmarker_' + index + '_zero path { fill: rgb(128,128,128); } \
    #trmarker_' + index + '_reg path { fill: black; } \
    #trmarker_' + index + '_act path { fill: red; } \
    .note path { fill: lightyellow; stroke-width: 1; stroke: black; stroke-opacity: 0.25; } \
    .note rect { opacity: 0; } \
    .note text { font-family: Arial, Gadget, sans-serif; font-size: 13px; } \
    .note text > tspan > tspan { dominant-baseline: alphabetic; } \
    .note text > tspan:first-of-type { font-size: 0.8em; text-decoration: underline; } \
    .note text > tspan:not(:first-of-type) { dominant-baseline: alphabetic; } \
    .noteact path:not(:first-of-type) { fill: url("#diagonalHatch"); opacity: 1; } \
    .noteact path:first-of-type { stroke-width: 3; stroke: red; stroke-opacity: 0.5; stroke-linejoin: round; } \
    .noteactb path:not(:first-of-type) { opacity: 0; } \
    .noteactb rect { fill: url("#diagonalHatch"); opacity: 1; stroke: red; stroke-width: 3; stroke-opacity: 0.5; } \
    .textbf { font-weight: bold; } \
    .textit { font-style: italic; }';
    
    for (var s_i = 0; s_i < dc.states.length; s_i++)
    {
        var s = dc.states[s_i];
        var state_css_array = (s.zerostate) ?
                                [
                                    { 'selector': '#state_' + index + '_' + s_i + ' .stext text',
                                        'props':	[
                                                        {'cssprop':'fill', 'keyval':(s.textcolor ? s.textcolor : s.basecolor)}
                                                    ]
                                    }
                                ]
                                :
                                [
                                    { 'selector': '#state_' + index + '_' + s_i + ' ellipse',
                                        'props':	[
                                                        {'cssprop':'fill', 'keyval':s.fill},
                                                        {'cssprop':'stroke', 'keyval':s.basecolor}
                                                    ]
                                    },
                                    { 'selector': '#state_' + index + '_' + s_i + ' .stext text',
                                        'props':	[
                                                        {'cssprop':'fill', 'keyval':s.textcolor}
                                                    ]
                                    },
                                    { 'selector': '#state_' + index + '_' + s_i + ' .stext line',
                                        'props':	[
                                                        {'cssprop':'stroke', 'keyval':(s.linecolor ? s.linecolor : s.basecolor)}
                                                    ]
                                    },
                                    { 'selector': '#state_' + index + '_' + s_i + ' .stext .stextname',
                                        'props':	[
                                                        {'cssprop':'fill', 'keyval':s.namecolor}
                                                    ]
                                    },
                                    { 'selector': '#state_' + index + '_' + s_i + ' .stext .stextaction',
                                        'props':	[
                                                        {'cssprop':'fill', 'keyval':s.actioncolor}
                                                    ]
                                    }
                                ];
        
        for (var sca_i = 0; sca_i < state_css_array.length; sca_i++)
        {
            var state_css = state_css_array[sca_i];
            var cssprops = '';
            
            for (var prop_i = 0; prop_i < state_css.props.length; prop_i++)
            {
                var cssprop = state_css.props[prop_i].cssprop;
                var cssvalue = state_css.props[prop_i].keyval;
                
                if (cssvalue) cssprops += ' ' + cssprop + ': ' + cssvalue + ';';
            }
            
            if (cssprops != '') stylevalue += state_css.selector + ' {' + cssprops + ' } ';
        }
    }
    
    for (var t_i = 0; t_i < dc.transitions.length; t_i++)
    {
        var t = dc.transitions[t_i];
        var transition_css_array = (t.start.zerostate) ?
                                [
                                    { 'selector': '#transition_' + index + '_' + t_i + ' path',
                                        'props':	[
                                                        {'cssprop':'stroke', 'keyval':t.basecolor},
                                                        {'cssprop':'marker-end', 'keyval':(t.basecolor ? 'url(#trmarker_' + index + '_' + t_i + ')' : undefined)}
                                                    ]
                                    },
                                    { 'selector': '#trmarker_' + index + '_' + t_i + ' path',
                                        'props':	[
                                                        {'cssprop':'fill', 'keyval':t.basecolor}
                                                    ]
                                    },
                                ]
                                :
                                [
                                    { 'selector': '#transition_' + index + '_' + t_i + ' path',
                                        'props':	[
                                                        {'cssprop':'stroke', 'keyval':t.basecolor}
                                                    ]
                                    },
                                    { 'selector': (t.end.length > 1 ? '#transition_' + index + '_' + t_i + ' path:not(:first-of-type)' : '#transition_' + index + '_' + t_i + ' path'),
                                        'props':	[
                                                        {'cssprop':'marker-end', 'keyval':(t.basecolor ? 'url(#trmarker_' + index + '_' + t_i + ')' : undefined)}
                                                    ]
                                    },
                                    { 'selector': '#trmarker_' + index + '_' + t_i + ' path',
                                        'props':	[
                                                        {'cssprop':'fill', 'keyval':t.basecolor}
                                                    ]
                                    },
                                    { 'selector': '#transition_' + index + '_' + t_i + ' .trtext text',
                                        'props':	[
                                                        {'cssprop':'fill', 'keyval':t.textcolor}
                                                    ]
                                    },
                                    { 'selector': '#transition_' + index + '_' + t_i + ' .trtext line',
                                        'props':	[
                                                        {'cssprop':'stroke', 'keyval':(t.linecolor ? t.linecolor : t.basecolor)}
                                                    ]
                                    },
                                    { 'selector': '#transition_' + index + '_' + t_i + ' .trtext .trtextcond',
                                        'props':	[
                                                        {'cssprop':'fill', 'keyval':t.conditioncolor}
                                                    ]
                                    },
                                    { 'selector': '#transition_' + index + '_' + t_i + ' .trtext .trtextaction',
                                        'props':	[
                                                        {'cssprop':'fill', 'keyval':t.actioncolor}
                                                    ]
                                    }
                                ];
        
        for (var tca_i = 0; tca_i < transition_css_array.length; tca_i++)
        {
            var transition_css = transition_css_array[tca_i];
            var cssprops = '';
            
            for (var prop_i = 0; prop_i < transition_css.props.length; prop_i++)
            {
                var cssprop = transition_css.props[prop_i].cssprop;
                var cssvalue = transition_css.props[prop_i].keyval;
                
                if (cssvalue) cssprops += ' ' + cssprop + ': ' + cssvalue + ';';
            }
            
            if (cssprops != '') stylevalue += transition_css.selector + ' {' + cssprops + ' } ';
        }
    }
    
    for (var n_i = 0; n_i < dc.notes.length; n_i++)
    {
        var n = dc.notes[n_i];
        var notes_css_array = 
                                [
                                    { 'selector': '#note_' + index + '_' + n_i + ' > path:first-of-type',
                                        'props':	[
                                                        {'cssprop':'fill', 'keyval':n.fill}
                                                    ]
                                    },
                                    { 'selector': '#note_' + index + '_' + n_i + ' text',
                                        'props':	[
                                                        {'cssprop':'fill', 'keyval':n.textcolor}
                                                    ]
                                    }
                                ];
        
        for (var nca_i = 0; nca_i < notes_css_array.length; nca_i++)
        {
            var note_css = notes_css_array[nca_i];
            var cssprops = '';
            
            for (var prop_i = 0; prop_i < note_css.props.length; prop_i++)
            {
                var cssprop = note_css.props[prop_i].cssprop;
                var cssvalue = note_css.props[prop_i].keyval;
                
                if (cssvalue) cssprops += ' ' + cssprop + ': ' + cssvalue + ';';
            }
            
            if (cssprops != '') stylevalue += note_css.selector + ' {' + cssprops + ' } ';
        }
    }
    
    // not relevant for saved SVG, just interaction:
    stylevalue += ' \
    :root { --handlecolorneighbor: rgba(51,204,51,0.5);	--handlecolorhover: rgba(255,0,0,0.5); --handlecolornormal: rgba(0,0,255,0.5); } \
    .state { cursor: pointer; } \
    text { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } \
    .transition { cursor: pointer; } \
    .trhandle > circle { cursor: pointer; fill: var(--handlecolornormal); stroke-width: 1; stroke: var(--handlecolornormal); } \
    .trhandle > line { stroke: var(--handlecolornormal); stroke-width: 1; stroke-dasharray: 3,1; } \
    .trhandleact > circle { fill: var(--handlecolorhover); stroke-width: 1; stroke: var(--handlecolorhover); } \
    .trhandleact > line { stroke: var(--handlecolorhover); } \
    .trhandleactc > circle { fill: var(--handlecolorneighbor); stroke-width: 1; stroke: var(--handlecolorneighbor); } \
    .trhandleactc > line { stroke: var(--handlecolorneighbor); } \
    .note { cursor: pointer; } \
    .nthandle > circle { cursor: pointer; fill: var(--handlecolornormal); stroke-width: 1; stroke: var(--handlecolornormal); } \
    .nthandleact > circle { fill: var(--handlecolorhover); stroke-width: 1; stroke: var(--handlecolorhover); } \
    #diagonalHatch path { stroke-width: 3; stroke: rgba(255,0,0,0.15); }';
    
    stylevalue += '/*]]>*/';
    
    d3svgcontent.append('style')
        .html(stylevalue);
    
    d3defs = d3svgcontent.append('defs')
        .each(function (d)
        {
            var m = ['zero', 'reg'];
            
            for (var t_i = 0; t_i < dc.transitions.length; t_i++)
            {
                if (dc.transitions[t_i].basecolor) m.push(t_i + '');
            }
            
            for (var m_i = 0; m_i < m.length; m_i++)
            {
                d3.select(this).append('marker')
                    .attr('orient', 'auto')
                    .attr('markerUnits', 'userSpaceOnUse')
                    .attr('markerWidth', 20)
                    .attr('markerHeight', 10)
                    .attr('refX', 0)
                    .attr('refY', 5)
                    .attr('viewBox', '0 0 20 10')
                    .attr('id', 'trmarker_' + index + '_' + m[m_i])
                    .classed('marker', true)
                    .append('path')
                    .attr('d', 'M0 0 20 5 0 10z');
            }
        });
    
    filter_array = [
                                {'id':'hl_state', 'borderfill':'rgba(255,0,0,0.5)', 'border':'rgba(255,0,0,0.5)'},
                                {'id':'hl_state_neighbor', 'borderfill':'rgba(51,204,51,0.25)', 'border':'rgba(51,204,51,0.5)'},
                                {'id':'hl_transition', 'borderfill':'rgba(255,0,0,0.25)', 'border':'rgba(255,0,0,0.5)'},
                                {'id':'hl_transition_neighbor', 'borderfill':'rgba(51,204,51,0.25)', 'border':'rgba(51,204,51,0.5)'}
                            ];
    
    for (var f_i = 0; f_i < filter_array.length; f_i++)
    {
        var d3filter = d3defs.append('filter')
            .attr('id', filter_array[f_i].id)
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');
    
        d3filter.append('feFlood')
            .attr('flood-color', filter_array[f_i].borderfill)
            .attr('result', 'basebf');
        
        d3filter.append('feFlood')
            .attr('flood-color', filter_array[f_i].border)
            .attr('result', 'baseb');
        
        d3filter.append('feMorphology')
            .attr('result', 'dilfat')
            .attr('in', 'SourceAlpha')
            .attr('operator', 'dilate')
            .attr('radius', '4');
        
        d3filter.append('feMorphology')
            .attr('result', 'dilthin')
            .attr('in', 'SourceAlpha')
            .attr('operator', 'dilate')
            .attr('radius', '3');
        
        d3filter.append('feComposite')
            .attr('result', 'dropfouter')
            .attr('in', 'basebf')
            .attr('in2', 'dilfat')
            .attr('operator', 'in');
        
        d3filter.append('feComposite')
            .attr('result', 'droptouter')
            .attr('in', 'baseb')
            .attr('in2', 'dilfat')
            .attr('operator', 'in');
        
        d3filter.append('feComposite')
            .attr('result', 'dropfat')
            .attr('in', 'dropfouter')
            .attr('in2', 'SourceAlpha')
            .attr('operator', 'out');
        
        d3filter.append('feComposite')
            .attr('result', 'dropthin')
            .attr('in', 'droptouter')
            .attr('in2', 'dilthin')
            .attr('operator', 'out');
        
        d3filter.append('feBlend')
            .attr('result', 'border')
            .attr('in', 'dropfat')
            .attr('in2', 'dropthin')
            .attr('mode', 'normal');
        
        d3filter.append('feBlend')
            .attr('in', 'SourceGraphic')
            .attr('in2', 'border')
            .attr('mode', 'normal');
    }
    
    d3defs.append('pattern')
        .attr('id', 'diagonalHatch')
        .attr('width', '8')
        .attr('height', '8')
        .attr('patternUnits', 'userSpaceOnUse')
        .append('path')
            .attr('d', 'M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4');
    
	 d3g = d3svgcontent.append('g')
		.attr('id', 'graph_' + index);
}

module.exports = insertSVGTemplateFsm;

},{"./create-element":2,"./fsm-gen-grid":7,"./fsm-json-update":10,"./w3":38,"d3-drag":47,"d3-selection":48}],9:[function(require,module,exports){
'use strict';

function deleteElementFromJsonString(str, beginIndex, endIndex)
{
	var firstHalf,
		secondHalf,
		commaIndex;
	
	firstHalf = str.substring(0, beginIndex);
	secondHalf = str.substring(endIndex + 1);
	commaIndex = -1;
	
	for (var sh_i = 0; sh_i < secondHalf.length; sh_i++)
	{
		if (/\S/.test(secondHalf[sh_i]))
		{
			if (secondHalf[sh_i] == ',')
			{
				commaIndex = sh_i;
			}
			break;
		}
	}
	
	if (commaIndex >= 0)
	{
		for (var fh_i = firstHalf.length - 1; fh_i >= 0; fh_i--)
		{
			if (/\S/.test(firstHalf[fh_i]))
			{
				if (firstHalf[fh_i] == '{' || firstHalf[fh_i] == '[')
				{
					for (var sh_i = commaIndex + 1; sh_i < secondHalf.length; sh_i++)
					{
						if (/\S/.test(secondHalf[sh_i]))
						{
							secondHalf = secondHalf.substring(sh_i);
							
							break;
						}
					}
				}
				break;
			}
		}
	}
	
	str = firstHalf + secondHalf;
	
	return str;
}

function insertElementInJsonString(str, beginIndex, elem)
{
	var firstHalf,
		secondHalf,
		foundnewline,
		indentstring;
	
	firstHalf = str.substring(0, beginIndex);
	secondHalf = str.substring(beginIndex + 1);
	foundnewline = false;
	indentstring = '';
	
	for (var fh_i = firstHalf.length - 1; fh_i >= 0; fh_i--)
	{
		if (/\S/.test(firstHalf[fh_i]))
		{
			if (!(firstHalf[fh_i] == '{' || firstHalf[fh_i] == '[' || firstHalf[fh_i] == ','))
			{
				firstHalf += ',';
				
				do
				{
					fh_i--;
					
					if (/\s/.test(firstHalf[fh_i]))
					{
						if (firstHalf[fh_i] != '\n')
						{
							indentstring += firstHalf[fh_i];
						}
						else
						{
							foundnewline = true;
						}
					}
					else
					{
						indentstring = '';
					}
					
					if (foundnewline)
					{
						firstHalf += '\n' + indentstring;
						break;
					}
				}
				while (firstHalf[fh_i] != '\n' || fh_i > 0);
			}
			
			break;
		}
	}
	
	for (var sh_i = 0; sh_i < secondHalf.length; sh_i++)
	{
		if (/\S/.test(secondHalf[sh_i]))
		{
			if (!(secondHalf[sh_i] == '}' || secondHalf[sh_i] == ']' || secondHalf[sh_i] == ','))
			{
				secondHalf = ', ' + secondHalf;
			}
			else
			{
				secondHalf = '\n' + secondHalf;
			}
			
			break;
		}
	}
	
	elem = elem.replace(/\n/g, '\n' + indentstring).replace(/\t/g, indentstring);
	
	str = firstHalf + elem + secondHalf;
	return str;
}

function getRangeInJsonString(str, elemRegExp, objLev, arrLev, type)
{
	var cntObjLev,
		cntArrLev,
		cntStr,
		beginIndex,
		endIndex,
		stringquote,
		stringopen,
		re = elemRegExp,
		results = [],
		match;
	
	beginIndex = -1;
	endIndex = -1;
	cntObjLev = 0;
	cntArrLev = 0;
	
	do
	{
		match = re.exec(str);
		
		if (match) results.push({ 'start':match.index, 'end':(re.lastIndex) });
	}
	while (match);
	
	for (var res_i = 0; res_i < results.length; res_i++)
	{
		stringopen = false;
		
		for (var str_i = 0; str_i < results[res_i].start; str_i++)
		{
			if (stringopen)
			{
				if (str[str_i] == stringquote && str[str_i - 1] != '\\') stringopen = false;
			}
			else
			{
				switch (str[str_i])
				{
					case '{':
						cntObjLev++;
						break;
					case '}':
						cntObjLev--;
						break;
					case '[':
						cntArrLev++;
						break;
					case ']':
						cntArrLev--;
						break;
					case '\"':
					case '\'':
						stringquote = str[str_i];
						stringopen = true;
						break;
					default:
						break;
				}
			}
		}
		
		if (cntObjLev == objLev && cntArrLev == arrLev)
		{
			beginIndex = results[res_i].start;
			cntStr = beginIndex;
			cntObjLev = 0;
			cntArrLev = 0;
			stringopen = false;
			
			switch(type)
			{
				case 'arr':
					while (str[cntStr] != '[') cntStr++;
					cntArrLev++;
					break;
				case 'obj':
					while (str[cntStr] != '{') cntStr++;
					cntObjLev++;
					break;
				default:
					break;
			}
			
			for (var elem_i = cntStr + 1; elem_i < str.length; elem_i++)
			{
				if (stringopen)
				{
					if (str[elem_i] == stringquote && str[elem_i - 1] != '\\') stringopen = false;
				}
				else
				{
					switch (str[elem_i])
					{
						case '{':
							cntObjLev++;
							break;
						case '}':
							cntObjLev--;
							break;
						case '[':
							cntArrLev++;
							break;
						case ']':
							cntArrLev--;
							break;
						case '\"':
						case '\'':
							stringquote = str[elem_i];
							stringopen = true;
							break;
						default:
							break;
					}
				}
				
				if (!cntObjLev && !cntArrLev)
				{
					endIndex = elem_i;
					break;
				}
			}
			
			break;
		}
	}
	
	return { 'beginIndex':beginIndex, 'endIndex':endIndex };
}

module.exports = {
	getRangeInJsonString: getRangeInJsonString,
	deleteElementFromJsonString: deleteElementFromJsonString,
	insertElementInJsonString: insertElementInJsonString
};

},{}],10:[function(require,module,exports){
'use strict';

var d3 = require('d3-selection'),
	jsonEdit = require('./fsm-json-edit');

function createCoordStr(index, parent)
{
    var coordstr,
		coord = {},
		svg,
		d3g_states,
		d3g_transitions,
		d3g_notes;
    
    svg = d3.select(parent).select('#svgcontent_'+index).datum();
    
    coord.offset = [];
    coord.states = [];
    coord.transitions = [];
    coord.notes = [];
    
    coordstr = 'coord: {\n';
    
    coord.offset = [svg.vb.x, svg.vb.y];
    coordstr += '\toffset: ' + JSON.stringify(coord.offset);
    coordstr += ',\n';
    
    d3g_states = d3.select(parent).select('#states_' + index).selectAll('g[id^=state_' + index + '_]')
            .each(function (d)
            {
                var s = [];
                
                s.push(d.refid);
                s.push(Math.round(d.x));
                s.push(Math.round(d.y));
                
                coord.states.push(s);
            });
    
    coordstr += '\tstates: ' + JSON.stringify(coord.states);
    coordstr += ',\n';
    
    d3g_transitions = d3.select(parent).select('#transitions_' + index).selectAll('g[id^=transition_' + index + '_]')
            .each(function (d)
            {
                var t = [];
                
                t.push(d.start.refid);
                for (var te_i = 0; te_i < d.end.length; te_i++)
                {
                    t.push(d.end[te_i].refid);
                }
                
                t.push(Math.round(d.p.psh0.x));
                t.push(Math.round(d.p.psh0.y));
                
                if (d.end.length > 1)
                {
                    t.push(Math.round(d.p.pm.x));
                    t.push(Math.round(d.p.pm.y));
                    t.push(Math.round(d.p.pmhe.x));
                    t.push(Math.round(d.p.pmhe.y));
                    t.push(Math.round(d.p.pmhs.x));
                    t.push(Math.round(d.p.pmhs.y));
                }
                
                for (var te_i = 0; te_i < d.end.length; te_i++)
                {
                    t.push(Math.round(d.p['peh' + [te_i]].x));
                    t.push(Math.round(d.p['peh' + [te_i]].y));
                }
                
                if (d.hasOwnProperty('pt'))
                {
                    for (var pt_i = 0; pt_i < d.pt.length; pt_i++)
                    {
                        if (d.pt[pt_i] !== null)
                        {
                            t.push(Math.round(d.pt[pt_i].xoff));
                            t.push(Math.round(d.pt[pt_i].yoff));
                        }
                    }
                }
                
                coord.transitions.push(t);
            });
    
    coordstr += '\ttransitions: ' + JSON.stringify(coord.transitions);
    coordstr += ',\n';
    
    d3g_notes = d3.select(parent).select('#notes_' + index).selectAll('g[id^=note_' + index + '_]')
            .each(function (d)
            {
                var n = [];
                
                n.push(d.refid);
                n.push(Math.round(d.pc.x));
                n.push(Math.round(d.pc.y));
                n.push(Math.round(d.pp.x));
                n.push(Math.round(d.pp.y));
                
                coord.notes.push(n);
            });
    
    coordstr += '\tnotes: ' + JSON.stringify(coord.notes);
    coordstr += '\n}';
    
    coordstr = coordstr.replace(/"/g, '\'');
    
    return coordstr;
}

function updateSourceCoord(index, parent, coordExists)
{
    var str,
		fsmloc,
		coordloc,
        input,
		win = d3.window(parent);//getWin('txt');
        
    input = win.document.getElementById('InputJSON_' + index);
	
    // if (wintxt && wintxt.WaveDrom.cm)
    {
        str = input.value;//wintxt.WaveDrom.cm.getValue();
        
        if (coordExists)
        {
            coordloc = jsonEdit.getRangeInJsonString(str, /\s*,?\s*['"]?coord['"]?\s*:/g, 1, 0, 'obj');
            str = jsonEdit.deleteElementFromJsonString(str, coordloc.beginIndex, coordloc.endIndex);
            str = jsonEdit.insertElementInJsonString(str, coordloc.beginIndex, createCoordStr(index, parent));
        }
        else
        {
            fsmloc = jsonEdit.getRangeInJsonString(str, /\s*,?\s*['"]?fsm['"]?\s*:/g, 1, 0, 'arr');
            str = jsonEdit.insertElementInJsonString(str, fsmloc.endIndex + 1, createCoordStr(index, parent));
        }
        
		input.value = str;
        localStorage.waveform = str;
        
        if (win.WaveDrom && win.WaveDrom.cm && win.WaveDrom.cmChangeFunction)
        {
            win.WaveDrom.cm.off('change', win.WaveDrom.cmChangeFunction);
            win.WaveDrom.cm.setValue(str);
            win.WaveDrom.cm.on('change', win.WaveDrom.cmChangeFunction);
        }
    }
}

module.exports = updateSourceCoord;

},{"./fsm-json-edit":9,"d3-selection":48}],11:[function(require,module,exports){
'use strict';

var d3 = Object.assign(require('d3-selection'), require('d3-drag')),
    fsmGrid = require('./fsm-gen-grid'),
    fsmJsonUpdate = require('./fsm-json-update'),
    resizeSVG = require('./fsm-resize-svg');

var mlen_g = 20;
var notemargin_g = 10;

function renderFsm(index, parent, datacont)
{
    createStates(index, parent, datacont);

    createTransitions(index, parent, datacont);

    createNotes(index, parent, datacont);

    resizeSVG(d3.select(parent).select('#svgcontent_' + index));
}

function createTransitions(index, parent, dc)
{
    function clickTransition(d)
    {
        if (d3.select(parent).select('#trhandle_' + index + '_' + d.id).empty())
        {
            createTrHandles(index, parent, dc, d3.select(this));
            
            highlightTransition(index, parent, d);
        }
        else
        {
            removeHandle(index, parent, d3.select(this), 'trhandle_' + index + '_');
        }
    }

    function enterTransition(d)
    {
        highlightState(index, parent, d.start, 'n');
        
        for (var p_i = 0; p_i < d.end.length; p_i++)
        {
            highlightState(index, parent, d.end[p_i], 'n');
        }
        
        highlightTransition(index, parent, d);
    }
    
    function leaveTransition(d)
    {
        lowlightState(index, parent, d.start);
        
        for (var p_i = 0; p_i < d.end.length; p_i++)
        {
            lowlightState(index, parent, d.end[p_i]);
        }
        
        lowlightTransition(index, parent, d);
    }
    
    function dragDragTrText(d)
    {
        var pt_i = d3.select(this).attr('id').split('_')[3];
        
        d.pt[pt_i].xoff = d3.event.x - d.pt[pt_i].x;
        d.pt[pt_i].yoff = d3.event.y - d.pt[pt_i].y;
        
        d3.select(parent).select('#trg_' + index + '_' + d.id + '_' + pt_i)
            .attr('transform', function (dd) { return 'translate('+(dd.pt[pt_i].x + dd.pt[pt_i].xoff)+','+(dd.pt[pt_i].y + dd.pt[pt_i].yoff)+')'; });
    }
    
    function dragEndTrText(d)
    {
        fsmJsonUpdate(index, parent, !isEmpty(dc.coordinates));
    }
    
    function enterTrText(d)
    {
        
    }
    
    function leaveTrText(d)
    {
        
    }
    
    var d3g_transitions = d3.select(parent).select('#graph_' + index).insert('g', '*:first-child')
        .attr('id', 'transitions_' + index);
    
    for (var t_i = 0; t_i < dc.transitions.length; t_i++)
    {
        var d3g_transition = d3g_transitions.append('g')
            .datum(dc.transitions[t_i])
            .attr('id', function (d) { return 'transition_' + index + '_' + d.id; })
            .classed('transition', true)
            .on('click', clickTransition)
            .on('mouseenter', enterTransition)
            .on('mouseleave', leaveTransition)
            .each(function (d)
            {
                if (d.start.zerostate)
                {
                    d3.select(this).classed('transitionzero', true);
                }
                else
                {
                    d3.select(this).classed('transitionreg', true);
                }
            });
        
        var d3path_transition;
        
        if (dc.transitions[t_i].end.length > 1)
        {
            defaultTransitionPoints(dc.transitions[t_i], dc);
            updateTransitionTextPosition(dc.transitions[t_i]);
            
            d3path_transition = d3g_transition.append('path')
                .attr('d', function (d)
                {
                    var bezierstring = 'M';
                    
                    bezierstring += d.p.pse0.x+' ';
                    bezierstring += d.p.pse0.y+' C';
                    bezierstring += d.p.psh0.x+' ';
                    bezierstring += d.p.psh0.y+' ';
                    bezierstring += d.p.pmhs.x+' ';
                    bezierstring += d.p.pmhs.y+' ';
                    bezierstring += d.p.pm.x+' ';
                    bezierstring += d.p.pm.y;
                    
                    return bezierstring;
                });
            
            for (var te_i = 0; te_i < dc.transitions[t_i].end.length; te_i++)
            {
                d3path_transition = d3g_transition.append('path')
                    .attr('d', function (d)
                    {
                        var bezierstring = 'M';
                        var t = dc.transitions[t_i];
                        
                        bezierstring += t.p.pm.x+' ';
                        bezierstring += t.p.pm.y+' C';
                        bezierstring += t.p.pmhe.x+' ';
                        bezierstring += t.p.pmhe.y+' ';
                        bezierstring += t.p['peh' + te_i].x+' ';
                        bezierstring += t.p['peh' + te_i].y+' ';
                        bezierstring += t.p['pea' + te_i].x+' ';
                        bezierstring += t.p['pea' + te_i].y;
                        
                        return bezierstring;
                    });
            }
        }
        else
        {
            d3path_transition = d3g_transition.append('path')
                .each(function (d)
                {
                    defaultTransitionPoints(d, dc);
                    updateTransitionTextPosition(d);
                })
                .attr('d', function (d)
                {
                    var bezierstring = 'M';
                    
                    bezierstring += d.p.pse0.x+' ';
                    bezierstring += d.p.pse0.y+' C';
                    bezierstring += d.p.psh0.x+' ';
                    bezierstring += d.p.psh0.y+' ';
                    bezierstring += d.p.peh0.x+' ';
                    bezierstring += d.p.peh0.y+' ';
                    bezierstring += d.p.pea0.x+' ';
                    bezierstring += d.p.pea0.y;
                    
                    return bezierstring;
                });
        }
        
        d3g_transition
            .each(function (d)
            {
                if (d.pt && !(d.start.zerostate))
                {
                    for (var pt_i = 0; pt_i < d.pt.length; pt_i++)
                    {
                        if (d.pt[pt_i] && (d.pt[pt_i].cond || d.pt[pt_i].action))
                        {
                            var d3g_trg = d3.select(this).append('g')
                                .attr('id', function (d) { return 'trg_' + index + '_' + d.id + '_' + pt_i; })
                                .attr('transform', function (dd) { return 'translate('+(dd.pt[pt_i].x + dd.pt[pt_i].xoff)+', '+(dd.pt[pt_i].y + dd.pt[pt_i].yoff)+')'; })
                                .call(d3.drag()
                                    .subject(function (dd)
                                    {
                                        var pt_i = d3.select(this).attr('id').split('_')[3];
                                        return { 'x':(dd.pt[pt_i].x + dd.pt[pt_i].xoff), 'y':(dd.pt[pt_i].y + dd.pt[pt_i].yoff)};
                                    })
                                    .on('drag', dragDragTrText)
                                    .on('end', dragEndTrText))
                                .on('mouseenter', enterTrText)
                                .on('mouseleave', leaveTrText);
                            
                            var d3rect_trlabel = d3g_trg.append('rect');
                            
                            var d3g_trlabel = d3g_trg.append('g')
                                .classed('trtext', true);
                            
                            if (d.pt[pt_i].cond)
                            {
                                var d3text_trcond = d3g_trlabel.append('text')
                                    .classed('trtextcond', true)
                                    .attr('x', 0)
                                    .attr('y', 0)
                                    //.style('font-family', 'LQR, MAS, KMQ')
                                    //.style('font-size', '10pt')
                                    //.style('font-family', 'Impact,Haettenschweiler,Franklin Gothic Bold,Charcoal,Helvetica Inserat,Bitstream Vera Sans Bold,Arial Black,sans serif')
                                    .each(function (dd)
                                    {
                                        var trcond = dd.pt[pt_i].cond;
                                        var firstline;
                                        var firstlineheight = 0;
                                            
                                        for (var condlines_i = 0; condlines_i < trcond.length; condlines_i++)
                                        {
                                            var d3tspan = d3.select(this).append('tspan')
                                                .attr('x', 0);
                                                //.attr('dy', function (ddd) { return (condlines_i ? (1) : -((trcond.length - 1)))+'em'; });
                                            
                                            if (!condlines_i) firstline = d3tspan;
                                            
                                            var lineheight = 0;
                                            
                                            for (var condline_i = 0; condline_i < trcond[condlines_i].length; condline_i++)
                                            {
                                                var d3tspanle = d3tspan.append('tspan')
                                                    .classed('textbf', trcond[condlines_i][condline_i].bf)
                                                    .classed('textit', trcond[condlines_i][condline_i].it)
                                                    .style('font-size', trcond[condlines_i][condline_i].fs)
                                                    .text(function (ddd) { return trcond[condlines_i][condline_i].content; });
                                                
                                                var fs = parseInt(window.getComputedStyle(d3tspanle.node(), null).getPropertyValue('font-size'), 10);
                                                
                                                lineheight = (fs > lineheight) ? fs : lineheight;
                                            }
                                            
                                            if (condlines_i) firstlineheight = firstlineheight - lineheight;
                                            
                                            d3tspan
                                                .attr('dy', function (ddd) { return (lineheight)+'px'; });
                                        }
                                        
                                        firstline
                                            .attr('dy', function (ddd) { return (firstlineheight - 0.25*lineheight)+'px'; });
                                    });
                            }
                            
                            if (d.pt[pt_i].action)
                            {
                                var d3line_trdiv = d3g_trlabel.append('line');
                                
                                var d3text_traction = d3g_trlabel.append('text')
                                    .datum(dc.transitions[t_i])
                                    .classed('trtextaction', true)
                                    .attr('x', 0)
                                    .attr('y', 0)
                                    .each(function (dd)
                                    {
                                        var traction = dd.pt[pt_i].action;
                                        
                                        for (var actlines_i = 0; actlines_i < traction.length; actlines_i++)
                                        {
                                            var d3tspan = d3.select(this).append('tspan')
                                                .attr('x', 0);
                                                //.attr('dy', function (ddd) { return (actlines_i ? 1 : 0)+'em'; });
                                            
                                            var lineheight = 0;
                                            
                                            for (var actline_i = 0; actline_i < traction[actlines_i].length; actline_i++)
                                            {
                                                var d3tspanle = d3tspan.append('tspan')
                                                    .classed('textbf', traction[actlines_i][actline_i].bf)
                                                    .classed('textit', traction[actlines_i][actline_i].it)
                                                    .style('font-size', traction[actlines_i][actline_i].fs)
                                                    .text(function (ddd) { return traction[actlines_i][actline_i].content; });
                                                
                                                var fs = parseInt(window.getComputedStyle(d3tspanle.node(), null).getPropertyValue('font-size'), 10);
                                                
                                                lineheight = (fs > lineheight) ? fs : lineheight;
                                            }
                                            
                                            d3tspan
                                                .attr('dy', function (ddd) { return (lineheight)+'px'; });
                                        }
                                    });
                            }
                            
                            d3g_trlabel
                                .each(function (dd)
                                {
                                    var t;
                                    var newy = 0;
                                    var d3text = d3.select(this).selectAll('text');
                                    
                                    t = this.getBBox();
                                    
                                    if (d3text.size() == 1)
                                    {
                                        newy = t.height / 2;
                                        
                                        if (d3text.classed('trtextcond'))
                                        {
                                            d3text
                                                .attr('y', newy);
                                        }
                                        else if (d3text.classed('trtextaction'))
                                        {
                                            newy = -newy;
                                            
                                            d3text
                                                .attr('y', newy);
                                        }
                                    }
                                    
                                    d3.select(this).selectAll('line')
                                        .attr('x1', function (ddd) { return -t.width*0.6; })
                                        .attr('x2', function (ddd) { return t.width*0.6; })
                                        .attr('y1', function (ddd) { return newy; })
                                        .attr('y2', function (ddd) { return newy; });
                                    
                                    t = this.getBBox();
                                    
                                    d3rect_trlabel
                                        .attr('x', function (ddd) { return t.x; })
                                        .attr('y', function (ddd) { return t.y; })
                                        .attr('width', function (ddd) { return t.width; })
                                        .attr('height', function (ddd) { return t.height; });
                                });
                        }
                    }
                }
            });
    }
}

function highlightNote(index, parent, d, c)
{
    d3.select(parent).select('#note_' + index + '_' + d.id).classed('note'+c, true);
    d3.select(parent).select('#nthandle_' + index + '_' + d.id).classed('nthandle'+c, true);
}

function lowlightNote(index, parent, d, c)
{
    d3.select(parent).select('#note_' + index + '_' + d.id).classed('note'+c, false);
    d3.select(parent).select('#nthandle_' + index + '_' + d.id).classed('nthandle'+c, false);
}

function highlightTransition(index, parent, d, c)
{
    switch (c)
    {
        case 'n':
            d3.select(parent).select('#transition_' + index + '_' + d.id)
                .attr('filter', 'url(#hl_transition_neighbor)');
            d3.select(parent).select('#trhandle_' + index + '_' + d.id).classed('trhandleactc', true);
            break;
        default:
            d3.select(parent).select('#transition_' + index + '_' + d.id)
                .attr('filter', 'url(#hl_transition)');
            d3.select(parent).select('#trhandle_' + index + '_' + d.id).classed('trhandleact', true);
            break;
    }
}

function lowlightTransition(index, parent, d)
{
    d3.select(parent).select('#transition_' + index + '_' + d.id)
        .attr('filter', null);
    d3.select(parent).select('#trhandle_' + index + '_' + d.id).classed('trhandleactc', false);
    d3.select(parent).select('#trhandle_' + index + '_' + d.id).classed('trhandleact', false);
}

function highlightState(index, parent, d, c)
{
    switch (c)
    {
        case 'n':
            d3.select(parent).select('#state_' + index + '_' + d.id)
                .attr('filter', 'url(#hl_state_neighbor)');
            break;
        default:
            d3.select(parent).select('#state_' + index + '_' + d.id)
                .attr('filter', 'url(#hl_state)');
            break;
    }
}

function lowlightState(index, parent, d)
{
    d3.select(parent).select('#state_' + index + '_' + d.id)
        .attr('filter', null);
}

function getTransitionTextPosition(p1, p2, p3, p4)
{
    var dx14, dy14, dx23, dy23, absx, absy;
    
    dx14 = (p4.x + p1.x) / 2;
    dy14 = (p4.y + p1.y) / 2;
    
    dx23 = (p3.x + p2.x) / 2;
    dy23 = (p3.y + p2.y) / 2;
    
    absx = (dx14 + dx23) / 2;
    absy = (dy14 + dy23) / 2;
    
    return { 'x':absx, 'y':absy };
}

function mirrorPoint(p1, pm, p2, p1n, pmn, angle_b, len_b)
{
    var dx1m, dy1m, dx1mn, dy1mn, dx2m, dy2m, p2ang, l1m, l1mn, l2m, lenmod;
    var relx, rely, absx, absy;
    
    dx1m = pm.x - p1.x;
    dy1m = pm.y - p1.y;
    dx1mn = pmn.x - p1n.x;
    dy1mn = pmn.y - p1n.y;
    dx2m = pm.x - p2.x;
    dy2m = pm.y - p2.y;
    
    l2m = Math.sqrt(Math.pow(dx2m, 2) + Math.pow(dy2m, 2));
    
    if (angle_b)
    {
        p2ang = Math.atan2(dy1mn, dx1mn);
    }
    else
    {
        p2ang = Math.atan2(dy1m, dx1m);
    }
    
    if (len_b)
    {
        l1m = Math.sqrt(Math.pow(dx1m, 2) + Math.pow(dy1m, 2));
        l1mn = Math.sqrt(Math.pow(dx1mn, 2) + Math.pow(dy1mn, 2));
        
        lenmod = l1mn / l1m;
    }
    else
    {
        lenmod = 1;
    }
    
    relx = l2m * lenmod * Math.cos(p2ang);
    rely = l2m * lenmod * Math.sin(p2ang);
        
    absx = pmn.x + relx;
    absy = pmn.y + rely;
    
    return { 'x':absx, 'y':absy };
}

function moveRelThirdPoint(p1, p2, p3, p1n, p2n, relLen)
{
    var dx12, dy12, dx13, dy13, dx12n, dy12n;
    var p2ang, p3ang, p23ang, p2nang, p3nang;
    var p12, p13, p12n, p13n;
    var relx, rely, absx, absy;
/*
    p3
    |   p2
    |  /
    | /
    p1
*/
    if (p1.x == p2.x && p1.y == p2.y)
    {
        relx = p1n.x - p1.x;
        rely = p1n.y - p1.y;
    
        absx = p3.x + relx/2;
        absy = p3.y + rely/2;
    }
    else
    {
        dx12 = p2.x - p1.x;
        dy12 = p2.y - p1.y;
        
        p2ang = Math.atan2(dy12, dx12);
        
        p12 = Math.sqrt(Math.pow(dx12, 2) + Math.pow(dy12, 2));
        
        dx13 = p3.x - p1.x;
        dy13 = p3.y - p1.y;
        
        p3ang = Math.atan2(dy13, dx13);
        
        p13 = Math.sqrt(Math.pow(dx13, 2) + Math.pow(dy13, 2));
        
        p23ang = p3ang - p2ang;
        
        dx12n = p2n.x - p1n.x;
        dy12n = p2n.y - p1n.y;
        
        p2nang = Math.atan2(dy12n, dx12n);
        
        p12n = Math.sqrt(Math.pow(dx12n, 2) + Math.pow(dy12n, 2));
        
        p3nang = p2nang + p23ang;
        p13n = p12n / p12 * p13;
        
        if (relLen)
        {
            relx = p13n * Math.cos(p3nang);
            rely = p13n * Math.sin(p3nang);
        }
        else
        {
            relx = p13 * Math.cos(p3nang);
            rely = p13 * Math.sin(p3nang);
        }
        
        absx = p1n.x + relx;
        absy = p1n.y + rely;
    }
    
    return { 'x':absx, 'y':absy };
}

function getDistance(p1, p2)
{
    var dx, dy, p12;
    
    dx = p2.x - p1.x;
    dy = p2.y - p1.y;
    
    p12 = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    
    return p12;
}

function getAddedLenCoord(p1, p2, len)
{
    var dx, dy, alpha, p12, relx, rely, absx, absy;
    
    dx = p2.x - p1.x;
    dy = p2.y - p1.y;
    
    alpha = Math.atan2(dy, dx);
    
    p12 = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    
    relx = (p12 + len) * Math.cos(alpha);
    rely = (p12 + len) * Math.sin(alpha);
    
    absx = p1.x + relx;
    absy = p1.y + rely;
    
    return { 'x':absx, 'y':absy };
}

function checkIfInsideEllipse(elli, p, len)
{
    var ebp, ellip, elliebp, pn;
    
    ebp = getEllipseBorderCoord(elli, p);
    
    ellip = getDistance(elli, p);
    elliebp = getDistance(elli, ebp);
    
    if (len)
    {
        elliebp += len;
    }
    
    if (ellip < elliebp)
    {
        pn = getAddedLenCoord(elli, ebp, len);

        return pn;
    }
    else
    {
        return false;
    }
}

function getEllipseBorderCoord(elli, p)
{
    var dx, dy, alpha, erelx, erely, eabsx, eabsy;
    var leftquadrant = false;
    
    dx = p.x - elli.x;
    dy = p.y - elli.y;
    
    alpha = Math.atan2(dy, dx);
    
    if (alpha > Math.PI/2)
    {
        alpha = -1 * (alpha - Math.PI);
        leftquadrant = true;
    }
    
    if (alpha < -Math.PI/2)
    {
        alpha = -1 * (alpha + Math.PI);
        leftquadrant = true;
    }
    
    erelx = Math.sqrt(1 / ((1 / Math.pow(elli.a, 2)) + (Math.pow(Math.tan(alpha), 2) / Math.pow(elli.b, 2))));
    erely = erelx * Math.tan(alpha);
    
    eabsx = elli.x + (leftquadrant ? -erelx : erelx);
    eabsy = elli.y + erely;
    
    return { 'x':eabsx, 'y':eabsy };
}

function createTrHandleCoord(p1, p2, angle)
{
    var dx, dy, alpha, p12, relx, rely, absx, absy, lenratio;
    
    dx = p2.x - p1.x;
    dy = p2.y - p1.y;
    
    alpha = Math.atan2(dy, dx) + angle;
    
    p12 = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    
    if (angle)
    {
        p12 *= Math.abs((Math.abs(angle) > Math.PI/2 ? (Math.PI/2) : angle) / (Math.PI/2));
    }
    else
    {
        p12 *= 0.5;
    }
    
    relx = p12 * Math.cos(alpha);
    rely = p12 * Math.sin(alpha);
    
    absx = p1.x + relx;
    absy = p1.y + rely;
    
    return { 'x':absx, 'y':absy };
}

function defaultTransitionPoints(t, dc)
{
    var start, middle = null, end = [], pt = [], angle = 0, pf;
    var tb, bb, lb, rb;
    var transition = {};
    
    start = { 'ps':{ }, 'psh':{ }, 'psi':{ } };
    
    if (t.end.length > 1)
    {
        middle = { 'pmhs':{ }, 'pm':{ }, 'pmhe':{ } };
    }
    
    for (var link_i = 0; link_i < t.end.length; link_i++)
    {
        end.push({ 'peh':{ }, 'pea':{ }, 'pe':{ } });
    }
    
    if (t.end.length > 1)	//Y-transition with multiple destination states
    {
        /*lb = rb = t.start.x;
        tb = bb = t.start.y;
        */
        middle.pm.x = t.start.x;
        middle.pm.y = t.start.y;
        
        for (var es_i = 0; es_i < t.end.length; es_i++)
        {
            /*if (t.end[es_i].x > rb) rb = t.end[es_i].x;
            else if (t.end[es_i].x < lb) lb = t.end[es_i].x;
            
            if (t.end[es_i].y > bb) bb = t.end[es_i].y;
            else if (t.end[es_i].y < tb) tb = t.end[es_i].y;*/
            middle.pm.x += t.end[es_i].x;
            middle.pm.y += t.end[es_i].y;
        }
        
        /*middle.pm.x = (lb + rb) / 2;
        middle.pm.y = (tb + bb) / 2;
        */
        middle.pm.x = middle.pm.x / (t.end.length + 1);
        middle.pm.y = middle.pm.y / (t.end.length + 1);
        
        /*lb = rb = t.start.x;
        tb = bb = t.start.y;
        */
        middle.pmhe.x = middle.pm.x;
        middle.pmhe.y = middle.pm.y;
        
        for (var es_i = 0; es_i < t.end.length; es_i++)
        {
            middle.pmhe.x += t.end[es_i].x;
            middle.pmhe.y += t.end[es_i].y;
        }
        
        middle.pmhe.x = middle.pmhe.x / (t.end.length + 1);
        middle.pmhe.y = middle.pmhe.y / (t.end.length + 1);
        
        middle.pmhs.x = 2 * middle.pm.x - middle.pmhe.x;
        middle.pmhs.y = 2 * middle.pm.y - middle.pmhe.y;
            
        start.psh = createTrHandleCoord(t.start, middle.pm, angle);
        
        for (var es_i = 0; es_i < t.end.length; es_i++)
        {
            end[es_i].peh = createTrHandleCoord(t.end[es_i], middle.pm, angle);
        }
    }
    else if (t.start == t.end[0])	//self-transition
    {
        angle = getRad(45);
        pf = { 'x':(t.start.x), 'y':(t.start.y - 250) };
        
        start.psh = createTrHandleCoord(t.start, pf, -angle);
        end[0].peh = createTrHandleCoord(t.start, pf, angle);
    }
    else	//single transition (with arc if same states have a counter transition)
    {
        if (t.pair)
        {
            angle = getRad(30);
        }
    
        start.psh = createTrHandleCoord(t.start, t.end[0], -angle);
        end[0].peh = createTrHandleCoord(t.end[0], t.start, angle);
    }
    
    if (dc.coordinates && dc.coordinates.transitions)
    {
        var hlpcnt = 0;
        
        for (var transition_i = 0; transition_i < dc.coordinates.transitions.length; transition_i++)
        {
            var tr = dc.coordinates.transitions[transition_i];
            var trc = 2, flowbreak = false;
            var trtype = 0;
            
            if (tr.length > 2 && tr[0] == t.start.refid && tr[1] == t.end[0].refid)
            {
                if (t.tsame && t.tsame[hlpcnt].drawn)
                {
                    hlpcnt++;
                    continue;
                }
                
                for (var es_i = 1; es_i < t.end.length; es_i++)
                {
                    if (tr[trc] != t.end[es_i].refid)
                    {
                        flowbreak = true;
                        break;
                    }
                    trc++;
                }
                
                if (!flowbreak)
                {
                    if (tr.length > trc)
                    {
                        //get start handle coordinates
                        start.psh.x = tr[trc];
                        trc++;
                        
                        if (tr.length > trc)
                        {
                            start.psh.y = tr[trc];
                            trc++;
                        }
                        
                        //get mid point (if available) and end handle coordinates
                        if (t.end.length > 1)
                        {
                            if (tr.length > trc)
                            {
                                middle.pm.x = tr[trc];
                                trc++;
                                
                                if (tr.length > trc)
                                {
                                    middle.pm.y = tr[trc];
                                    trc++;
                                    
                                    if (tr.length > trc)
                                    {
                                        middle.pmhe.x = tr[trc];
                                        trc++;
                                        
                                        if (tr.length > trc)
                                        {
                                            middle.pmhe.y = tr[trc];
                                            trc++;
                                            
                                            if (tr.length > trc)
                                            {
                                                middle.pmhs.x = tr[trc];
                                                trc++;
                                                
                                                if (tr.length > trc)
                                                {
                                                    middle.pmhs.y = tr[trc];
                                                    trc++;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        //get end handle coordinates
                        for (var es_i = 0; es_i < t.end.length; es_i++)
                        {
                            if (tr.length > trc)
                            {
                                end[es_i].peh.x = tr[trc];
                                trc++;
                                
                                if (tr.length > trc)
                                {
                                    end[es_i].peh.y = tr[trc];
                                    trc++;
                                }
                                else break;
                            }
                            else break;
                        }
                        
                        //get text center coordinates
                        if (tr.length > trc)
                        {
                            var trptc = 1;
                            
                            while (tr.length > trc)
                            {
                                if (trptc % 2)//xoff
                                {
                                    pt.push({ 'xoff':tr[trc] });
                                }
                                else//yoff
                                {
                                    pt[pt.length - 1].yoff = tr[trc];
                                }
                                
                                trptc++;
                                trc++;
                            }
                        }
                    }
                    
                    t.drawn = true;
                    
                    break;
                }
            }
        }
    }
    
    for (var pt_i = 0; pt_i < pt.length; pt_i++)
    {
        if (t.hasOwnProperty('pt') && t.pt[pt_i] && pt[pt_i].hasOwnProperty('xoff'))
        {
            t.pt[pt_i].xoff = pt[pt_i].xoff;
            
            if (pt[pt_i].hasOwnProperty('yoff'))
            {
                t.pt[pt_i].yoff = pt[pt_i].yoff;
            }
        }
    }
    
    start.ps = getEllipseBorderCoord(t.start, start.psh);
    start.psi = getAddedLenCoord(t.start, start.ps, mlen_g);
    
    for (var es_i = 0; es_i < t.end.length; es_i++)
    {
        end[es_i].pe = getEllipseBorderCoord(t.end[es_i], end[es_i].peh);
        end[es_i].pea = getAddedLenCoord(t.end[es_i], end[es_i].pe, mlen_g);
    }
    
    t.p.pse0.x = start.ps.x;
    t.p.pse0.y = start.ps.y;
    t.p.psh0.x = start.psh.x + ((!isEmpty(dc.coordinates) && start.psh.hasOwnProperty('x')) ? 0 : (angle ? start.ps.x - start.psi.x : 0));
    t.p.psh0.y = start.psh.y + ((!isEmpty(dc.coordinates) && start.psh.hasOwnProperty('y')) ? 0 : (angle ? start.ps.y - start.psi.y : 0));
    
    if (t.end.length > 1)
    {
        t.p.pmhs.x = middle.pmhs.x;
        t.p.pmhs.y = middle.pmhs.y;
        t.p.pm.x = middle.pm.x;
        t.p.pm.y = middle.pm.y;
        t.p.pmhe.x = middle.pmhe.x;
        t.p.pmhe.y = middle.pmhe.y;
    }
    
    for (var es_i = 0; es_i < t.end.length; es_i++)
    {
        t.p['peh' + es_i].x = end[es_i].peh.x + ((!isEmpty(dc.coordinates) && end[es_i].peh.hasOwnProperty('x')) ? 0 : (angle ? end[es_i].pea.x - end[es_i].pe.x : 0));
        t.p['peh' + es_i].y = end[es_i].peh.y + ((!isEmpty(dc.coordinates) && end[es_i].peh.hasOwnProperty('y')) ? 0 : (angle ? end[es_i].pea.y - end[es_i].pe.y : 0));
        t.p['pea' + es_i].x = end[es_i].pea.x;
        t.p['pea' + es_i].y = end[es_i].pea.y;
        t.p['pee' + es_i].x = end[es_i].pe.x;
        t.p['pee' + es_i].y = end[es_i].pe.y;
    }
}

function updateTransitionTextPosition(t)
{
    var pt;
    
    if (t.pt)
    {
        if (t.end.length > 1)
        {
            for (var pt_i = 0; pt_i < t.pt.length; pt_i++)
            {
                if ((pt_i < t.end.length + 1))
                {
                    if (t.pt[pt_i])
                    {
                        if (pt_i)
                        {
                            pt = getTransitionTextPosition(t.p.pm, t.p.pmhe, t.p['peh' + (pt_i - 1)], t.p['pea' + (pt_i - 1)]);
                        }
                        else
                        {
                            pt = getTransitionTextPosition(t.p.pse0, t.p.psh0, t.p.pmhs, t.p.pm);
                        }
                        
                        t.pt[pt_i].x = pt.x;
                        t.pt[pt_i].y = pt.y;
                    }
                }
                else
                {
                    break;
                }
            }
        }
        else
        {
            pt = getTransitionTextPosition(t.p.pse0, t.p.psh0, t.p.peh0, t.p.pea0);
            
            t.pt[0].x = pt.x;
            t.pt[0].y = pt.y;
        }
    }
}

function updateTransitionHandlePoints(t, s)
{
    if (t.end.length > 1)
    {
        var pm = {}, pmhe = {}, pmhs = {};
        
        if (s.draggedpoint == t.start)
        {
            var psh = {};
            
            psh = moveRelThirdPoint(s, t.p.pm, t.p.psh0, t.start, t.p.pm, true);
            pmhe = moveRelThirdPoint(t.p.pm, s, t.p.pmhe, t.p.pm, t.start, true);
            
            pmhs = mirrorPoint(t.p.pmhe, t.p.pm, t.p.pmhs, pmhe, t.p.pm, true, true);
            
            /*pm.x = phs.x;
            pm.y = phs.y;
            
            for (var te_i = 0; te_i < t.end.length; te_i++)
            {
                pm.x += t.p.end[te_i].ph.x;
                pm.y += t.p.end[te_i].ph.y;
            }
            
            pm.x = pm.x / (t.end.length + 1);
            pm.y = pm.y / (t.end.length + 1);
            
            pme = moveRelThirdPoint(pm, t.end[0], t.p.middle.phe, t.p.middle.pm, t.end[0]);
            pms.x = 2 * pm.x - pme.x;
            pms.y = 2 * pm.y - pme.y;
            */
            
            t.p.psh0.x = psh.x;
            t.p.psh0.y = psh.y;
            t.p.pmhs.x = pmhs.x;
            t.p.pmhs.y = pmhs.y;
            t.p.pmhe.x = pmhe.x;
            t.p.pmhe.y = pmhe.y;
        }
        else if (s.draggedpoint == t.p.pm)
        {
            var psh = {};
            
            psh = moveRelThirdPoint(t.start, s, t.p.psh0, t.start, t.p.pm, true);
            pmhe = moveRelThirdPoint(s, t.start, t.p.pmhe, t.p.pm, t.start, true);
            
            pmhs = mirrorPoint(t.p.pmhe, s, t.p.pmhs, pmhe, t.p.pm, true, true);
            
            t.p.psh0.x = psh.x;
            t.p.psh0.y = psh.y;
            t.p.pmhs.x = pmhs.x;
            t.p.pmhs.y = pmhs.y;
            t.p.pmhe.x = pmhe.x;
            t.p.pmhe.y = pmhe.y;
        }
        else
        {
            for (var te_i = 0; te_i < t.end.length; te_i++)
            {
                if (s.draggedpoint == t.end[te_i])
                {
                    var peh;
                    
                    peh = moveRelThirdPoint(s, t.p.pm, t.p['peh' + te_i], t.end[te_i], t.p.pm, true);
                    
                    t.p['peh' + te_i].x = peh.x;
                    t.p['peh' + te_i].y = peh.y;
                    break;
                }
            }
            
            /*var pemo = { 'x':0, 'y':0 }, pemn = { 'x':0, 'y':0 };
            
            for (var te_i = 0; te_i < t.end.length; te_i++)
            {
                if (s.draggedstate == t.end[te_i])
                {
                    pemo.x += s.x;
                    pemo.y += s.y;
                    pemn.x += t.end[te_i].x;
                    pemn.y += t.end[te_i].y;
                }
                else
                {
                    pemo.x += t.end[te_i].x;
                    pemo.y += t.end[te_i].y;
                    pemn.x += t.end[te_i].x;
                    pemn.y += t.end[te_i].y;
                }
                
                pemo.x = pemo.x / t.end.length;
                pemo.y = pemo.y / t.end.length;
                pemn.x = pemn.x / t.end.length;
                pemn.y = pemn.y / t.end.length;
            }
            
            pmhe = moveRelThirdPoint(t.p.pm, pemo, t.p.pmhe, t.p.pm, pemn, true);
            pmhs.x = 2 * t.p.pm.x - pmhe.x;
            pmhs.y = 2 * t.p.pm.y - pmhe.y;
            
            t.p.pmhe.x = pmhe.x;
            t.p.pmhe.y = pmhe.y;
            t.p.pmhs.x = pmhs.x;
            t.p.pmhs.y = pmhs.y;*/
        }
    }
    else
    {
        var phs, phe;
        
        if (s.draggedpoint == t.start && s.draggedpoint == t.end[0])
        {
            psh = moveRelThirdPoint(s, s, t.p.psh0, t.start, t.end[0], true);
            peh = moveRelThirdPoint(s, s, t.p.peh0, t.end[0], t.start, true);
        }
        else if (s.draggedpoint == t.start)
        {
            psh = moveRelThirdPoint(s, t.end[0], t.p.psh0, t.start, t.end[0], true);
            peh = moveRelThirdPoint(t.end[0], s, t.p.peh0, t.end[0], t.start, true);
        }
        else if (s.draggedpoint == t.end[0])
        {
            psh = moveRelThirdPoint(t.start, s, t.p.psh0, t.start, t.end[0], true);
            peh = moveRelThirdPoint(s, t.start, t.p.peh0, t.end[0], t.start, true);
        }
        
        t.p.psh0.x = psh.x;
        t.p.psh0.y = psh.y;
        t.p.peh0.x = peh.x;
        t.p.peh0.y = peh.y;
    }
}

function updateTransitionEndPoints(t)
{
    if (t.end.length > 1)
    {
        var ps, pa, pe;
        
        ps = getEllipseBorderCoord(t.start, t.p.psh0);
        t.p.pse0.x = ps.x;
        t.p.pse0.y = ps.y;
        
        for (var te_i = 0; te_i < t.end.length; te_i++)
        {
            pe = getEllipseBorderCoord(t.end[te_i], t.p['peh' + te_i]);
            pa = getAddedLenCoord(t.end[te_i], pe, mlen_g);
            
            t.p['pea' + te_i].x = pa.x;
            t.p['pea' + te_i].y = pa.y;
            t.p['pee' + te_i].x = pe.x;
            t.p['pee' + te_i].y = pe.y;
        }
    }
    else
    {
        var ps, pa, pe;
        
        ps = getEllipseBorderCoord(t.start, t.p.psh0);
        pe = getEllipseBorderCoord(t.end[0], t.p.peh0);
        pa = getAddedLenCoord(t.end[0], pe, mlen_g);
        
        t.p.pse0.x = ps.x;
        t.p.pse0.y = ps.y;
        t.p.pea0.x = pa.x;
        t.p.pea0.y = pa.y;
        t.p.pee0.x = pe.x;
        t.p.pee0.y = pe.y;
    }
}

function createTrHandles(index, parent, dc, d3gtr)
{
    function dragDragHandle (d)
    {
        var d3gthandle = d3.select(parent).select('#trhandle_' + index + '_' + d.id),
            thispoint = d3.select(this).attr('id').split('_'),
            elli = null, p, len, pn = null;
        
        p = { x:0, y:0 };
        
        p.x = d3.event.x;
        p.y = d3.event.y;
        
        switch (thispoint[3][1])
        {
            case 's':
                elli = d.start;
                len = 10;
                break;
            case 'e':
                elli = d.end[thispoint[3][3]];
                len = mlen_g + 10;
                break;
            default:
                break;
        }
        
        if (elli) pn = checkIfInsideEllipse(elli, p, len);
        
        if (pn) p = pn;
        
        switch (thispoint[3][1])
        {
            case 'm':
                switch (thispoint[3])
                {
                
                    case 'pm':
                        var o = { 'draggedpoint':d.p.pm, 'x':d.p.pm.x, 'y':d.p.pm.y };
                        d.p.pm.x = p.x;
                        d.p.pm.y = p.y;
                        updateTransitionHandlePoints(d, o);
                        break;
                    case 'pmhs':
                        d.p.pmhe = mirrorPoint(d.p.pmhs, d.p.pm, d.p.pmhe, p, d.p.pm, true, false);
                        break;
                    case 'pmhe':
                        d.p.pmhs = mirrorPoint(d.p.pmhe, d.p.pm, d.p.pmhs, p, d.p.pm, true, false);
                        break;
                    default:
                        break;
                }
            case 's':
            case 'e':
                d.p[thispoint[3]].x = p.x;
                d.p[thispoint[3]].y = p.y;
                break;
            default:
                break;
        }
        
        updateTransitionEndPoints(d);
        updateTransitionTextPosition(d);
        
        switch (thispoint[3])
        {
            case 'pm':
                d3.select(parent).select('#trhandle_' + index + '_' + d.id + '_pm_m')
                    .attr('cx',d.p.pm.x)
                    .attr('cy',d.p.pm.y);
                d3.select(parent).select('#trhandle_' + index + '_' + d.id + '_pm')
                    .attr('cx',d.p.pm.x)
                    .attr('cy',d.p.pm.y);
                d3.select(parent).select('#trhandle_' + index + '_' + d.id + '_lsh0')
                    .attr('x1',d.p.pse0.x)
                    .attr('y1',d.p.pse0.y)
                    .attr('x2',d.p.psh0.x)
                    .attr('y2',d.p.psh0.y);
                d3.select(parent).select('#trhandle_' + index + '_' + d.id + '_psh0')
                    .attr('cx',d.p.psh0.x)
                    .attr('cy',d.p.psh0.y);
            case 'pmhs':
            case 'pmhe':
                d3.select(parent).select('#trhandle_' + index + '_' + d.id + '_lmhs')
                    .attr('x1',d.p.pm.x)
                    .attr('y1',d.p.pm.y)
                    .attr('x2',d.p.pmhs.x)
                    .attr('y2',d.p.pmhs.y);
                d3.select(parent).select('#trhandle_' + index + '_' + d.id + '_pmhs')
                    .attr('cx',d.p.pmhs.x)
                    .attr('cy',d.p.pmhs.y);
                d3.select(parent).select('#trhandle_' + index + '_' + d.id + '_lmhe')
                    .attr('x1',d.p.pm.x)
                    .attr('y1',d.p.pm.y)
                    .attr('x2',d.p.pmhe.x)
                    .attr('y2',d.p.pmhe.y);
                d3.select(parent).select('#trhandle_' + index + '_' + d.id + '_pmhe')
                    .attr('cx',d.p.pmhe.x)
                    .attr('cy',d.p.pmhe.y);
                break;
            default:
                d3.select(parent).select('#trhandle_' + index + '_' + d.id + '_l' + thispoint[3].substring(1))
                    .attr('x1',d.p[thispoint[3].substring(0,2) + 'e' + thispoint[3][3]].x)
                    .attr('y1',d.p[thispoint[3].substring(0,2) + 'e' + thispoint[3][3]].y)
                    .attr('x2',d.p[thispoint[3]].x)
                    .attr('y2',d.p[thispoint[3]].y);
                d3.select(this)
                    .attr('cx',d.p[thispoint[3]].x)
                    .attr('cy',d.p[thispoint[3]].y);
                break;
            
        }
        
        if (d.end.length > 1)
        {
            d3.select(parent).select('#transition_' + index + '_' + d.id)
                .selectAll('path')
                    .each(function (dd, te_i)
                    {
                        d3.select(this)
                            .attr('d', function (dd)
                            {
                                var bezierstring = 'M';
                                    
                                if (!te_i)
                                {
                                    bezierstring += dd.p.pse0.x+' ';
                                    bezierstring += dd.p.pse0.y+' C';
                                    bezierstring += dd.p.psh0.x+' ';
                                    bezierstring += dd.p.psh0.y+' ';
                                    bezierstring += dd.p.pmhs.x+' ';
                                    bezierstring += dd.p.pmhs.y+' ';
                                    bezierstring += dd.p.pm.x+' ';
                                    bezierstring += dd.p.pm.y;
                                }
                                else
                                {
                                    bezierstring += dd.p.pm.x+' ';
                                    bezierstring += dd.p.pm.y+' C';
                                    bezierstring += dd.p.pmhe.x+' ';
                                    bezierstring += dd.p.pmhe.y+' ';
                                    bezierstring += dd.p['peh' + (te_i-1)].x+' ';
                                    bezierstring += dd.p['peh' + (te_i-1)].y+' ';
                                    bezierstring += dd.p['pea' + (te_i-1)].x+' ';
                                    bezierstring += dd.p['pea' + (te_i-1)].y;
                                }
                                
                                return bezierstring;
                            });
                    });
        }
        else
        {
            d3.select(parent).select('#transition_' + index + '_' + d.id)
                .select('path')
                    .attr('d', function (dd)
                    {
                        var bezierstring = 'M';
            
                        bezierstring += dd.p.pse0.x+' ';
                        bezierstring += dd.p.pse0.y+' C';
                        bezierstring += dd.p.psh0.x+' ';
                        bezierstring += dd.p.psh0.y+' ';
                        bezierstring += dd.p.peh0.x+' ';
                        bezierstring += dd.p.peh0.y+' ';
                        bezierstring += dd.p.pea0.x+' ';
                        bezierstring += dd.p.pea0.y;
                        
                        return bezierstring;
                    });
        }
        
        if (d.hasOwnProperty('pt'))
        {
            for (var pt_i = 0; pt_i < d.pt.length; pt_i++)
            {
                d3.select(parent).select('#trg_' + index + '_' + d.id + '_' + pt_i)
                    .attr('transform', function (dd) { return 'translate('+(dd.pt[pt_i].x + dd.pt[pt_i].xoff)+','+(dd.pt[pt_i].y + dd.pt[pt_i].yoff)+')'; });
            }
        }
    }
    
    function dragEndHandle(d)
    {
        fsmJsonUpdate(index, parent, !isEmpty(dc.coordinates));
    }
    
    function enterHandle (d)
    {
        for (var p_i = 0; p_i < d.end.length; p_i++)
        {
            highlightState(index, parent, d.end[p_i], 'n');
        }
        
        highlightState(index, parent, d.start, 'n');
        highlightTransition(index, parent, d);
    }
    
    function leaveHandle (d)
    {
        for (var p_i = 0; p_i < d.end.length; p_i++)
        {
            lowlightState(index, parent, d.end[p_i], 'n');
        }
        
        lowlightState(index, parent, d.start, 'n');
        lowlightTransition(index, parent, d);
    }
    
    var d3ghandles = d3.select(parent).select('#handles_' + index);
    
    if (d3ghandles.empty())
    {
        d3ghandles = d3.select(parent).select('#svgcontent_' + index)
            .append('g')
                .attr('id', 'handles_' + index);
    }
    
    d3gtr
        .each(function (d)
        {
            if (d3.select(parent).select('#trhandle_' + index + '_' + d.id).empty())
            {
                var d3gthandle = d3ghandles.append('g')
                    .datum(d)
                    .attr('id', function (dd) { return 'trhandle_' + index + '_' + dd.id; })
                    .classed('trhandle', true);
                
                d3gthandle.append('line')
                    .attr('id', function (dd) { return 'trhandle_' + index + '_' + dd.id + '_' + 'lsh0'; })
                    .attr('x1', function (dd) { return dd.p.pse0.x; })
                    .attr('y1', function (dd) { return dd.p.pse0.y; })
                    .attr('x2', function (dd) { return dd.p.psh0.x; })
                    .attr('y2', function (dd) { return dd.p.psh0.y; });
                
                d3gthandle.append('circle')
                    .attr('id', function (dd) { return 'trhandle_' + index + '_' + dd.id + '_' + 'psh0'; })
                    .attr('r', 10)
                    .attr('cx', function (dd) { return dd.p.psh0.x; })
                    .attr('cy', function (dd) { return dd.p.psh0.y; })
                    .call(d3.drag()
                        .subject(function (dd) { return dd.p[d3.select(this).attr('id').split('_')[3]]; })
                        .on('drag', dragDragHandle)
                        .on('end', dragEndHandle))
                    .on('mouseenter', enterHandle)
                    .on('mouseleave', leaveHandle);
                
                if (d.end.length > 1)
                {
                    var p = ['mhs','mhe', 'm'];
                    
                    for (var p_i = 0; p_i < p.length; p_i++)
                    {
                        if (p_i < p.length - 1)
                        {
                            d3gthandle.append('line')
                                .attr('id', function (dd) { return 'trhandle_' + index + '_' + dd.id + '_' + 'l' + p[p_i]; })
                                .attr('x1', function (dd) { return dd.p.pm.x; })
                                .attr('y1', function (dd) { return dd.p.pm.y; })
                                .attr('x2', function (dd) { return dd.p['p' + p[p_i]].x; })
                                .attr('y2', function (dd) { return dd.p['p' + p[p_i]].y; });
                        }
                        else
                        {
                            d3gthandle.append('circle')
                                .attr('id', function (dd) { return 'trhandle_' + index + '_' + dd.id + '_' + 'p' + p[p_i] + '_m'; })
                                .attr('r', 4)
                                .attr('cx', function (dd) { return dd.p['p' + p[p_i]].x; })
                                .attr('cy', function (dd) { return dd.p['p' + p[p_i]].y; });
                        }
                        
                        d3gthandle.append('circle')
                            .attr('id', function (dd) { return 'trhandle_' + index + '_' + dd.id + '_' + 'p' + p[p_i]; })
                            .attr('r', 10)
                            .attr('cx', function (dd) { return dd.p['p' + p[p_i]].x; })
                            .attr('cy', function (dd) { return dd.p['p' + p[p_i]].y; })
                            .call(d3.drag()
                                .subject(function (dd) { return dd.p[d3.select(this).attr('id').split('_')[3]]; })
                                .on('drag', dragDragHandle)
                                .on('end', dragEndHandle))
                            .on('mouseenter', enterHandle)
                            .on('mouseleave', leaveHandle);
                    }
                }
                
                for (var te_i = 0; te_i < d.end.length; te_i++)
                {
                    d3gthandle.append('line')
                        .attr('id', function (dd) { return 'trhandle_' + index + '_' + dd.id + '_' + 'leh' + te_i; })
                        .attr('x1', function (dd) { return dd.p['pee' + te_i].x; })
                        .attr('y1', function (dd) { return dd.p['pee' + te_i].y; })
                        .attr('x2', function (dd) { return dd.p['peh' + te_i].x; })
                        .attr('y2', function (dd) { return dd.p['peh' + te_i].y; });
                    
                    d3gthandle.append('circle')
                        .attr('id', function (dd) { return 'trhandle_' + index + '_' + dd.id + '_' + 'peh' + te_i; })
                        .attr('r', 10)
                        .attr('cx', function (dd) { return dd.p['peh' + te_i].x; })
                        .attr('cy', function (dd) { return dd.p['peh' + te_i].y; })
                        .call(d3.drag()
                            .subject(function (dd) { return dd.p[d3.select(this).attr('id').split('_')[3]]; })
                            .on('drag', dragDragHandle)
                            .on('end', dragEndHandle))
                        .on('mouseenter', enterHandle)
                        .on('mouseleave', leaveHandle);
                }
            }
        });
}

function createNtHandles(index, parent, dc, d3gnt)
{
    function dragDragHandle (d)
    {
        d.pp.x = d3.event.x;
        d.pp.y = d3.event.y;
        
        d3.select(parent).select('#note_' + index + '_' + d.id).select('path')
                .attr('d', createNotePath(d.pc, d.pp, d.width, d.height));
        
        /*d3.select('#' + d3.select(this).attr('id') + '_m')
            .attr('cx',d.pp.x)
            .attr('cy',d.pp.y);*/
        
        d3.select(this.parentNode).selectAll('circle')
            .attr('cx',d.pp.x)
            .attr('cy',d.pp.y);
    }
    
    function dragEndHandle(d)
    {
        fsmJsonUpdate(index, parent, !isEmpty(dc.coordinates));
    }
    
    function enterHandle (d)
    {
        highlightNote(index, parent,d, 'act');
    }
    
    function leaveHandle (d)
    {
        lowlightNote(index, parent, d, 'act');
    }
    
    var d3ghandles = d3.select(parent).select('#handles_' + index);
    
    if (d3ghandles.empty())
    {
        d3ghandles = d3.select(parent).select('#svgcontent_' + index)
            .append('g')
                .attr('id', 'handles_' + index);
    }
    
    d3gnt
        .each(function (d)
        {
            if (d3.select(parent).select('#nthandle_' + index + '_' + d.id).empty())
            {
                var d3gnhandle = d3ghandles.append('g')
                    .datum(d)
                    .attr('id', function (dd) { return 'nthandle_' + index + '_' + dd.id; })
                    .classed('nthandle', true);
                
                d3gnhandle.append('circle')
                    .attr('id', function (dd) { return 'nthandle_' + index + '_' + dd.id + '_pp_m'; })
                    .attr('r', 4)
                    .attr('cx', function (dd) { return dd.pp.x; })
                    .attr('cy', function (dd) { return dd.pp.y; });
                
                d3gnhandle.append('circle')
                    .attr('id', function (dd) { return 'nthandle_' + index + '_' + dd.id + '_pp'; })
                    .attr('r', 10)
                    .attr('cx', function (dd) { return dd.pp.x; })
                    .attr('cy', function (dd) { return dd.pp.y; })
                    .call(d3.drag()
                        .subject(function (dd) { return dd[d3.select(this).attr('id').split('_')[3]]; })
                        .on('drag', dragDragHandle)
                        .on('end', dragEndHandle))
                    .on('mouseenter', enterHandle)
                    .on('mouseleave', leaveHandle);
            }
        });
}

function removeHandle(index, parent, d3g, handle_id)
{
    d3g
        .each(function (d)
        {
            d3.select(parent).select('#' + handle_id + d.id).remove();
        });
    
    if (d3.select(parent).select('#handles_' + index).selectAll('*').empty())
    {
        d3.select(parent).select('#handles_' + index).remove();
    }
}

function createStates(index, parent, dc)
{
    function dragStartState(d)
    {
        
    }
    
    function dragDragState(d)
    {
        var c = getCoordOnGrid(fsmGrid.grid.widthMin, d3.event.x, d3.event.y);
        var o = { 'draggedpoint':d, 'x':d.x, 'y':d.y };
        
        d.x = c.x;
        d.y = c.y;
        
        d3.select(this).attr('transform', 'translate('+d.x+','+d.y+')');
        
        for (var l_i = 0; l_i < d.links.length; l_i++)
        {
            var l = d.links[l_i];
            
            updateTransitionHandlePoints(l, o);
            updateTransitionEndPoints(l);
            updateTransitionTextPosition(l);
            
            if (l.end.length > 1)
            {
                d3.select(parent)
                    .select('#transition_' + index + '_' + l.id)
                        .selectAll('path')
                            .each(function (dd, te_i)
                            {
                                d3.select(this)
                                    .attr('d', function (dd)
                                    {
                                        var bezierstring = 'M';
                                        
                                        if (!te_i)
                                        {
                                            bezierstring += l.p.pse0.x+' ';
                                            bezierstring += l.p.pse0.y+' C';
                                            bezierstring += l.p.psh0.x+' ';
                                            bezierstring += l.p.psh0.y+' ';
                                            bezierstring += l.p.pmhs.x+' ';
                                            bezierstring += l.p.pmhs.y+' ';
                                            bezierstring += l.p.pm.x+' ';
                                            bezierstring += l.p.pm.y;
                                        }
                                        else
                                        {
                                            bezierstring += l.p.pm.x+' ';
                                            bezierstring += l.p.pm.y+' C';
                                            bezierstring += l.p.pmhe.x+' ';
                                            bezierstring += l.p.pmhe.y+' ';
                                            bezierstring += l.p['peh' + (te_i-1)].x+' ';
                                            bezierstring += l.p['peh' + (te_i-1)].y+' ';
                                            bezierstring += l.p['pea' + (te_i-1)].x+' ';
                                            bezierstring += l.p['pea' + (te_i-1)].y;
                                        }
                                        
                                        return bezierstring;
                                    });
                            });
            }
            else
            {
                d3.select(parent)
                    .select('#transition_' + index + '_' + l.id)
                        .select('path')
                            .attr('d', function (dd)
                            {
                                var bezierstring = 'M';
                    
                                bezierstring += l.p.pse0.x+' ';
                                bezierstring += l.p.pse0.y+' C';
                                bezierstring += l.p.psh0.x+' ';
                                bezierstring += l.p.psh0.y+' ';
                                bezierstring += l.p.peh0.x+' ';
                                bezierstring += l.p.peh0.y+' ';
                                bezierstring += l.p.pea0.x+' ';
                                bezierstring += l.p.pea0.y;
                                
                                return bezierstring;
                            });
            }
            
            for (var p in l.p)
            {
                if (p[2] == 'h')
                {
                    var d3gtr = d3.select(parent).select('#trhandle_' + index + '_' + l.id);
                    
                    d3gtr.select('#trhandle_' + index + '_' + l.id + '_l' + p.substring(1))
                        .attr('x1', (p[1] == 'm' ? l.p.pm.x : l.p[p.substr(0,2) + 'e' + p.substr(3,1)].x))
                        .attr('y1', (p[1] == 'm' ? l.p.pm.y : l.p[p.substr(0,2) + 'e' + p.substr(3,1)].y))
                        .attr('x2', l.p[p].x)
                        .attr('y2', l.p[p].y);
                    
                    d3gtr.select('#trhandle_' + index + '_' + l.id + '_' + p)
                        .attr('cx',l.p[p].x)
                        .attr('cy',l.p[p].y);
                }
            }
            
            if (l.hasOwnProperty('pt'))
            {
                for (var pt_i = 0; pt_i < l.pt.length; pt_i++)
                {
                    d3.select(parent).select('#trg_' + index + '_' + l.id + '_' + pt_i)
                        .attr('transform', function (dd) { return 'translate('+(dd.pt[pt_i].x + dd.pt[pt_i].xoff)+','+(dd.pt[pt_i].y + dd.pt[pt_i].yoff)+')'; });
                }
            }
        }
    }

    function dragEndState(d)
    {
        fsmJsonUpdate(index, parent, !isEmpty(dc.coordinates));
    }
    
    function clickState(d)
    {
        d3.select(this)
            .each(function(d)
            {
                var foundactive = 0;
                
                for (var l_i = 0; l_i < d.links.length; l_i++)
                {
                    if (!d3.select(parent).select('#trhandle_' + index + '_' + d.links[l_i].id).empty())
                    {
                        foundactive++;
                    }
                }
                
                if (foundactive)
                {
                    for (var l_i = 0; l_i < d.links.length; l_i++)
                    {
                        removeHandle(index, parent, d3.select('#transition_' + index + '_' + d.links[l_i].id), 'trhandle_' + index + '_');
                    }
                }
                else
                {
                    for (var l_i = 0; l_i < d.links.length; l_i++)
                    {
                        createTrHandles(index, parent, dc, d3.select('#transition_' + index + '_' + d.links[l_i].id));
                    }
                    
                    enterState(d);
                }
            });
    }
    
    function enterState(d)
    {
        d3.select(parent).select('#state_' + index + '_' + d.id)
            .each(function(dd)
            {
                for (var l_i = 0; l_i < dd.links.length; l_i++)
                {
                    for (var p_i = 0; p_i < dd.links[l_i].end.length; p_i++)
                    {
                        if (dd.links[l_i].end[p_i] != d)
                        {
                            highlightState(index, parent, dd.links[l_i].end[p_i], 'n');
                        }
                    }
                    
                    if (dd.links[l_i].start != d)
                    {
                        highlightState(index, parent, dd.links[l_i].start, 'n');
                    }
                    
                    highlightTransition(index, parent, dd.links[l_i], 'n');
                }
            });
        
        highlightState(index, parent, d, 'act');
    }
    
    function leaveState(d)
    {
        d3.select(parent).select('#state_' + index + '_' + d.id)
            .each(function(dd)
            {
                for (var l_i = 0; l_i < dd.links.length; l_i++)
                {
                    for (var p_i = 0; p_i < dd.links[l_i].end.length; p_i++)
                    {
                        if (dd.links[l_i].end[p_i] != d)
                        {
                            lowlightState(index, parent, dd.links[l_i].end[p_i]);
                        }
                    }
                    
                    if (dd.links[l_i].start != d)
                    {
                        lowlightState(index, parent, dd.links[l_i].start);
                    }
                    
                    lowlightTransition(index, parent, dd.links[l_i]);
                }
            });
        
        lowlightState(index, parent, d);
    }

    var d3g_states = d3.select(parent).select('#graph_' + index).append('g')
        .attr('id', 'states_' + index);
    
    if (dc.states.length < 2)
    {
        errMsg(d3svg, 'Not enough states to display a graph.');
    }
    else
    {
        for (var state_i = 0; state_i < dc.states.length; state_i++)
        {
            var d3g_state = d3g_states.append('g')
                .datum(dc.states[state_i])
                .attr('id', function (d) { return 'state_' + index + '_' + d.id; })
                .classed('state', true)
                .each(function (d)
                {
                    if (d.zerostate)
                    {
                        d3.select(this).classed('statezero', true);
                    }
                    else
                    {
                        d3.select(this).classed('statereg', true);
                    }
                })
                .call(d3.drag()
                    .subject(function (d) { return d; })
                    .on('start', dragStartState)
                    .on('drag', dragDragState)
                    .on('end', dragEndState))
                .on('click', clickState)
                .on('mouseenter', enterState)
                .on('mouseleave', leaveState);
            
            var d3ellipse_state = d3g_state.append('ellipse')
                .datum(dc.states[state_i])
                .attr('cx', 0)
                .attr('cy', 0);
            
            var d3g_statelabel = d3g_state.append('g')
                .classed('stext', true);
            
            var d3text_statename = d3g_statelabel.append('text')
                .datum(dc.states[state_i])
                .classed('stextname', true)
                .attr('x', 0)
                .attr('y', 0)
                .each(function (d)
                {
                    if (d.zerostate)
                    {
                        var zerolines = [];
                        var zeroline = [];
                        
                        if (d.links[0].pt[0])
                        {
                            zerolines = d.links[0].pt[0].cond;
                            //console.log(zeroline)
                        }
                        else
                        {
                            zeroline.push({ 'content':'cond' });
                            zerolines.push(zeroline);
                            zeroline = [];
                            zeroline.push({ 'content':'N/A' });
                            zerolines.push(zeroline);
                        }
                        
                        for (var lines_i = 0; lines_i < zerolines.length; lines_i++)
                        {
                            var d3tspan = d3.select(this).append('tspan')
                                .attr('x', 0)
                                .attr('dy', function (dd)
                                    {
                                        return (lines_i ? (1) : -((zerolines.length - 1)))+'em';
                                    });
                            
                            for (var line_i = 0; line_i < zerolines[lines_i].length; line_i++)
                            {
                                d3tspan.append('tspan')
                                    .classed('textbf', zerolines[lines_i][line_i].bf)
                                    .classed('textit', zerolines[lines_i][line_i].it)
                                    .style('font-size', zerolines[lines_i][line_i].fs)
                                    .text(function (dd) { return zerolines[lines_i][line_i].content; });
                            }
                        }
                    }
                    else
                    {
                        var statename = d.name,
                            firstline,
                            firstlineheight = 0;
                        
                        for (var namelines_i = 0; namelines_i < statename.length; namelines_i++)
                        {
                            var d3tspan = d3.select(this).append('tspan')
                                .attr('x', 0);
                            
                            if (!namelines_i) firstline = d3tspan;
                            
                            var lineheight = 0;
                            
                            for (var nameline_i = 0; nameline_i < statename[namelines_i].length; nameline_i++)
                            {
                                var d3tspanle = d3tspan.append('tspan')
                                    .classed('textbf', statename[namelines_i][nameline_i].bf)
                                    .classed('textit', statename[namelines_i][nameline_i].it)
                                    .style('font-size', statename[namelines_i][nameline_i].fs)
                                    .text(function (dd) { return statename[namelines_i][nameline_i].content; });
                                
                                var fs = parseInt(window.getComputedStyle(d3tspanle.node(), null).getPropertyValue('font-size'), 10);
                                                
                                lineheight = (fs > lineheight) ? fs : lineheight;
                            }
                            
                            if (namelines_i) firstlineheight = firstlineheight - lineheight;
                                
                            d3tspan
                                .attr('dy', function (ddd) { return (lineheight)+'px'; });
                        }
                        
                        firstline
                            .attr('dy', function (ddd) { return (firstlineheight - 0.25*lineheight)+'px'; });
                        
                        if (d.action)
                        {
                            var stateaction = d.action;
                            
                            var d3line_statediv = d3g_statelabel.append('line');
                            
                            var d3text_stateaction = d3g_statelabel.append('text')
                                .datum(dc.states[state_i])
                                .classed('stextaction', true)
                                .attr('x', 0)
                                .attr('y', 0);
                            
                            for (var actlines_i = 0; actlines_i < stateaction.length; actlines_i++)
                            {
                                var d3tspan = d3text_stateaction.append('tspan')
                                    .attr('x', 0);
                                    //.attr('dy', function (dd) { return (actlines_i ? 1 : 0)+'em'; });
                                
                                var lineheight = 0;
                                
                                for (var actline_i = 0; actline_i < stateaction[actlines_i].length; actline_i++)
                                {
                                    var d3tspanle = d3tspan.append('tspan')
                                        .classed('textbf', stateaction[actlines_i][actline_i].bf)
                                        .classed('textit', stateaction[actlines_i][actline_i].it)
                                        .style('font-size', stateaction[actlines_i][actline_i].fs)
                                        .text(function (dd) { return stateaction[actlines_i][actline_i].content; });
                                    
                                    var fs = parseInt(window.getComputedStyle(d3tspanle.node(), null).getPropertyValue('font-size'), 10);
                                    
                                    lineheight = (fs > lineheight) ? fs : lineheight;
                                }
                                
                                d3tspan
                                    .attr('dy', function (ddd) { return (lineheight)+'px'; });
                            }
                        }
                    }
                });
            
            d3g_statelabel
                .each(function (d)
                {
                    var t;
                    
                    t = this.getBBox();
                    
                    d.a = t.width;// * 0.75;//calcEllipseA(t.height, t.width / 2);
                    d.b = t.height / 2 + 10;
                    
                    d3.select(this).select('line')
                        .attr('x1', function (d) { return -t.width*0.6; })
                        .attr('x2', function (d) { return t.width*0.6; })
                        .attr('y1', function (d) { return 0; })
                        .attr('y2', function (d) { return 0; });
                });
            
            d3ellipse_state
                .attr('rx', function (d) { return d.a; })
                .attr('ry', function (d) { return d.b; })
                .each(function (d)
                {
                    var t = d3g_statelabel.node().getBBox();
                    var e = this.getBBox();
                    
                    var yoffset = (e.height - t.height) / 2 + (e.y - t.y);
                    
                    d3g_statelabel
                        .attr('transform', function (dd) { return 'translate(0,'+yoffset+')'; });
                    
                    if (d.zerostate)
                    {
                        this.remove();
                    }
                });
        }
    
        var s_row_len = Math.ceil(Math.sqrt(dc.states.length));
        var s_row = 0, s_row_pos = 0;
        var s_row_maxy = 0, s_row_maxx = 0;
        var s_x = fsmGrid.grid.widthMain, s_y = fsmGrid.grid.widthMain;
        var c;
        
        d3g_states.selectAll('g[id^=state_' + index + '_]')
            .each(function (d)
            {
                var state = {};
                
                if (dc.coordinates && dc.coordinates.states)
                {
                    for (var state_i = 0; state_i < dc.coordinates.states.length; state_i++)
                    {
                        var st = dc.coordinates.states[state_i];
                    
                        if (st.length > 1 && st[0] == d.refid)
                        {
                            state.x = st[1];
                            
                            if (st.length > 2)
                            {
                                state.y = st[2];
                            }
                            
                            break;
                        }
                    }
                }
                
                if (!s_row_maxx)
                {
                    c = getCoordOnGrid(fsmGrid.grid.widthMain, s_x, s_y);
                }
                else
                {
                    c = getCoordOnGrid(fsmGrid.grid.widthMain, s_row_maxx + 2 * fsmGrid.grid.widthMain + d.a, s_y);
                }
                
                d.x = c.x;
                d.y = c.y;
                
                if (state.hasOwnProperty('x'))
                {
                    d.x = state.x;
                    
                    if (state.hasOwnProperty('y'))
                    {
                        d.y = state.y;
                    }
                }
                
                d3.select(this).attr('transform', function (d) { return 'translate('+d.x+','+d.y+')'; });
                
                s_row_maxx = d.x + d.a;
                
                if (s_row_maxy < d.y + d.a)
                {
                    s_row_maxy = d.y + d.a;
                }
                
                s_row_pos++;
                
                if (!((s_row_pos) % s_row_len))
                {
                    s_y = s_row_maxy + fsmGrid.grid.widthMain;
                    s_row_maxx = 0;
                    s_row_pos = 0;
                    s_row++;
                }
            });
    }
}

function createNotes(index, parent, dc)
{
    function dragDragNote(d)
    {
        var notepath;
        
        d.pc.x = d3.event.x;
        d.pc.y = d3.event.y;
        d.pp.x += d3.event.dx;
        d.pp.y += d3.event.dy;
        
        d3.select(parent).select('#ntg_' + index + '_' + d.id).attr('transform', 'translate('+d.pc.x+','+d.pc.y+')');
        
        notepath = createNotePath(d.pc, d.pp, d.width, d.height);
        
        d3.select(parent).select('#note_' + index + '_' + d.id).selectAll('path')
            .attr('d', notepath);
        
        d3.select(parent).select('#nthandle_' + index + '_' + d.id).selectAll('circle')
            .attr('cx',d.pp.x)
            .attr('cy',d.pp.y);
    }
    
    function dragDragNoteBody(d)
    {
        var notepath;
        
        d.pc.x = d3.event.x;
        d.pc.y = d3.event.y;
        
        d3.select(parent).select('#ntg_' + index + '_' + d.id).attr('transform', 'translate('+d.pc.x+','+d.pc.y+')');
        
        notepath = createNotePath(d.pc, d.pp, d.width, d.height);
        
        d3.select(parent).select('#note_' + index + '_' + d.id).selectAll('path')
            .attr('d', notepath);
    }
    
    function dragEndNote(d)
    {
        fsmJsonUpdate(index, parent, !isEmpty(dc.coordinates));
    }
    
    function clickNote(d)
    {
        if (d3.select(parent).select('#nthandle_' + index + '_' + d.id).empty())
        {
            createNtHandles(index, parent, dc, d3.select(this));
            
            if (d3.select(this).classed('noteact'))
            {
                d3.select(parent).select('#nthandle_' + index + '_' + d.id).classed('nthandleact', true);
            }
        }
        else
        {
            removeHandle(index, parent, d3.select(this), 'nthandle_' + index + '_');
        }
    }
    
    function enterNote(d)
    {
        highlightNote(index, parent, d, 'act');
        d3.select(this).insert('path', 'path + *')
            .attr('d', createNotePath(d.pc, d.pp, d.width, d.height));
    }
    
    function leaveNote(d)
    {
        lowlightNote(index, parent, d, 'act');
        d3.select(this).select('path + path').remove();
    }
    
    function enterNoteBody(d)
    {
        lowlightNote(index, parent, d, 'act');
        highlightNote(index, parent, d, 'actb');
    }
    
    function leaveNoteBody(d)
    {
        if (d3.select(this).classed('noteact')) lowlightNote(index, parent, d, 'act');
        else highlightNote(index, parent, d, 'act');
        lowlightNote(index, parent, d, 'actb');
    }
    
    var d3g_notes = d3.select(parent).select('#graph_' + index).append('g')
        .attr('id', 'notes_' + index);
    
    for (var note_i = 0; note_i < dc.notes.length; note_i++)
    {
        var d3g_note = d3g_notes.append('g')
            .datum(dc.notes[note_i])
            .attr('id', function (d) { return 'note_' + index + '_' + d.id; })
            .classed('note', true)
            .on('click', clickNote)
            .on('mouseenter', enterNote)
            .on('mouseleave', leaveNote)
            .call(d3.drag()
                .subject(function (d) { return { 'x':(d.pc.x), 'y':(d.pc.y) }; })
                .on('drag', dragDragNote)
                .on('end', dragEndNote));
        
        var d3path_note = d3g_note.append('path');
        
        var d3g_noteabs = d3g_note.append('g')
            .attr('id', function (d) { return 'ntg_' + index + '_' + d.id; })
            .call(d3.drag()
                .subject(function (d) { return { 'x':(d.pc.x), 'y':(d.pc.y) }; })
                .on('drag', dragDragNoteBody)
                .on('end', dragEndNote))
            .on('mouseenter', enterNoteBody)
            .on('mouseleave', leaveNoteBody);
        
        var d3g_noterel = d3g_noteabs.append('g');
        
        var d3rect_note = d3g_noterel.append('rect');
        
        var d3g_notelabel = d3g_noterel.append('g')
            .attr('transform', 'translate('+notemargin_g+','+notemargin_g+')');
        
        var d3text_note = d3g_notelabel.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .each(function (d)
            {
                d3.select(this).append('tspan')
                    .attr('x', 0)
                    .attr('dy', '1em')
                    .text(function (dd) { return dd.refid; });
                
                var notecont = d.text;
                
                for (var textlines_i = 0; textlines_i < notecont.length; textlines_i++)
                {
                    var d3tspan = d3.select(this).append('tspan')
                        .attr('x', 0);
                    
                    var lineheight = 0;
                    
                    for (var textline_i = 0; textline_i < notecont[textlines_i].length; textline_i++)
                    {
                        var d3tspanle = d3tspan.append('tspan')
                            .classed('textbf', notecont[textlines_i][textline_i].bf)
                            .classed('textit', notecont[textlines_i][textline_i].it)
                            .style('font-size', notecont[textlines_i][textline_i].fs)
                            .text(notecont[textlines_i][textline_i].content);
                        
                        var fs = parseInt(window.getComputedStyle(d3tspanle.node(), null).getPropertyValue('font-size'), 10);
                        
                        lineheight = (fs > lineheight) ? fs : lineheight;
                    }
                    
                    d3tspan
                        .attr('dy', (lineheight + 'px'));
                }
            });
        
        d3g_noterel
            .each(function (d)
            {
                var t, relx, rely, nw, nh;
                
                t = this.getBBox();
                d.width = t.width;
                d.height = t.height;
                relx = -1 * (t.width / 2 + notemargin_g);
                rely = -1 * (t.height / 2 + notemargin_g);
                nw = d.width + 2* notemargin_g;
                nh = d.height + 2* notemargin_g;
                
                d3.select(this)
                    .attr('transform', 'translate('+relx+','+rely+')');
                
                d3.select(this).select('rect')
                    .attr('width', nw)
                    .attr('height', nh);
            });
    }
    
    var n_row_len = Math.ceil(Math.sqrt(dc.notes.length));
    var n_row_pos = 0;
    var n_row_maxy = 0, n_row_maxx = 0;
    var s_x = fsmGrid.grid.widthMain * 1.5, s_y = fsmGrid.grid.widthMain;
    var c;
    
    d3g_notes.selectAll('g[id^=note_' + index + '_]')
        .each(function (d)
        {
            var note = { pc:{}, pp:{} };
            
            if (dc.coordinates && dc.coordinates.notes)
            {
                for (var note_i = 0; note_i < dc.coordinates.notes.length; note_i++)
                {
                    var nt = dc.coordinates.notes[note_i];
                
                    if (nt.length > 1 && nt[0] == d.refid)
                    {
                        note.pc.x = nt[1];
                        
                        if (nt.length > 2)
                        {
                            note.pc.y = nt[2];
                            
                            if (nt.length > 3)
                            {
                                note.pp.x = nt[3];
                                
                                if (nt.length > 4)
                                {
                                    note.pp.y = nt[4];
                                }
                            }
                        }
                        
                        break;
                    }
                }
            }
            
            if (!n_row_maxx)
            {
                c = getCoordOnGrid(fsmGrid.grid.widthMain, s_x, s_y);
            }
            else
            {
                c = getCoordOnGrid(fsmGrid.grid.widthMain, n_row_maxx + 2 * fsmGrid.grid.widthMain + d.width / 2, s_y);
            }
            
            d.pc.x = c.x;
            d.pc.y = c.y;
            d.pp.x = c.x;
            d.pp.y = c.y;
            
            if (note.pc.hasOwnProperty('x'))
            {
                d.pc.x = note.pc.x;
                
                if (note.pc.hasOwnProperty('y'))
                {
                    d.pc.y = note.pc.y;
                }
            }
            
            if (note.pp.hasOwnProperty('x'))
            {
                d.pp.x = note.pp.x;
                
                if (note.pp.hasOwnProperty('y'))
                {
                    d.pp.y = note.pp.y;
                }
            }
            
            d3.select(this).select('path')
                .attr('d', createNotePath(d.pc, d.pp, d.width, d.height));
            
            d3.select(this).select('g')
                .attr('transform', function (d) { return 'translate('+d.pc.x+','+d.pc.y+')'; });
            
            n_row_maxx = d.pc.x + d.width / 2;
            
            if (n_row_maxy < d.pc.y + d.width / 2)
            {
                n_row_maxy = d.pc.y + d.width / 2;
            }
            
            n_row_pos++;
            
            if (!((n_row_pos) % n_row_len))
            {
                s_y = n_row_maxy + fsmGrid.grid.widthMain;
                n_row_maxx = 0;
                n_row_pos = 0;
            }
        });
}

function createNotePath(pc, pp, w, h)
{
    var path = '';
    var l, r, t, b;
    var pointerbaselen = 2 * notemargin_g;
    
    l = pc.x - w / 2 - notemargin_g;
    r = pc.x + w / 2 + notemargin_g;
    t = pc.y - h / 2 - notemargin_g;
    b = pc.y + h / 2 + notemargin_g;
    
    if (((pp.x < l) || (pp.x > r)) && ((pp.y < t) || (pp.y > b))) //pointer beyond corners
    {
        var dx, dy, dxb, dyb, alpha;
        
        if (pp.x < l)
        {
            dx = l - pp.x;
        }
        else
        {
            dx = pp.x - r;
        }
        
        if (pp.y < t)
        {
            dy = t - pp.y;
        }
        else
        {
            dy = pp.y - b;
        }
        
        alpha = Math.atan2(dy, dx) % (Math.PI / 2);
        dxb = pointerbaselen * (alpha / (Math.PI / 2));
        dyb = pointerbaselen - dxb;
        
        path += 'M';
        path += pp.x+' '+pp.y+' ';
        path += 'L';
        
        if ((pp.x < l) && (pp.y < t)) //upper left
        {
            path += (l + dxb)+' '+t+' ';
            path += r+' '+t+' ';
            path += r+' '+b+' ';
            path += l+' '+b+' ';
            path += l+' '+(t + dyb)+' ';
        }
        else if ((pp.x > r) && (pp.y < t)) //upper right
        {
            path += r+' '+(t + dyb)+' ';
            path += r+' '+b+' ';
            path += l+' '+b+' ';
            path += l+' '+t+' ';
            path += (r - dxb)+' '+t+' ';
        }
        else if ((pp.x > r) && (pp.y > b)) //lower right
        {
            path += (r - dxb)+' '+b+' ';
            path += l+' '+b+' ';
            path += l+' '+t+' ';
            path += r+' '+t+' ';
            path += r+' '+(b - dyb)+' ';
        }
        else //lower left
        {
            path += l+' '+(b - dyb)+' ';
            path += l+' '+t+' ';
            path += r+' '+t+' ';
            path += r+' '+b+' ';
            path += (l + dxb)+' '+b+' ';
        }
        
        path += ' Z';
    }
    else if ((pp.x >= l) && (pp.x <= r) && (pp.y >= t) && (pp.y <= b)) //pointer inside/behind note box
    {
        path += 'M';
        path += l+' '+t+' ';
        path += 'L';
        path += r+' '+t+' ';
        path += r+' '+b+' ';
        path += l+' '+b+' ';
        path += 'Z';
    }
    else //pointer l, r, t, b of note box
    {
        var d1, d2, d1b, d2b;
        
        if ((pp.x < l) || (pp.x > r))
        {
            d1 = pp.y - t;
            d2 = b - pp.y;
        }
        else
        {
            d1 = pp.x - l;
            d2 = r - pp.x;
        }
        
        if (d1 > d2)
        {
            if (d2 > pointerbaselen / 2)
            {
                d2b = pointerbaselen / 2;
                d1b = d2b;
            }
            else
            {
                d2b = d2;
                d1b = pointerbaselen - d2b;
            }
        }
        else
        {
            if (d1 > pointerbaselen / 2)
            {
                d1b = pointerbaselen / 2;
                d2b = d1b;
            }
            else
            {
                d1b = d1;
                d2b = pointerbaselen - d1b;
            }
        }
        
        path += 'M';
        path += pp.x+' '+pp.y+' ';
        path += 'L';
        
        if (pp.x < l) //left
        {
            path += l+' '+(pp.y - d1b)+' ';
            path += l+' '+t+' ';
            path += r+' '+t+' ';
            path += r+' '+b+' ';
            path += l+' '+b+' ';
            path += l+' '+(pp.y + d2b)+' ';
        }
        else if (pp.y < t) //upper
        {
            path += (pp.x + d2b)+' '+t+' ';
            path += r+' '+t+' ';
            path += r+' '+b+' ';
            path += l+' '+b+' ';
            path += l+' '+t+' ';
            path += (pp.x - d1b)+' '+t+' ';
        }
        else if (pp.x > r) //right
        {
            path += r+' '+(pp.y + d2b)+' ';
            path += r+' '+b+' ';
            path += l+' '+b+' ';
            path += l+' '+t+' ';
            path += r+' '+t+' ';
            path += r+' '+(pp.y - d1b)+' ';
        }
        else //lower
        {
            path += (pp.x - d1b)+' '+b+' ';
            path += l+' '+b+' ';
            path += l+' '+t+' ';
            path += r+' '+t+' ';
            path += r+' '+b+' ';
            path += (pp.x + d2b)+' '+b+' ';
        }
        
        path += 'Z';
    }
    
    return path;
}

function getCoordOnGrid(gw, x, y)
{
    var nx, ny;
    
    nx = Math.round(x / gw) * gw;
    ny = Math.round(y / gw) * gw;
    
    return { 'x':nx, 'y':ny };
}

function calcEllipseA(b, e)
{
    return Math.sqrt(Math.pow(b, 2) + Math.pow(e, 2));
}

function getRad(deg)
{
    var rad;
    
    rad = deg * Math.PI / 180;
    
    return rad;
}

function errMsg(svg, msg)
{

}

function putInCM(str, wintxt)
{
    var changefunc = (window.name == 'drom.editor.win.svg') ? ('cmSepChangeFunc') : ('cmChangeFunc');

    wintxt.WaveDrom.cm.off('change', wintxt.WaveDrom[changefunc]);
    
    wintxt.WaveDrom.cm.setValue(str);
    wintxt.document.getElementById('InputJSON_0').value = str;
    localStorage.waveform = str;
    
    wintxt.WaveDrom.cm.on('change', wintxt.WaveDrom[changefunc]);
}

function cropSVGToContent(index, parent)
{
    var d3svg = d3.select(parent).select('#svgcontent_' + index),
        d3g = d3.select(parent).select('#graph_' + index),
        extraspace = 20;
    
    d3svg.each(function (d)
    {
        var t = d3g.node().getBBox();
        
        t.x -= extraspace;
        t.y -= extraspace;
        t.width += 2 * extraspace;
        t.height += 2 * extraspace;
        
        d3.select(this)
            .attr('width', t.width)
            .attr('height', t.height)
            .attr('viewBox', t.x + ' ' + t.y + ' ' + t.width + ' ' + t.height);
    });
}

function readyFSMToSave(index, parent)
{
    // var winsvg = getWin('svg');
    
    if (!(d3.select(parent).select('#graph_' + index).empty()))
    {
        cropSVGToContent(index, parent);
    }
}

function restoreSVGViewBox(index, parent)
{
    // var winsvg = getWin('svg');
    
    if (!(d3.select(parent).select('#graph_' + index).empty()))
    {
        resizeSVG(d3.select(parent).select('#svgcontent_' + index));
    }
}

function createFSMBg(index, bg_id)
{
    var vb = d3.select('#svgcontent_' + index).attr('viewBox').split(' ');
    
    d3.select('#graph_' + index).insert('g','*:first-child')
        .attr('id', bg_id)
        .append('rect')
            .attr('x', vb[0])
            .attr('y', vb[1])
            .attr('width', vb[2])
            .attr('height', vb[3])
            .style('fill', '#FFF');
}

function removeAllHandles(index, parent)
{
    // var winsvg = getWin('svg');
    
    d3.select(parent).select('#handles_' + index).remove();
}

function getWin(winsuffix)
{
    return window;
    // var winname = 'drom.editor.win.';
    
    // if (window.name == (winname + 'tutorial'))
    // {
        // return;
    // }
    // else
    // {
        // return (window.name == (winname + 'uni')) ? (window) : (window.open('', winname + winsuffix));
    // }
}

function isEmpty(obj)
{
    for(var prop in obj)
    {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

WaveDrom.createFSMBg = createFSMBg;
WaveDrom.readyFSMToSave = readyFSMToSave;
WaveDrom.restoreSVGViewBox = restoreSVGViewBox;
WaveDrom.removeAllHandles = removeAllHandles;

module.exports = renderFsm;

},{"./fsm-gen-grid":7,"./fsm-json-update":10,"./fsm-resize-svg":12,"d3-drag":47,"d3-selection":48}],12:[function(require,module,exports){
'use strict';

var d3 = require('d3-selection'),
	fsmGrid = require('./fsm-gen-grid');

window.addEventListener('resize', resizeFunction);

function resizeFunction()
{
    d3.selectAll('[id^=WaveDrom_Display_]').select('svg').call(resizeSVG);
}

function resizeSVG(d)
{
    var display = d.node().parentNode,
		data = d.datum();
    
    if (data)
    {
        data.vb.height = display.offsetHeight - 1;
        data.vb.width = display.offsetWidth - 1;
        
        adjustSVGsize(display/* , win */);
    }
}

function adjustSVGsize(display/* , win */)
{
    d3.select(display)
        .selectAll('svg')
            .attr('width', function (d) { return d.vb.width; })
            .attr('height', function (d) { return d.vb.height; })
            .attr('viewBox', function (d) { return d.vb.x + ' ' + d.vb.y + ' ' + d.vb.width + ' ' + d.vb.height; })
            .each(function (d)
            {
                if (/^svggrid_/.test(d3.select(this).attr('id')))
                {
                    fsmGrid.create(d3.select(this));
                }
            });
}

module.exports = resizeSVG;

},{"./fsm-gen-grid":7,"d3-selection":48}],13:[function(require,module,exports){
'use strict';

function genBrick (texts, extra, times) {
    var i, j, R = [];

    if (texts.length === 4) {
        for (j = 0; j < times; j += 1) {
            R.push(texts[0]);
            for (i = 0; i < extra; i += 1) {
                R.push(texts[1]);
            }
            R.push(texts[2]);
            for (i = 0; i < extra; i += 1) {
                R.push(texts[3]);
            }
        }
        return R;
    }
    if (texts.length === 1) {
        texts.push(texts[0]);
    }
    R.push(texts[0]);
    for (i = 0; i < (times * (2 * (extra + 1)) - 1); i += 1) {
        R.push(texts[1]);
    }
    return R;
}

module.exports = genBrick;

},{}],14:[function(require,module,exports){
'use strict';

var genBrick = require('./gen-brick');

function genFirstWaveBrick (text, extra, times) {
    var tmp;

    tmp = [];
    switch (text) {
    case 'p': tmp = genBrick(['pclk', '111', 'nclk', '000'], extra, times); break;
    case 'n': tmp = genBrick(['nclk', '000', 'pclk', '111'], extra, times); break;
    case 'P': tmp = genBrick(['Pclk', '111', 'nclk', '000'], extra, times); break;
    case 'N': tmp = genBrick(['Nclk', '000', 'pclk', '111'], extra, times); break;
    case 'l':
    case 'L':
    case '0': tmp = genBrick(['000'], extra, times); break;
    case 'h':
    case 'H':
    case '1': tmp = genBrick(['111'], extra, times); break;
    case '=': tmp = genBrick(['vvv-2'], extra, times); break;
    case '2': tmp = genBrick(['vvv-2'], extra, times); break;
    case '3': tmp = genBrick(['vvv-3'], extra, times); break;
    case '4': tmp = genBrick(['vvv-4'], extra, times); break;
    case '5': tmp = genBrick(['vvv-5'], extra, times); break;
    case 'd': tmp = genBrick(['ddd'], extra, times); break;
    case 'u': tmp = genBrick(['uuu'], extra, times); break;
    case 'z': tmp = genBrick(['zzz'], extra, times); break;
    default:  tmp = genBrick(['xxx'], extra, times); break;
    }
    return tmp;
}

module.exports = genFirstWaveBrick;

},{"./gen-brick":13}],15:[function(require,module,exports){
'use strict';

var genBrick = require('./gen-brick');

function genWaveBrick (text, extra, times) {
    var x1, x2, x3, y1, y2, x4, x5, x6, xclude, atext, tmp0, tmp1, tmp2, tmp3, tmp4;

    x1 = {p:'pclk', n:'nclk', P:'Pclk', N:'Nclk', h:'pclk', l:'nclk', H:'Pclk', L:'Nclk'};

    x2 = {
        '0':'0', '1':'1',
        'x':'x',
        'd':'d',
        'u':'u',
        'z':'z',
        '=':'v',  '2':'v',  '3':'v',  '4':'v', '5':'v'
    };

    x3 = {
        '0': '', '1': '',
        'x': '',
        'd': '',
        'u': '',
        'z': '',
        '=':'-2', '2':'-2', '3':'-3', '4':'-4', '5':'-5'
    };

    y1 = {
        'p':'0', 'n':'1',
        'P':'0', 'N':'1',
        'h':'1', 'l':'0',
        'H':'1', 'L':'0',
        '0':'0', '1':'1',
        'x':'x',
        'd':'d',
        'u':'u',
        'z':'z',
        '=':'v', '2':'v', '3':'v', '4':'v', '5':'v'
    };

    y2 = {
        'p': '', 'n': '',
        'P': '', 'N': '',
        'h': '', 'l': '',
        'H': '', 'L': '',
        '0': '', '1': '',
        'x': '',
        'd': '',
        'u': '',
        'z': '',
        '=':'-2', '2':'-2', '3':'-3', '4':'-4', '5':'-5'
    };

    x4 = {
        'p': '111', 'n': '000',
        'P': '111', 'N': '000',
        'h': '111', 'l': '000',
        'H': '111', 'L': '000',
        '0': '000', '1': '111',
        'x': 'xxx',
        'd': 'ddd',
        'u': 'uuu',
        'z': 'zzz',
        '=': 'vvv-2', '2': 'vvv-2', '3': 'vvv-3', '4': 'vvv-4', '5': 'vvv-5'
    };

    x5 = {
        p:'nclk', n:'pclk', P:'nclk', N:'pclk'
    };

    x6 = {
        p: '000', n: '111', P: '000', N: '111'
    };

    xclude = {
        'hp':'111', 'Hp':'111', 'ln': '000', 'Ln': '000', 'nh':'111', 'Nh':'111', 'pl': '000', 'Pl':'000'
    };

    atext = text.split('');
    //if (atext.length !== 2) { return genBrick(['xxx'], extra, times); }

    tmp0 = x4[atext[1]];
    tmp1 = x1[atext[1]];
    if (tmp1 === undefined) {
        tmp2 = x2[atext[1]];
        if (tmp2 === undefined) {
            // unknown
            return genBrick(['xxx'], extra, times);
        } else {
            tmp3 = y1[atext[0]];
            if (tmp3 === undefined) {
                // unknown
                return genBrick(['xxx'], extra, times);
            }
            // soft curves
            return genBrick([tmp3 + 'm' + tmp2 + y2[atext[0]] + x3[atext[1]], tmp0], extra, times);
        }
    } else {
        tmp4 = xclude[text];
        if (tmp4 !== undefined) {
            tmp1 = tmp4;
        }
        // sharp curves
        tmp2 = x5[atext[1]];
        if (tmp2 === undefined) {
            // hlHL
            return genBrick([tmp1, tmp0], extra, times);
        } else {
            // pnPN
            return genBrick([tmp1, tmp0, tmp2, x6[atext[1]]], extra, times);
        }
    }
}

module.exports = genWaveBrick;

},{"./gen-brick":13}],16:[function(require,module,exports){
'use strict';

var processAll = require('./process-all'),
    eva = require('./eva'),
    renderWaveForm = require('./render-wave-form'),
    editorRefresh = require('./editor-refresh');

module.exports = {
    processAll: processAll,
    eva: eva,
    renderWaveForm: renderWaveForm,
    editorRefresh: editorRefresh
};

},{"./editor-refresh":3,"./eva":4,"./process-all":28,"./render-wave-form":36}],17:[function(require,module,exports){
'use strict';

var jsonmlParse = require('./create-element'),
    w3 = require('./w3');

function insertSVGTemplateAssign (index, parent) {
    var node, e;
    // cleanup
    while (parent.childNodes.length) {
        parent.removeChild(parent.childNodes[0]);
    }
    e =
    ['svg', {id: 'svgcontent_' + index, xmlns: w3.svg, 'xmlns:xlink': w3.xlink, overflow:'hidden'},
        ['style', '.pinname {font-size:12px; font-style:normal; font-variant:normal; font-weight:500; font-stretch:normal; text-align:center; text-anchor:end; font-family:Helvetica} .wirename {font-size:12px; font-style:normal; font-variant:normal; font-weight:500; font-stretch:normal; text-align:center; text-anchor:start; font-family:Helvetica} .wirename:hover {fill:blue} .gate {color:#000; fill:#ffc; fill-opacity: 1;stroke:#000; stroke-width:1; stroke-opacity:1} .gate:hover {fill:red !important; } .wire {fill:none; stroke:#000; stroke-width:1; stroke-opacity:1} .grid {fill:#fff; fill-opacity:1; stroke:none}']
    ];
    node = jsonmlParse(e);
    parent.insertBefore(node, null);
}

module.exports = insertSVGTemplateAssign;

/* eslint-env browser */

},{"./create-element":2,"./w3":38}],18:[function(require,module,exports){
'use strict';

var jsonmlParse = require('./create-element'),
    w3 = require('./w3'),
    waveSkin = require('./wave-skin');

function insertSVGTemplate (index, parent, source, lane) {
    var node, first, e;

    // cleanup
    while (parent.childNodes.length) {
        parent.removeChild(parent.childNodes[0]);
    }

    for (first in waveSkin) { break; }

    e = waveSkin.default || waveSkin[first];

    if (source && source.config && source.config.skin && waveSkin[source.config.skin]) {
        e = waveSkin[source.config.skin];
    }

    if (index === 0) {
        lane.xs     = Number(e[3][1][2][1].width);
        lane.ys     = Number(e[3][1][2][1].height);
        lane.xlabel = Number(e[3][1][2][1].x);
        lane.ym     = Number(e[3][1][2][1].y);
    } else {
        e = ['svg',
            {
                id: 'svg',
                xmlns: w3.svg,
                'xmlns:xlink': w3.xlink,
                height: '0'
            },
            ['g',
                {
                    id: 'waves'
                },
                ['g', {id: 'lanes'}],
                ['g', {id: 'groups'}]
            ]
        ];
    }

    e[e.length - 1][1].id    = 'waves_'  + index;
    e[e.length - 1][2][1].id = 'lanes_'  + index;
    e[e.length - 1][3][1].id = 'groups_' + index;
    e[1].id = 'svgcontent_' + index;
    e[1].height = 0;

    node = jsonmlParse(e);
    parent.insertBefore(node, null);
}

module.exports = insertSVGTemplate;

/* eslint-env browser */

},{"./create-element":2,"./w3":38,"./wave-skin":40}],19:[function(require,module,exports){
'use strict';

//attribute name mapping
var ATTRMAP = {
        rowspan : 'rowSpan',
        colspan : 'colSpan',
        cellpadding : 'cellPadding',
        cellspacing : 'cellSpacing',
        tabindex : 'tabIndex',
        accesskey : 'accessKey',
        hidefocus : 'hideFocus',
        usemap : 'useMap',
        maxlength : 'maxLength',
        readonly : 'readOnly',
        contenteditable : 'contentEditable'
        // can add more attributes here as needed
    },
    // attribute duplicates
    ATTRDUP = {
        enctype : 'encoding',
        onscroll : 'DOMMouseScroll'
        // can add more attributes here as needed
    },
    // event names
    EVTS = (function (/*string[]*/ names) {
        var evts = {}, evt;
        while (names.length) {
            evt = names.shift();
            evts['on' + evt.toLowerCase()] = evt;
        }
        return evts;
    })('blur,change,click,dblclick,error,focus,keydown,keypress,keyup,load,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,resize,scroll,select,submit,unload'.split(','));

/*void*/ function addHandler(/*DOM*/ elem, /*string*/ name, /*function*/ handler) {
    if (typeof handler === 'string') {
        handler = new Function('event', handler);
    }

    if (typeof handler !== 'function') {
        return;
    }

    elem[name] = handler;
}

/*DOM*/ function addAttributes(/*DOM*/ elem, /*object*/ attr) {
    if (attr.name && document.attachEvent) {
        // IE fix for not being able to programatically change the name attribute
        var alt = document.createElement('<' + elem.tagName + ' name=\'' + attr.name + '\'>');
        // fix for Opera 8.5 and Netscape 7.1 creating malformed elements
        if (elem.tagName === alt.tagName) {
            elem = alt;
        }
    }

    // for each attributeName
    for (var name in attr) {
        if (attr.hasOwnProperty(name)) {
            // attributeValue
            var value = attr[name];
            if (
                name &&
                value !== null &&
                typeof value !== 'undefined'
            ) {
                name = ATTRMAP[name.toLowerCase()] || name;
                if (name === 'style') {
                    if (typeof elem.style.cssText !== 'undefined') {
                        elem.style.cssText = value;
                    } else {
                        elem.style = value;
                    }
                    //                    } else if (name === 'class') {
                    //                        elem.className = value;
                    //                        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    //                        elem.setAttribute(name, value);
                    //                        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                } else if (EVTS[name]) {
                    addHandler(elem, name, value);

                    // also set duplicated events
                    if (ATTRDUP[name]) {
                        addHandler(elem, ATTRDUP[name], value);
                    }
                } else if (
                    typeof value === 'string' ||
                     typeof value === 'number' ||
                     typeof value === 'boolean'
                ) {
                    elem.setAttribute(name, value);

                    // also set duplicated attributes
                    if (ATTRDUP[name]) {
                        elem.setAttribute(ATTRDUP[name], value);
                    }
                } else {

                    // allow direct setting of complex properties
                    elem[name] = value;

                    // also set duplicated attributes
                    if (ATTRDUP[name]) {
                        elem[ATTRDUP[name]] = value;
                    }
                }
            }
        }
    }
    return elem;
}

module.exports = addAttributes;

/* eslint-env browser */
/* eslint no-new-func:0 */

},{}],20:[function(require,module,exports){
'use strict';

/*void*/ function appendChild(/*DOM*/ elem, /*DOM*/ child) {
    if (child) {
        // if (
        //     elem.tagName &&
        //     elem.tagName.toLowerCase() === 'table' &&
        //     elem.tBodies
        // ) {
        //     if (!child.tagName) {
        //         // must unwrap documentFragment for tables
        //         if (child.nodeType === 11) {
        //             while (child.firstChild) {
        //                 appendChild(elem, child.removeChild(child.firstChild));
        //             }
        //         }
        //         return;
        //     }
        //     // in IE must explicitly nest TRs in TBODY
        //     var childTag = child.tagName.toLowerCase();// child tagName
        //     if (childTag && childTag !== "tbody" && childTag !== "thead") {
        //         // insert in last tbody
        //         var tBody = elem.tBodies.length > 0 ? elem.tBodies[elem.tBodies.length - 1] : null;
        //         if (!tBody) {
        //             tBody = document.createElement(childTag === "th" ? "thead" : "tbody");
        //             elem.appendChild(tBody);
        //         }
        //         tBody.appendChild(child);
        //     } else if (elem.canHaveChildren !== false) {
        //         elem.appendChild(child);
        //     }
        // } else
        if (
            elem.tagName &&
            elem.tagName.toLowerCase() === 'style' &&
            document.createStyleSheet
        ) {
            // IE requires this interface for styles
            elem.cssText = child;
        } else

        if (elem.canHaveChildren !== false) {
            elem.appendChild(child);
        }
        // else if (
        //     elem.tagName &&
        //     elem.tagName.toLowerCase() === 'object' &&
        //     child.tagName &&
        //     child.tagName.toLowerCase() === 'param'
        // ) {
        //         // IE-only path
        //     try {
        //         elem.appendChild(child);
        //     } catch (ex1) {
        //
        //     }
        //     try {
        //         if (elem.object) {
        //             elem.object[child.name] = child.value;
        //         }
        //     } catch (ex2) {}
        // }
    }
}

module.exports = appendChild;

/* eslint-env browser */

},{}],21:[function(require,module,exports){
'use strict';

var trimWhitespace = require('./jsonml-trim-whitespace');

/*DOM*/ function hydrate(/*string*/ value) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = value;

    // trim extraneous whitespace
    trimWhitespace(wrapper);

    // eliminate wrapper for single nodes
    if (wrapper.childNodes.length === 1) {
        return wrapper.firstChild;
    }

    // create a document fragment to hold elements
    var frag = document.createDocumentFragment ?
        document.createDocumentFragment() :
        document.createElement('');

    while (wrapper.firstChild) {
        frag.appendChild(wrapper.firstChild);
    }
    return frag;
}

module.exports = hydrate;

/* eslint-env browser */

},{"./jsonml-trim-whitespace":23}],22:[function(require,module,exports){
'use strict';

var hydrate = require('./jsonml-hydrate'),
    w3 = require('./w3'),
    appendChild = require('./jsonml-append-child'),
    addAttributes = require('./jsonml-add-attributes'),
    trimWhitespace = require('./jsonml-trim-whitespace');

var patch,
    parse,
    onerror = null;

/*bool*/ function isElement (/*JsonML*/ jml) {
    return (jml instanceof Array) && (typeof jml[0] === 'string');
}

/*DOM*/ function onError (/*Error*/ ex, /*JsonML*/ jml, /*function*/ filter) {
    return document.createTextNode('[' + ex + '-' + filter + ']');
}

patch = /*DOM*/ function (/*DOM*/ elem, /*JsonML*/ jml, /*function*/ filter) {
    for (var i = 1; i < jml.length; i++) {

        if (
            (jml[i] instanceof Array) ||
            (typeof jml[i] === 'string')
        ) {
            // append children
            appendChild(elem, parse(jml[i], filter));
        // } else if (jml[i] instanceof Unparsed) {
        } else if (
            jml[i] &&
            jml[i].value
        ) {
            appendChild(elem, hydrate(jml[i].value));
        } else if (
            (typeof jml[i] === 'object') &&
            (jml[i] !== null) &&
            elem.nodeType === 1
        ) {
            // add attributes
            elem = addAttributes(elem, jml[i]);
        }
    }

    return elem;
};

parse = /*DOM*/ function (/*JsonML*/ jml, /*function*/ filter) {
    var elem;

    try {
        if (!jml) {
            return null;
        }

        if (typeof jml === 'string') {
            return document.createTextNode(jml);
        }

        // if (jml instanceof Unparsed) {
        if (jml && jml.value) {
            return hydrate(jml.value);
        }

        if (!isElement(jml)) {
            throw new SyntaxError('invalid JsonML');
        }

        var tagName = jml[0]; // tagName
        if (!tagName) {
            // correctly handle a list of JsonML trees
            // create a document fragment to hold elements
            var frag = document.createDocumentFragment ?
                document.createDocumentFragment() :
                document.createElement('');
            for (var i = 2; i < jml.length; i++) {
                appendChild(frag, parse(jml[i], filter));
            }

            // trim extraneous whitespace
            trimWhitespace(frag);

            // eliminate wrapper for single nodes
            if (frag.childNodes.length === 1) {
                return frag.firstChild;
            }
            return frag;
        }

        if (
            tagName.toLowerCase() === 'style' &&
            document.createStyleSheet
        ) {
            // IE requires this interface for styles
            patch(document.createStyleSheet(), jml, filter);
            // in IE styles are effective immediately
            return null;
        }

        elem = patch(document.createElementNS(w3.svg, tagName), jml, filter);

        // trim extraneous whitespace
        trimWhitespace(elem);
        // return (elem && (typeof filter === 'function')) ? filter(elem) : elem;
        return elem;
    } catch (ex) {
        try {
            // handle error with complete context
            var err = (typeof onerror === 'function') ? onerror : onError;
            return err(ex, jml, filter);
        } catch (ex2) {
            return document.createTextNode('[' + ex2 + ']');
        }
    }
};

module.exports = parse;

/* eslint-env browser */
/* eslint yoda:1 */

},{"./jsonml-add-attributes":19,"./jsonml-append-child":20,"./jsonml-hydrate":21,"./jsonml-trim-whitespace":23,"./w3":38}],23:[function(require,module,exports){
'use strict';

/*bool*/ function isWhitespace(/*DOM*/ node) {
    return node &&
        (node.nodeType === 3) &&
        (!node.nodeValue || !/\S/.exec(node.nodeValue));
}

/*void*/ function trimWhitespace(/*DOM*/ elem) {
    if (elem) {
        while (isWhitespace(elem.firstChild)) {
            // trim leading whitespace text nodes
            elem.removeChild(elem.firstChild);
        }
        while (isWhitespace(elem.lastChild)) {
            // trim trailing whitespace text nodes
            elem.removeChild(elem.lastChild);
        }
    }
}

module.exports = trimWhitespace;

/* eslint-env browser */

},{}],24:[function(require,module,exports){
'use strict';

var lane = {
    xs     : 20,    // tmpgraphlane0.width
    ys     : 20,    // tmpgraphlane0.height
    xg     : 120,   // tmpgraphlane0.x
    // yg     : 0,     // head gap
    yh0    : 0,     // head gap title
    yh1    : 0,     // head gap
    yf0    : 0,     // foot gap
    yf1    : 0,     // foot gap
    y0     : 5,     // tmpgraphlane0.y
    yo     : 30,    // tmpgraphlane1.y - y0;
    tgo    : -10,   // tmptextlane0.x - xg;
    ym     : 15,    // tmptextlane0.y - y0
    xlabel : 6,     // tmptextlabel.x - xg;
    xmax   : 1,
    scale  : 1,
    head   : {},
    foot   : {}
};

module.exports = lane;

},{}],25:[function(require,module,exports){
'use strict';

function parseConfig (source, lane) {
    var hscale;

    function tonumber (x) {
        return x > 0 ? Math.round(x) : 1;
    }

    lane.hscale = 1;

    if (lane.hscale0) {
        lane.hscale = lane.hscale0;
    }
    if (source && source.config && source.config.hscale) {
        hscale = Math.round(tonumber(source.config.hscale));
        if (hscale > 0) {
            if (hscale > 100) {
                hscale = 100;
            }
            lane.hscale = hscale;
        }
    }
    lane.yh0 = 0;
    lane.yh1 = 0;
    lane.head = source.head;

    lane.xmin_cfg = 0;
    lane.xmax_cfg = 1e12; // essentially infinity
    if (source && source.config && source.config.hbounds && source.config.hbounds.length==2) {
        source.config.hbounds[0] = Math.floor(source.config.hbounds[0]);
        source.config.hbounds[1] = Math.ceil(source.config.hbounds[1]);
        if (  source.config.hbounds[0] < source.config.hbounds[1] ) {
            // convert hbounds ticks min, max to bricks min, max
            // TODO: do we want to base this on ticks or tocks in
            //  head or foot?  All 4 can be different... or just 0 reference?
            lane.xmin_cfg = 2 * Math.floor(source.config.hbounds[0]);
            lane.xmax_cfg = 2 * Math.floor(source.config.hbounds[1]);
        }
    }

    if (source && source.head) {
        if (
            source.head.tick || source.head.tick === 0 ||
            source.head.tock || source.head.tock === 0
        ) {
            lane.yh0 = 20;
        }
        // if tick defined, modify start tick by lane.xmin_cfg
        if ( source.head.tick || source.head.tick === 0 ) {
            source.head.tick = source.head.tick + lane.xmin_cfg/2;
        }
        // if tock defined, modify start tick by lane.xmin_cfg
        if ( source.head.tock || source.head.tock === 0 ) {
            source.head.tock = source.head.tock + lane.xmin_cfg/2;
        }

        if (source.head.text) {
            lane.yh1 = 46;
            lane.head.text = source.head.text;
        }
    }

    lane.yf0 = 0;
    lane.yf1 = 0;
    lane.foot = source.foot;
    if (source && source.foot) {
        if (
            source.foot.tick || source.foot.tick === 0 ||
            source.foot.tock || source.foot.tock === 0
        ) {
            lane.yf0 = 20;
        }
        // if tick defined, modify start tick by lane.xmin_cfg
        if ( source.foot.tick || source.foot.tick === 0 ) {
            source.foot.tick = source.foot.tick + lane.xmin_cfg/2;
        }
        // if tock defined, modify start tick by lane.xmin_cfg
        if ( source.foot.tock || source.foot.tock === 0 ) {
            source.foot.tock = source.foot.tock + lane.xmin_cfg/2;
        }

        if (source.foot.text) {
            lane.yf1 = 46;
            lane.foot.text = source.foot.text;
        }
    }
}

module.exports = parseConfig;

},{}],26:[function(require,module,exports){
'use strict';

var genFirstWaveBrick = require('./gen-first-wave-brick'),
    genWaveBrick = require('./gen-wave-brick'),
    findLaneMarkers = require('./find-lane-markers');

// text is the wave member of the signal object
// extra = hscale-1 ( padding )
// lane is an object containing all properties for this waveform
function parseWaveLane (text, extra, lane) {
    var Repeats, Top, Next, Stack = [], R = [], i, subCycle;
    var unseen_bricks = [], num_unseen_markers;

    Stack = text.split('');
    Next  = Stack.shift();
    subCycle = false;

    Repeats = 1;
    while (Stack[0] === '.' || Stack[0] === '|') { // repeaters parser
        Stack.shift();
        Repeats += 1;
    }
    R = R.concat(genFirstWaveBrick(Next, extra, Repeats));

    while (Stack.length) {
        Top = Next;
        Next = Stack.shift();
        if (Next === '<') { // sub-cycles on
            subCycle = true;
            Next = Stack.shift();
        }
        if (Next === '>') { // sub-cycles off
            subCycle = false;
            Next = Stack.shift();
        }
        Repeats = 1;
        while (Stack[0] === '.' || Stack[0] === '|') { // repeaters parser
            Stack.shift();
            Repeats += 1;
        }
        if (subCycle) {
            R = R.concat(genWaveBrick((Top + Next), 0, Repeats - lane.period));
        } else {
            R = R.concat(genWaveBrick((Top + Next), extra, Repeats));
        }
    }
    // shift out unseen bricks due to phase shift, and save them in
    //  unseen_bricks array
    for (i = 0; i < lane.phase; i += 1) {
        unseen_bricks.push(R.shift());
    }
    if (unseen_bricks.length > 0) {
        num_unseen_markers = findLaneMarkers( unseen_bricks ).length;
        // if end of unseen_bricks and start of R both have a marker,
        //  then one less unseen marker
        if ( findLaneMarkers( [unseen_bricks[unseen_bricks.length-1]] ).length == 1 &&
             findLaneMarkers( [R[0]] ).length == 1 ) {
            num_unseen_markers -= 1;
        }
    } else {
        num_unseen_markers = 0;
    }

    // R is array of half brick types, each is item is string
    // num_unseen_markers is how many markers are now unseen due to phase
    return [R, num_unseen_markers];
}

module.exports = parseWaveLane;

},{"./find-lane-markers":5,"./gen-first-wave-brick":14,"./gen-wave-brick":15}],27:[function(require,module,exports){
'use strict';

var parseWaveLane = require('./parse-wave-lane');

function data_extract (e, num_unseen_markers) {
    var ret_data;

    ret_data = e.data;
    if (ret_data === undefined) { return null; }
    if (typeof (ret_data) === 'string') { ret_data= ret_data.split(' '); }
    // slice data array after unseen markers
    ret_data = ret_data.slice( num_unseen_markers );
    return ret_data;
}

function parseWaveLanes (sig, lane) {
    var x,
        sigx,
        content = [],
        content_wave,
        parsed_wave_lane,
        num_unseen_markers,
        tmp0 = [];

    for (x in sig) {
        // sigx is each signal in the array of signals being iterated over
        sigx = sig[x];
        lane.period = sigx.period ? sigx.period    : 1;
        // xmin_cfg is min. brick of hbounds, add to lane.phase of all signals
        lane.phase  = (sigx.phase  ? sigx.phase * 2 : 0) + lane.xmin_cfg;
        content.push([]);
        tmp0[0] = sigx.name  || ' ';
        // xmin_cfg is min. brick of hbounds, add 1/2 to sigx.phase of all sigs
        tmp0[1] = (sigx.phase || 0) + lane.xmin_cfg/2;
        if ( sigx.wave ) {
            parsed_wave_lane = parseWaveLane(sigx.wave, lane.period * lane.hscale - 1, lane);
            content_wave = parsed_wave_lane[0] ;
            num_unseen_markers = parsed_wave_lane[1];
        } else {
            content_wave = null;
        }
        content[content.length - 1][0] = tmp0.slice(0);
        content[content.length - 1][1] = content_wave;
        content[content.length - 1][2] = data_extract(sigx, num_unseen_markers);
    }
    // content is an array of arrays, representing the list of signals using
    //  the same order:
    // content[0] = [ [name,phase], parsedwavelaneobj, dataextracted ]
    return content;
}

module.exports = parseWaveLanes;

},{"./parse-wave-lane":26}],28:[function(require,module,exports){
'use strict';

var eva = require('./eva'),
    appendSaveAsDialog = require('./append-save-as-dialog'),
    renderWaveForm = require('./render-wave-form');

function processAll () {
    var points,
        i,
        index,
        node0;
        // node1;

    // first pass
    index = 0; // actual number of valid anchor
    points = document.querySelectorAll('*');
    for (i = 0; i < points.length; i++) {
        if (points.item(i).type && points.item(i).type === 'WaveDrom') {
            points.item(i).setAttribute('id', 'InputJSON_' + index);

            node0 = document.createElement('div');
            //			node0.className += 'WaveDrom_Display_' + index;
            node0.id = 'WaveDrom_Display_' + index;
            points.item(i).parentNode.insertBefore(node0, points.item(i));
            // WaveDrom.InsertSVGTemplate(i, node0);
            index += 1;
        }
    }
    // second pass
    for (i = 0; i < index; i += 1) {
        renderWaveForm(i, eva('InputJSON_' + i), 'WaveDrom_Display_');
        appendSaveAsDialog(i, 'WaveDrom_Display_');
    }
    // add styles
    document.head.innerHTML += '<style type="text/css">div.wavedromMenu{position:fixed;border:solid 1pt#CCCCCC;background-color:white;box-shadow:0px 10px 20px #808080;cursor:default;margin:0px;padding:0px;}div.wavedromMenu>ul{margin:0px;padding:0px;}div.wavedromMenu>ul>li{padding:2px 10px;list-style:none;}div.wavedromMenu>ul>li:hover{background-color:#b5d5ff;}</style>';
}

module.exports = processAll;

/* eslint-env browser */

},{"./append-save-as-dialog":1,"./eva":4,"./render-wave-form":36}],29:[function(require,module,exports){
'use strict';

function rec (tmp, state) {
    var i, name, old = {}, delta = {'x':10};
    if (typeof tmp[0] === 'string' || typeof tmp[0] === 'number') {
        name = tmp[0];
        delta.x = 25;
    }
    state.x += delta.x;
    for (i = 0; i < tmp.length; i++) {
        if (typeof tmp[i] === 'object') {
            if (Object.prototype.toString.call(tmp[i]) === '[object Array]') {
                old.y = state.y;
                state = rec(tmp[i], state);
                state.groups.push({'x':state.xx, 'y':old.y, 'height':(state.y - old.y), 'name':state.name});
            } else {
                state.lanes.push(tmp[i]);
                state.width.push(state.x);
                state.y += 1;
            }
        }
    }
    state.xx = state.x;
    state.x -= delta.x;
    state.name = name;
    return state;
}

module.exports = rec;

},{}],30:[function(require,module,exports){
'use strict';

var tspan = require('tspan'),
    jsonmlParse = require('./create-element'),
    w3 = require('./w3');

function renderArcs (root, source, index, top, lane) {
    var gg,
        i,
        k,
        text,
        Stack = [],
        Edge = {words: [], from: 0, shape: '', to: 0, label: ''},
        Events = {},
        pos,
        eventname,
        // labeltext,
        label,
        underlabel,
        from,
        to,
        dx,
        dy,
        lx,
        ly,
        gmark,
        lwidth;

    function t1 () {
        if (from && to) {
            gmark = document.createElementNS(w3.svg, 'path');
            gmark.id = ('gmark_' + Edge.from + '_' + Edge.to);
            gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + to.x   + ',' + to.y);
            gmark.setAttribute('style', 'fill:none;stroke:#00F;stroke-width:1');
            gg.insertBefore(gmark, null);
        }
    }

    if (source) {
        for (i in source) {
            lane.period = source[i].period ? source[i].period    : 1;
            lane.phase  = (source[i].phase  ? source[i].phase * 2 : 0) + lane.xmin_cfg;
            text = source[i].node;
            if (text) {
                Stack = text.split('');
                pos = 0;
                while (Stack.length) {
                    eventname = Stack.shift();
                    if (eventname !== '.') {
                        Events[eventname] = {
                            'x' : lane.xs * (2 * pos * lane.period * lane.hscale - lane.phase) + lane.xlabel,
                            'y' : i * lane.yo + lane.y0 + lane.ys * 0.5
                        };
                    }
                    pos += 1;
                }
            }
        }
        gg = document.createElementNS(w3.svg, 'g');
        gg.id = 'wavearcs_' + index;
        root.insertBefore(gg, null);
        if (top.edge) {
            for (i in top.edge) {
                Edge.words = top.edge[i].split(' ');
                Edge.label = top.edge[i].substring(Edge.words[0].length);
                Edge.label = Edge.label.substring(1);
                Edge.from  = Edge.words[0].substr(0, 1);
                Edge.to    = Edge.words[0].substr(-1, 1);
                Edge.shape = Edge.words[0].slice(1, -1);
                from  = Events[Edge.from];
                to    = Events[Edge.to];
                t1();
                if (from && to) {
                    if (Edge.label) {
                        label = tspan.parse(Edge.label);
                        label.unshift(
                            'text',
                            {
                                style: 'font-size:10px;',
                                'text-anchor': 'middle',
                                'xml:space': 'preserve'
                            }
                        );
                        label = jsonmlParse(label);
                        underlabel = jsonmlParse(['rect',
                            {
                                height: 9,
                                style: 'fill:#FFF;'
                            }
                        ]);
                        gg.insertBefore(underlabel, null);
                        gg.insertBefore(label, null);

                        lwidth = label.getBBox().width;

                        underlabel.setAttribute('width', lwidth);
                    }
                    dx = to.x - from.x;
                    dy = to.y - from.y;
                    lx = ((from.x + to.x) / 2);
                    ly = ((from.y + to.y) / 2);

                    switch (Edge.shape) {
                    case '-'  : {
                        break;
                    }
                    case '~'  : {
                        gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' c ' + (0.7 * dx) + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx + ', ' + dy);
                        break;
                    }
                    case '-~' : {
                        gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' c ' + (0.7 * dx) + ', 0 ' +         dx + ', ' + dy + ' ' + dx + ', ' + dy);
                        if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.75); }
                        break;
                    }
                    case '~-' : {
                        gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' c ' + 0          + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx + ', ' + dy);
                        if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.25); }
                        break;
                    }
                    case '-|' : {
                        gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + dx + ',0 0,' + dy);
                        if (Edge.label) { lx = to.x; }
                        break;
                    }
                    case '|-' : {
                        gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' 0,' + dy + ' ' + dx + ',0');
                        if (Edge.label) { lx = from.x; }
                        break;
                    }
                    case '-|-': {
                        gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + (dx / 2) + ',0 0,' + dy + ' ' + (dx / 2) + ',0');
                        break;
                    }
                    case '->' : {
                        gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                        break;
                    }
                    case '~>' : {
                        gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                        gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + (0.7 * dx) + ', 0 ' + 0.3 * dx + ', ' + dy + ' ' + dx + ', ' + dy);
                        break;
                    }
                    case '-~>': {
                        gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                        gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + (0.7 * dx) + ', 0 ' +     dx + ', ' + dy + ' ' + dx + ', ' + dy);
                        if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.75); }
                        break;
                    }
                    case '~->': {
                        gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                        gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + 0      + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx + ', ' + dy);
                        if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.25); }
                        break;
                    }
                    case '-|>' : {
                        gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                        gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + dx + ',0 0,' + dy);
                        if (Edge.label) { lx = to.x; }
                        break;
                    }
                    case '|->' : {
                        gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                        gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' 0,' + dy + ' ' + dx + ',0');
                        if (Edge.label) { lx = from.x; }
                        break;
                    }
                    case '-|->': {
                        gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                        gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + (dx / 2) + ',0 0,' + dy + ' ' + (dx / 2) + ',0');
                        break;
                    }
                    case '<->' : {
                        gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
                        break;
                    }
                    case '<~>' : {
                        gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
                        gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + (0.7 * dx) + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx + ', ' + dy);
                        break;
                    }
                    case '<-~>': {
                        gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
                        gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + (0.7 * dx) + ', 0 ' +     dx + ', ' + dy + ' ' + dx + ', ' + dy);
                        if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.75); }
                        break;
                    }
                    case '<-|>' : {
                        gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
                        gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + dx + ',0 0,' + dy);
                        if (Edge.label) { lx = to.x; }
                        break;
                    }
                    case '<-|->': {
                        gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
                        gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + (dx / 2) + ',0 0,' + dy + ' ' + (dx / 2) + ',0');
                        break;
                    }
                    default   : { gmark.setAttribute('style', 'fill:none;stroke:#F00;stroke-width:1'); }
                    }
                    if (Edge.label) {
                        label.setAttribute('x', lx);
                        label.setAttribute('y', ly + 3);
                        underlabel.setAttribute('x', lx - lwidth / 2);
                        underlabel.setAttribute('y', ly - 5);
                    }
                }
            }
        }
        for (k in Events) {
            if (k === k.toLowerCase()) {
                if (Events[k].x > 0) {
                    underlabel = jsonmlParse(['rect',
                        {
                            y: Events[k].y - 4,
                            height: 8,
                            style: 'fill:#FFF;'
                        }
                    ]);
                    label = jsonmlParse(['text',
                        {
                            style: 'font-size:8px;',
                            x: Events[k].x,
                            y: Events[k].y + 2,
                            'text-anchor': 'middle'
                        },
                        (k + '')
                    ]);

                    gg.insertBefore(underlabel, null);
                    gg.insertBefore(label, null);

                    lwidth = label.getBBox().width + 2;

                    underlabel.setAttribute('x', Events[k].x - lwidth / 2);
                    underlabel.setAttribute('width', lwidth);
                }
            }
        }
    }
}

module.exports = renderArcs;

/* eslint-env browser */

},{"./create-element":2,"./w3":38,"tspan":49}],31:[function(require,module,exports){
'use strict';

var jsonmlParse = require('./create-element');

function render (tree, state) {
    var y, i, ilen;

    state.xmax = Math.max(state.xmax, state.x);
    y = state.y;
    ilen = tree.length;
    for (i = 1; i < ilen; i++) {
        if (Object.prototype.toString.call(tree[i]) === '[object Array]') {
            state = render(tree[i], {x: (state.x + 1), y: state.y, xmax: state.xmax});
        } else {
            tree[i] = {name:tree[i], x: (state.x + 1), y: state.y};
            state.y += 2;
        }
    }
    tree[0] = {name: tree[0], x: state.x, y: Math.round((y + (state.y - 2)) / 2)};
    state.x--;
    return state;
}

function draw_body (type, ymin, ymax) {
    var e,
        iecs,
        circle = ' M 4,0 C 4,1.1 3.1,2 2,2 0.9,2 0,1.1 0,0 c 0,-1.1 0.9,-2 2,-2 1.1,0 2,0.9 2,2 z',
        gates = {
            '~':  'M -11,-6 -11,6 0,0 z m -5,6 5,0' + circle,
            '=':  'M -11,-6 -11,6 0,0 z m -5,6 5,0',
            '&':  'm -16,-10 5,0 c 6,0 11,4 11,10 0,6 -5,10 -11,10 l -5,0 z',
            '~&': 'm -16,-10 5,0 c 6,0 11,4 11,10 0,6 -5,10 -11,10 l -5,0 z' + circle,
            '|':  'm -18,-10 4,0 c 6,0 12,5 14,10 -2,5 -8,10 -14,10 l -4,0 c 2.5,-5 2.5,-15 0,-20 z',
            '~|': 'm -18,-10 4,0 c 6,0 12,5 14,10 -2,5 -8,10 -14,10 l -4,0 c 2.5,-5 2.5,-15 0,-20 z' + circle,
            '^':  'm -21,-10 c 1,3 2,6 2,10 m 0,0 c 0,4 -1,7 -2,10 m 3,-20 4,0 c 6,0 12,5 14,10 -2,5 -8,10 -14,10 l -4,0 c 1,-3 2,-6 2,-10 0,-4 -1,-7 -2,-10 z',
            '~^': 'm -21,-10 c 1,3 2,6 2,10 m 0,0 c 0,4 -1,7 -2,10 m 3,-20 4,0 c 6,0 12,5 14,10 -2,5 -8,10 -14,10 l -4,0 c 1,-3 2,-6 2,-10 0,-4 -1,-7 -2,-10 z' + circle,
            '+':  'm -8,5 0,-10 m -5,5 10,0 m 3,0 c 0,4.418278 -3.581722,8 -8,8 -4.418278,0 -8,-3.581722 -8,-8 0,-4.418278 3.581722,-8 8,-8 4.418278,0 8,3.581722 8,8 z',
            '*':  'm -4,4 -8,-8 m 0,8 8,-8 m 4,4 c 0,4.418278 -3.581722,8 -8,8 -4.418278,0 -8,-3.581722 -8,-8 0,-4.418278 3.581722,-8 8,-8 4.418278,0 8,3.581722 8,8 z'
        },
        iec = {
            BUF: 1, INV: 1, AND: '&',  NAND: '&',
            OR: '\u22651', NOR: '\u22651', XOR: '=1', XNOR: '=1', box: ''
        },
        circled = { INV: 1, NAND: 1, NOR: 1, XNOR: 1 };

    if (ymax === ymin) {
        ymax = 4; ymin = -4;
    }
    e = gates[type];
    iecs = iec[type];
    if (e) {
        return ['path', {class:'gate', d: e}];
    } else {
        if (iecs) {
            return [
                'g', [
                    'path', {
                        class:'gate',
                        d: 'm -16,' + (ymin - 3) + ' 16,0 0,' + (ymax - ymin + 6) + ' -16,0 z' + (circled[type] ? circle : '')
                    }], [
                    'text', [
                        'tspan', {x: '-14', y: '4', class: 'wirename'}, iecs + ''
                    ]
                ]
            ];
        } else {
            return ['text', ['tspan', {x: '-14', y: '4', class: 'wirename'}, type + '']];
        }
    }
}

function draw_gate (spec) { // ['type', [x,y], [x,y] ... ]
    var i,
        ret = ['g'],
        ys = [],
        ymin,
        ymax,
        ilen = spec.length;

    for (i = 2; i < ilen; i++) {
        ys.push(spec[i][1]);
    }

    ymin = Math.min.apply(null, ys);
    ymax = Math.max.apply(null, ys);

    ret.push(
        ['g',
            {transform:'translate(16,0)'},
            ['path', {
                d: 'M  ' + spec[2][0] + ',' + ymin + ' ' + spec[2][0] + ',' + ymax,
                class: 'wire'
            }]
        ]
    );

    for (i = 2; i < ilen; i++) {
        ret.push(
            ['g',
                ['path',
                    {
                        d: 'm  ' + spec[i][0] + ',' + spec[i][1] + ' 16,0',
                        class: 'wire'
                    }
                ]
            ]
        );
    }
    ret.push(
        ['g', { transform: 'translate(' + spec[1][0] + ',' + spec[1][1] + ')' },
            ['title', spec[0]],
            draw_body(spec[0], ymin - spec[1][1], ymax - spec[1][1])
        ]
    );
    return ret;
}

function draw_boxes (tree, xmax) {
    var ret = ['g'], i, ilen, fx, fy, fname, spec = [];
    if (Object.prototype.toString.call(tree) === '[object Array]') {
        ilen = tree.length;
        spec.push(tree[0].name);
        spec.push([32 * (xmax - tree[0].x), 8 * tree[0].y]);
        for (i = 1; i < ilen; i++) {
            if (Object.prototype.toString.call(tree[i]) === '[object Array]') {
                spec.push([32 * (xmax - tree[i][0].x), 8 * tree[i][0].y]);
            } else {
                spec.push([32 * (xmax - tree[i].x), 8 * tree[i].y]);
            }
        }
        ret.push(draw_gate(spec));
        for (i = 1; i < ilen; i++) {
            ret.push(draw_boxes(tree[i], xmax));
        }
    } else {
        fname = tree.name;
        fx = 32 * (xmax - tree.x);
        fy = 8 * tree.y;
        ret.push(
            ['g', { transform: 'translate(' + fx + ',' + fy + ')'},
                ['title', fname],
                ['path', {d:'M 2,0 a 2,2 0 1 1 -4,0 2,2 0 1 1 4,0 z'}],
                ['text',
                    ['tspan', {
                        x:'-4', y:'4',
                        class:'pinname'},
                    fname
                    ]
                ]
            ]
        );
    }
    return ret;
}

function renderAssign (index, source) {
    var tree,
        state,
        xmax,
        svg = ['g'],
        grid = ['g'],
        svgcontent,
        width,
        height,
        i,
        ilen,
        j,
        jlen;

    ilen = source.assign.length;
    state = { x: 0, y: 2, xmax: 0 };
    tree = source.assign;
    for (i = 0; i < ilen; i++) {
        state = render(tree[i], state);
        state.x++;
    }
    xmax = state.xmax + 3;

    for (i = 0; i < ilen; i++) {
        svg.push(draw_boxes(tree[i], xmax));
    }
    width  = 32 * (xmax + 1) + 1;
    height = 8 * (state.y + 1) - 7;
    ilen = 4 * (xmax + 1);
    jlen = state.y + 1;
    for (i = 0; i <= ilen; i++) {
        for (j = 0; j <= jlen; j++) {
            grid.push(['rect', {
                height: 1,
                width: 1,
                x: (i * 8 - 0.5),
                y: (j * 8 - 0.5),
                class: 'grid'
            }]);
        }
    }
    svgcontent = document.getElementById('svgcontent_' + index);
    svgcontent.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svgcontent.setAttribute('width', width);
    svgcontent.setAttribute('height', height);
    svgcontent.insertBefore(jsonmlParse(['g', {transform:'translate(0.5, 0.5)'}, grid, svg]), null);
}

module.exports = renderAssign;

/* eslint-env browser */

},{"./create-element":2}],32:[function(require,module,exports){
'use strict';

var w3 = require('./w3');

function renderGaps (root, source, index, lane) {
    var i, gg, g, b, pos, Stack = [], text, subCycle, next;

    if (source) {

        gg = document.createElementNS(w3.svg, 'g');
        gg.id = 'wavegaps_' + index;
        root.insertBefore(gg, null);
        subCycle = false;
        for (i in source) {
            lane.period = source[i].period ? source[i].period    : 1;
            lane.phase  = (source[i].phase  ? source[i].phase * 2 : 0) + lane.xmin_cfg;
            g = document.createElementNS(w3.svg, 'g');
            g.id = 'wavegap_' + i + '_' + index;
            g.setAttribute('transform', 'translate(0,' + (lane.y0 + i * lane.yo) + ')');
            gg.insertBefore(g, null);

            text = source[i].wave;
            if (text) {
                Stack = text.split('');
                pos = 0;
                while (Stack.length) {
                    next = Stack.shift();
                    if (next === '<') { // sub-cycles on
                        subCycle = true;
                        next = Stack.shift();
                    }
                    if (next === '>') { // sub-cycles off
                        subCycle = false;
                        next = Stack.shift();
                    }
                    if (subCycle) {
                        pos += 1;
                    } else {
                        pos += (2 * lane.period);
                    }
                    if (next === '|') {
                        b    = document.createElementNS(w3.svg, 'use');
                        // b.id = 'guse_' + pos + '_' + i + '_' + index;
                        b.setAttributeNS(w3.xlink, 'xlink:href', '#gap');
                        b.setAttribute('transform', 'translate(' + (lane.xs * ((pos - (subCycle ? 0 : lane.period)) * lane.hscale - lane.phase)) + ')');
                        g.insertBefore(b, null);
                    }
                }
            }
        }
    }
}

module.exports = renderGaps;

/* eslint-env browser */

},{"./w3":38}],33:[function(require,module,exports){
'use strict';

var tspan = require('tspan');

function renderGroups (groups, index, lane) {
    var x, y, res = ['g'], ts;

    groups.forEach(function (e, i) {
        res.push(['path',
            {
                id: 'group_' + i + '_' + index,
                d: ('m ' + (e.x + 0.5) + ',' + (e.y * lane.yo + 3.5 + lane.yh0 + lane.yh1)
                    + ' c -3,0 -5,2 -5,5 l 0,' + (e.height * lane.yo - 16)
                    + ' c 0,3 2,5 5,5'),
                style: 'stroke:#0041c4;stroke-width:1;fill:none'
            }
        ]);

        if (e.name === undefined) { return; }

        x = (e.x - 10);
        y = (lane.yo * (e.y + (e.height / 2)) + lane.yh0 + lane.yh1);
        ts = tspan.parse(e.name);
        ts.unshift(
            'text',
            {
                'text-anchor': 'middle',
                class: 'info',
                'xml:space': 'preserve'
            }
        );
        res.push(['g', {transform: 'translate(' + x + ',' + y + ')'}, ['g', {transform: 'rotate(270)'}, ts]]);
    });
    return res;
}

module.exports = renderGroups;

/* eslint-env browser */

},{"tspan":49}],34:[function(require,module,exports){
'use strict';

var tspan = require('tspan'),
    jsonmlParse = require('./create-element');
    // w3 = require('./w3');

function renderMarks (root, content, index, lane) {
    var i, g, marks, mstep, mmstep, gy; // svgns

    function captext (cxt, anchor, y) {
        var tmark;

        if (cxt[anchor] && cxt[anchor].text) {
            tmark = tspan.parse(cxt[anchor].text);
            tmark.unshift(
                'text',
                {
                    x: cxt.xmax * cxt.xs / 2,
                    y: y,
                    'text-anchor': 'middle',
                    fill: '#000',
                    'xml:space': 'preserve'
                }
            );
            tmark = jsonmlParse(tmark);
            g.insertBefore(tmark, null);
        }
    }

    function ticktock (cxt, ref1, ref2, x, dx, y, len) {
        var tmark, step = 1, offset, dp = 0, val, L = [], tmp;

        if (cxt[ref1] === undefined || cxt[ref1][ref2] === undefined) { return; }
        val = cxt[ref1][ref2];
        if (typeof val === 'string') {
            val = val.split(' ');
        } else if (typeof val === 'number' || typeof val === 'boolean') {
            offset = Number(val);
            val = [];
            for (i = 0; i < len; i += 1) {
                val.push(i + offset);
            }
        }
        if (Object.prototype.toString.call(val) === '[object Array]') {
            if (val.length === 0) {
                return;
            } else if (val.length === 1) {
                offset = Number(val[0]);
                if (isNaN(offset)) {
                    L = val;
                } else {
                    for (i = 0; i < len; i += 1) {
                        L[i] = i + offset;
                    }
                }
            } else if (val.length === 2) {
                offset = Number(val[0]);
                step   = Number(val[1]);
                tmp = val[1].split('.');
                if ( tmp.length === 2 ) {
                    dp = tmp[1].length;
                }
                if (isNaN(offset) || isNaN(step)) {
                    L = val;
                } else {
                    offset = step * offset;
                    for (i = 0; i < len; i += 1) {
                        L[i] = (step * i + offset).toFixed(dp);
                    }
                }
            } else {
                L = val;
            }
        } else {
            return;
        }
        for (i = 0; i < len; i += 1) {
            tmp = L[i];
            //  if (typeof tmp === 'number') { tmp += ''; }
            tmark = tspan.parse(tmp);
            tmark.unshift(
                'text',
                {
                    x: i * dx + x,
                    y: y,
                    'text-anchor': 'middle',
                    class: 'muted',
                    'xml:space': 'preserve'
                }
            );
            tmark = jsonmlParse(tmark);
            g.insertBefore(tmark, null);
        }
    }

    mstep  = 2 * (lane.hscale);
    mmstep = mstep * lane.xs;
    marks  = lane.xmax / mstep;
    gy     = content.length * lane.yo;

    g = jsonmlParse(['g', {id: ('gmarks_' + index)}]);
    root.insertBefore(g, root.firstChild);

    for (i = 0; i < (marks + 1); i += 1) {
        g.insertBefore(
            jsonmlParse([
                'path',
                {
                    id:    'gmark_' + i + '_' + index,
                    d:     'm ' + (i * mmstep) + ',' + 0 + ' 0,' + gy,
                    style: 'stroke:#888;stroke-width:0.5;stroke-dasharray:1,3'
                }
            ]),
            null
        );
    }

    captext(lane, 'head', (lane.yh0 ? -33 : -13));
    captext(lane, 'foot', gy + (lane.yf0 ? 45 : 25));

    ticktock(lane, 'head', 'tick',          0, mmstep,      -5, marks + 1);
    ticktock(lane, 'head', 'tock', mmstep / 2, mmstep,      -5, marks);
    ticktock(lane, 'foot', 'tick',          0, mmstep, gy + 15, marks + 1);
    ticktock(lane, 'foot', 'tock', mmstep / 2, mmstep, gy + 15, marks);
}

module.exports = renderMarks;

/* eslint-env browser */

},{"./create-element":2,"tspan":49}],35:[function(require,module,exports){
'use strict';

var jsonmlParse = require('./create-element'),
    render = require('bit-field/lib/render');

function renderReg (index, source, parent) {
    // cleanup
    while (parent.childNodes.length) {
        parent.removeChild(parent.childNodes[0]);
    }
    var e = render(source.reg, source.config);
    var node = jsonmlParse(e);
    parent.insertBefore(node, null);
}

module.exports = renderReg;

},{"./create-element":2,"bit-field/lib/render":41}],36:[function(require,module,exports){
'use strict';

var rec = require('./rec'),
    lane = require('./lane'),
    jsonmlParse = require('./create-element'),
    parseConfig = require('./parse-config'),
    parseWaveLanes = require('./parse-wave-lanes'),
    renderMarks = require('./render-marks'),
    renderGaps = require('./render-gaps'),
    renderGroups = require('./render-groups'),
    renderWaveLane = require('./render-wave-lane'),
    renderAssign = require('./render-assign'),
    renderReg = require('./render-reg'),
    renderArcs = require('./render-arcs'),
    insertSVGTemplate = require('./insert-svg-template'),
    insertSVGTemplateAssign = require('./insert-svg-template-assign'),
    genFsmData = require('./fsm-gen-data'),
	insertSVGTemplateFsm = require('./fsm-insert-svg-template'),
    renderFsm = require('./fsm-render');

function renderWaveForm (index, source, output) {
    var ret,
        root,
		groups,
		svgcontent,
		content,
		width,
		height,
        glengths,
		xmax = 0,
		i,
		data;

    if (source.signal) {
        insertSVGTemplate(index, document.getElementById(output + index), source, lane);
        parseConfig(source, lane);
        ret = rec(source.signal, {'x':0, 'y':0, 'xmax':0, 'width':[], 'lanes':[], 'groups':[]});
        root = document.getElementById('lanes_' + index);
        groups = document.getElementById('groups_' + index);
        content  = parseWaveLanes(ret.lanes, lane);
        glengths = renderWaveLane(root, content, index, lane);
        for (i in glengths) {
            xmax = Math.max(xmax, (glengths[i] + ret.width[i]));
        }
        renderMarks(root, content, index, lane);
        renderArcs(root, ret.lanes, index, source, lane);
        renderGaps(root, ret.lanes, index, lane);
        groups.insertBefore(jsonmlParse(renderGroups(ret.groups, index, lane)), null);
        lane.xg = Math.ceil((xmax - lane.tgo) / lane.xs) * lane.xs;
        width  = (lane.xg + (lane.xs * (lane.xmax + 1)));
        height = (content.length * lane.yo +
        lane.yh0 + lane.yh1 + lane.yf0 + lane.yf1);

        svgcontent = document.getElementById('svgcontent_' + index);
        svgcontent.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
        svgcontent.setAttribute('width', width);
        svgcontent.setAttribute('height', height);
        svgcontent.setAttribute('overflow', 'hidden');
        root.setAttribute('transform', 'translate(' + (lane.xg + 0.5) + ', ' + ((lane.yh0 + lane.yh1) + 0.5) + ')');
    } else if (source.assign) {
        insertSVGTemplateAssign(index, document.getElementById(output + index), source);
        renderAssign(index, source);
    } else if (source.reg) {
        renderReg(index, source, document.getElementById(output + index));
    } /* STATE MACHINE */ else if (source.fsm) {
		data = genFsmData(source);
        insertSVGTemplateFsm(index, document.getElementById(output + index), data);
        renderFsm(index, document.getElementById(output + index), data);
    }
}

module.exports = renderWaveForm;

/* eslint-env browser */

},{"./create-element":2,"./fsm-gen-data":6,"./fsm-insert-svg-template":8,"./fsm-render":11,"./insert-svg-template":18,"./insert-svg-template-assign":17,"./lane":24,"./parse-config":25,"./parse-wave-lanes":27,"./rec":29,"./render-arcs":30,"./render-assign":31,"./render-gaps":32,"./render-groups":33,"./render-marks":34,"./render-reg":35,"./render-wave-lane":37}],37:[function(require,module,exports){
'use strict';

var tspan = require('tspan'),
    jsonmlParse = require('./create-element'),
    w3 = require('./w3'),
    findLaneMarkers = require('./find-lane-markers');

function renderWaveLane (root, content, index, lane) {
    var i,
        j,
        k,
        g,
        gg,
        title,
        b,
        labels = [1],
        name,
        xoffset,
        xmax     = 0,
        xgmax    = 0,
        glengths = [];

    for (j = 0; j < content.length; j += 1) {
        name = content[j][0][0];
        if (name) { // check name
            g = jsonmlParse(['g',
                {
                    id: 'wavelane_' + j + '_' + index,
                    transform: 'translate(0,' + ((lane.y0) + j * lane.yo) + ')'
                }
            ]);
            root.insertBefore(g, null);
            title = tspan.parse(name);
            title.unshift(
                'text',
                {
                    x: lane.tgo,
                    y: lane.ym,
                    class: 'info',
                    'text-anchor': 'end',
                    'xml:space': 'preserve'
                }
            );
            title = jsonmlParse(title);
            g.insertBefore(title, null);

            // scale = lane.xs * (lane.hscale) * 2;

            glengths.push(title.getBBox().width);

            xoffset = content[j][0][1];
            xoffset = (xoffset > 0) ? (Math.ceil(2 * xoffset) - 2 * xoffset) :
                (-2 * xoffset);
            gg = jsonmlParse(['g',
                {
                    id: 'wavelane_draw_' + j + '_' + index,
                    transform: 'translate(' + (xoffset * lane.xs) + ', 0)'
                }
            ]);
            g.insertBefore(gg, null);

            if (content[j][1]) {
                for (i = 0; i < content[j][1].length; i += 1) {
                    b = document.createElementNS(w3.svg, 'use');
                    // b.id = 'use_' + i + '_' + j + '_' + index;
                    b.setAttributeNS(w3.xlink, 'xlink:href', '#' + content[j][1][i]);
                    // b.setAttribute('transform', 'translate(' + (i * lane.xs) + ')');
                    b.setAttribute('transform', 'translate(' + (i * lane.xs) + ')');
                    gg.insertBefore(b, null);
                }
                if (content[j][2] && content[j][2].length) {
                    labels = findLaneMarkers(content[j][1]);

                    if (labels.length !== 0) {
                        for (k in labels) {
                            if (content[j][2] && (typeof content[j][2][k] !== 'undefined')) {
                                title = tspan.parse(content[j][2][k]);
                                title.unshift(
                                    'text',
                                    {
                                        x: labels[k] * lane.xs + lane.xlabel,
                                        y: lane.ym,
                                        'text-anchor': 'middle',
                                        'xml:space': 'preserve'
                                    }
                                );
                                title = jsonmlParse(title);
                                gg.insertBefore(title, null);
                            }
                        }
                    }
                }
                if (content[j][1].length > xmax) {
                    xmax = content[j][1].length;
                }
            }
        }
    }
    // xmax if no xmax_cfg,xmin_cfg, else set to config
    lane.xmax = Math.min(xmax, lane.xmax_cfg - lane.xmin_cfg);
    lane.xg = xgmax + 20;
    return glengths;
}

module.exports = renderWaveLane;

/* eslint-env browser */

},{"./create-element":2,"./find-lane-markers":5,"./w3":38,"tspan":49}],38:[function(require,module,exports){
'use strict';

module.exports = {
    svg: 'http://www.w3.org/2000/svg',
    xlink: 'http://www.w3.org/1999/xlink',
    xmlns: 'http://www.w3.org/XML/1998/namespace'
};

},{}],39:[function(require,module,exports){
'use strict';

window.WaveDrom = window.WaveDrom || {};

var index = require('./');

window.WaveDrom.ProcessAll = index.processAll;
window.WaveDrom.RenderWaveForm = index.renderWaveForm;
window.WaveDrom.EditorRefresh = index.editorRefresh;
window.WaveDrom.eva = index.eva;

/* eslint-env browser */

},{"./":16}],40:[function(require,module,exports){
'use strict';

module.exports = window.WaveSkin;

/* eslint-env browser */

},{}],41:[function(require,module,exports){
'use strict';

var tspan = require('tspan');

function t (x, y) {
    return 'translate(' + x + ',' + y + ')';
}

function hline (len, x, y) {
    var res = ['line'];
    var opt = {};
    if (x) {
        opt.x1 = x;
        opt.x2 = x + len;
    } else {
        opt.x2 = len;
    }
    if (y) {
        opt.y1 = y;
        opt.y2 = y;
    }
    res.push(opt);
    return res;
}

function vline (len, x, y) {
    var res = ['line'];
    var opt = {};
    if (x) {
        opt.x1 = x;
        opt.x2 = x;
    }
    if (y) {
        opt.y1 = y;
        opt.y2 = y + len;
    } else {
        opt.y2 = len;
    }
    res.push(opt);
    return res;
}

function labelArr (desc, opt) {
    var step = opt.hspace / opt.mod;
    var bits  = ['g', {transform: t(step / 2, opt.vspace / 5)}];
    var names = ['g', {transform: t(step / 2, opt.vspace / 2 + 4)}];
    var attrs = ['g', {transform: t(step / 2, opt.vspace)}];
    var blanks = ['g', {transform: t(0, opt.vspace / 4)}];
    var fontsize = opt.fontsize;
    var fontfamily = opt.fontfamily;
    var fontweight = opt.fontweight;
    desc.forEach(function (e) {
        var lText, aText, lsbm, msbm, lsb, msb;
        lsbm = 0;
        msbm = opt.mod - 1;
        lsb = opt.index * opt.mod;
        msb = (opt.index + 1) * opt.mod - 1;
        if (((e.lsb / opt.mod) >> 0) === opt.index) {
            lsbm = e.lsbm;
            lsb = e.lsb;
            if (((e.msb / opt.mod) >> 0) === opt.index) {
                msb = e.msb;
                msbm = e.msbm;
            }
        } else {
            if (((e.msb / opt.mod) >> 0) === opt.index) {
                msb = e.msb;
                msbm = e.msbm;
            } else {
                return;
            }
        }
        bits.push(['text', {
            x: step * (opt.mod - lsbm - 1),
            'font-size': fontsize,
            'font-family': fontfamily,
            'font-weight': fontweight
        }, lsb.toString()]);
        if (lsbm !== msbm) {
            bits.push(['text', {
                x: step * (opt.mod - msbm - 1),
                'font-size': fontsize,
                'font-family': fontfamily,
                'font-weight': fontweight
            }, msb.toString()]);
        }
        if (e.name) {
            lText = tspan.parse(e.name);
            lText.unshift({
                x: step * (opt.mod - ((msbm + lsbm) / 2) - 1),
                'font-size': fontsize,
                'font-family': fontfamily,
                'font-weight': fontweight
            });
            lText.unshift('text');
            names.push(lText);
        } else {
            blanks.push(['rect', {
                style: 'fill-opacity:0.1',
                x: step * (opt.mod - msbm - 1),
                y: 0,
                width: step * (msbm - lsbm + 1),
                height: opt.vspace / 2
            }]);
        }
        if (e.attr) {
            aText = tspan.parse(e.attr);
            aText.unshift({
                x: step * (opt.mod - ((msbm + lsbm) / 2) - 1),
                'font-size': fontsize,
                'font-family': fontfamily,
                'font-weight': fontweight
            });
            aText.unshift('text');
            attrs.push(aText);
        }
    });
    return ['g', blanks, bits, names, attrs];
}

function labels (desc, opt) {
    return ['g', {'text-anchor': 'middle'},
        labelArr(desc, opt)
    ];
}

function cage (desc, opt) {
    var hspace = opt.hspace;
    var vspace = opt.vspace;
    var mod = opt.mod;
    var res = ['g', {
        stroke: 'black',
        'stroke-width': 1,
        'stroke-linecap': 'round',
        transform: t(0, vspace / 4)
    }];

    res.push(hline(hspace));
    res.push(vline(vspace / 2));
    res.push(hline(hspace, 0, vspace / 2));

    var i = opt.index * opt.mod, j = opt.mod;
    do {
        if ((j === opt.mod) || desc.some(function (e) { return (e.lsb === i); })) {
            res.push(vline((vspace / 2), j * (hspace / mod)));
        } else {
            res.push(vline((vspace / 16), j * (hspace / mod)));
            res.push(vline((vspace / 16), j * (hspace / mod), vspace * 7 / 16));
        }
        i++; j--;
    } while (j);
    return res;
}

function lane (desc, opt) {
    var res = ['g', {
        transform: t(4.5, (opt.lanes - opt.index - 1) * opt.vspace + 0.5)
    }];
    res.push(cage(desc, opt));
    res.push(labels(desc, opt));
    return res;
}

function isIntGTorDefault(val, min, def) {
    return (typeof val === 'number' && val > min) ? (val |0) : def;
}

function render (desc, opt) {
    opt = (typeof opt === 'object') ? opt : {};

    opt.vspace = isIntGTorDefault(opt.vspace, 19, 80);
    opt.hspace = isIntGTorDefault(opt.hspace, 39, 640);
    opt.lanes = isIntGTorDefault(opt.lanes, 0, 2);
    opt.bits = isIntGTorDefault(opt.bits, 4, 32);
    opt.fontsize = isIntGTorDefault(opt.fontsize, 5, 14);

    opt.bigendian = opt.bigendian || false;
    opt.fontfamily = opt.fontfamily || 'sans-serif';
    opt.fontweight = opt.fontweight || 'normal';

    var res = ['svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        width: (opt.hspace + 9),
        height: (opt.vspace * opt.lanes + 5),
        viewBox: [
            0,
            0,
            (opt.hspace + 9),
            (opt.vspace * opt.lanes + 5)
        ].join(' ')
    }];

    var lsb = 0;
    var mod = opt.bits / opt.lanes;
    opt.mod = mod |0;
    desc.forEach(function (e) {
        e.lsb = lsb;
        e.lsbm = lsb % mod;
        lsb += e.bits;
        e.msb = lsb - 1;
        e.msbm = e.msb % mod;
    });

    var i;
    for (i = 0; i < opt.lanes; i++) {
        opt.index = i;
        res.push(lane(desc, opt));
    }
    return res;
}

module.exports = render;

},{"tspan":42}],42:[function(require,module,exports){
'use strict';

var parse = require('./parse'),
    reparse = require('./reparse');

module.exports = {
    parse: parse,
    reparse: reparse
};

},{"./parse":43,"./reparse":44}],43:[function(require,module,exports){
'use strict';

var token = /<o>|<ins>|<s>|<sub>|<sup>|<b>|<i>|<tt>|<\/o>|<\/ins>|<\/s>|<\/sub>|<\/sup>|<\/b>|<\/i>|<\/tt>/;

function update (s, cmd) {
    if (cmd.add) {
        cmd.add.split(';').forEach(function (e) {
            var arr = e.split(' ');
            s[arr[0]][arr[1]] = true;
        });
    }
    if (cmd.del) {
        cmd.del.split(';').forEach(function (e) {
            var arr = e.split(' ');
            delete s[arr[0]][arr[1]];
        });
    }
}

var trans = {
    '<o>'    : { add: 'text-decoration overline' },
    '</o>'   : { del: 'text-decoration overline' },

    '<ins>'  : { add: 'text-decoration underline' },
    '</ins>' : { del: 'text-decoration underline' },

    '<s>'    : { add: 'text-decoration line-through' },
    '</s>'   : { del: 'text-decoration line-through' },

    '<b>'    : { add: 'font-weight bold' },
    '</b>'   : { del: 'font-weight bold' },

    '<i>'    : { add: 'font-style italic' },
    '</i>'   : { del: 'font-style italic' },

    '<sub>'  : { add: 'baseline-shift sub;font-size .7em' },
    '</sub>' : { del: 'baseline-shift sub;font-size .7em' },

    '<sup>'  : { add: 'baseline-shift super;font-size .7em' },
    '</sup>' : { del: 'baseline-shift super;font-size .7em' },

    '<tt>'   : { add: 'font-family monospace' },
    '</tt>'  : { del: 'font-family monospace' }
};

function dump (s) {
    return Object.keys(s).reduce(function (pre, cur) {
        var keys = Object.keys(s[cur]);
        if (keys.length > 0) {
            pre[cur] = keys.join(' ');
        }
        return pre;
    }, {});
}

function parse (str) {
    var state, res, i, m, a;

    if (str === undefined) {
        return [];
    }

    if (typeof str === 'number') {
        return [str + ''];
    }

    if (typeof str !== 'string') {
        return [str];
    }

    res = [];

    state = {
        'text-decoration': {},
        'font-weight': {},
        'font-style': {},
        'baseline-shift': {},
        'font-size': {},
        'font-family': {}
    };

    while (true) {
        i = str.search(token);

        if (i === -1) {
            res.push(['tspan', dump(state), str]);
            return res;
        }

        if (i > 0) {
            a = str.slice(0, i);
            res.push(['tspan', dump(state), a]);
        }

        m = str.match(token)[0];

        update(state, trans[m]);

        str = str.slice(i + m.length);

        if (str.length === 0) {
            return res;
        }
    }
}

module.exports = parse;
/* eslint no-constant-condition: 0 */

},{}],44:[function(require,module,exports){
'use strict';

var parse = require('./parse');

function deDash (str) {
    var m = str.match(/(\w+)-(\w)(\w+)/);
    if (m === null) {
        return str;
    }
    var newStr = m[1] + m[2].toUpperCase() + m[3];
    return newStr;
}

function reparse (React) {

    var $ = React.createElement;

    function reTspan (e, i) {
        var tag = e[0];
        var attr = e[1];

        var newAttr = Object.keys(attr).reduce(function (res, key) {
            var newKey = deDash(key);
            res[newKey] = attr[key];
            return res;
        }, {});

        var body = e[2];
        attr.key = i;
        return $(tag, newAttr, body);
    }

    return function (str) {
        return parse(str).map(reTspan);
    };
}

module.exports = reparse;

},{"./parse":43}],45:[function(require,module,exports){
// https://d3js.org/d3-array/ Version 1.2.1. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var ascending = function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

var bisector = function(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
};

function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;
var bisectLeft = ascendingBisect.left;

var pairs = function(array, f) {
  if (f == null) f = pair;
  var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);
  while (i < n) pairs[i] = f(p, p = array[++i]);
  return pairs;
};

function pair(a, b) {
  return [a, b];
}

var cross = function(values0, values1, reduce) {
  var n0 = values0.length,
      n1 = values1.length,
      values = new Array(n0 * n1),
      i0,
      i1,
      i,
      value0;

  if (reduce == null) reduce = pair;

  for (i0 = i = 0; i0 < n0; ++i0) {
    for (value0 = values0[i0], i1 = 0; i1 < n1; ++i1, ++i) {
      values[i] = reduce(value0, values1[i1]);
    }
  }

  return values;
};

var descending = function(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
};

var number = function(x) {
  return x === null ? NaN : +x;
};

var variance = function(values, valueof) {
  var n = values.length,
      m = 0,
      i = -1,
      mean = 0,
      value,
      delta,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number(values[i]))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number(valueof(values[i], i, values)))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  if (m > 1) return sum / (m - 1);
};

var deviation = function(array, f) {
  var v = variance(array, f);
  return v ? Math.sqrt(v) : v;
};

var extent = function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  return [min, max];
};

var array = Array.prototype;

var slice = array.slice;
var map = array.map;

var constant = function(x) {
  return function() {
    return x;
  };
};

var identity = function(x) {
  return x;
};

var range = function(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
};

var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);

var ticks = function(start, stop, count) {
  var reverse,
      i = -1,
      n,
      ticks,
      step;

  stop = +stop, start = +start, count = +count;
  if (start === stop && count > 0) return [start];
  if (reverse = stop < start) n = start, start = stop, stop = n;
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array(n = Math.ceil(stop - start + 1));
    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array(n = Math.ceil(start - stop + 1));
    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();

  return ticks;
};

function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log(step) / Math.LN10),
      error = step / Math.pow(10, power);
  return power >= 0
      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
      : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}

var sturges = function(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
};

var histogram = function() {
  var value = identity,
      domain = extent,
      threshold = sturges;

  function histogram(data) {
    var i,
        n = data.length,
        x,
        values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    var xz = domain(values),
        x0 = xz[0],
        x1 = xz[1],
        tz = threshold(values, x0, x1);

    // Convert number of thresholds into uniform thresholds.
    if (!Array.isArray(tz)) {
      tz = tickStep(x0, x1, tz);
      tz = range(Math.ceil(x0 / tz) * tz, Math.floor(x1 / tz) * tz, tz); // exclusive
    }

    // Remove any thresholds outside the domain.
    var m = tz.length;
    while (tz[0] <= x0) tz.shift(), --m;
    while (tz[m - 1] > x1) tz.pop(), --m;

    var bins = new Array(m + 1),
        bin;

    // Initialize bins.
    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    }

    // Assign data to bins by value, ignoring any outside the domain.
    for (i = 0; i < n; ++i) {
      x = values[i];
      if (x0 <= x && x <= x1) {
        bins[bisectRight(tz, x, 0, m)].push(data[i]);
      }
    }

    return bins;
  }

  histogram.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
  };

  histogram.domain = function(_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
  };

  histogram.thresholds = function(_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
  };

  return histogram;
};

var quantile = function(values, p, valueof) {
  if (valueof == null) valueof = number;
  if (!(n = values.length)) return;
  if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);
  var n,
      i = (n - 1) * p,
      i0 = Math.floor(i),
      value0 = +valueof(values[i0], i0, values),
      value1 = +valueof(values[i0 + 1], i0 + 1, values);
  return value0 + (value1 - value0) * (i - i0);
};

var freedmanDiaconis = function(values, min, max) {
  values = map.call(values, number).sort(ascending);
  return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(values.length, -1 / 3)));
};

var scott = function(values, min, max) {
  return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
};

var max = function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
};

var mean = function(values, valueof) {
  var n = values.length,
      m = n,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number(values[i]))) sum += value;
      else --m;
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number(valueof(values[i], i, values)))) sum += value;
      else --m;
    }
  }

  if (m) return sum / m;
};

var median = function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      numbers = [];

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number(values[i]))) {
        numbers.push(value);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number(valueof(values[i], i, values)))) {
        numbers.push(value);
      }
    }
  }

  return quantile(numbers.sort(ascending), 0.5);
};

var merge = function(arrays) {
  var n = arrays.length,
      m,
      i = -1,
      j = 0,
      merged,
      array;

  while (++i < n) j += arrays[i].length;
  merged = new Array(j);

  while (--n >= 0) {
    array = arrays[n];
    m = array.length;
    while (--m >= 0) {
      merged[--j] = array[m];
    }
  }

  return merged;
};

var min = function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
};

var permute = function(array, indexes) {
  var i = indexes.length, permutes = new Array(i);
  while (i--) permutes[i] = array[indexes[i]];
  return permutes;
};

var scan = function(values, compare) {
  if (!(n = values.length)) return;
  var n,
      i = 0,
      j = 0,
      xi,
      xj = values[j];

  if (compare == null) compare = ascending;

  while (++i < n) {
    if (compare(xi = values[i], xj) < 0 || compare(xj, xj) !== 0) {
      xj = xi, j = i;
    }
  }

  if (compare(xj, xj) === 0) return j;
};

var shuffle = function(array, i0, i1) {
  var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
      t,
      i;

  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m + i0];
    array[m + i0] = array[i + i0];
    array[i + i0] = t;
  }

  return array;
};

var sum = function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
    }
  }

  else {
    while (++i < n) {
      if (value = +valueof(values[i], i, values)) sum += value;
    }
  }

  return sum;
};

var transpose = function(matrix) {
  if (!(n = matrix.length)) return [];
  for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
      row[j] = matrix[j][i];
    }
  }
  return transpose;
};

function length(d) {
  return d.length;
}

var zip = function() {
  return transpose(arguments);
};

exports.bisect = bisectRight;
exports.bisectRight = bisectRight;
exports.bisectLeft = bisectLeft;
exports.ascending = ascending;
exports.bisector = bisector;
exports.cross = cross;
exports.descending = descending;
exports.deviation = deviation;
exports.extent = extent;
exports.histogram = histogram;
exports.thresholdFreedmanDiaconis = freedmanDiaconis;
exports.thresholdScott = scott;
exports.thresholdSturges = sturges;
exports.max = max;
exports.mean = mean;
exports.median = median;
exports.merge = merge;
exports.min = min;
exports.pairs = pairs;
exports.permute = permute;
exports.quantile = quantile;
exports.range = range;
exports.scan = scan;
exports.shuffle = shuffle;
exports.sum = sum;
exports.ticks = ticks;
exports.tickIncrement = tickIncrement;
exports.tickStep = tickStep;
exports.transpose = transpose;
exports.variance = variance;
exports.zip = zip;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],46:[function(require,module,exports){
// https://d3js.org/d3-dispatch/ Version 1.0.3. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var noop = {value: function() {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

exports.dispatch = dispatch;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],47:[function(require,module,exports){
// https://d3js.org/d3-drag/ Version 1.2.1. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-dispatch'), require('d3-selection')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-dispatch', 'd3-selection'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3,global.d3));
}(this, (function (exports,d3Dispatch,d3Selection) { 'use strict';

function nopropagation() {
  d3Selection.event.stopImmediatePropagation();
}

var noevent = function() {
  d3Selection.event.preventDefault();
  d3Selection.event.stopImmediatePropagation();
};

var nodrag = function(view) {
  var root = view.document.documentElement,
      selection = d3Selection.select(view).on("dragstart.drag", noevent, true);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
};

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = d3Selection.select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent, true);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

var constant = function(x) {
  return function() {
    return x;
  };
};

function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch$$1) {
  this.target = target;
  this.type = type;
  this.subject = subject;
  this.identifier = id;
  this.active = active;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this._ = dispatch$$1;
}

DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// Ignore right-click, since that should open the context menu.
function defaultFilter() {
  return !d3Selection.event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(d) {
  return d == null ? {x: d3Selection.event.x, y: d3Selection.event.y} : d;
}

function defaultTouchable() {
  return "ontouchstart" in this;
}

var drag = function() {
  var filter = defaultFilter,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable,
      gestures = {},
      listeners = d3Dispatch.dispatch("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection) {
    selection
        .on("mousedown.drag", mousedowned)
      .filter(touchable)
        .on("touchstart.drag", touchstarted)
        .on("touchmove.drag", touchmoved)
        .on("touchend.drag touchcancel.drag", touchended)
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned() {
    if (touchending || !filter.apply(this, arguments)) return;
    var gesture = beforestart("mouse", container.apply(this, arguments), d3Selection.mouse, this, arguments);
    if (!gesture) return;
    d3Selection.select(d3Selection.event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
    nodrag(d3Selection.event.view);
    nopropagation();
    mousemoving = false;
    mousedownx = d3Selection.event.clientX;
    mousedowny = d3Selection.event.clientY;
    gesture("start");
  }

  function mousemoved() {
    noevent();
    if (!mousemoving) {
      var dx = d3Selection.event.clientX - mousedownx, dy = d3Selection.event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag");
  }

  function mouseupped() {
    d3Selection.select(d3Selection.event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(d3Selection.event.view, mousemoving);
    noevent();
    gestures.mouse("end");
  }

  function touchstarted() {
    if (!filter.apply(this, arguments)) return;
    var touches = d3Selection.event.changedTouches,
        c = container.apply(this, arguments),
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(touches[i].identifier, c, d3Selection.touch, this, arguments)) {
        nopropagation();
        gesture("start");
      }
    }
  }

  function touchmoved() {
    var touches = d3Selection.event.changedTouches,
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent();
        gesture("drag");
      }
    }
  }

  function touchended() {
    var touches = d3Selection.event.changedTouches,
        n = touches.length, i, gesture;

    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation();
        gesture("end");
      }
    }
  }

  function beforestart(id, container, point, that, args) {
    var p = point(container, id), s, dx, dy,
        sublisteners = listeners.copy();

    if (!d3Selection.customEvent(new DragEvent(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function() {
      if ((d3Selection.event.subject = s = subject.apply(that, args)) == null) return false;
      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;
      return true;
    })) return;

    return function gesture(type) {
      var p0 = p, n;
      switch (type) {
        case "start": gestures[id] = gesture, n = active++; break;
        case "end": delete gestures[id], --active; // nobreak
        case "drag": p = point(container, id), n = active; break;
      }
      d3Selection.customEvent(new DragEvent(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
    };
  }

  drag.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), drag) : filter;
  };

  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant(_), drag) : container;
  };

  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant(_), drag) : subject;
  };

  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), drag) : touchable;
  };

  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
};

exports.drag = drag;
exports.dragDisable = nodrag;
exports.dragEnable = yesdrag;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{"d3-dispatch":46,"d3-selection":48}],48:[function(require,module,exports){
// https://d3js.org/d3-selection/ Version 1.3.0. Copyright 2018 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none() {}

function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function empty() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

function selection_selectAll(select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
}

var matcher = function(selector) {
  return function() {
    return this.matches(selector);
  };
};

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!element.matches) {
    var vendorMatches = element.webkitMatchesSelector
        || element.msMatchesSelector
        || element.mozMatchesSelector
        || element.oMatchesSelector;
    matcher = function(selector) {
      return function() {
        return vendorMatches.call(this, selector);
      };
    };
  }
}

var matcher$1 = matcher;

function selection_filter(match) {
  if (typeof match !== "function") match = matcher$1(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant(x) {
  return function() {
    return x;
  };
}

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
      exit[i] = node;
    }
  }
}

function selection_data(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

function selection_exit() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}

function selection_merge(selection$$1) {

  for (var groups0 = this._groups, groups1 = selection$$1._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  return this.parentNode.insertBefore(this.cloneNode(false), this.nextSibling);
}

function selection_cloneDeep() {
  return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

var filterEvents = {};

exports.event = null;

if (typeof document !== "undefined") {
  var element$1 = document.documentElement;
  if (!("onmouseenter" in element$1)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function(event1) {
    var event0 = exports.event; // Events can be reentrant (e.g., focus).
    exports.event = event1;
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      exports.event = event0;
    }
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function(d, i, group) {
    var on = this.__on, o, listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, capture) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
  return this;
}

function customEvent(event1, listener, that, args) {
  var event0 = exports.event;
  event1.sourceEvent = exports.event;
  exports.event = event1;
  try {
    return listener.apply(that, args);
  } finally {
    exports.event = event0;
  }
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

function select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
}

function create(name) {
  return select(creator(name).call(document.documentElement));
}

var nextId = 0;

function local() {
  return new Local;
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local.prototype = {
  constructor: Local,
  get: function(node) {
    var id = this._;
    while (!(id in node)) if (!(node = node.parentNode)) return;
    return node[id];
  },
  set: function(node, value) {
    return node[this._] = value;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};

function sourceEvent() {
  var current = exports.event, source;
  while (source = current.sourceEvent) current = source;
  return current;
}

function point(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}

function mouse(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
}

function selectAll(selector) {
  return typeof selector === "string"
      ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
      : new Selection([selector == null ? [] : selector], root);
}

function touch(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }

  return null;
}

function touches(node, touches) {
  if (touches == null) touches = sourceEvent().touches;

  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = point(node, touches[i]);
  }

  return points;
}

exports.create = create;
exports.creator = creator;
exports.local = local;
exports.matcher = matcher$1;
exports.mouse = mouse;
exports.namespace = namespace;
exports.namespaces = namespaces;
exports.clientPoint = point;
exports.select = select;
exports.selectAll = selectAll;
exports.selection = selection;
exports.selector = selector;
exports.selectorAll = selectorAll;
exports.style = styleValue;
exports.touch = touch;
exports.touches = touches;
exports.window = defaultView;
exports.customEvent = customEvent;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],49:[function(require,module,exports){
'use strict';

var parse = require('./parse'),
    reparse = require('./reparse');

exports.parse = parse;
exports.reparse = reparse;

},{"./parse":50,"./reparse":51}],50:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43}],51:[function(require,module,exports){
'use strict';

var parse = require('./parse');

function deDash (str) {
    var m = str.match(/(\w+)-(\w)(\w+)/);
    if (m === null) {
        return str;
    }
    var newStr = m[1] + m[2].toUpperCase() + m[3];
    return newStr;
}

function reparse (React) {

    var $ = React.createElement;

    function reTspan (e, i) {
        var tag = e[0];
        var attr = e[1];

        var newAttr = Object.keys(attr).reduce(function (res, key) {
            var newKey = deDash(key);
            res[newKey] = attr[key];
            return res;
        }, {});

        var body = e[2];
        newAttr.key = i;
        return $(tag, newAttr, body);
    }

    return function (str) {
        return parse(str).map(reTspan);
    };
}

module.exports = reparse;

},{"./parse":50}]},{},[39]);
