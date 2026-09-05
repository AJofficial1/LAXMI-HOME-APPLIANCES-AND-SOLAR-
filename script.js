/* ================= MENU ================= */

function toggleMenu() {
    const menu = document.getElementById("navMenu");
    menu.classList.toggle("active");
}

document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("navMenu").classList.remove("active");
    });
});

/* ================= YEAR ================= */
document.getElementById("year").textContent = new Date().getFullYear();


/* ================= LANGUAGE ================= */
const selector = document.getElementById("languageSelector");

function detectBrowserLanguage() {
    const language = navigator.language || navigator.userLanguage || "en";
    if (language.toLowerCase().startsWith("mr")) return "mr";
    if (language.toLowerCase().startsWith("hi")) return "hi";
    return "en";
}

function changeLanguage(language) {
    if (language === "auto") language = detectBrowserLanguage();
    document.querySelectorAll("[data-mr]").forEach(element => {
        const text = element.getAttribute("data-" + language);
        if (text) element.textContent = text;
    });
}

selector.addEventListener("change", function() {
    changeLanguage(this.value);
});

changeLanguage("auto");


/* ================= BOOKING FORM & UNIQUE ID ================= */

const bookingForm = document.getElementById("bookingForm");

// प्रत्येक नवीन बुकिंगसाठी रँडम किंवा सिक्वेन्सियल बुकिंग नंबर तयार करणे
function generateServiceNumber() {
    let randomNum = Math.floor(1000 + Math.random() * 9000); // ४ अंकी रँडम नंबर
    return "LSH-" + randomNum;
}

bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const service = document.getElementById("service").value;
    const address = document.getElementById("customerAddress").value.trim();
    const message = document.getElementById("customerMessage").value.trim();

    if (phone.length !== 10) {
        showToast("कृपया योग्य 10 digit mobile number टाका.");
        return;
    }

    // युनिक सर्विस नंबर तयार करणे
    const serviceId = generateServiceNumber();
    const businessNumber = "917020279531";

    const whatsappMessage = 
`🔔 NEW SERVICE BOOKING
🆔 Service ID: ${serviceId}

👤 Customer: ${name}
📱 Mobile: ${phone}
🔧 Service: ${service}

📍 Address:
${address}

📝 Problem:
${message || "Not provided"}

🌐 Website Booking
Laxmi Home Appliances & Solar`;

    const whatsappURL = "https://wa.me/" + businessNumber + "?text=" + encodeURIComponent(whatsappMessage);

    /* 
       ग्राहकाला वेबसाईटवरच थांबवून त्याला व्हॉट्सॲपवर पाठवण्यासाठी एक सुंदर पॉपअप किंवा लिंक तयार करणे.
    */
    showBookingSuccessModal(serviceId, whatsappURL);

    showToast("बुकिंग यशस्वी! कृपया WhatsApp वर क्लिक करा.");
    bookingForm.reset();
});


/* ================= SUCCESS MODAL & WHATSAPP BUTTON ================= */

function showBookingSuccessModal(serviceId, whatsappURL) {
    // जर आधीपासूनच मॉडल असेल तर काढून टाकणे
    let oldModal = document.getElementById("successModal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.id = "successModal";
    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.background = "rgba(0,0,0,0.8)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "4000";
    modal.style.padding = "20px";

    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; max-width: 400px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            <h2 style="color: #28a745; margin-bottom: 10px;">✅ यशस्वीरित्या सबमिट झाले!</h2>
            <p style="color: #555; font-size: 16px; margin-bottom: 15px;">तुमची सर्विस यशस्वीरित्या बुक झाली आहे.</p>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; color: #333;">
                Service ID: <span style="color: #007bff;">${serviceId}</span>
            </div>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">कृपया खालील बटणावर क्लिक करून दुकानदाराला WhatsApp वर बुकिंगची माहिती पाठवा.</p>
            <a href="${whatsappURL}" target="_blank" style="display: inline-block; background: #25D366; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; width: 100%; box-sizing: border-box; margin-bottom: 10px;">
                💬 WhatsApp वर पाठवा
            </a>
            <button id="closeModalBtn" style="background: #ddd; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold; color: #333;">
                बंद करा
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeModalBtn").addEventListener("click", () => {
        modal.remove();
    });
}


/* ================= TOAST ================= */

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}


/* ================= GALLERY ================= */

document.querySelectorAll(".gallery-grid img").forEach(image => {
    image.addEventListener("click", function() {
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(0,0,0,.9)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "3000";
        overlay.style.padding = "20px";

        const fullImage = document.createElement("img");
        fullImage.src = this.src;
        fullImage.style.maxWidth = "95%";
        fullImage.style.maxHeight = "90%";
        fullImage.style.borderRadius = "15px";

        overlay.appendChild(fullImage);
        overlay.addEventListener("click", () => overlay.remove());
        document.body.appendChild(overlay);
    });
});


/* ================= SCROLL REVEAL ================= */

const cards = document.querySelectorAll(".service-card, .quick-card, .booking-form");

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    },
    { threshold: 0.15 }
);

cards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all .7s ease";
    observer.observe(card);
});
