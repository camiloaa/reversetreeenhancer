// ==UserScript==
// @name         Duolingo Tree Enhancer
// @namespace    https://github.com/camiloaa/duolingotreeenhancer
// @version      1.1.6
// @description  Enhance Duolingo by customizing difficulty and providing extra functionality. Based on Guillaume Brunerie's ReverseTreeEnhancer
// @author       Camilo Arboleda
// @match        https://www.duolingo.com/*
// @icon         https://raw.githubusercontent.com/camiloaa/duolingotreeenhancer/master/duolingo.png
// @require      https://github.com/camiloaa/GM_config/raw/master/gm_config.js
// @downloadURL  https://github.com/camiloaa/duolingotreeenhancer/raw/master/DuolingoTreeEnhancer.user.js
// @updateURL    https://github.com/camiloaa/duolingotreeenhancer/raw/master/DuolingoTreeEnhancer.user.js
// @grant        none
// ==/UserScript==

// console.debug('DuolingoTreeEnhancer');

let K_DUOTREE = "i12-l";
let K_CHALLENGE_CLASS = "_1Y5M_";
let K_CHALLENGE_CORRECT_ANSWER = "_75iiA";
let K_CHALLENGE_TRANSLATIONS = "TVAVJ";
let K_CHALLENGE_TRANSLATE_QUESTION = "_3XQ22";
let K_CHALLENGE_TRANSLATE_QUESTION_CSS = "._3XQ22:not(:hover) "
let K_CHALLENGE_TRANSLATE_ANSWER = "_7q434 _1qCW5 _2fPEB _3_NyK _1Juqt _3WbPm";
let K_CHALLENGE_TRANSLATE_BANK = "_3xKXD";
let K_CHALLENGE_SPEAK_QUESTION = "_2D75z";
let K_CHALLENGE_SPEAK_QUESTION_CSS = "._2D75z:not(:hover) ";
let K_CHALLENGE_JUDGE_QUESTION = "KRKEd";
let K_CHALLENGE_JUDGE_QUESTION_CSS = ".KRKEd:not(:hover) ";
let K_CHALLENGE_JUDGE_OPTIONS = "_2Ma9W";
let K_CHALLENGE_JUDGE_TEXT = "_2gaCX";
let K_CHALLENGE_JUDGE_TEXT_CSS = ".NUoBR:not(:hover) div._2gaCX ";
let K_CHALLENGE_JUDGE_CHECKBOX = "_tqTV";
let K_CHALLENGE_COMPLETE_QUESTION = "OGy1T";
let K_CHALLENGE_COMPLETE_QUESTION_CSS = ".OGy1T:not(:hover) "
let K_CHALLENGE_COMPLETE_ANSWER = "_3vSqb _2fPEB _3_NyK _1Juqt";
let K_CHALLENGE_COMPLETE_INPUT_BOX = "_38suA _3ehFQ _1Juqt";
let K_CHALLENGE_SELECT_PIC = "_1Zqmf";
let K_CHALLENGE_NAME_PIC = "_1Zqmf";
let K_CHALLENGE_FOOTER = "_1_XY0 _3wVKa";
let K_ANSWER_FOOTER = "KekRP";
let K_FOOTER_CORRECT = K_CHALLENGE_CORRECT_ANSWER;
let K_SPEAKER_BUTTON = "_1B6Vk _2ESN4 _2arQ0 _2vmUZ _2Zh2S _1X3l0 eJd0I _3yrdh _2wXoR _1AM95 _1dlWz _2gnHr"
let K_CONFIG_BUTTON = "oNqWF _3hso2 _2Zh2S _1X3l0 _1AM95 H7AnT";
let K_SPEAKER_ICON_STYLE = "text-align:center; margin-top:-7px; margin-left:-8px";
let K_SIDE_PANEL = "_21w25 _1E3L7";

var enableTTSGlobal = true;
var duo_languages = JSON.parse(
        '{"gu":"Gujarati","ga":"Irish","gn":"Guarani (Jopará)","'
                + 'gl":"Galician","la":"Latin","tt":"Tatar","tr":"Turkish",'
                + '"lv":"Latvian","tl":"Tagalog","th":"Thai","te":"Telugu",'
                + '"ta":"Tamil","yi":"Yiddish","dk":"Dothraki","de":"German",'
                + '"db":"Dutch (Belgium)","da":"Danish","uz":"Uzbek",'
                + '"el":"Greek","eo":"Esperanto","en":"English",'
                + '"zc":"Chinese (Cantonese)","eu":"Basque","et":"Estonian",'
                + '"ep":"English (Pirate)","es":"Spanish","zs":"Chinese",'
                + '"ru":"Russian","ro":"Romanian","be":"Belarusian",'
                + '"bg":"Bulgarian","ms":"Malay","bn":"Bengali",'
                + '"ja":"Japanese","or":"Oriya","xl":"Lolcat","ca":"Catalan",'
                + '"xe":"Emoji","xz":"Zombie","cy":"Welsh","cs":"Czech",'
                + '"pt":"Portuguese","lt":"Lithuanian","pa":"Punjabi (Gurmukhi)",'
                + '"pl":"Polish","hy":"Armenian","hr":"Croatian",'
                + '"hv":"High Valyrian","ht":"Haitian Creole","hu":"Hungarian",'
                + '"hi":"Hindi","he":"Hebrew","mb":"Malay (Brunei)",'
                + '"mm":"Malay (Malaysia)","ml":"Malayalam","mn":"Mongolian",'
                + '"mk":"Macedonian","ur":"Urdu","kk":"Kazakh","uk":"Ukrainian",'
                + '"mr":"Marathi","my":"Burmese","dn":"Dutch","af":"Afrikaans",'
                + '"vi":"Vietnamese","is":"Icelandic","it":"Italian",'
                + '"kn":"Kannada","zt":"Chinese (Traditional)","as":"Assamese",'
                + '"ar":"Arabic","zu":"Zulu","az":"Azeri","id":"Indonesian",'
                + '"nn":"Norwegian (Nynorsk)","no":"Norwegian",'
                + '"nb":"Norwegian (Bokmål)","ne":"Nepali","fr":"French",'
                + '"fa":"Farsi","fi":"Finnish","fo":"Faroese","ka":"Georgian",'
                + '"ss":"Swedish (Sweden)","sq":"Albanian","ko":"Korean",'
                + '"sv":"Swedish","km":"Khmer","kl":"Klingon","sk":"Slovak",'
                + '"sn":"Sindarin","sl":"Slovenian","ky":"Kyrgyz",'
                + '"sf":"Swedish (Finland)","sw":"Swahili"}');
