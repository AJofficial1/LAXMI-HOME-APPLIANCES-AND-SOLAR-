/* ================= MENU ================= */
function toggleMenu() {
    document.getElementById("navMenu").classList.toggle("active");
}
document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", () => document.getElementById("navMenu").classList.remove("active"));
});

document.getElementById("year").textContent = new Date().getFullYear();

/* ================= DARK MODE LOGIC ================= */
const darkModeBtn = document.getElementById("darkModeToggle");
const themeIcon = document.getElementById("themeIcon");
const htmlRoot = document.getElementById("htmlRoot");

darkModeBtn.addEventListener("click", () => {
    htmlRoot.classList.toggle("dark-mode");
    if(htmlRoot.classList.contains("dark-mode")) {
        themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
        themeIcon.classList.replace("fa-sun", "fa-moon");
    }
});

/* ================= LIVE SERVICE TRACKING ================= */
let savedBookings = JSON.parse(localStorage.getItem("laxmiBookings")) || {};

function trackService() {
    const id = document.getElementById("trackInput").value.trim().toUpperCase();
    const resultBox = document.getElementById("trackResult");
    if(!id) {
        resultBox.innerHTML = "<p style='color:red;'>कृपया योग्य Service ID टाका.</p>";
        return;
    }
    if(savedBookings[id]) {
        resultBox.innerHTML = `<div style="background:#e8f5e9; color:#2e7d32; padding:12px; border-radius:8px; margin-top:10px;">
            <strong>Status:</strong> ${savedBookings[id].status} <br>
            <strong>सेवा:</strong> ${savedBookings[id].service} <br>
            <strong>नाव:</strong> ${savedBookings[id].name}
        </div>`;
    } else {
        resultBox.innerHTML = `<div style="background:#ffebee; color:#c62828; padding:12px; border-radius:8px; margin-top:10px;">
            हा ID (<strong>${id}</strong>) आमच्या रेकॉर्डमध्ये प्रोसेसिंगमध्ये आहे. लवकरच टीम संपर्क करेल.
        </div>`;
    }
}

/* ================= TESTIMONIALS SLIDER ================= */
let slideIndex = 0;
const slides = document.querySelectorAll(".testimonial-slide");
const dots = document.querySelectorAll(".dot");

function showSlides(n) {
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));
    slideIndex = (n + slides.length) % slides.length;
    slides[slideIndex].classList.add("active");
    dots[slideIndex].classList.add("active");
}

function currentSlide(n) { showSlides(n); }
setInterval(() => { showSlides(slideIndex + 1); }, 4000);

/* ================= FREE AI CHATBOT LOGIC ================= */
function toggleChatbot() {
    document.getElementById("aiChatBox").classList.toggle("hidden");
}

function sendAiMessage() {
    const input = document.getElementById("aiUserInput");
    const text = input.value.trim();
    if(!text) return;

    const chatBody = document.getElementById("aiChatBody");
    chatBody.innerHTML += `<div class="ai-msg user">${text}</div>`;
    input.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        let reply = "धन्यवाद! अधिक माहितीसाठी तुम्ही आम्हाला थेट कॉल किंवा व्हॉट्सॲप करू शकता.";
        const lower = text.toLowerCase();
        if(lower.includes("gas") || lower.includes("गॅस")) {
            reply = "गॅस दुरुस्ती आणि गळती तपासणीसाठी आमचे तंत्रज्ञ तत्पर आहेत. तुम्ही फॉर्म भरून सर्व्हिस बुक करू शकता.";
        } else if(lower.includes("solar") || lower.includes("सोलार")) {
            reply = "सोलार इन्स्टॉलेशनच्या संपूर्ण माहितीसाठी संपर्क करा: 7020279531.";
        } else if(lower.includes("pata") || lower.includes("address") || lower.includes("पत्ता")) {
            reply = "आमचे दुकान: भावसार चौक, नांदेड - 431605 येथे आहे.";
        }
        chatBody.innerHTML += `<div class="ai-msg bot">${reply}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 700);
}

function handleChatKey(e) {
    if(e.key === "Enter") sendAiMessage();
}

/* ================= BOOKING & WHATSAPP ================= */
const bookingForm = document.getElementById("bookingForm");

function generateServiceNumber() {
    return "LSH-" + Math.floor(1000 + Math.random() * 9000);
}

bookingForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const phone = document.getElementById("customerPhone").value.trim();
    if (phone.length !== 10) {
        showToast("कृपया योग्य १० अंकी मोबाईल नंबर टाका.");
        return;
    }

    const serviceId = generateServiceNumber();
    const formData = new FormData(bookingForm);
    formData.append("Service_ID", serviceId);

    const name = document.getElementById("customerName").value.trim();
    const service = document.getElementById("service").value;
    const address = document.getElementById("customerAddress").value.trim();
    const message = document.getElementById("customerMessage").value.trim();

    savedBookings[serviceId] = { name, service, status: "Pending / Processing (प्रोसेसिंग सुरू आहे)" };
    localStorage.setItem("laxmiBookings", JSON.stringify(savedBookings));

    const businessNumber = "917020279531";
    const whatsappMessage = `🔔 NEW SERVICE BOOKING\n🆔 Service ID: ${serviceId}\n\n👤 Customer: ${name}\n📱 Mobile: ${phone}\n🔧 Service: ${service}\n\n📍 Address:\n${address}\n\n📝 Problem:\n${message || "Not provided"}`;
    const whatsappURL = "https://wa.me/" + businessNumber + "?text=" + encodeURIComponent(whatsappMessage);

    try {
        const response = await fetch(bookingForm.action, { method: bookingForm.method, body: formData, headers: {'Accept': 'json'} });
        if (response.ok) {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = whatsappURL;
            document.body.appendChild(iframe);

            showBookingSuccessModal(serviceId);
            bookingForm.reset();
        } else {
            showToast("काहीतरी चूक झाली, पुन्हा प्रयत्न करा.");
        }
    } catch (error) {
        showToast("इंटरनेट कनेक्शन तपासा.");
    }
});

function showBookingSuccessModal(serviceId) {
    let oldModal = document.getElementById("successModal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.id = "successModal";
    modal.style.cssText = "position:fixed; inset:0; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:4000; padding:20px;";
    modal.innerHTML = `
        <div style="background: white; padding: 35px 25px; border-radius: 20px; text-align: center; max-width: 420px; width: 100%; box-shadow: 0 15px 35px rgba(0,0,0,0.3);">
            <div style="font-size: 50px; color: #28a745; margin-bottom: 10px;">🎉</div>
            <h2 style="color: #28a745; font-size: 22px; font-weight: bold; margin-bottom: 10px;">Congratulations! Successfully booked your service.</h2>
            <p style="color: #555; font-size: 14px; margin-bottom: 15px;">तुमची सर्विस यशस्वीरित्या बुक झाली आहे. मेसेज थेट दुकानदाराच्या व्हॉट्सॲपवर पोहोचला आहे.</p>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 10px; margin-bottom: 20px; font-weight: bold; color: #333; border: 1px dashed #ddd;">
                Service ID: <span style="color: #ff7200;">${serviceId}</span>
            </div>
            <button id="closeModalBtn" style="background: #ff7200; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; width: 100%; font-weight: bold; color: white; font-size: 15px;">ठीक आहे (OK)</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("closeModalBtn").addEventListener("click", () => modal.remove());
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
}
