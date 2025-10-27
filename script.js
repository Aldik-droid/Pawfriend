(function(){
    const greeting = document.getElementById("greeting");
    const hour = new Date().getHours();
    let greetMessage = "";
    switch (true) {
        case hour < 12: greetMessage = "Good morning!"; break;
        case hour < 18: greetMessage = "Good afternoon!"; break;
        default: greetMessage = "Good evening!";
    }
    if (greeting) greeting.textContent = greetMessage;
    
    const modeBtn = document.getElementById("modeBtn");
    const body = document.body;
    if (!body.classList.contains("day-mode") && !body.classList.contains("night-mode")) body.classList.add("day-mode"); modeBtn && modeBtn.addEventListener("click", function(){
        body.classList.toggle("day-mode");
        body.classList.toggle("night-mode");
        modeBtn.textContent = body.classList.contains("night-mode") ? "Switch to Day Mode" : "Switch to Night Mode";
    });
    
    const pets = [
        { 
            name: "Buddy", 
            type: "Dog", 
            desc: "Friendly and loyal.", 
            extra: "Buddy is a 2-year-old Labrador who loves running and playing fetch.",
            img: "images/dog1.jpg",
            rating: 0
        },
        
        { 
            name: "Misty", 
            type: "Cat", 
            desc: "Loves to sleep all day.", 
            extra: "Misty is a calm and affectionate cat who enjoys warm sunlight and soft cushions.",
            img: "images/cat1.jpg",
            rating: 0
            },
            
            { 
            name: "Coco", 
            type: "Parrot", 
            desc: "Talkative and colorful.", 
            extra: "Coco can repeat short phrases and loves to be around people.",
            img: "images/parrot1.jpg",
            rating: 0
        },
        
        { 
            name: "Nibbles", 
            type: "Hamster",
            desc: "Cute and playful.", 
            extra: "Nibbles is very active and enjoys running on his wheel at night.",
            img: "images/hamster1.jpg",
            rating: 0
        }
    ];
    
    const petList = $("#petList");
    
    function renderPetCards() {
        petList.empty();
        pets.forEach((pet, index) => {
            const card = `
                <div class="col-md-3">
                <div class="card p-3 text-center shadow-sm">
                <img src="${pet.img}" class="img-fluid mb-2" alt="${pet.name}">
                <h4 class="pet-name">${pet.name}</h4>
                <p class="pet-type">${pet.type}</p>
                <p class="pet-desc">${pet.desc}</p>
                <p class="hidden-text" id="extra${index}">${pet.extra}</p>
                <button class="btn btn-outline-primary readBtn" data-id="${index}">Read More</button>
                <div class="rating mt-2" data-id="${index}">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <button class="btn btn-success mt-2 adoptBtn">Adopt Me</button>
                </div>
                </div>
                `;
                petList.append(card);
            });
        }
        renderPetCards();
    

    $(document).on('click', '.readBtn', function(){
        var $btn = $(this);
        var id = $btn.data('id');
        var $extra = $('#extra' + id);
        $extra.toggleClass('hidden-text');
        if ($extra.hasClass('hidden-text')) {
            $btn.text('Read More');
        } else {
            $btn.text('Hide');
        }
    });
    
    document.getElementById("showTimeBtn").addEventListener("click", () => {
        document.getElementById("timeDisplay").textContent = new Date().toLocaleTimeString();
    });
    
    document.getElementById("contactForm").addEventListener("submit", e => {
        e.preventDefault();
        document.getElementById("formMsg").textContent = "Message sent successfully!";
        e.target.reset();
    });
    
    window.__PAWFRIEND = { pets: pets, attachCardEvents: attachCardEvents, renderPetCards: renderPetCards };
})();

