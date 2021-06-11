// ==UserScript==
// @name         Duolingo Tree Enhancer
// @namespace    https://github.com/camiloaa/duolingotreeenhancer
// @version      1.3.2
// @description  Enhance Duolingo by customizing difficulty and providing extra functionality. Based on Guillaume Brunerie's ReverseTreeEnhancer
// @author       Camilo Arboleda
// @match        https://www.duolingo.com/*
// @match        https://preview.duolingo.com/*
// @icon         https://raw.githubusercontent.com/camiloaa/duolingotreeenhancer/master/duolingo.png
// @require      https://github.com/camiloaa/GM_config/raw/master/gm_config.js
// @downloadURL  https://github.com/camiloaa/duolingotreeenhancer/raw/master/DuolingoTreeEnhancer.user.js
// @updateURL    https://github.com/camiloaa/duolingotreeenhancer/raw/master/DuolingoTreeEnhancer.user.js
// @grant        none
// ==/UserScript==

// log('DuolingoTreeEnhancer');

const K_PLUGIN_NAME = "DuolingoTreeEnhancer";
const K_CHALLENGE_JUDGE_QUESTION = "_3-JBe";
const K_SPEAKER_BUTTON = "_2UpLr _1x6bc _1vUZG whuSQ _2gwtT _1nlVc _2fOC9 t5wFJ _3dtSu _25Cnc _3yAjN UCrz7 yTpGk"
const K_CONFIG_BUTTON = "_2Jb7i _3iVqs _2A7uO _2gwtT _1nlVc _2fOC9 t5wFJ _3dtSu _25Cnc _3yAjN _3Ev3S _1figt";
const K_SPEAKER_ICON_STYLE = "text-align:center; margin-top:-7px; margin-left:-8px";

const duo_languages = JSON.parse(
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
                + '"sf":"Swedish (Finland)","sw":"Swahili","zh":"Chinese"}');
var activeClass = "";
var duoState = JSON.parse(localStorage.getItem('duo.state'));
var targetLang = duoState.user.learningLanguage;
var sourceLang = duoState.user.fromLanguage;

/* --------------------------------------
 *  Prototypes Section
 * --------------------------------------*/

/* Restore console */
var _i = document.createElement('iframe');
_i.style.display = 'none';
document.body.appendChild(_i);
console_alt = _i.contentWindow.console;
function log(objectToLog) {
	console_alt.debug("[" + K_PLUGIN_NAME + "]: %o", objectToLog);
}

Array.prototype.randomElement = function () {
	return this[Math.floor(Math.random() * this.length)]
}

Element.prototype.parentN = function (n) {
	if (parseInt(n) <= 0) {
		return this;
	}
	return this.parentElement.parentN(n - 1);
}

String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

/* --------------------------------------
 *  UI-elements Section
 * --------------------------------------*/

function getFirstElementByDataTestValue(data_test) {
    return document.querySelector("[data-test='" + data_test + "']");
}

function getFirstMatchingElementByDataTestValue(data_test) {
    return document.querySelector("*[data-test*='" + data_test + "']");
}

function getElementsByDataTestValue(data_test) {
    return document.querySelectorAll("[data-test='" + data_test + "']");
}

function getMatchingElementsByDataTestValue(data_test) {
    return document.querySelectorAll("[data-test*='" + data_test + "']");
}

function getDuoTree() {
	return getFirstElementByDataTestValue("skill-tree");
}

function getChallenge() {
    return getFirstMatchingElementByDataTestValue("challenge");
}

function getChallengeHeader() {
    return getFirstElementByDataTestValue("challenge-header");
}

function getTranslatePrompt() {
    return getFirstElementByDataTestValue("challenge-translate-prompt");
}

function getHintSentence() {
    return getFirstElementByDataTestValue("hint-sentence");
}

function getHintToken() {
    return getFirstElementByDataTestValue("hint-token");
}

function getFormPrompt() {
    return getFirstElementByDataTestValue("challenge-form-prompt");
}

function getInputBox() {
    return getFirstElementByDataTestValue("challenge-text-input");
}

function getCardChoices() {
    return getElementsByDataTestValue("challenge-choice-card-input");
}

function getChoiceBox() {
    return getFirstElementByDataTestValue("challenge-choice").parentNode;
}

function getChoices() {
    return getElementsByDataTestValue("challenge-choice");
}

function getChoicesText() {
    return getElementsByDataTestValue("challenge-judge-text");
}