var activeclass = "";
var DuoState = JSON.parse(localStorage.getItem('duo.state'));
var targetLang = DuoState.user.learningLanguage;
var sourceLang = DuoState.user.fromLanguage;
var challenge;

/* The color used for hiding */
var hColor = "#def0a5"; // "##dadada"

/* Turns a stylesheet (as a string) into a style element */
function toStyleElem(css) {
    var style = document.createElement('style');

    style.type = 'text/css';
    style.className = "enhancer-stylesheet";
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    return style;
}

/* Stylesheet for the hiding text */
var css_hiding_style = '{ color: ' + hColor
       + '!important; background-color: ' + hColor
       + '; border-color: ' + hColor + '; } \n';

/* Elements to hide: Translate, judge, & speak questions */
var css_hiding_source = toStyleElem(
       K_CHALLENGE_TRANSLATE_QUESTION_CSS + css_hiding_style
       + K_CHALLENGE_JUDGE_QUESTION_CSS + css_hiding_style
       + K_CHALLENGE_SPEAK_QUESTION_CSS + css_hiding_style
       + K_CHALLENGE_COMPLETE_QUESTION_CSS + css_hiding_style);

/* Elements to hide: Name & select questions */
var css_hiding_title = toStyleElem('._1Zqmf:not(:hover) ' + css_hiding_style);

/* Elements to hide: Translate questions,judge options, & speak questions */
var css_hiding_target = toStyleElem(
        K_CHALLENGE_TRANSLATE_QUESTION_CSS + css_hiding_style
        + K_CHALLENGE_JUDGE_TEXT_CSS + css_hiding_style
        + K_CHALLENGE_SPEAK_QUESTION_CSS + css_hiding_style);

var css_hiding_pics = toStyleElem('._1o8rO { opacity: 0; } \n'
        + '.eSlsq { opacity: 0; } \n');

function addCSSHiding(node, css_hiding) {
    node.appendChild(css_hiding);
}

function removeCSSHiding(node) {
    var styles = node.getElementsByClassName("enhancer-stylesheet");

    for (var i = styles.length - 1; i >= 0; i--) {
        node.removeChild(styles[i]);
    }
}

/* Audio functions */

var audio;
var prevAudio;
var waiting = false;

// Play an audio element.
function playURL(url, lang) {

    console.debug("[DuolingoTreeEnhancer] Playing URL " + url);
    var audio_id = "audio-userscript-cm-" + lang;
    audio = document.getElementById(audio_id);

    if (audio != null) {
        // Delete audio element
        try {
            audio.parentNode.removeChild(audio);
        } catch (err) {
            // Do nothing, I don't care
        }
    }
    audio = document.createElement('audio');
    audio.setAttribute("id", audio_id);
    audio.setAttribute("autoplay", "true");
    source = document.createElement('source');
    source.setAttribute("type", "audio/mpeg");
    source.setAttribute("src", url);
    audio.appendChild(source);
    var div = document.getElementById("empty-play-button-cm");
    if (div != null) {
        var play_button = document.createElement('div');
        play_button.style = K_SPEAKER_ICON_STYLE;
        play_button.appendChild(audio);
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.className = " enhancer-media-element";
        svg.setAttribute("width", "28");
        svg.setAttribute("height", "32");
        svg.setAttribute("version", "1.1");
        var ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        ellipse.setAttribute("cx", "12");
        ellipse.setAttribute("cy", "12");
        ellipse.setAttribute("rx", "10");
        ellipse.setAttribute("ry", "10");
        ellipse.style = "fill:none;stroke:#EEEEEE;stroke-width:5;stroke-linecap:round";
        svg.appendChild(ellipse);
        play_button.appendChild(svg);
        div.setAttribute("onclick", "document.getElementById('"
            + audio_id + "').play()");
        div.removeAttribute("id"); // Make it anonymous
        div.appendChild(play_button);
    } else {
        document.body.parentNode.insertBefore(audio, document.body);
    }

    audio.load();
}

// Play a sentence using the first available TTS
function playSound(sentence, lang) {
    var url = "";
    for (i = 0; i < sayFuncOrder.length; i++) {
        try {
            // console.debug("[DuolingoTreeEnhancer] playSound loop " + sayFuncOrder[i]);
            if (sayFunc[sayFuncOrder[i]](sentence, lang)) {
                break;
            }
        } catch (err) {
            // Do nothing, I don't care
        }
    }
}

