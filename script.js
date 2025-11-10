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
    
function filterPets(query) {
    localStorage.setItem('lastSearchQuery', query);

    $('#petList .card').each(function () {
        const card = $(this);
        const nameEl = card.find('h4');
        
        nameEl.html(nameEl.text());

        if (query) {
            const highlighted = nameEl.text().replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
            nameEl.html(highlighted);
            card.toggle(card.text().toLowerCase().includes(query));
        } else {
            card.show();
        }
    });
}

$('#searchInput').on('input', function () {
    const query = $(this).val().toLowerCase();
    filterPets(query);
});

const lastQuery = localStorage.getItem('lastSearchQuery');
if (lastQuery) {
    $('#searchInput').val(lastQuery);
    filterPets(lastQuery);
}
    
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
    
    function validatePassword(password) {
    const minLength = /.{8,}/;
    const upperCase = /[A-Z]/;
    const number = /[0-9]/;
    const symbol = /[^A-Za-z0-9]/;
    
    return minLength.test(password) && upperCase.test(password) && number.test(password) && symbol.test(password);
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function logOut() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    
    window.location.href = 'login.html'; 
}

function updateNavBar() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const navbar = $('.ms-auto');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    navbar.find('a[href="login.html"], a[href="signup.html"], a[href="profile.html"], a[id="navLogOutBtn"]').remove();

    if (isLoggedIn) {
        if (currentUser) {
            const profileLink = `<a href="profile.html" class="nav-link d-inline text-light fw-bold ms-2 me-1">${currentUser.name}'s Profile</a>`;
            const logOutButton = `<a href="#" id="navLogOutBtn" class="nav-link d-inline text-warning fw-bold">Log Out</a>`;

            navbar.find('#modeBtn').before(profileLink + logOutButton);
            
            $('#navLogOutBtn').on('click', function(e) {
                e.preventDefault();
                logOut();
            });
        }
    } else {
        const loginLink = `<a href="login.html" class="nav-link d-inline text-light">Log In</a>`;
        const signupLink = `<a href="signup.html" class="nav-link d-inline text-warning fw-bold">Sign Up</a>`;
            
        navbar.find('#modeBtn').before(loginLink + signupLink);
    }
}

$('#signupForm').on('submit', function(event) {
    const form = this;
    event.preventDefault();
    event.stopPropagation();
    
    const name = $('#regName').val();
    const email = $('#regEmail').val();
    const password = $('#regPassword').val();
    const signupMsg = $('#signupMsg');
    
    let isValid = true;
    
    form.classList.remove('was-validated');
    $('#regEmail').get(0).setCustomValidity('');
    $('#regPassword').get(0).setCustomValidity('');
    signupMsg.text('');
    
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        $('#regEmail').get(0).setCustomValidity('Email already registered.');
        $('#emailError').text('This email is already registered. Please log in.');
        isValid = false;
    } else {
        $('#regEmail').get(0).setCustomValidity('');
    }
    
    if (!validatePassword(password)) {
        $('#regPassword').get(0).setCustomValidity('Invalid password complexity.');
        $('#passwordError').text('Password must be 8+ chars, with 1 uppercase, 1 number, and 1 symbol.');
        isValid = false;
    } else {
        $('#regPassword').get(0).setCustomValidity('');
    }
    if (!form.checkValidity() || !isValid) {
        form.classList.add('was-validated');
        signupMsg.text('Please fix the errors above.').css('color', 'red');
        return;
    }
    
    const newUser = { name: name, email: email, password: password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    signupMsg.text('Registration successful! Redirecting to login... ').css('color', 'lightgreen');
    form.reset();
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
});

$('#loginForm').on('submit', function(event) {
    const form = this;
    event.preventDefault();
    event.stopPropagation();
    
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();
    const loginMsg = $('#loginMsg');
    
    loginMsg.text('');
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        loginMsg.text(`Welcome back, ${user.name}! Redirecting to profile... `).css('color', 'lightgreen');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
        
    } else {
        loginMsg.text('Invalid email or password.').css('color', 'red');
        form.classList.remove('was-validated');
        form.classList.add('was-validated');
    }
});

if (window.location.pathname.endsWith('profile.html')) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (isLoggedIn === 'true' && currentUser) {
        $('#profileName').text(currentUser.name);
        $('#profileEmail').text(currentUser.email);
        
        $('#logOutBtn').on('click', logOut);
        
    } else {
        window.location.href = 'login.html';
    }
}

updateNavBar();

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
                $('#formMsg').text('Message sent successfully! ').css('color', 'lightgreen');
                form.reset();
                form.classList.remove('was-validated');
            }, false);
        });
    })();

}); 

function fetchCatFact() {
    $.ajax({
        url: 'https://catfact.ninja/fact',
        method: 'GET',
        success: function(data) {
            $('#catFactText').text(`"${data.fact}"`);
        },
        error: function() {
            $('#catFactText').text('Oops! Could not load a fun fact right now. (API Error)');
        }
    });
}

if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    fetchCatFact();
}

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