    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
    import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved }
        from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
    // Your web app's Firebase configuration
    import {firebaseConfig} from "../setting/firebase_api.js"
    // Initialize Firebase
    let app = initializeApp(firebaseConfig);
    let db = getDatabase(app); //RealtimeDBに接続
    // const dbRef = ref(db, "memolink_"); //RealtimeDB内の"chat"を使う
    let fbsrc = prompt("Please type document name","")
    if(fbsrc===null){location.reload()}
    if(fbsrc==""){fbsrc="Trial_this can be refleshed by someone"}
    $("#dbname").text(`DBName: "${fbsrc}"`)
    let dbRef = ref(db, "memolink_"+String(fbsrc))
    console.log("end",fbsrc)
$(".title").on("dblclick",function(e){
    if(this == e.target){
        ApplyTimeZoneColor(0)
    }    
})

// ****************************************
// *      ADD_NEW_CARD  : click "+"
// ****************************************
let id_card = 0

$("#hb0").on("click",function(e){
    console.log(id_card)
    let num_of_card =$(".card").length
    let mode = "ADD_NEW_CARD"
    let info = num_of_card+1
    let send_object = {
        // room:"",
        // postby:"",
        addmode:mode,
        addinfo:info,
        // comment:""
        }
    fbDataSend(mode,send_object)
    id_card ++

});

// ****************************************
// *Edit_CARD_CONTENT  : double click on "p"
// ****************************************
let active_edit_el = "";
$(document).on("dblclick",".label>p.default-text, .lwr>p",function(e){
    if(e.target == this && active_edit_el == ""){
        active_edit_el = $(this).parent();
        let initial_text = $(this).text()
        if (initial_text =="No_title"){initial_text=""}

        if($(this).parent().attr("class") == "label"){
            let html = `
                <textarea class="text_tmp" placeholder="set text" cols="30" rows="1">${initial_text}</textarea>
                <span class="help" id ="text1_1_help">→Enter the title of topic</span>

                `
            //thisをセレクタにしないと他のtextも反応してしまう
            let add_el = $(html).appendTo($(this).parent())
            $(add_el).css("top","30%");
            $(add_el).focus();

        }else if($(this).parent().attr("class") == "lwr"){
            let initial_text1 = $(this).text()
            let initial_text2 = $(this).parent().find("a").attr("href")
            if(initial_text2==undefined){initial_text2=""}
            console.log("check",initial_text1,initial_text2,$(this).find(".option"));
            console.log("check",$(this).parent(),$(this).parent().find(".option"));
            if (initial_text1 =="None"){initial_text1=""}
            if (initial_text2 =="None"){initial_text2=""}

            let html_1 = `
                <textarea class="text_tmp_1" placeholder="set Comment" cols="30" rows="4">${initial_text1}</textarea>
                <span class="help" id ="text2_1_help">→Enter comment</span>
            `
            let html_2 = `
                <textarea class="text_tmp_2" placeholder="set ref URL" cols="30" rows="2">${initial_text2}</textarea>
                <span class="help" id ="text2_2_help">→drag&drop OK</span>

                `

            //thisをセレクタにしないと他のtextも反応してしまう
            let add_el_1 = $(html_1).appendTo($(this).parent())
            let add_el_2 = $(html_2).appendTo($(this).parent())
            // cancelation of layout overlapping
            let id = $(active_edit_el).attr("id").split("_")[2]
            let shift= 0
            if(id>2){shift=-110}else{shift=0}

            $(add_el_1).css("display","block")
            $(add_el_1).css("top",`${shift}px`)
            $(add_el_2).css("display","block")
            $(add_el_2).css("top",`${shift+110}px`)
            $(add_el_1).focus();

        }else{
            let add_el = "";
        };
    }    
});

