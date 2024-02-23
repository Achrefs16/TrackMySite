const userRoute = "http://localhost:5001/user-data";
const ViewRoute = "http://localhost:5001/page-view";
const infoPageRoute = "http://localhost:5001/page-info";
const FormRoute = "http://localhost:5001/form-info";
const ViewProductRoute = "http://localhost:5001/view-product";
const AddtoCartRoute = "http://localhost:5001/add-cart";
const PurchaseRoute = "http://localhost:5001/purchase-info";
const fileDownloadRoute = "http://localhost:5001/download";
const VideoPlayRoute = "http://localhost:5001/video-play";
const visibilityRoute = "http://localhost:5001/visibility";
const clickEventRoute = "http://localhost:5001/click-event";
const clipboardCopyRoute = "http://localhost:5001/clipboard-copy";
const querySearchRoute = "http://localhost:5001/query-search";
const customEventRoute = "http://localhost:5001/custom-event";
async function sendToBackend(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Data sent successfully:", responseData);
  } catch (error) {
    console.error("Error sending data to the backend:", error);
  }
}

var maxScrollPercentage = 0;
var pageStartTime = new Date().getTime();

var appId;
function calculateTimeSpent() {
  var currentTime = new Date().getTime();
  var timeSpentInSeconds = (currentTime - pageStartTime) / 1000;
  return timeSpentInSeconds;
}
function generateUserId() {
  return "user_" + Math.random().toString(36).substr(2, 10);
}

// Function to generate a random session ID
function generateSessionId() {
  return "session_" + Math.random().toString(36).substr(2, 10);
}

// Function to get or generate a user ID
function getUserId() {
  var userId = localStorage.getItem("userId");
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem("userId", userId);
  }
  return userId;
}

// Function to get or generate a session ID
function getSessionId() {
  var sessionId = sessionStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

// Function to get browser information
function getBrowserInfo() {
  var ua = navigator.userAgent,
    tem,
    M =
      ua.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];

  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return "IE " + (tem[1] || "");
  }

  if (M[1] === "Chrome") {
    tem = ua.match(/\bOPR\/(\d+)/);
    if (tem != null) return "Opera " + tem[1];
  }

  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);

  return {
    browser: M[0],
    version: M[1],
  };
}

// Function to get device information
function getDeviceInfo() {
  let device;
  let userAgent = navigator.userAgent.toLowerCase();
  if (/android/i.test(userAgent)) {
    device = "Mobile";
  } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
    device = "Tablet";
  } else {
    device = "PC";
  }
  let deviceInfo = {
    os: getOS(userAgent),
    device: device, // New: Get the OS information
  };

  return deviceInfo;
}

function getOS(userAgent) {
  if (/android/i.test(userAgent)) {
    return "Android";
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "iOS";
  } else if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  } else if (/win/i.test(userAgent)) {
    return "Windows";
  } else if (/mac/i.test(userAgent)) {
    return "Mac OS";
  } else if (/linux/i.test(userAgent)) {
    return "Linux";
  } else {
    return "Unknown";
  }
}
//user data

export async function handleUserData() {
  // Check if data has already been sent

  const userData = {
    appId: appId,
    userId: getUserId(),
    browser: getBrowserInfo().browser,
    browserVersion: getBrowserInfo().version,
    device: getDeviceInfo().device,
    os: getDeviceInfo().os,
    language: navigator.language,
    timestamp: new Date().getTime(),
  };

  try {
    sendToBackend(userRoute, userData);
    // Set flag in localStorage to indicate that data has been sent

    console.log("User data sent successfully.");
  } catch (error) {
    console.error("Error sending data to backend:", error);
    // Optionally, you can retry or handle the error as needed
  }
}

export function initializeTMS(id) {
  appId = id;
  handleUserData();
  trackClick();
  trackVisibility();
  searchQuery();
  fileDownload();
  formSubmit();
  videoInteraction();
  trackClipboardCopy();
}

var repeatVisit = false;
//page view
var pageN;
export async function handlePageView(PageName) {
  // Calculate the time spent on the page
  pageN = PageName;
  // Construct an object with page view details including device and browser info
  var pageViewData = {
    appId: appId,
    userId: getUserId(),
    sessionId: getSessionId(), // New: Get or generate a session ID
    PageName: PageName,
    url: window.location.pathname + window.location.search,
    title: document.title,
    referrer: document.referrer,
    timestamp: new Date().getTime(),
  };
  sendToBackend(ViewRoute, pageViewData);

  window.addEventListener("beforeunload", () => {
    sentinfo(pageN);
  });
}
function sentinfo(pageN) {
  var timeSpentInSeconds = calculateTimeSpent();

  var info = {
    appId: appId,
    userId: getUserId(),
    sessionId: getSessionId(),
    pageUrl: window.location.pathname + window.location.search,
    pageName: pageN,
    timespent: timeSpentInSeconds,
    scrollPercentage: maxScrollPercentage,
    timestamp: new Date().getTime(),
  };
  sendToBackend(infoPageRoute, info);
}

