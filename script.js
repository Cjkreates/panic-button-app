// ✅ Initialize EmailJS
(function () {
  emailjs.init("SlAP2_iUIVPEU5Jjr");
})();

// ✅ Handle form submission
document.getElementById("panicForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("senderName").value;
  const messageText = document.getElementById("customMsg").value;
  const contacts = document.getElementById("emails").value.split(",").map(e => e.trim());
  const phoneInput = document.getElementById("phones").value;
  const phoneNumbers = phoneInput.split(",").map(p => p.trim());

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const mapLink = `https://maps.google.com/?q=${lat},${lon}`;
      const fullMessage = `🚨 PANIC ALERT from ${name}\n${messageText}\nLocation: ${mapLink}`;

      // ✅ Send Email to each contact
      contacts.forEach(contactEmail => {
        emailjs.send("service_kzv0bup", "template_xyz123", {
          to_email: contactEmail,
          to_name: contactEmail,
          message: fullMessage,
        })
        .then(() => {
          console.log(`✅ Email sent to ${contactEmail}`);
        })
        .catch(err => {
          console.error(`❌ Email failed to ${contactEmail}`, err);
        });
      });

      // ✅ Send SMS via backend
      fetch("http://localhost:5000/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          toNumbers: phoneNumbers,
          message: fullMessage
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("✅ SMS sent!");
        } else {
          console.error("❌ SMS failed:", data.error);
        }
      })
      .catch(err => {
        console.error("❌ Network/Server error:", err);
      });

      alert("🚀 Alert sent via Email and SMS!");

    }, () => {
      alert("❌ Location permission denied.");
    });
  } else {
    alert("❌ Geolocation not supported.");
  }
});

// ✅ Voice activation ("help")
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;

recognition.onresult = function (event) {
  const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
  if (transcript.includes("help")) {
    document.getElementById("panicBtn").click(); // Triggers form submission
    recognition.stop();
  }
};

recognition.onerror = function (e) {
  console.error("Speech recognition error:", e);
};

recognition.start();