// Google TTS Functions
// ====================
//
function googleTTSLang(target) {
    if (target == "dn") {
        return "nl";
    }
    if (target == "zs") {
        return "zh";
    }
    return target;
}

function googleSay(sentence, lang) {

    // Create Google TTS in a way that it doesn't get tired that quickly.
    var gRand = function() {
        return Math.floor(Math.random() * 1000000) + '|'
                + Math.floor(Math.random() * 1000000)
    };
    url = "http://translate.google.com/translate_tts?ie=UTF-8&tl="
            + googleTTSLang(lang) + "&total=1&textlen=" + sentence.length
            + "&tk=" + gRand() + "&q=" + encodeURIComponent(sentence)
            + "&client=tw-ob";
    playURL(url, lang);
    return true;
}

// Yandex TTS Functions
// ====================
//
function yandexTTSLang(target) {
    switch (target) {
    case 'ar': return 'ar_AE';
    case 'ca': return 'ca_ES';
    case 'cs': return 'cs_CZ';
    case 'da': return 'da_DK';
    case 'de': return 'de_DE';
    case 'el': return 'el_GR';
    case 'en': return 'en_GB';
    case 'es': return 'es_ES';
    case 'fi': return 'fi_FI';
    case 'fr': return 'fr_FR';
    case 'it': return 'it_IT';
    case 'dn': return 'nl_NL';
    case 'no': return 'no_NO';
    case 'pl': return 'pl_PL';
    case 'pt': return 'pt_PT';
    case 'ru': return 'ru_RU';
    case 'se': return 'sv_SE';
    case 'tr': return 'tr_TR';
    }
    return undefined;
};

function yandexSay(sentence, lang) {
    var sayLang = yandexTTSLang(lang);
    // console.debug("[DuolingoTreeEnhancer] Yandex " + sayLang);
    if (sayLang != undefined) {
        url = 'http://tts.voicetech.yandex.net/tts?text='
                + encodeURIComponent(sentence) + '&lang=' + sayLang
                + '&format=mp3&quality=hi';
        playURL(url, lang);
        return true;
    }
    return false;
};

// Baidu TTS Functions
// ====================

// Duolingo to Baidu language codes
function baiduTTSLang(lang) {
    switch (lang) {
    case 'en': return 'en'; // American English
    case 'es': return 'es'; // Spanish
    case 'pt': return 'pt'; // Portuguese
    case 'zs': return 'zh'; // Chinese
    }
    return undefined;
};

function baiduSay(sentence, lang) {
    var sayLang = baiduTTSLang(lang);
    if (sayLang != undefined) {
        url = 'http://tts.baidu.com/text2audio?text='
                + encodeURIComponent(sentence) + '&lan=' + sayLang
                + '&ie=UTF-8';
        playURL(url, lang);
        return true;
    }
    return false;
}

// List of supported TTS providers
var sayFunc = new Array();
sayFunc['baidu'] = baiduSay;
sayFunc['google'] = googleSay;
sayFunc['yandex'] = yandexSay;
var sayFuncOrder = [ 'baidu', 'yandex', 'google', ];

function insertNodeAfter(node, after) {
    if (after.nextSibling != null) {
        // console.debug("[DuolingoTreeEnhancer] New play button after!");
        after.parentNode.insertBefore(node, after.nextSibling);
    } else {
        // console.debug("[DuolingoTreeEnhancer] New play button end!");
        after.parentNode.appendChild(node);
    }
}

function insertNodeBefore(node, before) {
    // console.debug("[DuolingoTreeEnhancer] New button before!");
    before.parentNode.insertBefore(node, before);
}

// Say a sentence
function say(itemsToSay, lang, node, css) {
    var sentence = "";
    for (var i = 0; i < itemsToSay.length; ++i) {
        var text = itemsToSay[i].type == "textarea" ? itemsToSay[i].textContent
                : itemsToSay[i].innerText;
        sentence = sentence + text + ". ";
    }

    sentence = sentence.replace(/•/g, "");
    sentence = sentence.replace(/\.\./g, ".");

    console.debug("[DuolingoTreeEnhancer] Saying '" + sentence + "'");

    var div = document.createElement('div');
    div.className = K_SPEAKER_BUTTON + " enhancer-media-button";
    div.id = "empty-play-button-cm";

    try {
        div.style = css;
    } catch (err) {
        // Do nothing, really
    }

    try {
        // console.debug("[DuolingoTreeEnhancer] say: Insert play button");
        insertNodeBefore(div, node);
    } catch (err) {
        // console.debug("[DuolingoTreeEnhancer] say: No play button, use old method");
    }

    if (typeof (lang) != 'undefined') {
        playSound(sentence, lang);
        lastSaidLang = lang;
    } else {
        // Do nothing, really
    }
}

function keyUpHandler(e) {
    if (e.shiftKey && (e.keyCode == 32) && audio) {
        audio.play();
    } else if (e.altKey && e.ctrlKey && (e.keyCode == 75) && audio) {
        audio.play();
    } else if (e.altKey && e.ctrlKey && (e.keyCode == 72)) {
        removeCSSHiding(challenge);
    } else {
    }
}

/* Get the right answers if the user answered wrong */
function getRightAnswers() {
}

/* Get the translations */
function getTranslations() {
    var possible = document.getElementsByClassName(K_CHALLENGE_TRANSLATIONS);
    var translations = [];
    if (possible.length > 0) {
        // console.debug("[DuolingoTreeEnhancer] There are translations")
        for (var i = 0; i < possible.length; ++i) {
            translations[i] = possible[i].cloneNode(true);
            translations[i].removeChild(translations[i].firstChild);
        }
    }
    return translations;
}

