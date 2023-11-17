$("#hb0").on("click",function(e){
    let html = `
        <div class="card">
            <div class="upr">
                <p class="default-text">UPR_FIG</p>
            </div>
            <div class="label">
                <p class="expand">▲</p>
                <p class="default-text">No_title</p>
                <p class="counter">(1items)</p>

                </div>
            <div class="lwr">
                <p class="default-text">None</p>
            </div>
            <div class="add-item">
                <p class="default-text">＋</p>
            </div>
        </div>
    `
    $(".main-area").append(html)
});


// !label 
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
        console.log("b",text_inner,text_inner.length,ref_text,ref_text.length);
        
        if(text_inner.length >= 1){$(active_edit_el).children(".default-text").text(text_inner)}
        if(ref_text.length >=1){
            console.log("passs",$(active_edit_el).children());
            $(active_edit_el).children(".reflink").remove()
            $(active_edit_el).children(".option-list").remove()
            let html = `
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
            if($(active_edit_el).attr("class")=="lwr"){
                $(active_edit_el).append(html)
            }   
            console.log("sssssssssss",active_edit_el);
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


// !viewer
$(document).on("click", ".option.ex",function(e){
    let ref_url = $(this).prev().children("a").attr("href")
    console.log($(this),ref_url);
    $(".viewer").attr("src",ref_url)
    // $(".viewer").attr("title","reference view")

    // $(".viewer").addClass("active")
    $(".viewer, .viewer-close, .width-bar").fadeIn(600)

});

$(document).on("click", ".viewer-close",function(e){
    console.log($(close),this);
    $(".viewer").attr("src","")
    // $(".viewer").attr("title","reference view")

    // $(".viewer").addClass("active")
    $(".viewer, .viewer-close , .width-bar").fadeOut(600)
    $(".viewer").attr("src","")

});

$(".width-bar").change(function(){
    let ratio = $(".width-bar").val()
    let current_width = $(".width-bar").css("width")
    console.log("ratio:current_width:",ratio, current_width);
    console.log("calc width:",`calc(${ratio} * ${current_width})`);
    $(".viewer").css("width",`calc(${ratio} * ${current_width})`) 
    // $(".viewer").css()
});


$(document).on("click",".option", function(e){
    e.stopImmediatePropagation()
    console.log("ssssss",e);
    $(".option-list").hasClass("active")
    $(".option-list").removeClass("active")

});

$(document).on("click",".add-item", function(e){
    let targets = $(this).parent().prevAll(".lwr")
    $(targets).css("display","flex")
    let targetdiv = $(e.target).parent()
    addItem($(targetdiv))
});

$(document).on("click",".expand", function(e){
    console.log($(this).parent().nextAll(".lwr"));
    let targets = $(this).parent().nextAll(".lwr")
    $(targets).slideToggle(100)
    if($(this).text()=="▲"){
        $(this).text("▼")
    }else{
        $(this).text("▲")
    }    
});


// *function
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
    updateCounter(parent,".lwr",counter)

    console.log("added_item: ",item," | target: ",target_div);
}

function removeItem(target_div){
    let item = $(target_div).parent();
    $(item).remove(target_div)
    console.log("deleted_item: ",target_div);

};

function updateCounter(parent, selector,counter="", ){
    let count = $(parent).children(selector).length;
    console.log(count);
    if(count > 0 ){
        console.log($(counter).text());
        $(counter).text(`(${count}items)`)
    }else{
        return count
    }
}