// ****************************************
// *REFRECT_CARD_CONTENT  : click out of ".card"
// ****************************************
$("*").not(active_edit_el).on("click",function(e){
    console.log("text_edit_active: ddddd",active_edit_el);
    if(e.target == this && active_edit_el != ""){
        // get textarea length = 0 or 1
        let cardTitle = $(active_edit_el).find("textarea.text_tmp")
        let Item = $(active_edit_el).parent().find("textarea.text_tmp_1")
        let refUrl = $(active_edit_el).parent().find("textarea.text_tmp_2")
        
        if(cardTitle.length >= 1){       
            // * label text update
            let text_inner = $(cardTitle).val()
            if (text_inner == ""){text_inner="No_title"}

            let mode = "UPDATE_CARD_ITEM_LABEL"
            if($(active_edit_el).attr("class")=="label"){
                let id_card = $(active_edit_el).attr("id").split("_")[1]
                let info = [id_card,text_inner]
                let send_object = {
                    addmode:mode,
                    addinfo:info,
                    // comment:""
                    }
                fbDataSend(mode,send_object)
            }
        }
        if(Item.length >=1 || refUrl.length >=1){
            // * lwr text+link update
            let text_inner = $(Item).val()
            if (text_inner == ""){text_inner="None"}
            let ref_text = $(refUrl).val()
            if (ref_text === undefined){ref_text=""}

            let mode = "UPDATE_CARD_ITEM_DETAILS"
            $(active_edit_el).children(".reflink").remove()
            $(active_edit_el).children(".option-list").remove()
            $(active_edit_el).find(".help").remove()

            let id_item = $(active_edit_el).children("p").attr("id").split("_")
            let info = [id_item,text_inner,ref_text] 
            let send_object = {
                // room:"",
                // postby:"",
                addmode:mode,
                addinfo:info,
                // comment:""
                }
            fbDataSend(mode,send_object)
        
        }else{
            $(active_edit_el).children(".reflink").remove()
            $(active_edit_el).children(".option-list").remove()
            $(active_edit_el).find(".help").remove()

        };
        $(cardTitle).remove();
        $(Item).remove()
        $(refUrl).remove()
        active_edit_el="";
    }    
});


// ****************************************
// *LINK OPTION OPEN : click "LINK"
// ****************************************
let active_option_el = "";
let option_click_stat = false
$(document).on("click",".reflink", function(e){
    // ! stop default action
    let optiondiv = $(this).next()
    if($(optiondiv).hasClass("active")==true){
        $(optiondiv).removeClass("active")
    }else{
        $(optiondiv).addClass("active")
    }

    if(option_click_stat == false){
        option_click_stat = !option_click_stat
    }
    active_option_el = $(this).next()
    console.log(active_option_el);

});

// ****************************************
// *Clear all : click*2 
// ****************************************
$("#hb3").on("dblclick",function(e){
    if(this == e.target){
        const answer = confirm("Are you sure to clear all?")
        if(answer){
            remove(dbRef)
            location.href = "../index.html";
        }
        else{
            alert("Canceled")
        }
    }
})

// ****************************************
// *OPEN IFRAME viewer  : click 
// ****************************************
$(document).on("click", ".option.ex",function(e){
    let ref_url = $(this).prev().children("a").attr("href")
    console.log($(this),ref_url);
    $(".viewer").attr("src",iframeUrlConvert(ref_url))
    // $(".viewer").attr("title","reference view")
    // $(".viewer").addClass("active")
    $(".viewer, .viewer-close, .width-bar").fadeIn(600)
});

// ****************************************
// *CLOSE IFRAME viewer  : click X
// ****************************************
$(document).on("click", ".viewer-close",function(e){
    console.log($(close),this);
    $(".viewer").attr("src","")
    $(".viewer, .viewer-close , .width-bar").fadeOut(600)
    $(".viewer").attr("src","")
});

// ****************************************
// *DYNAMIC WIDTH CHANGE of IFRAME : slidebar
// ****************************************
$(".width-bar").change(function(){
    let ratio = $(".width-bar").val()
    let current_width = $(".width-bar").css("width")
    $(".viewer").css("width",`calc(${ratio} * ${current_width})`) 
});


// ****************************************
// *LINK OPTION CLOSE : click any option
// ****************************************
$(document).on("click",".option", function(e){
    e.stopImmediatePropagation()
    $(".option-list").hasClass("active")
    $(".option-list").removeClass("active")
});

// ****************************************
// *ADD_CARD_ITEM : click "+New CARD"
// ****************************************
$(document).on("click",".add-item", function(e){
    let thisCard = $(e.target).parent().parent()
    let counter = $(thisCard).find(".counter")
    let id_card = $(thisCard).attr("id").split("_")[1]
    let id_item = String(updateCounter(thisCard,".lwr"))
    let targets = $(this).parent().prevAll(".lwr")
    $(targets).css("display","flex")
    let targetdiv = $(e.target).parent()

    let mode = "ADD_NEW_ITEM"
    let info = [id_card,id_item]
    let send_object = {
        // room:"",
        // postby:"",
        addmode:mode,
        addinfo:info,
        // comment:""
        }

    toggleItemList(thisCard,"show")       
    fbDataSend(mode,send_object)

});