document.addEventListener('keyup', keyUpHandler, false);

/* Functions acting on the various types of exercices */

/* Translation from target language (eg. Polish) */
function challengeTranslate() {
    var questionBox = challenge.getElementsByClassName(K_CHALLENGE_TRANSLATE_QUESTION);

    var answerbox = challenge.getElementsByTagName("textarea");
    var input_area = answerbox[0];

    lang = input_area.getAttribute("lang");
    if (isCheckSpell()) {
        input_area.setAttribute("spellcheck", "true");
    }

    if (lang == targetLang) {
        question = sourceLang;
        answer = targetLang;
        css_hiding = css_hiding_source;
    } else {
        question = targetLang;
        answer = sourceLang;
        css_hiding = css_hiding_target;
    }

    if (isHideText(question)) {
        newWords = document.getElementsByClassName("_29XRF")
        if (newWords.length > 0) {
            newWordsArray = [].slice.call(newWords)
            newWordsArray.map(element => { element.className = element.className.replace(/_29XRF/g, "");})
        }
        addCSSHiding(challenge, css_hiding);
    }

    // console.debug("[DuolingoTreeEnhancer] challengeTranslate from "+question+" to "+answer);
    if (/answer/.test(activeclass)) {
        // console.debug("[DuolingoTreeEnhancer] We have an answer");
        removeCSSHiding(challenge);
        // Read the answer aloud if necessary
        var grade = document.getElementsByClassName(K_CHALLENGE_CORRECT_ANSWER);
        if (grade.length == 0) {
            grade = answerbox;
        }

        if ((grade.length > 0) && isSayText(answer)) {
            var input_css = "display: inline-block; "
                    + "margin: 20px 0px 0px -40px; "
                    + "position: absolute;";
            say(grade, answer, input_area, input_css);
        }

    } else {
        // Read the question aloud if no TTS is available
        // We know there is not TTS because there is no play button
        speak_button = challenge.getElementsByClassName(K_SPEAKER_BUTTON);
        if (isSayText(question)) {
            if (speak_button.length == 0) {
                say(questionBox, question, questionBox[0].firstChild, "");
            } else if (!/enhancer-media-button/.test(speak_button[0].className)) {
                say(questionBox); // No lang
            }
        }
    }

}

/* Speak question */
function challengeSpeak() {
    if(isHideText(targetLang)) {
        addCSSHiding(challenge, css_hiding_target);
    }
}

/* Multiple-choice translation question */
function challengeJudge() {
    var textCell = challenge.getElementsByClassName(K_CHALLENGE_JUDGE_QUESTION);

    if (!document.getElementById("timer") && isHideTranslations()) {
        // console.debug("[DuolingoTreeEnhancer] challengeJudge Hiding target");
        addCSSHiding(challenge, css_hiding_target);
    }

    if (/answer/.test(activeclass)) {
        // console.debug("[DuolingoTreeEnhancer] callengeJudge answer");
        removeCSSHiding(challenge);
        var grade = document.getElementsByClassName(K_CHALLENGE_CORRECT_ANSWER);
        if (grade.length == 0) { // Answer is right
            ansStatus = challenge.getElementsByClassName(K_CHALLENGE_JUDGE_CHECKBOX);
            ansText = challenge.getElementsByClassName(K_CHALLENGE_JUDGE_TEXT);

            for (var i = 0; i < ansStatus.length; ++i) {
                if (ansStatus[i].checked == true) {
                    grade = ansText[i];
                    ansText[i].className = K_CHALLENGE_JUDGE_TEXT
                            + " valid-ans";
                }
            }

            grade = challenge.getElementsByClassName("valid-ans");
        }

        if (isSayText(targetLang)) {
            // console.debug("[DuolingoTreeEnhancer] challengeJudge Hiding source");
            var answers = challenge.getElementsByClassName(K_CHALLENGE_JUDGE_OPTIONS)[0];
            var answer_css = "display: inline-block; "
                    + "margin: 0px 0px -40px -40px; "
                    + "position: relative;";
            say(grade, targetLang, answers, answer_css);
        }
    } else {
        // console.debug("[DuolingoTreeEnhancer] callengeJudge question");
        if (isHideText(sourceLang)) {
            addCSSHiding(challenge, css_hiding_source);
        }

        if (isSayText(sourceLang)) {
            // console.debug("[DuolingoTreeEnhancer] challengeJudge: Sentence to translate");
            var question_css = "display: inline-block; "
                    + "margin: 0px 0px -45px -40px; "
                    + "position: relative;";
            say(textCell, sourceLang, textCell[0], question_css);
        }
    }
}

