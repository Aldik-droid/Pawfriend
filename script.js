$(function () {
    const pets = [
        { name: "Buddy", type: "Dog", desc: "Friendly and loyal.", img: "images/dog1.jpg" },
        { name: "Misty", type: "Cat", desc: "Loves to sleep all day.", img: "images/cat1.jpg" },
        { name: "Coco", type: "Parrot", desc: "Talkative and colorful.", img: "images/parrot1.jpg" },
        { name: "Nibbles", type: "Hamster", desc: "Cute and playful.", img: "images/hamster1.jpg" }
    ];
    
    const petList = $('#petList');
    pets.forEach((pet, i) => {
        const card = `
        <div class="col-md-3">
            <div class="card">
                <img src="${pet.img}" class="img-fluid rounded mb-2" alt="${pet.name}">
                <h4>${pet.name}</h4>
                <p>${pet.type}</p>
                <p>${pet.desc}</p>
                <button class="btn btn-outline-warning adoptBtn"
                data-bs-toggle="modal"
                data-bs-target="#adoptionModal"
                data-pet-name="${pet.name}">Adopt me</button>
            </div>
        </div>`;
        petList.append(card);
    });
    
    const adoptionModal = document.getElementById('adoptionModal');
    if (adoptionModal) {
        adoptionModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const petName = button.getAttribute('data-pet-name');
            
            const modalTitle = adoptionModal.querySelector('#petNameInModal');
            const petToAdoptField = adoptionModal.querySelector('#petToAdopt');
            
            modalTitle.textContent = petName;
            petToAdoptField.value = petName;
        });
    }
    
    $('#adoptionForm').on('submit', function(event) {
        const form = this;
        event.preventDefault();
        event.stopPropagation();
        
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        form.classList.remove('was-validated');
        
        $('#adoptionFormMsg').text(`Application for ${$('#petToAdopt').val()} received! We will be in touch soon. `).css('color', 'lightgreen');
        
        form.reset();

        setTimeout(() => {
            $('#adoptionModal').modal('hide');
            $('#adoptionFormMsg').empty();
        }, 4000);
    });
    
    $('#searchInput').on('input', function () {
        const query = $(this).val().toLowerCase();
        
        $('#petList .card').each(function () {
            const card = $(this);
            const nameEl = card.find('h4');
            nameEl.html(nameEl.text());
    
            if (query) {
                const highlighted = nameEl.text().replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
                nameEl.html(highlighted);
            }
            
            card.toggle(card.text().toLowerCase().includes(query));
        });
    });
    
    const modeBtn = $('#modeBtn');
    let mode = localStorage.getItem('mode') || 'day';
    if (mode === 'night') $('body').addClass('night-mode');
    modeBtn.text(mode === 'night' ? '🌜' : '🌞');
    
    modeBtn.on('click', function () {
        $('body').toggleClass('night-mode');
        mode = $('body').hasClass('night-mode') ? 'night' : 'day';
        localStorage.setItem('mode', mode);
        modeBtn.text(mode === 'night' ? '🌜' : '🌞');
    });
    
    (() => {
        'use strict';
        
        const forms = document.querySelectorAll('.needs-validation');
        
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                event.preventDefault();
                event.stopPropagation();
                if (!form.checkValidity()) {
                    form.classList.add('was-validated');
                    return;
                }
                $('#formMsg').text('Message sent successfully! ✅').css('color', 'lightgreen');
                form.reset();
                form.classList.remove('was-validated');
            }, false);
        });
    })();

});

// script.js: ДОБАВИТЬ ЭТОТ КОД В КОНЕЦ ФАЙЛА

// Donation Modal Logic
$('#donationAmount').on('change', function() {
    if ($(this).val() === 'custom') {
        $('#customAmountField').show();
        $('#customAmount').prop('required', true);
    } else {
        $('#customAmountField').hide();
        $('#customAmount').prop('required', false);
    }
});

$('#donationForm').on('submit', function(event) {
    const form = this;
    event.preventDefault();
    event.stopPropagation();
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    form.classList.remove('was-validated'); 
    
    let amount = $('#donationAmount').val();
    if (amount === 'custom') {
        amount = $('#customAmount').val();
    }
    
    $('#donationFormMsg').text(`Thank you for your generous ${amount}$ donation! We appreciate your support.`).css('color', 'lightgreen');
    
    form.reset();
    $('#customAmountField').hide();
    
    setTimeout(() => {
        $('#donationModal').modal('hide');
        $('#donationFormMsg').empty(); 
    }, 4000);
});