//ecommerce "call in html to use it"
export function trackProductView(productName, productCategory) {
  var productViewLog = {
    appId: appId,
    userId: getUserId(),
    sessionId: getSessionId(),
    event: "Product View",
    productCategory: productCategory,
    productName: productName,
    timestamp: new Date().getTime(),
  };

  // Log the product view data to the console or send it to a server
  sendToBackend(ViewProductRoute, productViewLog);
}

// Function to track add to cart actions
export function trackAddToCart(productId, productName, quantity) {
  var addToCartLog = {
    appId: appId,
    userId: getUserId(),
    sessionId: getSessionId(),
    event: "Add to Cart",
    productId: productId,
    productName: productName,
    quantity: quantity,
    timestamp: new Date().getTime(),
  };

  // Log the add to cart data to the console or send it to a server
  sendToBackend(AddtoCartRoute, addToCartLog);
}

// Function to track purchases
export function trackPurchase(orderId, totalAmount, products) {
  var purchaseLog = {
    appId: appId,
    userId: getUserId(),
    sessionId: getSessionId(),

    event: "Purchase",
    orderId: orderId,
    totalAmount: totalAmount,
    products: products,
    timestamp: new Date().getTime(),
  };

  // Log the purchase data to the console or send it to a server
  sendToBackend(PurchaseRoute, purchaseLog);
}

//costm events
export function trackCustomEvent(eventName, eventDetails) {
  // You can include any additional logic here, such as sending the data to the server.
  const customEventData = {
    appId: appId,
    userId: getUserId(),
    sessionId: getSessionId(),
    pageUrl: window.location.pathname + window.location.search,
    eventName: eventName,
    eventDetails: eventDetails,
    timestamp: new Date().toISOString(),
  };
  sendToBackend(customEventRoute, customEventData);
}

///////////////////////////////visibility///////////////////////////////
function handleVisibility(targetElement) {
  var visibilityLog = {
    appId: appId,
    userId: getUserId(),
    sessionId: getSessionId(),
    pageUrl: window.location.pathname + window.location.search,
    event: "Visibility",
    elementId: targetElement.id || "",
    tagName: targetElement.tagName || "",
    timestamp: new Date().getTime(),
  };

  // Log the visibility data to the console or send it to a server
  sendToBackend(visibilityRoute, visibilityLog);
}

// Function to track visibility based on data attribute
function trackVisibility() {
  var elementsToTrack = document.querySelectorAll('[tms="visibility"]');

  elementsToTrack.forEach((element) => {
    // Create an Intersection Observer

    var visibilityObserver = new IntersectionObserver((entries) => {
      console.log(element);
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Element is now visible in the viewport
          handleVisibility(element);
          visibilityObserver.unobserve(element); // Stop observing after visibility
        }
      });
    });

    // Attach the Intersection Observer to the target element
    visibilityObserver.observe(element);
  });
}

///auto//////////////////////////////////////////////

function extractFileInfo(url) {
  // Split the URL by '/'
  var segments = url.split("/");

  // Get the last segment (presumably the filename)
  var lastSegment = segments[segments.length - 1];

  // Split the filename by '.' to get extension and name
  var filenameParts = lastSegment.split(".");

  // Extract the extension and name
  var fileExtension = filenameParts.length > 1 ? filenameParts.pop() : "";
  var fileName = filenameParts.join(".");

  return { fileExtension: fileExtension, fileName: fileName };
}

function trackFileDownload(event) {
  // Extract information from the clicked link
  var link = event.currentTarget;
  var linkUrl = link.href || link.getAttribute("data-file-url") || "";
  var fileInfo = extractFileInfo(linkUrl);
  var fileExtension = fileInfo.fileExtension;
  var fileName = fileInfo.fileName;

  var linkId = link.id;
  var linkText = link.innerText;
  var file = {
    appId: appId,
    userId: getUserId(),
    sessionId: getSessionId(),
    pageUrl: window.location.pathname + window.location.search,
    event: "file download",
    linkUrl: linkUrl,
    fileExtension: fileExtension || "?",
    fileName: fileName || "?",
    linkId: linkId || "",
    linkText: linkText || "",
    timestamp: new Date().getTime(),
  };

  // Replace this line with your actual tracking logic
  sendToBackend(fileDownloadRoute, file);
}
function isVideoElement(element) {
  return element.tagName.toLowerCase() === "video";
}