/* Type in a missing word */
function challengeComplete() {
    var questionBox = challenge.getElementsByClassName(K_CHALLENGE_COMPLETE_QUESTION);

    var answerarray = challenge.getElementsByClassName(K_CHALLENGE_COMPLETE_ANSWER);
    var answerbox = answerarray[0]

    if (isHideText(sourceLang)) {
        addCSSHiding(challenge, css_hiding_source);
    }

    // console.debug("[DuolingoTreeEnhancer] challengeTranslate from "+question+" to "+answer);
    if (/answer/.test(activeclass)) {
        // console.debug("[DuolingoTreeEnhancer] We have an answer");
        removeCSSHiding(challenge);
        // Read the answer aloud if necessary
        var grade = document.getElementsByClassName(K_CHALLENGE_CORRECT_ANSWER);
        if (grade.length == 0) {
            // Make the whole answer a single text
            // console.debug("[DuolingoTreeEnhancer] Change the whole line");
            var box_to_remove = answerbox.getElementsByClassName(K_CHALLENGE_COMPLETE_INPUT_BOX)[0];
            var box_to_fix = box_to_remove.parentNode;
            box_to_fix.removeChild(box_to_remove);
            box_to_fix.innerText = box_to_remove.value;
            grade = answerarray;
        } else {
            // console.debug("[DuolingoTreeEnhancer] You made a mistake");
        }

        if ((grade.length > 0) && isSayText(targetLang)) {
            var input_css = "display: inline-block; "
                + "margin: 20px 0px 0px -40px; "
                + "position: absolute;";
            say(grade, targetLang, answerbox, input_css);
        }

    } else {
        // Read the question aloud if no TTS is available
        // We know there is not TTS because there is no play button
        speak_button = challenge.getElementsByClassName(K_SPEAKER_BUTTON);
        if (isSayText(sourceLang)) {
            if (speak_button.length == 0) {
                say(questionBox, sourceLang, questionBox[0].firstChild, "");
            } else if (!/enhancer-media-button/.test(speak_button[0].className)) {
                say(questionBox); // No lang
            }
        }
    }

}

/* Select the correct image */
function challengeSelect() {
    if (/answer/.test(activeclass)) {
        removeCSSHiding(challenge);
    } else {
        if (isHidePics()) {
            addCSSHiding(challenge, css_hiding_pics);
        }
        if (isHideText(sourceLang)) {
            addCSSHiding(challenge, css_hiding_title);
        }
        // console.debug("[DuolingoTreeEnhancer] challengeSelect question");
        textCell = challenge.getElementsByClassName(K_CHALLENGE_SELECT_PIC);
        if (isSayText(sourceLang)) {
            question_css = "display: inline-block; "
                + "margin: 12px 0px 0px -40px; "
                + "top: 30px; "
                + "position: relative; "
                + "align-self:left";
            say(textCell, sourceLang, textCell[0], question_css);
        }

    }
}

/* Type the word corresponding to the images */
function challengeName() {
    if (/answer/.test(activeclass)) {
        removeCSSHiding(challenge);
    } else {
        if (isHidePics()) {
            addCSSHiding(challenge, css_hiding_pics);
        }
        if (isHideText(sourceLang)) {
            addCSSHiding(challenge, css_hiding_title);
        }
        textCell = challenge.getElementsByClassName(K_CHALLENGE_NAME_PIC);
        if (isSayText(sourceLang)) {
            question_css = "display: inline-block; "
                + "position: relative; ";
            say(textCell, sourceLang, textCell[0].firstChild, question_css);
        }
    }
}

/*
 * Choose the missing word in the sentence.
 */
function challengeForm() {
    // _1VfeV -> Question
    //
    if (/answer/.test(activeclass)) {
        var translations = getTranslations();
        var first_translation = document
                .getElementsByClassName(K_CHALLENGE_TRANSLATIONS)[0];
        var grade = document.getElementsByClassName(K_CHALLENGE_CORRECT_ANSWER);
        var sentences = [];
        if (grade.length == 0) {
            // console.debug("[DuolingoTreeEnhancer] Right selection");
        } else {
            // console.debug("[DuolingoTreeEnhancer] Wrong selection");
            // Translation, just as Listen
        }
        if (isSayText(targetLang) && sentences.length > 0) {
            // Say selection as first option
            say(sentences, targetLang);
        } else if (isSayText(sourceLang) && translations.length > 0) {
            // Otherwise say translation
            say(translations, sourceLang, first_translation);
        }
    } else {
        // console.debug("[DuolingoTreeEnhancer] Challenge Form: nothing to read here");
    }
}

function challengeListen() {
    if (/answer/.test(activeclass)) {
        // console.debug("[DuolingoTreeEnhancer] Check if a translation is available");
        var translations = getTranslations();
        if (isSayText(sourceLang) && translations.length > 0) {
            var first_translation = document
                    .getElementsByClassName(K_CHALLENGE_TRANSLATIONS)[0];
            say(translations, sourceLang, first_translation);
        }
    } else {
        if (isCheckSpell()) {
            var input_box = challenge.getElementsByTagName("textarea")[0];
            input_box.setAttribute("spellcheck", "true");
            input_box.setAttribute("lang", targetLang);
        }
    }
}

function setUserConfig() {
    var autoplay = isSayText(targetLang);
    var microphone = isSpeaking();
    var speakers = isListening();
    DuoState.user.enableMicrophone = microphone;
    DuoState.user.enableSpeaker = speakers;

    // This was reverse engineered, might stop working any time
    url = "/2016-04-13/users/";
    fields = "?fields=%2Cautoplay%2CenableMicrophone%2CenableSpeaker";
    params = '{"":"","autoplay":' + autoplay + ',"enableMicrophone":'
            + microphone + ',"enableSpeaker":' + speakers + '}';

    http = new XMLHttpRequest();
    http.open("PATCH", url + DuoState.user.id + fields, true);

    http.onreadystatechange = function() {// Call a function when the state
        // changes.
        if (http.readyState == 4 && http.status == 200) {
            console.info("[DuolingoTreeEnhancer] Updated Setup " + params);
        }
    }

    // console.debug("[DuolingoTreeEnhancer] About to send config");
    http.send(params);
}