// ****************************************
// *Show/Hide_CARD : click "Show/Hide"
// ****************************************
$("#hb1").on("click",function(e){
    if(e.target ==this){
        ListUpCards()
        $("#cardlistview").toggle(300)
    };
});

$(document).on("click",".item_name",function(e){

    if($(e.target).attr("class") == "item_name"){
        let cardid = $(e.target).prev("p").text() 
        let targetcard = "#card_"+cardid

        $(window).scrollTop($(targetcard).offset().top-100)
    }
});
// ****************************************
// *Show Help comment : click "Help"
// ****************************************
$("#hb2").on("click",function(e){
    if(e.target ==this){
        let chk = ""
        for(let jqobj of $("span")){
            console.log("first",jqobj)
                chk = $(jqobj).attr("style")
                break
            }
            console.log(chk,chk=="")
        if(chk==undefined ||chk ==""){
            $("span.help").attr("style","display:flex")
        }else{
            $("span.help").attr("style","")
        }
    };

});

// ****************************************
// *OPEN/CLOSE EXPANDER: click "▲, ▼"
// ****************************************
$(document).on("click",".expand", function(e){
    ListUpCards()
    let thisCard = $(this).parent().parent()
    toggleItemList(thisCard)   
});

function toggleItemList(card,mode="toggle",cssDisplayTo="flex"){
    let targets = $(card).find(".lwr")
    let btn = $(card).find(".expand")[0]
    switch(mode) {
        //  ***********
        case "show" :
        //  ***********
        for (let target of targets) {
            if ($(target).attr("style","display")=="none") {
                $(target).attr("style","")
            }        
            $(btn).text("▶")
        }
        break;  

        // *********** 
        case "toggle" :
        // *********** 
        $(targets).slideToggle(100)
            if($(btn).text()=="▶"){
                $(btn).text("▼")
            }else{
                $(btn).text("▶")
            }
        break;  

    };

}

// ?****************************************
// ****************************************
// ! *function
// ****************************************
// ****************************************

function addItem(target_div){

    let html =`
        <div class="lwr">
            <p class="default-text">None</p>
        </div>
        ` 
    // $(target_div).prev("div").append(html)
    let item = $(html).insertBefore($(target_div))
    let parent = $(target_div).parent()
    let counter = $(parent).find(".counter")
    $(parent).find(".lwr").css("display","flex")
}

function removeItem(target_div){
    let item = $(target_div).parent();
    $(item).remove(target_div)
};

function updateCounter(parent, selector,counter="", ){
    let count = $(parent).children(selector).length;
    if(count > 0 && counter !=""){
        $(counter).text(`(${count}items)`)

    }else{
        return count
    }
}

function iframeUrlConvert(str){
// https://www.youtube.com/watch?v=*********
//  => https://www.youtube.com/embed/*********
    let str_separated = str.split("https://www.youtube.com/watch?v=")
    if (str_separated.length ==2){
        return `https://www.youtube.com/embed/${str_separated[1]}`
    }else{
        return str
    }
}

function ApplyTimeZoneColor(z_inp=""){
    let now =new Date()
    let hour = now.getHours()
    let zone = Math.floor(hour/6)
    if(z_inp=""){zone=z_inp}
    $("body").removeClass(`z0`)
    $("body").removeClass(`z1`)
    $("body").removeClass(`z2`)
    $("body").removeClass(`z3`)

    if (zone==0 || zone==3){
        $("body").addClass(`z${zone}`)
    }
}
function ListUpCards(){
    let cards = $(".card")
    $("#card_list").children("li").remove()
    // 配列風オブジェクトでFOREACHつかえないとき
    for (const cardPicked of cards) {
        const cardid = $(cardPicked).attr("id").split("_")[1]
        const cardname = $(cardPicked).find(".label>p").text()
        console.log(cardid,"||",cardname)
        const html =`
            <li class="cardinfo" id ="citem_${cardid}">
                <p class="item_jump"></p>
                <p class="item_id">${cardid}</p>
                <p class="item_name">${cardname}</p>
            </li>
        `
        $("#card_list").append(html)
    }

}
// !**************************************************
function fbDataSend(mode="",object={}){
    
    let today = new Date();

    if (mode == ""){return false};
    let send_object = {
        room:"",
        postby:"",
        timestamp:today,
        addmode:object.addmode,
        addinfo:object.addinfo,
        comment:""
    }
    //firebase におくる 
    const newPostRef = push(dbRef);
    set(newPostRef,send_object);
    return true 
}

