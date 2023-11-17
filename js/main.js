
console.log(window.dbRef)

// ****************************************
// *      ADD_NEW_CARD  : click "+"
// ****************************************
let id_card = 0
$("#hb0").on("click",function(e){

    let mode = "ADD_NEW_CARD"
    let info = id_card
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
$(document).on("dblclick",".label>p, .lwr>p",function(e){
    console.log("dbl:",this,e);
    if(e.target == this && active_edit_el == ""){
        active_edit_el = $(this).parent();
        let initial_text = $(this).text()
        console.log("object",initial_text);
        console.log("active",active_edit_el);

        if($(this).parent().attr("class") == "label"){
            let html = `
                <textarea class="text_tmp" placeholder="set text" cols="30" rows="1">${initial_text}</textarea>
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

            let html_1 = `
                <textarea class="text_tmp_1" placeholder="set Comment" cols="30" rows="4">${initial_text1}</textarea>
            `
            let html_2 = `
                <textarea class="text_tmp_2" placeholder="set ref URL" cols="30" rows="2">${initial_text2}</textarea>
            `

            //thisをセレクタにしないと他のtextも反応してしまう
            let add_el_1 = $(html_1).appendTo($(this).parent())
            let add_el_2 = $(html_2).appendTo($(this).parent())
            console.log(add_el_1);
            $(add_el_1).css("display","block")
            $(add_el_1).css("top","0px")
            $(add_el_2).css("display","block")
            $(add_el_2).css("top","110px")

            // $(add_el).css("top","50%");
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
    console.log("text_edit_active: ",active_edit_el);
    if(e.target == this && active_edit_el != ""){
        console.log("text_edit_add_jufge: ",e.target == this,active_edit_el != "");
        let textarea_tmp = $(active_edit_el).children("textarea")[0]
        let textarea_tmp_sub = $(active_edit_el).children("textarea")[1]

        let text_inner = $(textarea_tmp).val()
        if (text_inner == ""){text_inner="None"}
 
        let ref_text = $(textarea_tmp_sub).val()
        if (ref_text === undefined){ref_text=""}
        console.log("text",text_inner,text_inner.length,ref_text,ref_text.length);
        
        if(text_inner.length >= 1){   
            // * label text update
            let mode = "UPDATE_CARD_ITEM_LABEL"
            console.log("swss",$(active_edit_el))
            // let id_card = $(active_edit_el).children("p").attr("id").split("_")[1]
            if($(active_edit_el).attr("class")=="label"){
                let id_card = $(active_edit_el).attr("id").split("_")[1]
                let info = [id_card,text_inner]
                console.log("infooo",info)
                let send_object = {
                    addmode:mode,
                    addinfo:info,
                    // comment:""
                    }
                fbDataSend(mode,send_object)
            }
        }
        if(ref_text.length >=1){
            // * lwr text+link update
            let mode = "UPDATE_CARD_ITEM_DETAILS"

            console.log("passs",$(active_edit_el).children());
            $(active_edit_el).children(".reflink").remove()
            $(active_edit_el).children(".option-list").remove()
            let id_item = $(active_edit_el).children("p").attr("id").split("_")
            let info = [id_item,text_inner,ref_text] 
            console.log("id",  id_item)
            let send_object = {
                // room:"",
                // postby:"",
                addmode:mode,
                addinfo:info,
                // comment:""
                }
            fbDataSend(mode,send_object)
        
            // let html = `
            //     <p class = "reflink" ">LINK</p>
            //     <div class="option-list">
            //         <p class="option-label">Open as</p>
            //         <p class="option">
            //             <a class = "ref_url" href="${ref_text}" target="_blank" rel="noopener noreferrer">New Tab</a>
            //         </p>
            //         <p class="option ex">preview in app</p>
            //         <p class="option">✖ CLOSE</p>
            //     </div>
            // `;
            // if($(active_edit_el).attr("class")=="lwr"){
            //     $(active_edit_el).append(html)
            // }   
        }else{
            $(active_edit_el).children(".reflink").remove()
            $(active_edit_el).children(".option-list").remove()

        };
        $(textarea_tmp).remove();
        $(textarea_tmp_sub).remove()

        console.log("test",textarea_tmp,textarea_tmp_sub);
        active_edit_el="";
    }    
});


// ****************************************
// *LINK OPTION OPEN : click "LINK"
// ****************************************
let active_option_el = "";
let option_click_stat = false
$(document).on("click",".reflink", function(e){
    console.log("click_option_active: ",active_option_el);

    // ! stop default action
    // e.preventDefault()
    let optiondiv = $(this).next()
    console.log(optiondiv,$(optiondiv).attr("class"));
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
// *OPEN IFRAME viewer  : click 
// ****************************************
$(document).on("click", ".option.ex",function(e){
    let ref_url = $(this).prev().children("a").attr("href")
    console.log($(this),ref_url);
    $(".viewer").attr("src",ref_url)
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
    // $(".viewer").attr("title","reference view")
    // $(".viewer").addClass("active")
    $(".viewer, .viewer-close , .width-bar").fadeOut(600)
    $(".viewer").attr("src","")
});

// ****************************************
// *DYNAMIC WIDTH CHANGE of IFRAME : slidebar
// ****************************************
$(".width-bar").change(function(){
    let ratio = $(".width-bar").val()
    let current_width = $(".width-bar").css("width")
    console.log("ratio:current_width:",ratio, current_width);
    console.log("calc width:",`calc(${ratio} * ${current_width})`);
    $(".viewer").css("width",`calc(${ratio} * ${current_width})`) 
    // $(".viewer").css()
});


// ****************************************
// *LINK OPTION CLOSE : click any option
// ****************************************
$(document).on("click",".option", function(e){
    e.stopImmediatePropagation()
    console.log("ssssss",e);
    $(".option-list").hasClass("active")
    $(".option-list").removeClass("active")
});

// ****************************************
// *ADD_CARD_ITEM : click "+"
// ****************************************
$(document).on("click",".add-item", function(e){
    let parent2 = $(e.target).parent().parent()
    console.log("otyaa",parent2)
    let id_card = $(parent2).attr("id").split("_")[1]
    let id_item = String(updateCounter(parent2,".lwr"))
   
    console.log("+++",parent2,id_card,id_item)
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
    fbDataSend(mode,send_object)


    // let html =`
    //     <div class="lwr">
    //         <p class="default-text">None</p>
    //     </div>
    //     ` 
    // // $(target_div).prev("div").append(html)
    // let item = $(html).insertBefore($(target_div))
    // let parent = $(target_div).parent()
    // let counter = $(parent).find(".counter")
    $(parent).find(".lwr").css("display","flex")
    updateCounter(parent,".lwr",counter)

    console.log("added_item: ",item," | target: ",target_div);

});

// ****************************************
// *OPEN/CLOSE EXPANDER: click "▲, ▼"
// ****************************************
$(document).on("click",".expand", function(e){
    console.log($(this).parent().nextAll(".lwr"));
    let targets = $(this).parent().nextAll(".lwr")
    $(targets).slideToggle(100)
    if($(this).text()=="▶"){
        $(this).text("▼")
    }else{
        $(this).text("▶")
    }    
});


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

    console.log("added_item: ",item," | target: ",target_div);
}

function removeItem(target_div){
    let item = $(target_div).parent();
    $(item).remove(target_div)
    console.log("deleted_item: ",target_div);

};

function updateCounter(parent, selector,counter="", ){
    let count = $(parent).children(selector).length;
    console.log("counter_info",parent,selector,$(parent).children(selector),$(parent).children(selector).length);

    if(count > 0 && counter !=""){
        console.log($(counter).text());
        $(counter).text(`(${count}items)`)
    }else{
        return count
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
    const newPostRef = push(window.dbRef);
    set(newPostRef,send_object);
    return true 
};

onChildAdded(window.dbRef, function(data){
    const mode = data.val().addmode;
    console.log("dddd",data.val())
    switch(mode){
        // *****************
        case "ADD_NEW_CARD":
        // *****************
            var id_card = data.val().addinfo
            console.log(id_card,data.addinfo)
            let html = `
                <div id = "card_${id_card}" class="card">
                    <div class="upr">
                        <p class="default-text">UPR_FIG</p>
                    </div>
                    <div id = "lavel_${id_card}" class="label">
                        <p class="expand">▼</p>
                        <p id = "lbltext_${id_card}" class="default-text">No_title</p>
                        <p class="counter">(1items)</p>

                        </div>
                    <div class="lwr" id = "lwr_${id_card}_0">
                        <p id = "lwrtext_${id_card}_0" class="default-text">None</p>
                    </div>
                    <div class="add-item">
                        <p class="default-text">＋</p>
                    </div>
                </div>
            `
            $(".main-area").append(html)
        // ***************************
        case "UPDATE_CARD_ITEM_LABEL":
        // ***************************
            var id_card = data.val().addinfo[0]
            let text_inner = data.val().addinfo[1]
            console.log("eee", $(`#lbltext_${id_card}`))
            $(`#lbltext_${id_card}`).text(text_inner)
        
            
        // ***************************
        case "UPDATE_CARD_ITEM_DETAILS":
        // ***************************
        console.log("onchange",data.val().addinfo[1])
            var id_card = data.val().addinfo[0][1]
            var id_item = data.val().addinfo[0][2]
            let text_in = data.val().addinfo[1]
            let ref_text = data.val().addinfo[2]

            console.log("eee", $(`#lwrtext_${id_card}_${id_item}`))
            $(`#lwrtext_${id_card}_${id_item}`).text(text_in)

            // initialize \
            $(`#lwr_${id_card}_${id_item}`).children(".reflink").remove()
            $(`#lwr_${id_card}_${id_item}`).children(".option-list").remove()
            
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
            
        // ***********************
        case "ADD_NEW_ITEM":
        // ***********************
        var id_card = data.val().addinfo[0]
        var id_item = data.val().addinfo[1]
        let html3 =`
        <div class="lwr" id = "lwr_${id_card}_${id_item}">
            <p id = "lwrtext_${id_card}_${id_item}" class="default-text">None</p>
        </div>
        `
        $(`#card_${id_card}`).find(".add-item").before(html3) 
    // $(target_div).prev("div").append(html)
    $(parent).find(".lwr").css("display","flex")

        


    }
 
})