function updateConfig() {
    var item = "gm_conf-" + sourceLang + "-" + targetLang;
    var conf = {
        id : item, // The id used for this instance of GM_config
        title : 'Enhanced Tree Configurator',
        fields : // Fields object
        {
            'SECTION_0' : {
                'section' : [ '', '' ],
                'type' : 'hidden'
            },
            'IS_ENHANCED' : { // Choose a pre-defined profile
                'label' : 'Select the kind of tree you want to play:',
                'options' : [ 'Normal', 'Reverse', 'Enhanced', 'Laddering' ],
                'default' : 'Normal', // Do nothing by default
                'change' : function() {
                    setConfigDefaults(this[this.selectedIndex].value);
                },
                'type' : 'select', // Makes this setting a dropdown
            },
            'SECTION_1' : {
                'section' : [ '', 'Hide questions in:' ],
                'type' : 'hidden'
            },
            'HIDE_TARGET' : { // Hide questions in Duo's target language
                'section' : [],
                'labelPos' : 'right',
                'label' : duo_languages[targetLang], // SECTION_2
                'type' : 'checkbox',
                'default' : false
            },
            'HIDE_SOURCE' : { // Hide questions in Duo's source language
                'label' : duo_languages[sourceLang],
                'labelPos' : 'right',
                'type' : 'checkbox',
                'default' : false
            },
            'HIDE_TRANSLATIONS' : {
                'label' : 'Multiple selection',
                'labelPos' : 'right',
                'type' : 'checkbox',
                'default' : false
            },
            'SECTION_3' : {
                'section' : [ '', 'Read text in:' ],
                'type' : 'hidden'
            },
            'READ_TARGET' : { // Read text in Duo's target language
                'section' : [], // SECTION_4
                'label' : duo_languages[targetLang],
                'labelPos' : 'right',
                'type' : 'checkbox',
                'default' : true
            },
            'READ_SOURCE' : // Read text in Duo's target language
            {
                'label' : duo_languages[sourceLang],
                'labelPos' : 'right',
                'type' : 'checkbox',
                'default' : false
            },
            'LISTENING' : {
                'label' : 'Listening exercises',
                'labelPos' : 'right',
                'type' : 'checkbox',
                'default' : true
            },
            'SECTION_5' : {
                'section' : [ '', 'Other options' ],
                'type' : 'hidden'
            },
            'HIDE_PICS' : {
                'section' : [], // SECTION_6
                'label' : 'Hide pics',
                'labelPos' : 'right',
                'type' : 'checkbox',
                'default' : false
            },
            'SPELL_CHECK' : {
                'label' : 'Check spelling',
                'labelPos' : 'right',
                'type' : 'checkbox',
                'default' : false
            },
            'SPEAKING' : {
                'label' : 'Speaking exercises',
                'labelPos' : 'right',
                'type' : 'checkbox',
                'default' : true
            },
            'SECTION_7' : {
                'section' : [ '', '' ],
                'type' : 'hidden'
            },
            'TTS_ORDER' : {
                'label' : 'List of TTS services ',
                'labelPos' : 'left',
                'type' : 'text', // Makes this setting a text field
                'default' : 'google yandex baidu'
            },
        },
        full_css : [
                "#GM_config * * { font: 500 15px/20px 'museo-sans-rounded',sans-serif; "
                        + "margin-right: 6px; color: #333 }",
                "#GM_config { background: #FFF; }",
                "#GM_config input[type='radio'] { margin-right: 8px; }",
                "#GM_config .indent40 { margin-left: 40%; }",
                "#GM_config .field_label { margin-right: 6px; }",
                "#GM_config .radio_label { font-size: 12px; }",
                "#GM_config .block { display: block; }",
                "#GM_config .saveclose_buttons { margin: 16px 10px 10px; padding: 2px 12px; }",
                "#GM_config .reset, #GM_config .reset a,"
                        + " #GM_config_buttons_holder { color: #000; text-align: right; }",
                "#GM_config .config_header { font-size: 20pt; margin:0px; color: white; background: "
                        + "rgba(32, 166, 231, 0.8) linear-gradient(to bottom, #20A8E9, "
                        + "rgba(30, 158, 220, 0.5)) "
                        + "repeat-x scroll 0% 0%; border: 10px solid rgba(32, 166, 231, 0.8); }",
                "#GM_config .config_desc, #GM_config .section_desc, #GM_config .reset { font-size: 9pt; }",
                "#GM_config .center { text-align: center; }",
                "#GM_config .section_header_holder { margin-top: 8px; }",
                "#GM_config .config_var { margin: 0 0 4px; }",
                "#GM_config .section_header { background: #F0F0F0; border: 1px solid #CCC; "
                        + "color: #404040; font-size: 11pt; margin: 0; text-align: left; }",
                "#GM_config .section_desc { background: #F0F0F0; border: 1px solid #CCC; color: #404040;"
                        + " font-size: 11pt; margin: 0 0 6px; text-align: left; }",
                "#GM_config_section_0 .config_var, #GM_config_section_7 .config_var "
                        + " { background: #F0F0F0; border: 1px solid #CCC; color: #404040;"
                        + " font-size: 11pt; margin: 0 0 6px; text-align: left; }",
                "#GM_config_section_2 .config_var, "
                        + "#GM_config_section_4 .config_var, "
                        + "#GM_config_section_6 .config_var "
                        + "{ margin: 5% !important;display: inline !important; }", ]
                .join('\n')
                + '\n',
        events : { // Callback functions object
            save : function() {
                GM_config.close()
            },
            close : function() {
                getConfig();
            },
            open : function() {
                this.frame.setAttribute(
                                'style',
                                'bottom: auto; border: 1px solid #000;'
                                        + ' display: none; height: 60%; left: 0; margin: 0; max-height: 95%;'
                                        + ' max-width: 95%; opacity: 0; overflow: auto; padding: 0;'
                                        + ' position: fixed; right: auto; top: 0; width: 70%; z-index: 9999;');
            }
        }
    };
    GM_config = new GM_configStruct();
    GM_config.init(conf);
    sayFuncOrder = GM_config.get('TTS_ORDER').split(" ");
    try {
        console.debug("DuolingoTreeEnhancer version " + GM_info.script.version
                + " ready from " + duo_languages[sourceLang]
                + " to " + duo_languages[targetLang]);
    } catch (err) {
        console.debug("DuolingoTreeEnhancer"
                + " ready from " + duo_languages[sourceLang]
                + " to " + duo_languages[targetLang]);
    }
};

