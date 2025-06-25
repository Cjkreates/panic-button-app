// Initialize EmailJS
(function () {
  emailjs.init("SlAP2_iUIVPEU5Jjr"); // Your actual EmailJS user ID
})();

// Form Submit Handler
document.getElementById("panicForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("senderName").value;
  const messageText = document.getElementById("customMsg").value;
  const contacts = document.getElementById("emails").value.split(",").map(e => e.trim());

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const mapLink = `https://maps.google.com/?q=${lat},${lon}`;
      const fullMessage = `🚨 PANIC ALERT from ${name}\n${messageText}\nLocation: ${mapLink}`;

      // Send email to each contact
      contacts.forEach(contactEmail => {
        emailjs.send("service_kzv0bup", "template_xyz123", {
          to_email: contactEmail,
          to_name: contactEmail,
          message: fullMessage,
        })
        .then(() => {
          console.log(`✅ Sent to ${contactEmail}`);
        })
        .catch(err => {
          console.error(`❌ Failed to send to ${contactEmail}`, err);
        });
      });

      alert("✅ Location sent to all emergency contacts!");

    }, () => {
      alert("❌ Location permission denied.");
    });
  } else {
    alert("❌ Geolocation not supported by your browser.");
  }
});

// Voice Activation Feature (say "help")
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;

recognition.onresult = function (event) {
  const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
  if (transcript.includes("help")) {
    document.getElementById("panicBtn").click(); // Trigger form submission
    recognition.stop();
  }
};

recognition.onerror = function (e) {
  console.error("Speech recognition error:", e);
};

recognition.start();