onChildAdded(dbRef, function(data){
    // $(".help").attr("style","d")

    const mode = data.val().addmode;
    ApplyTimeZoneColor()
    switch(mode){
        // *****************
        case "ADD_NEW_CARD":
        // *****************
            var id_card = data.val().addinfo
            let html = `
                <div id = "card_${id_card}" class="card">
                    <span class="help" id ="card_${id_card}_help">→Click*2&nbsp;to&nbsp;edit</span>
                    <div class="upr">
                        <p class="default"></p>
                    </div>
                    <div id = "lavel_${id_card}" class="label">
                        <p class="expand">▶</p>
                        <p id = "lbltext_${id_card}" class="default-text">No_title</p>
                        <span class="help ed1" id ="title_${id_card}_help">*Editable</span>
                        <span class="help expand" id ="expand_${id_card}_help">↓Epand/Shrink&nbsp;the&nbsp;item&nbsp;list</span>
                        <p class="counter">(1items)</p>
                    </div>
                    <div class="lwr" id = "lwr_${id_card}_0">
                        <p id = "lwrtext_${id_card}_0" class="default-text">None</p>
                        <span class="help ed2" id ="item_${id_card}_0_help">*Editable</span>
                    </div>
                    <div class="add-item">
                        <p class="default-text">＋</p>
                        <span class="help add" id ="add_item_${id_card}_0_help">Add&nbsp;item→</span>
                    </div>
                </div>
            `
            let add = $(html).appendTo($(".main-area"))
            break;

        // ***************************
        case "UPDATE_CARD_ITEM_LABEL":
        // ***************************
            var id_card = data.val().addinfo[0]
            let text_inner = data.val().addinfo[1]
            $(`#lbltext_${id_card}`).text(text_inner)
            break;
            
        // ***************************
        case "UPDATE_CARD_ITEM_DETAILS":
        // ***************************
            var id_card = data.val().addinfo[0][1]
            var id_item = data.val().addinfo[0][2]
            let text_in = data.val().addinfo[1]
            let ref_text = data.val().addinfo[2]
            $(`#lwrtext_${id_card}_${id_item}`).text(text_in)

            // initialize \
            $(`#lwr_${id_card}_${id_item}`).children(".reflink").remove()
            $(`#lwr_${id_card}_${id_item}`).children(".option-list").remove()
            

            if(ref_text != ""){
                let html2 = `
                    <p class = "reflink" ">LINK</p>
                    <div class="option-list">
                        <p class="option-label">Open as</p>
                        <p class="option">
                            <a class = "ref_url" href="${ref_text}" target="_blank" rel="noopener noreferrer">New Tab</a>
                        </p>
                        <p class="option ex">preview in app</p>
                        <p class="option">✖ CLOSE</p>
                    </div>
                `;
                $(`#lwr_${id_card}_${id_item}`).append(html2)
            }
            break;

        // ***********************
        case "ADD_NEW_ITEM":
        // ***********************
        var id_card = data.val().addinfo[0]
        var id_item = data.val().addinfo[1]
        let html3 =`
        <div class="lwr" id = "lwr_${id_card}_${id_item}">
            <p id = "lwrtext_${id_card}_${id_item}" class="default-text">None</p>
            <span class="help ed2" id ="item_${id_card}_${id_item}_help">*Editable</span>
        </div>
        `
        $(`#card_${id_card}`).find(".add-item").before(html3) 
        // $(target_div).prev("div").append(html)
        let card=$(`#card_${id_card}`)
        toggleItemList(card,"show")
        // $(parent).find(".lwr").css("display","flex")
        let counter = $(`#card_${id_card}`).find(".counter")
        updateCounter(`#card_${id_card}`,".lwr",counter)

        break;

    }
 
})



