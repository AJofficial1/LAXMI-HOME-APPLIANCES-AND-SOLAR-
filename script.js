/* ================= MENU ================= */

function toggleMenu() {

    const menu = document.getElementById("navMenu");

    menu.classList.toggle("active");

}


/* Close menu after clicking link */

document.querySelectorAll("#navMenu a").forEach(link => {

    link.addEventListener("click", () => {

        document
            .getElementById("navMenu")
            .classList.remove("active");

    });

});


/* ================= YEAR ================= */

document.getElementById("year").textContent =
    new Date().getFullYear();


/* ================= LANGUAGE ================= */

const selector =
    document.getElementById("languageSelector");


function detectBrowserLanguage() {

    const language =
        navigator.language ||
        navigator.userLanguage ||
        "en";

    if (language.toLowerCase().startsWith("mr")) {
        return "mr";
    }

    if (language.toLowerCase().startsWith("hi")) {
        return "hi";
    }

    return "en";
}


function changeLanguage(language) {

    if (language === "auto") {
        language = detectBrowserLanguage();
    }

    document.querySelectorAll("[data-mr]").forEach(element => {

        const text =
            element.getAttribute("data-" + language);

        if (text) {
            element.textContent = text;
        }

    });

}


selector.addEventListener("change", function() {

    changeLanguage(this.value);

});


/* Automatically detect language */

changeLanguage("auto");


/* ================= BOOKING FORM ================= */

const bookingForm =
    document.getElementById("bookingForm");


bookingForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("customerName").value.trim();

    const phone =
        document.getElementById("customerPhone").value.trim();

    const service =
        document.getElementById("service").value;

    const address =
        document.getElementById("customerAddress").value.trim();

    const message =
        document.getElementById("customerMessage").value.trim();


    if (phone.length !== 10) {

        showToast(
            "कृपया योग्य 10 digit mobile number टाका."
        );

        return;

    }


    /*
       WhatsApp booking message.

       IMPORTANT:
       येथे 7020279531 च्या जागी
       तुमचा WhatsApp नंबर टाका.
    */

    const businessNumber =
        "917020279531";


    const whatsappMessage =

`🔔 NEW SERVICE BOOKING

👤 Customer: ${name}

📱 Mobile: ${phone}

🔧 Service: ${service}

📍 Address:
${address}

📝 Problem:
${message || "Not provided"}

🌐 Website Booking
Laxmi Home Appliances & Solar`;


    const whatsappURL =

        "https://wa.me/" +
        businessNumber +
        "?text=" +
        encodeURIComponent(whatsappMessage);


    /*
       Demo मध्ये WhatsApp उघडेल.
    */

    window.open(
        whatsappURL,
        "_blank"
    );


    showToast(
        "Booking message तयार झाला आहे!"
    );


    bookingForm.reset();

});


/* ================= TOAST ================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}


/* ================= GALLERY ================= */

document.querySelectorAll(".gallery-grid img")
.forEach(image => {

    image.addEventListener("click", function() {

        const overlay =
            document.createElement("div");

        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(0,0,0,.9)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "3000";
        overlay.style.padding = "20px";


        const fullImage =
            document.createElement("img");

        fullImage.src = this.src;

        fullImage.style.maxWidth = "95%";
        fullImage.style.maxHeight = "90%";
        fullImage.style.borderRadius = "15px";


        overlay.appendChild(fullImage);


        overlay.addEventListener("click", () => {

            overlay.remove();

        });


        document.body.appendChild(overlay);

    });

});


/* ================= SCROLL REVEAL ================= */

const cards =
    document.querySelectorAll(
        ".service-card, .quick-card, .booking-form"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                }

            });

        },
        {
            threshold: 0.15
        }
    );


cards.forEach(card => {

    card.style.opacity = "0";

    card.style.transform =
        "translateY(30px)";

    card.style.transition =
        "all .7s ease";

    observer.observe(card);

});