function setConfigDefaults(treeType) {
    switch (treeType) {
    case 'Normal':
        GM_config.fields['HIDE_TARGET'].value = false;
        GM_config.fields['HIDE_SOURCE'].value = false;
        GM_config.fields['READ_TARGET'].value = true;
        GM_config.fields['READ_SOURCE'].value = false;
        GM_config.fields['LISTENING'].value = true;
        GM_config.fields['SPEAKING'].value = true;
        GM_config.fields['HIDE_PICS'].value = false;
        GM_config.fields['SPELL_CHECK'].value = false;
        GM_config.fields['HIDE_TRANSLATIONS'].value = false;
        break;

    case 'Reverse':
        GM_config.fields['HIDE_TARGET'].value = false;
        GM_config.fields['HIDE_SOURCE'].value = true;
        GM_config.fields['READ_TARGET'].value = false;
        GM_config.fields['READ_SOURCE'].value = true;
        GM_config.fields['LISTENING'].value = false;
        GM_config.fields['SPEAKING'].value = false;
        GM_config.fields['HIDE_PICS'].value = true;
        GM_config.fields['SPELL_CHECK'].value = true;
        GM_config.fields['HIDE_TRANSLATIONS'].value = true;
        break;

    case 'Enhanced':
        GM_config.fields['HIDE_TARGET'].value = true;
        GM_config.fields['HIDE_SOURCE'].value = false;
        GM_config.fields['READ_TARGET'].value = true;
        GM_config.fields['READ_SOURCE'].value = false;
        GM_config.fields['LISTENING'].value = true;
        GM_config.fields['SPEAKING'].value = true;
        GM_config.fields['HIDE_PICS'].value = false;
        GM_config.fields['SPELL_CHECK'].value = true;
        GM_config.fields['HIDE_TRANSLATIONS'].value = false;
        break;

    case 'Laddering':
        GM_config.fields['HIDE_TARGET'].value = true;
        GM_config.fields['HIDE_SOURCE'].value = true;
        GM_config.fields['READ_TARGET'].value = true;
        GM_config.fields['READ_SOURCE'].value = true;
        GM_config.fields['LISTENING'].value = true;
        GM_config.fields['SPEAKING'].value = true;
        GM_config.fields['HIDE_PICS'].value = false;
        GM_config.fields['SPELL_CHECK'].value = true;
        GM_config.fields['HIDE_TRANSLATIONS'].value = false;
        break;

    default:
        break;
    }

    GM_config.fields['HIDE_TARGET'].reload();
    GM_config.fields['HIDE_SOURCE'].reload();
    GM_config.fields['READ_TARGET'].reload();
    GM_config.fields['READ_SOURCE'].reload();
    GM_config.fields['LISTENING'].reload();
    GM_config.fields['SPEAKING'].reload();
    GM_config.fields['HIDE_PICS'].reload();
    GM_config.fields['SPELL_CHECK'].reload();
    GM_config.fields['HIDE_TRANSLATIONS'].reload();
}

function showConfig() {
    GM_config.open();
}

function getConfig() {
    // Keep a list of reverse trees
    var item = sourceLang + "-" + targetLang;

    sayFuncOrder = GM_config.get('TTS_ORDER').split(" ");

    // Read the current TTS preferences
    var hasEnhancement = GM_config.get('HIDE_TARGET')
            || GM_config.get('HIDE_SOURCE') || GM_config.get('SPELL_CHECK')
            || GM_config.get('READ_SOURCE') || GM_config.get('HIDE_PICS');
    if (!isEnhancedTree() && hasEnhancement) {
        GM_config.set('IS_ENHANCED', "Enhanced");
    } else if (!hasEnhancement) {
        GM_config.set('IS_ENHANCED', "Normal");
    }
    updateButton();
    GM_config.save(); // Won't return
}

/* Function dealing with the button on the home page */
function isReverseTree() {
    return GM_config.get('IS_ENHANCED') == 'Reverse';
}

function isEnhancedTree() {
    return GM_config.get('IS_ENHANCED') != 'Normal';
}

function isHidePics() {
    return GM_config.get('HIDE_PICS');
}

function isHideTranslations() {
    return GM_config.get('HIDE_TRANSLATIONS');
}

function isCheckSpell() {
    return GM_config.get('SPELL_CHECK');
}

function isHideText(from) {
    if (targetLang == from)
        return GM_config.get('HIDE_TARGET');
    else
        return GM_config.get('HIDE_SOURCE');
}

function isSayText(from) {
    if (targetLang == from)
        return (GM_config.get('READ_TARGET') && enableTTSGlobal
                && isEnhancedTree());
    else
        return (GM_config.get('READ_SOURCE') && enableTTSGlobal);
}

function isListening() {
    return (GM_config.get([ 'LISTENING' ]));
}

function isSpeaking() {
    return (GM_config.get([ 'SPEAKING' ]));
}