function getChoosenAnser() {
    const choices = Array.prototype.slice.call(getChoices());
    const answers = Array.prototype.slice.call(getChoicesText());
    for (var i = 0; i < choices.length; i++) {
        if (choices[i].firstChild.checked) {
            return answers[i];
        }
    }
}

function getTappedAnswer() {
    const first_token = getFirstElementByDataTestValue("challenge-tap-token");
    const parent_token = first_token.parentN(3);
    if (parent_token.hasAttribute("dir")) {
        return parent_token;
    }
    return parent_token.parentElement;
}

function getAnswerFooter() {
    return getFirstMatchingElementByDataTestValue("blame")
}

function getFirstAnswerInFooter() {
    answers = getAnswerFooter().getElementsByTagName("h2");
    if (answers.length > 0) {
        return answers[0].nextSibling;
    }
    return null;
}

function getLastAnswerInFooter() {
    answers = getAnswerFooter().getElementsByTagName("h2");
    if (answers.length > 0) {
        return answers[answers.length - 1].nextSibling;
    }
    return null;
}

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

function addCSSHiding(css) {
    // log("addCSSHiding: " + css);
    var style = toStyleElem(css);
    document.head.appendChild(style);
}

/* Stylesheet for the hiding text */

// HARDCODED CLASSNAME HERE -> Hide orange new words
css_style_hide_text = `{parent} {child}:not(:hover){
    background-color: #def0a5;
    color: #def0a5;
    transition: .2s;
    flex-basis:100%
}

{child}:hover {
    transition: .5s;
    flex-basis:100%
}

{child} ._1bkpY:not(:hover) {
    color: inherit;
}
`;

css_style_hide_pic = `{parent} {child}:not(:hover){
    transition: .2s;
    opacity: 0;
}

{child}:hover {
    transition: .5s;
    opacity: 1;
}`;

function revealElements() {
    var styles = document.getElementsByClassName("enhancer-stylesheet");

    for (var i = styles.length - 1; i >= 0; i--) {
        styles[i].parentNode.removeChild(styles[i]);
    }
}

function hideElements(elements, css) {
    // elements can be an array or an HTMLCollection
    // better use the old safe for cycle
    // log("hideElements");
    // log(elements);
    // Make the style dependent on parent. Important for multiple selection
    const parent_class = elements[0].parentElement.classList[0];
    const child_class = ["enhancer-hide-class", parent_class].filter(Boolean).join("-");
    const parent_style = (parent_class) ? "." + parent_class : "";
    const child_style = "."+child_class;
    addCSSHiding(css.formatUnicorn({parent:parent_style, child: child_style}));
    elements.forEach(element => {
        element.classList.add(child_class);
        if (element.parentElement.firstChild != element) {
            element.parentElement.style = "display:flex;";
        }
        });
    // log("hidden elements: " + elements.length);
}

function hideTextElements(elements) {
    // log("hideTextElements");
    hideElements(elements, css_style_hide_text);
}

function hidePicElements(elements) {
    // log("hidePicElements");
    hideElements(elements, css_style_hide_pic);
}

/* Put an element inside a flexbox */
function putInFlexbox(element, id = "enhancer-flexbox") {
    // Put everything inside a flexbox
    // log("putInFlexbox");
    // log(element);
    if (element.id == id) {
        // log("Found myself!");
        return element;
    }
    if (element.parentNode.id == id) {
        // log("Found my parent!");
        return element.parentNode;
    }
    var flexbox = document.createElement("div");
    flexbox.style = "display: flex";
    // log(element.parentNode);
    element.parentNode.insertBefore(flexbox, element);
    flexbox.appendChild(element);
    flexbox.id = id;
    element.style = "width:100%";
    return flexbox;
}

/* Audio functions */

var audio;

// Play an audio element.
function playURL(url, lang, speaker_button) {

    // log("Playing URL " + url);
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
    audio.classList.add("enhancer-audio-class");
    audio.setAttribute("id", audio_id);
    audio.setAttribute("autoplay", "true");
    var source = document.createElement('source');
    source.setAttribute("type", "audio/mpeg");
    source.setAttribute("src", url);
    audio.appendChild(source);
    var div = document.getElementById("empty-play-button-cm");
    if (div != null) {
        var play_button = document.createElement('div');
        play_button.style = K_SPEAKER_ICON_STYLE;
        play_button.appendChild(audio);
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "28");
        svg.setAttribute("height", "32");
        svg.setAttribute("version", "1.1");
        var ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        ellipse.setAttribute("cx", "17");
        ellipse.setAttribute("cy", "17");
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
        speaker_button.insertBefore(audio, document.body);
    }

    audio.load();
}

