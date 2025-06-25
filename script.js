(function() {
  emailjs.init("SlAP2_iUIVPEU5Jjr"); // Your EmailJS User ID
})();

document.getElementById("panicBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const message = `🚨 Emergency Alert!\nLive Location: https://maps.google.com/?q=${lat},${lon}`;

      emailjs.send("service_kzv0bup", "template_xyz123", {
        to_name: "Trusted Contact",
        message: message,
      })
      .then(() => {
        alert("✅ Location sent to your emergency contact!");
      }, (err) => {
        alert("❌ Failed to send location. Try again.");
        console.error("EmailJS error:", err);
      });

    }, error => {
      alert("❌ Location access denied or unavailable.");
    });
  } else {
    alert("❌ Geolocation not supported by your browser.");
  }
});