// Function to handle video play events
function handleVideoPlay(event) {
  var video = event.target;

  if (isVideoElement(video)) {
    var videoId = video.id || "";
    var videoSrc = video.currentSrc || "";
    var videoTitle = video.title || video.alt || "";
    var videoDuration = video.duration;

    var video = {
      appId: appId,
      userId: getUserId(),
      sessionId: getSessionId(),
      pageUrl: window.location.pathname + window.location.search,
      event: "video-play",
      videoId: videoId,
      videoSrc: videoSrc,
      videoTitle: videoTitle,
      videoDuration: videoDuration,
      timestamp: new Date().getTime(),
    };

    sendToBackend(VideoPlayRoute, video);
  }
}

// Function to track form submissions
function extractFormInfo(form) {
  // Check if the form is defined
  if (!form) {
    return {
      formId: "",
      formName: "",
      formDestination: "",
      formSubmitText: "",
    };
  }

  // Extract form properties
  var formId = form.id || "";
  var formName = form.getAttribute("name") || "";
  var formDestination = form.getAttribute("action") || "";

  // Find the submit button inside the form
  var submitButton = form.querySelector(
    'button[type="submit"], input[type="submit"]'
  );
  var formSubmitText = submitButton
    ? submitButton.value || submitButton.innerText || ""
    : "";

  return {
    formId: formId,
    formName: formName,
    formDestination: formDestination,
    formSubmitText: formSubmitText,
  };
}
function trackClick() {
  // Replace this with your actual tracking code or API call
  const clicked = document.querySelectorAll('[tms="click"]');
  clicked.forEach((s) => {
    s.addEventListener("click", (event) => {
      const clickedElementInfo = {
        appId: appId,
        userId: generateUserId(),
        sessionId: getSessionId(),
        pageUrl: window.location.pathname + window.location.search,
        event: "click",
        elementId: event.target.id || "",
        tagName: event.target.tagName || "",
        textContent: event.target.textContent || "",
        href: event.target.href || "", // Check if the property exists for links
        // Add more properties as needed
      };
      sendToBackend(clickEventRoute, clickedElementInfo);
    });
  });
  // Retrieve information about the clicked element dynamically
}

// Function to track form submissions sayee
async function trackFormSubmit(event) {
  // Extract information from the submitted form
  var form = event.currentTarget;
  var forminfo = extractFormInfo(form);
  console.log(forminfo);
  var formInfo = {
    appId: appId,
    userId: getUserId(),
    sessionId: getSessionId(),
    pageUrl: window.location.pathname + window.location.search,
    event: "form-submit",
    formId: forminfo.formId || "",
    formName: forminfo.formName || "",
    formDestination: forminfo.formDestination || "",
    formSubmitText: forminfo.formSubmitText || "",
    timestamp: new Date().getTime(),
  };

  await sendToBackend(FormRoute, formInfo);
}
function fileDownload() {
  var downloadLinks = document.querySelectorAll('[tms="download"]');
  downloadLinks.forEach(function (link) {
    link.addEventListener("click", trackFileDownload);
  });
}
function videoInteraction() {
  var videos = document.querySelectorAll('[tms="video"]');
  videos.forEach(function (video) {
    video.addEventListener("play", function (event) {
      handleVideoPlay(event);
    });
  });
}
function formSubmit() {
  var forms = document.querySelectorAll('[tms="form"]');
  forms.forEach(function (form) {
    form.addEventListener("submit", trackFormSubmit);
  });
}
function searchQuery() {
  const searchInput = document.querySelectorAll('[tms="search-query"]');
  searchInput.forEach((s) => {
    s.addEventListener("blur", (e) => {
      handelserach(e);
    });
  });
}
function handelserach(event) {
  var query = event.target.value;
  var searchData = {
    appId: appId,
    userId: getUserId(),
    sessionId: getSessionId(),
    pageUrl: window.location.pathname + window.location.search,
    event: "query-search",
    elementId: event.target.id || "",
    elementTagName: event.target.tagName || "",
    query: query || "",
    timestamp: new Date().getTime(),
  };
  sendToBackend(querySearchRoute, searchData);
}
function trackClipboardCopy() {
  const copys = document.querySelectorAll('[tms="clipboard-copy"]');
  copys.forEach((c) => {
    c.addEventListener("copy", (e) => {
      handelClipboardCopy(e);
    });
  });
}
function handelClipboardCopy(event) {
  const copiedData = window.getSelection().toString();
  const clipboardEventData = {
    appId: appId,
    userId: getUserId(),
    sessionId: getSessionId(),
    pageUrl: window.location.pathname + window.location.search,
    event: "Clipboard-Copy",
    elementId: event.target.id || "",
    elementTagName: event.target.tagName || "",
    copiedData: copiedData || "",
    timestamp: new Date().getTime(),
  };
  sendToBackend(clipboardCopyRoute, clipboardEventData);
}
