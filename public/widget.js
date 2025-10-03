(function() {
  if (document.getElementById("chatwidgetia-container")) return;

  // Create container
  const container = document.createElement("div");
  container.id = "chatwidgetia-container";
  document.body.appendChild(container);

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.src = "https://chatwidgetia.netlify.app"; // Your deployed chat widget app
  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.width = "400px";
  iframe.style.height = "600px";
  iframe.style.border = "none";
  iframe.style.zIndex = "999999";
  iframe.style.borderRadius = "16px";
  iframe.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  
  container.appendChild(iframe);

  // Pass Business ID
  const scriptTag = document.currentScript;
  const businessId = scriptTag.getAttribute("data-business-id");

  if (businessId) {
    iframe.onload = () => {
      iframe.contentWindow.postMessage({ businessId }, "*");
    };
  }
})();
