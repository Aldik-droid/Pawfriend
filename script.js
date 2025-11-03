$(function() {
    $(window).on('load', function() {
        $('#loader').fadeOut(500, function(){
            $(this).remove();
        });
    });

    setTimeout(function(){
        $('#loader').fadeOut(500, function(){
            $(this).remove();
        });
    }, 2000);

    const hour = new Date().getHours();
    const greeting =
    hour < 12 ? "Good morning!" :
    hour < 18 ? "Good afternoon!" :
    "Good evening!";
    $("#greeting").text(greeting);
    
    const savedMode = localStorage.getItem('mode') || 'day';
    $("body").addClass(savedMode + "-mode");
    $("#modeBtn").text(savedMode === "day" ? "Switch to Night Mode" : "Switch to Day Mode");
    
    $("#modeBtn").on("click", function() {
        $("body").toggleClass("day-mode night-mode");
        const newMode = $("body").hasClass("night-mode") ? "night" : "day";
        localStorage.setItem("mode", newMode);
        $(this).text(newMode === "day" ? "Switch to Night Mode" : "Switch to Day Mode");
    });
    
    const pets = [
        { name: "Buddy", type: "Dog", desc: "Friendly and loyal.", img: "images/dog1.jpg" },
        { name: "Misty", type: "Cat", desc: "Loves to sleep all day.", img: "images/cat1.jpg" },
        { name: "Coco", type: "Parrot", desc: "Talkative and colorful.", img: "images/parrot1.jpg" },
        { name: "Nibbles", type: "Hamster", desc: "Cute and playful.", img: "images/hamster1.jpg" }
    ];
    
    pets.forEach((pet, index) => {
        const card = `
        <div class="col-md-3 col-sm-6">
            <div class="card p-3 text-center shadow-sm">
                <img src="${pet.img}" alt="${pet.type}">
                <h4>${pet.name}</h4>
                <p>${pet.desc}</p>
                <p id="extra${index}" class="hidden-text">More info about ${pet.name}!</p>
                <button class="btn btn-outline-primary readBtn" data-id="${index}">Read More</button>
                <div class="rating mt-2" data-id="${index}">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <button class="btn btn-success mt-2 adoptBtn">Adopt Me</button>
            </div>
        </div>`;
        $("#petList").append(card);
    });
    
    $(document).on("click", ".readBtn", function() {
        const id = $(this).data("id");
        const $extra = $("#extra" + id);
        $extra.toggleClass("hidden-text");
        $(this).text($extra.hasClass("hidden-text") ? "Read More" : "Hide");
    });
    
    $(document).on("click", ".rating span", function() {
        const $star = $(this);
        const $rating = $star.parent();
        const index = $rating.find("span").index($star);
        $rating.find("span").removeClass("active");
        $rating.find("span:lt(" + (index + 1) + ")").addClass("active");
    });
    
    $('.adoptBtn').on("click", function() {
        const audio = new Audio('sounds/cat-meow.mp3');
        audio.play();

        $('#adoptMsg').fadeIn(300).delay(1500).fadeOut(500);
    });
    
    $("#showTimeBtn").on("click", function() {
        $("#timeDisplay").text(new Date().toLocaleTimeString());
    });
    
    (() => {
        'use strict';
        
        const forms = document.querySelectorAll('.needs-validation');
        
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                event.preventDefault();
                event.stopPropagation();

                if(!form.checkValidity()) {
                    form.classList.add('was-validated');
                    return;
                }
                
                $('#formMsg').text('Message sent successfully!');
                
                form.reset();
                form.classList.remove('was-validated');
            }, false);
        });
    })();
    
    $('#searchInput').on('input', function () {
        const query = $(this).val().toLowerCase();
        
        $('#petList .card').each(function () {
            const $card = $(this);
            const nameEl = $card.find('h4');
            const descEl = $card.find('p').first();
            
            nameEl.html(nameEl.text());
            descEl.html(descEl.text());
            
            if (query) {
                const nameText = nameEl.text();
                const descText = descEl.text();
                
                const highlightedName = nameText.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
                const highlightedDesc = descText.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
                
                nameEl.html(highlightedName);
                descEl.html(highlightedDesc);
            }
            
            const match = $card.text().toLowerCase().includes(query);
            $card.toggle(match);
        });
    });
    
    $('#copyBtn').on('click', function() {
        const pageUrl = window.location.href;
        navigator.clipboard.writeText(pageUrl).then(() => {
            $('#copyMsg').text('Page URL copied');
            setTimeout(() => $('#copyMsg').text(''), 2000);
        })
        .catch(() => {
            $('#copyMsg').text('Copy failed');
        });
    });
});