function updateButton() {
    var button = document.getElementById("reverse-tree-enhancer-button");
    if (button === null) {
        return;
    }
    if (isEnhancedTree()) {
        button.textContent = GM_config.get('IS_ENHANCED') + " tree!";
        button.className = K_CONFIG_BUTTON;
    } else {
        button.textContent = "Normal tree";
        button.className = K_CONFIG_BUTTON;
    }
}

/* Check if mutations correspond to an answer */
function isAnswer(mutations, challengeclass) {
    // By default, we get an empty collection here
    for (var i = 0; i < mutations.length; ++i) {
        mutation = mutations[i];
        if (mutation.type === 'childList') {
            var target = mutation.target;
            var footer_correct = target.getElementsByClassName(K_FOOTER_CORRECT);

            if (/challenge/.test(challengeclass)) {
                // console.debug("[DuolingoTreeEnhancer] Challenge activity" + challengeclass);
                // console.debug("[DuolingoTreeEnhancer] Changed target " + target.className);
                // console.debug(target);
                if (/enhancer/.test(target.className)) {
                    // console.debug("[DuolingoTreeEnhancer] We are adding a button here");
                    return activeclass;
                }
                if (target.className == K_CHALLENGE_FOOTER) {
                    // console.debug("[DuolingoTreeEnhancer] An important change in the challenge");
                    for (var j = 0; j < mutation.addedNodes.length; ++j) {
                        // was a child added with ID of 'bar'?
                        var added_class = mutation.addedNodes[j].className;
                        // console.debug("[DuolingoTreeEnhancer] class: " + added_class);
                        var matcher = new RegExp(K_ANSWER_FOOTER, "g");
                        if (matcher.test(added_class)) {
                            // console.debug("[DuolingoTreeEnhancer] We got an answer");
                            if (footer_correct.length != 0) {
                                // console.debug("[DuolingoTreeEnhancer] You are right, no alt answer");
                                return challengeclass + " correct answer";
                            }
                            return challengeclass + " answer";
                        }
                    }
                }
            }
        } else {
            // var target = mutation.target;
            // console.debug("[DuolingoTreeEnhancer] Changed no child class " + target.className);
        }
    }
    return challengeclass;
}

function addButton() {
    var trees = document.getElementsByClassName(K_DUOTREE);
    if (trees.length == 0) {
        return; // Nothing to do here
    }
    var tree = trees[0];
    var button = document.createElement("button");

    button.id = "reverse-tree-enhancer-button";
    button.onclick = showConfig;
    button.className = K_CONFIG_BUTTON
            + " reverse-tree-enhancer-button"
    button.style = "visibility: visible;" +
        "border-left-width: 1px; " +
        "margin-bottom: 5px;";
    tree.insertBefore(button, tree.firstChild);

    updateButton(); // Read setup
}

/* Function dispatching the changes in the page to the other functions */
function onChange(mutations) {
    var newclass = "";

    if (window.location.pathname == "/learn") {
        // General setup
        DuoState = JSON.parse(localStorage.getItem('duo.state'));
        newSourceLang = DuoState.user.fromLanguage;
        newTargetLang = DuoState.user.learningLanguage;

        if (newSourceLang != sourceLang || newTargetLang != targetLang) {
            // console.debug("[DuolingoTreeEnhancer] Update DuoState language change");
            targetLang = DuoState.user.learningLanguage;
            sourceLang = DuoState.user.fromLanguage;
            updateConfig(); // Make GM_Config point to this language setup
            setUserConfig();

            var tree = document.getElementsByClassName(K_DUOTREE)[0];
            var button = document.getElementById("reverse-tree-enhancer-button");
            if (window.location.pathname == "/learn")
                tree.removeChild(button);
        }

        // console.debug("[DuolingoTreeEnhancer] Update DuoState new window");
        targetLang = DuoState.user.learningLanguage;
        sourceLang = DuoState.user.fromLanguage;

        if (!document.getElementById("reverse-tree-enhancer-button")) {
            addButton();
        }
    }

    var challenges = document.getElementsByClassName(K_CHALLENGE_CLASS);
    if (challenges.length > 0) {
        newclass = challenges[0].getAttribute("data-test");
        newclass = isAnswer(mutations, newclass);
        // console.debug("[DuolingoTreeEnhancer] Challenge: " + newclass);

        if (newclass != activeclass) {
            // console.debug("[DuolingoTreeEnhancer] Old class: " + activeclass);
            activeclass = newclass;

            if (challenges.length == 0) {
                return;
            }

            challenge = challenges[0];
            challenge.setAttribute("data-test", activeclass);

            if (/translate/.test(newclass)) {
                challengeTranslate();
            }

            if (/speak/.test(newclass)) {
                challengeSpeak();
            }

            if (/judge/.test(newclass)) {
                challengeJudge();
            }
            if (/completeReverseTranslation/.test(newclass)) {
                challengeComplete();
            }
            if (/select/.test(newclass)) {
                challengeSelect();
            }
            if (/name/.test(newclass)) {
                challengeName();
            }
            if (/form/.test(newclass)) {
                challengeForm();
            }
            if (/listen/.test(newclass)) {
                challengeListen();
            }
        }
    }

    if (/certification_test/.test(newclass)) {
        enableTTSGlobal = false;
    } else {
        enableTTSGlobal = true;
    }
}

new MutationObserver(onChange).observe(document.body, {
    childList : true,
    subtree : true
});

updateConfig();
if (document.getElementById("reverse-tree-enhancer-button") == null) {
    addButton();
} else {
    // console.debug("[DuolingoTreeEnhancer] Not a tree");
}