// play OS TTS
function playTTS(url, lang, speaker_button) {
    let synth = window.speechSynthesis;
    let voices = window.speechSynthesis.getVoices();
    let voiceSelect;
    for (let i = 0; i < voices.length; i++) {
        if(voices[i].lang.includes(lang)) {
            voiceSelect = i;
        }
    }
    let utter = new SpeechSynthesisUtterance(url);
    utter.voice = voices[voiceSelect];

    var div = document.getElementById("empty-play-button-cm");
    if (div != null) {
        var play_button = document.createElement('div');
        play_button.style = K_SPEAKER_ICON_STYLE;
        // play_button.appendChild(audio);
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "28");
        svg.setAttribute("height", "32");
        svg.setAttribute("version", "1.1");
        var ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        ellipse.setAttribute("cx", "17");
        ellipse.setAttribute("cy", "17");
        ellipse.setAttribute("rx", "10");
        ellipse.setAttribute("ry", "10");
        ellipse.style = "fill:none;stroke:#EEEEEE;stroke-width:5;stroke-linecap:round";
        svg.appendChild(ellipse);
        play_button.appendChild(svg);
        div.addEventListener('click',function(){synth.speak(utter);});
        div.removeAttribute("id"); // Make it anonymous
        div.appendChild(play_button);
    } else {
        speaker_button.insertBefore(audio, document.body);
    }
}