$(function(){
    var pets = window.__PAWFRIEND.pets;
    
    function lazyLoadImages() {
        $('.lazy-img').each(function(){
            var $img = $(this);
            if ($img.attr('src')) return;
            var winTop = $(window).scrollTop();
            var winBottom = winTop + $(window).height();
            var imgTop = $img.offset().top;
            if (imgTop < winBottom + 200) {
                $img.attr('src', $img.data('src')).on('load', function(){ $img.addClass('loaded'); });
            }
        });
    }
    lazyLoadImages();
    $(window).on('scroll resize', lazyLoadImages);
    
    function highlightText($el, query){
        var text = $el.text();
        if(!query) { $el.html(text); return; }
        var re = new RegExp('('+escapeRegExp(query)+')', 'gi');
        $el.html(text.replace(re, '<mark>$1</mark>'));
    }
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function refreshCards(filter){
        filter = (filter||'').trim().toLowerCase();
        $('#petList .col-md-3').each(function(){
            var $col = $(this);
            var name = $col.find('.pet-name').text().toLowerCase();
            var type = $col.find('.pet-type').text().toLowerCase();
            if (!filter || name.indexOf(filter) !== -1 || type.indexOf(filter) !== -1) {
                $col.show();
                highlightText($col.find('.pet-name'), filter);
                highlightText($col.find('.pet-type'), filter);
                highlightText($col.find('.pet-desc'), filter);
            }
            else {
                $col.hide();
            }
        });
    }
    
    var namesList = pets.map(p => p.name);
    
    $('#searchInput').on('input', function(){
        var q = $(this).val();
        refreshCards(q);
        if (!q) { $('#suggestions').hide().empty(); return; }
        var suggestions = namesList.filter(n => n.toLowerCase().indexOf(q.toLowerCase()) !== -1);
        var $s = $('#suggestions').empty();
        suggestions.slice(0,5).forEach(function(s){
            $s.append('<a class="list-group-item list-group-item-action">'+s+'</a>');
        });
        $s.toggle(suggestions.length>0);
    });
    
    $('#suggestions').on('click', 'a', function(){
        var val = $(this).text();
        $('#searchInput').val(val);
        $('#suggestions').hide().empty();
        refreshCards(val);
    });
    
    $('#clearSearch').on('click', function(){
        $('#searchInput').val('');
        refreshCards('');
        $('#suggestions').hide().empty();
    });
    
    $(window).on('scroll resize', function(){
        var docH = $(document).height() - $(window).height();
        var sc = $(window).scrollTop();
        var pct = docH>0 ? Math.round((sc/docH)*100) : 0;
        $('#progressBar').css('width', pct + '%');
    });
    
    function animateCounter($el, target){
        $({count: 0}).animate({count: target}, {
            duration: 1500,
            easing: 'swing',
            step: function(now){
                $el.text(Math.floor(now));
            },
            complete: function(){ $el.text(target); }
        });
    }
    
    var $happy = $('#happyCounter');
    var target = parseInt($happy.data('target')) || 500;
    animateCounter($happy, target);
    
    $('#contactForm').on('submit', function(e){
        e.preventDefault();
        $('#spinnerOverlay').show();
        setTimeout(function(){
            $('#spinnerOverlay').hide();
            $('#formMsg').text('Message sent successfully!');
            showNotify('Message sent successfully!');
            $('#contactForm')[0].reset();
        }, 900);
    });
    
    function showNotify(text){
        var $n = $('#notify');
        $n.stop(true).text(text).fadeIn(200).delay(1800).fadeOut(600);
    }
    
    $('#copyBtn').on('click', function(){
        var txt = $('#siteUrl').text();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(txt).then(function(){ showNotify('Link copied to clipboard!'); }, function(){ fallbackCopy(txt); });
        } else fallbackCopy(txt);
    });
    
    function fallbackCopy(text){
        var $ta = $('<textarea>').val(text).appendTo('body').select();
        try { document.execCommand('copy'); showNotify('Link copied to clipboard!'); } catch(e){ showNotify('Copy failed'); }
        $ta.remove();
    }
    
    lazyLoadImages();
    
    window.__PAWFRIEND.attachCardEvents();
});