// Play a sentence using the first available TTS
function playSound(sentence, lang, speaker_button) {
    var url = "";
    for (i = 0; i < sayFuncOrder.length; i++) {
        try {
            // log("playSound loop " + sayFuncOrder[i]);
            if (sayFunc[sayFuncOrder[i]](sentence, lang, speaker_button)) {
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

function osttsSay(sentence, lang, speaker_button) {
    playTTS(sentence, lang, speaker_button);
    return true;
}

function googleSay(sentence, lang, speaker_button) {

    // Create Google TTS in a way that it doesn't get tired that quickly.
    var gRand = function() {
        return Math.floor(Math.random() * 1000000) + '|'
                + Math.floor(Math.random() * 1000000)
    };
    url = "http://translate.google.com/translate_tts?ie=UTF-8&tl="
            + googleTTSLang(lang) + "&total=1&textlen=" + sentence.length
            + "&tk=" + gRand() + "&q=" + encodeURIComponent(sentence)
            + "&client=tw-ob";
    playURL(url, lang, speaker_button);
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

function yandexSay(sentence, lang, speaker_button) {
    var sayLang = yandexTTSLang(lang);
    // log("Yandex " + sayLang);
    if (sayLang != undefined) {
        url = 'http://tts.voicetech.yandex.net/tts?text='
                + encodeURIComponent(sentence) + '&lang=' + sayLang
                + '&format=mp3&quality=hi';
        playURL(url, lang, speaker_button);
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

function baiduSay(sentence, lang, speaker_button) {
    var sayLang = baiduTTSLang(lang);
    if (sayLang != undefined) {
        url = 'http://tts.baidu.com/text2audio?text='
                + encodeURIComponent(sentence) + '&lan=' + sayLang
                + '&ie=UTF-8';
        playURL(url, lang, speaker_button);
        return true;
    }
    return false;
}

// List of supported TTS providers
var sayFunc = new Array();
sayFunc['baidu'] = baiduSay;
sayFunc['google'] = googleSay;
sayFunc['yandex'] = yandexSay;
sayFunc['ostts'] = osttsSay;
var sayFuncOrder = [ 'ostts', 'baidu', 'yandex', 'google', ];

function insertNodeAfter(node, after) {
    if (after.nextSibling != null) {
        // log("New play button after!");
        after.parentNode.insertBefore(node, after.nextSibling);
    } else {
        // log("New play button end!");
        after.parentNode.appendChild(node);
    }
}

function insertNodeBefore(node, before) {
    // log("New button before!");
    before.parentNode.insertBefore(node, before);
}

// Say a sentence
function say(itemToSay, lang, node, css) {
    var sentence = itemToSay.type == "textarea" ? itemToSay.textContent : itemToSay.innerText;;
    sentence = sentence.replace(/•/g, "");
    sentence = sentence.replace(/\.\./g, ".");
    sentence = sentence.replace(/\n/g," ");

    log("Saying '" + sentence + "'");

    var div = document.createElement('button');
    div.className = K_SPEAKER_BUTTON + " enhancer-media-button";
    div.id = "empty-play-button-cm";

    try {
        div.style = css;
    } catch (err) {
        // Do nothing, really
    }

    if (typeof (lang) != 'undefined') {
        if (typeof (node) != 'undefined') {
            putInFlexbox(node);
            insertNodeBefore(div, node);
        } else {
            putInFlexbox(itemToSay);
            insertNodeBefore(div, itemToSay);
        }
        playSound(sentence, lang, div);
        lastSaidLang = lang;
    } else {
        // Do nothing, really
    }
}

function keyUpHandler(e) {
    if (e.altKey && e.ctrlKey && (e.keyCode == 75) && audio) {
        audio.play();
    } else if (e.altKey && e.ctrlKey && (e.keyCode == 72)) {
        revealElements();
    } else {
    }
}

document.addEventListener('keyup', keyUpHandler, false);

/* Functions acting on the various types of exercices */

/* Translation from target language (eg. Polish) */
function challengeTranslate(challenge) {
    // log("challengeTranslate");
    var question_box = getTranslatePrompt();
    var answerbox = challenge.getElementsByTagName("textarea");
    var input_area = answerbox[0];
    var question_hint = getHintSentence();
    const speaker_button = question_box.getElementsByTagName("button");
    const has_button = speaker_button.length != 0;
    const has_enhancer_button = has_button ? /enhancer-media-button/.test(speaker_button[0].className) : false;

    if (input_area != undefined) {
        lang = input_area.getAttribute("lang");
        if (isCheckSpell()) {
            input_area.setAttribute("spellcheck", "true");
        }
    } else {
        // log("Tapped exercise "+has_button+" "+has_enhancer_button);
        input_area = getTappedAnswer();
        if (!has_button || has_enhancer_button) {
            // Not sure how to figure out which language it is.
            // Most likely it is a source to target challenge,
            // since target to source should have a sound icon already,
            // but it is still just a guess
            lang = targetLang;
        } else {
            lang = sourceLang;
        }
        // log("Probably translating to: " + lang);
    }

    if (lang == targetLang) {
        question = sourceLang;
        answer = targetLang;
    } else {
        question = targetLang;
        answer = sourceLang;
    }

    // log("challengeTranslate from "+question+" to "+answer);
    if (/answer/.test(activeClass)) {
        // log("We have an answer");
        input_area.disabled = false;
        revealElements();
        // Read the answer aloud if necessary
        if (/answer-correct/.test(activeClass)) { // Answer is right
            var grade = getFirstAnswerInFooter();
            if (grade == null) {
                // log("perfect answer!")
                grade = input_area;
            }

            if (isSayText(answer)) {
                say(grade, answer, input_area);
            }
        } else {
            sayAnswersInFooter(input_area, answer);
        }
    } else {
        // Read the question aloud if no TTS is available
        // We know there is not TTS because there is no play button
        // log("Should we read the question?");
        // log(question_hint);
        if (isHideText(question)) {
            hideTextElements([question_hint]);
        }
        if (isSayText(question)) {
            if (!has_button) {
                // log("Read the question aloud");
                say(question_hint, question);
            } else if (!has_enhancer_button) {
                // log("just log the question");
                say(question_hint); // No lang
            }
        }
    }
}

/* Speak question */
function challengeSpeak(challenge) {
    if (/answer/.test(activeClass)) {
        revealElements();
    } else {
        var question_hint = getHintSentence();
        if (isHideText(targetLang)) {
            hideTextElements([question_hint]);
        }
        if (isSayText(targetLang)) {
            say(question_hint);
        }
    }
}

/* Multiple-choice translation question */
function challengeJudge(challenge) {
    // log("challengeJudge");
    // HARDCODED CLASSNAME HERE -> ChallengeJudge doesn't have a "data-" hint
    var textCell = challenge.getElementsByClassName(K_CHALLENGE_JUDGE_QUESTION)[0];

    if (/answer/.test(activeClass)) {
        // log("challengeJudge answer");
        revealElements();
        if (isSayText(targetLang)) {
            var selection_row = getChoiceBox();
            if (/answer-correct/.test(activeClass)) { // Answer is right
                // log("challengeJudge correct");
                grade = getChoosenAnser();
                say(grade, targetLang, grade.parentElement);
            } else {
                // log("challengeJudge incorrect");
                sayAnswersInFooter(selection_row, targetLang);
            }
        }
    } else { // Asking a question
        // log("challengeJudge question");

        // Do we want to hide the target language?
        if (isHideTranslations()) {
            // log("challengeJudge Hiding target");
            const choices = Array.prototype.slice.call(getChoicesText());
            hideTextElements(choices);
        }

        if (isHideText(sourceLang)) {
            hideTextElements([textCell]);
        }

        if (isSayText(sourceLang)) {
            // log("challengeJudge: Sentence to translate");
            say(textCell, sourceLang);
        }
    }
}

/* Type in a missing word */
function challengeComplete(challenge) {
    // log("challengeComplete");
    var question_hint = getHintSentence();
    var input_box = getInputBox();

    if (isHideText(sourceLang)) {
        hideTextElements([question_hint]);
    }

    // log("challengeTranslate from "+question+" to "+answer);
    if (/answer/.test(activeClass)) {
        // log("We have an answer");
        revealElements();
        if (isSayText(targetLang)) {
            // Read the answer aloud if necessary
            var grade = getFirstAnswerInFooter();
            var ansText = "";
            var box_to_fix = input_box.parentNode;
            var answer_box = box_to_fix.parentNode;
            if (grade == null) {
                // Make the whole answer a single text
                // log("You were right");
                ansText = input_box.value;
                box_to_fix.innerHTML = ansText;
                say(answer_box, targetLang);
            } else {
                // log("You made a mistake");
                say(grade, targetLang);
            }
        }
    } else {
        // Read the question aloud if no TTS is available
        // We know there is not TTS because there is no play button
        if (isHideText(sourceLang)) {
            hideTextElements([question_hint]);
        }
        if (isSayText(sourceLang)) {
            say(question_hint, sourceLang); // No lang
        }
    }

}

/* Select the correct image */
function challengeSelect(challenge) {
    // log("challengeSelect");
    if (/answer/.test(activeClass)) {
        revealElements();
    } else {
        // log("challengeSelect question");
        if (isHidePics()) {
            const choices = Array.prototype.slice.call(getCardChoices());
            const images = choices.map(choice => choice.nextElementSibling);
            hidePicElements(images);
        }
        const textCell = getChallengeHeader();
        if (isHideText(sourceLang)) {
            hideTextElements([textCell]);
        }
        if (isSayText(sourceLang)) {
            say(textCell, sourceLang);
        }

    }
}

/* Type the word corresponding to the images */
function challengeName(challenge) {
    // log("challengeName");
    if (/answer/.test(activeClass)) {
        revealElements();
    } else {
        const textCell = getChallengeHeader();
        if (isHidePics()) {
            var pic_to_hide = getInputBox().parentN(2).firstChild;
            hidePicElements([pic_to_hide]);
        }
        if (isHideText(sourceLang)) {
            hideTextElements([textCell]);
        }
        if (isSayText(sourceLang)) {
            say(textCell, sourceLang);
        }
    }
}

/*
 * Choose the missing word in the sentence.
 */
function challengeForm(challenge) {
    // log("challengeForm");
    if (/answer/.test(activeClass)) {
        if (isSayText(targetLang)) {
            var grade = null;
            if (/answer-correct/.test(activeClass)) { // Answer is right
                // log("challengeForm correct");
                grade = getChoosenAnser();
            } else {
                // log("challengeJudge incorrect");
                grade = getFirstAnswerInFooter();
            }
            var ansText = grade.innerText;
            var parent_span = getFormPrompt().firstChild;
            parent_span.childNodes.forEach(node => { if (node.className != "") { node.innerHTML = ansText } });
            say(parent_span, targetLang);
        }
        if (isSayText(sourceLang)) {
            if (!isSayText(targetLang)) {
                sayAnswersInFooter();
            } else {
                say(getLastAnswerInFooter());
            }
        }
    } else {
        // log("Challenge Form: nothing to read here");
    }
}

function challengeListen(challenge) {
    // log("challengeListen");
    var input_box = challenge.getElementsByTagName("textarea")[0];
    if (/answer/.test(activeClass)) {
        // log("Check if a translation is available");
        if (/correct/.test(activeClass)) {
            say(input_box);
        }
        sayAnswersInFooter();
    } else {
        if (isCheckSpell()) {
            input_box.setAttribute("spellcheck", "true");
            input_box.setAttribute("lang", targetLang);
        }
    }
}

// Use TTS for answer in footer
function sayAnswersInFooter(where = null, lang = sourceLang) {
    const first = lang == targetLang;
    const log_translation = first ? getLastAnswerInFooter() : getFirstAnswerInFooter();
    const say_translation = first ? getFirstAnswerInFooter() : getLastAnswerInFooter();
    // log("sayAnswersInFooter " + first);
    if (log_translation != say_translation) {
        // log("Just log")
        say(log_translation);
    }

    if (where == null) {
        where = say_translation;
    }
    if (isSayText(lang) && say_translation != null) {
        say(say_translation, lang, where);
    }
}

function setUserConfig() {
    var autoplay = isSayText(targetLang);
    var microphone = isSpeaking();
    var speakers = isListening();
    duoState.user.enableMicrophone = microphone;
    duoState.user.enableSpeaker = speakers;

    // This was reverse engineered, might stop working any time
    url = "/2016-04-13/users/";
    fields = "?fields=%2Cautoplay%2CenableMicrophone%2CenableSpeaker";
    params = '{"":"","autoplay":' + autoplay + ',"enableMicrophone":'
            + microphone + ',"enableSpeaker":' + speakers + '}';

    http = new XMLHttpRequest();
    http.open("PATCH", url + duoState.user.id + fields, true);

    http.onreadystatechange = function() {// Call a function when the state
        // changes.
        if (http.readyState == 4 && http.status == 200) {
            console.info("Updated Setup " + params);
        }
    }

    // log("About to send config");
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
                'default' : 'ostts google yandex baidu'
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
        log("Version " + GM_info.script.version
                + " ready from " + duo_languages[sourceLang]
                + " to " + duo_languages[targetLang]);
    } catch (err) {
        log("Ready from " + duo_languages[sourceLang]
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
        return (GM_config.get('READ_TARGET') && isEnhancedTree());
    else
        return (GM_config.get('READ_SOURCE'));
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
    // log("Do we have an answer? " + challengeclass)
    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            // log("Changes in childlist ");
            // log(mutation.target);
            var answer = getAnswerFooter();
            if (answer != null) {
                // log("Yes! We have an answer");
                if(/answer/.test(challengeclass)) {
                    return challengeclass;
                }
                if (/blame-correct/.test(answer.getAttribute("data-test"))) {
                    return challengeclass + " answer answer-correct";
                }
                return challengeclass + " answer";
            }
        } else {
            // var target = mutation.target;
            // log("Changed no child class " + target.className);
        }
    }
    return challengeclass;
}

function addButton() {
    // log("addButton");
    var tree = getDuoTree();
    if (tree == null) {
        // log("Couldn't find a tree");
        return; // Nothing to do here
    }
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
        duoState = JSON.parse(localStorage.getItem('duo.state'));
        newSourceLang = duoState.user.fromLanguage;
        newTargetLang = duoState.user.learningLanguage;

        if (newSourceLang != sourceLang || newTargetLang != targetLang) {
            // log("Update duoState language change");
            targetLang = duoState.user.learningLanguage;
            sourceLang = duoState.user.fromLanguage;
            updateConfig(); // Make GM_Config point to this language setup
            setUserConfig();

            var tree = getDuoTree();
            var button = document.getElementById("reverse-tree-enhancer-button");
            if (window.location.pathname == "/learn")
                tree.removeChild(button);
        }

        // log("Update duoState new window");
        targetLang = duoState.user.learningLanguage;
        sourceLang = duoState.user.fromLanguage;

        if (!document.getElementById("reverse-tree-enhancer-button")) {
            addButton();
        }
    }

    var challenge = getChallenge();
    if (challenge != null) {
        newclass = challenge.getAttribute("data-test");
        newclass = isAnswer(mutations, newclass);
        // log("Challenge: " + newclass);

        if (newclass != activeClass) {
            // log("Old class: " + activeClass);
            activeClass = newclass;

            if (challenge == null) {
                return;
            }

            challenge.setAttribute("data-test", activeClass);

            if (/translate/.test(newclass)) {
                challengeTranslate(challenge);
            }
            else if (/speak/.test(newclass)) {
                challengeSpeak(challenge);
            }
            else if (/judge/.test(newclass)) {
                challengeJudge(challenge);
            }
            else if (/completeReverseTranslation/.test(newclass)) {
                challengeComplete(challenge);
            }
            else if (/selectTranscription/.test(newclass)) {
                log("selectTranscription");
            }
            else if (/select/.test(newclass)) {
                challengeSelect(challenge);
            }
            else if (/name/.test(newclass)) {
                challengeName(challenge);
            }
            else if (/form/.test(newclass)) {
                challengeForm(challenge);
            }
            else if (/listen/.test(newclass)) {
                challengeListen(challenge);
            }
        }
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
    // log("Not a tree");
}
