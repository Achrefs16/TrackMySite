const userRoute = "http://localhost:5173/user";
const sessionRoute = "http://localhost:5173/session";
const eventRoute = "http://localhost:5173/event";
let resolveUserDataPromise;
const userDataPromise = new Promise((resolve) => {
  resolveUserDataPromise = resolve;
});
let resolveappIdPromise;
const appIdPromise = new Promise((resolve) => {
  resolveappIdPromise = resolve;
});
var appId;
var userId;
var sessionId;
getUserId();
getSessionId();

async function sendUser(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AppId: data.appId,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
  } catch (error) {
    console.error("Error sending data to the backend:", error);
  }
}
async function sendToBackend(url, data) {
  await userDataPromise;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AppId: data.appId,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
  } catch (error) {
    console.error("Error sending data to the backend:", error);
  }
}

var pageStartTime = 0;
let maxScrollPercentage = 0;
function generateUserId() {
  return "user_" + Math.random().toString(36).substr(2, 10);
}

// Function to generate a random session ID
function generateSessionId() {
  return "session_" + Math.random().toString(36).substr(2, 10);
}

// Function to get or generate a user ID
function getUserId() {
  userId = localStorage.getItem("userId");
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem("userId", userId);
  }
}

// Function to get or generate a session ID
function getSessionId() {
  sessionId = sessionStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem("sessionId", sessionId);
  }
}

// Save the session information to the backend

// Function to get browser information
function getBrowserInfo() {
  var ua = navigator.userAgent;

  // Check for Edge (including Edge Chromium)
  if (/edge\/|edg\//i.test(ua)) {
    return "Edge";
  }

  // Check for Google Chrome
  if (/chrome|crios/i.test(ua)) {
    return "Chrome";
  }

  // Check for Safari
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
    return "Safari";
  }

  // Check for Firefox
  if (/firefox|fxios/i.test(ua)) {
    return "Firefox";
  }

  // Check for Opera
  if (/opera|opr\//i.test(ua)) {
    return "Opera";
  }

  // Check for Internet Explorer
  if (/msie|trident/i.test(ua)) {
    return "IE";
  }

  // Default to "Unknown" if none of the above checks match
  return "Unknown";
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
    device = "Laptop/Desktop";
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
function getGeolocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(
            "Geolocation is not supported by this browser or user has denied access."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}

async function handleUserSession() {
  // Check if data has already been sent
  const user = localStorage.getItem("usersent");
  console.log(getBrowserInfo());
  const { latitude, longitude } = await getGeolocation();
  const userData = {
    appId: appId,
    userId: userId,
    browser: getBrowserInfo(),
    device: getDeviceInfo().device,
    os: getDeviceInfo().os,
    latitude: latitude || "",
    longitude: longitude || "",
    language: navigator.language,
    timestamp: new Date().getTime(),
  };
  var session = sessionStorage.getItem("sessionSent");
  console.log("this is session 1", session);
  const sessionData = {
    appId: appId, // Ensure appId is defined or retrieved correctly
    userId: userId, // Ensure getUserId() is defined or retrieved correctly
    session_id: sessionId,
    start_time: new Date().getTime(),
  };

  try {
    // First, send the user data
    await sendUser(userRoute, userData);
    console.log("User data sent successfully");

    // After user data is successfully sent, then send session data
    await sendUser(sessionRoute, sessionData);
    console.log("Session data sent successfully");
    resolveUserDataPromise();
  } catch (error) {
    console.error("Error in sending user or session data:", error);
  }
}

async function checkAppId(app) {
  try {
    const response = await fetch("http://localhost:5173/appId", {
      method: "POST",
      headers: {
        AppId: app,
        "Content-Type": "application/json",
      },
      // Ensure the body is correctly structured as per your backend's expectation
      body: JSON.stringify({ appId: app }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    return responseData.status;
    // Resolve the promise when the check completes successfully
  } catch (error) {
    console.error("Error sending data to the backend:", error);
    // Consider rejecting the promise if the appId check fails and you have a rejection handler
  }
}

export async function initializeTMS(app) {
  //check if the web site is exist
  appId = app;
  const status = await checkAppId(appId);
  if (status === "success") {
    resolveappIdPromise();
    await handleUserSession();
    trackClick();
    trackVisibility();
    searchQuery();
    fileDownload();
    formSubmit();
    videoInteraction();
    trackClipboardCopy();
  }
}

const updateMaxScrollPercentage = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  // Ensure that the denominator is never 0 to avoid division by zero errors
  const totalScrollable = Math.max(scrollHeight, 1);

  let currentScrollPercentage = (scrollTop / totalScrollable) * 100;

  // Round to a maximum of 2 decimal places (or any other precision you prefer)
  currentScrollPercentage = Math.round(currentScrollPercentage * 100) / 100;

  // Ensure the calculated percentage does not exceed 100%
  currentScrollPercentage = Math.min(currentScrollPercentage, 100);

  if (currentScrollPercentage > maxScrollPercentage) {
    maxScrollPercentage = currentScrollPercentage;
  }
};
function isExternalReferrer(referrer) {
  if (!referrer) return false; // No referrer

  const referrerHost = new URL(referrer).hostname.replace("www.", "");
  const siteHost = window.location.hostname.replace("www.", "");

  return referrerHost !== siteHost;
}

var referrer = document.referrer;
var externalReferrer = isExternalReferrer(referrer) ? referrer : null;
//page view
var pageN;
var pageUrl;
export async function handlePageView(PageName) {
  await appIdPromise;
  maxScrollPercentage = 0;
  window.addEventListener("scroll", updateMaxScrollPercentage);
  pageStartTime = new Date().getTime();

  pageN = PageName;
  pageUrl = window.location.pathname;
  var data = {
    appId: appId,
    userId: userId,
    sessionId: sessionId, // New: Get or generate a session ID
    pageUrl: window.location.pathname,
    event: "page-view",
    eventData: {
      PageName: PageName,
      title: document.title,
      referrer: externalReferrer,
    },
    timestamp: new Date().getTime(),
  };

  // sendToBackend(ViewRoute, pageViewData);
  sendToBackend(eventRoute, data);
  //for server rendering
  /* window.addEventListener("beforeunload", () => {
      sentinfo(pageN);
    });*/
}
function sentinfo(pageN) {
  function calculateTimeSpent() {
    var currentTime = new Date().getTime();
    var timeSpentInSeconds = (currentTime - pageStartTime) / 1000;
    return timeSpentInSeconds;
  }
  var timeSpentInSeconds = calculateTimeSpent();
  if (appId) {
    var data = {
      appId: appId,
      userId: userId,
      sessionId: sessionId,
      pageUrl: pageUrl,
      event: "page-leave",
      eventData: {
        timespent: timeSpentInSeconds,
        scrollPercentage: maxScrollPercentage,
      },
      timestamp: new Date().getTime(),
    };

    sendToBackend(eventRoute, data);
  }
}
(function () {
  function onNavigate() {
    sentinfo(pageN, appId);
    console.log("Navigation detected");
  }

  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function () {
    originalPushState.apply(window.history, arguments);
    onNavigate();
  };

  window.history.replaceState = function () {
    originalReplaceState.apply(window.history, arguments);
    onNavigate();
  };

  window.addEventListener("popstate", onNavigate);
})();
export async function trackLogin(methode) {
  await appIdPromise;
  const data = {
    appId: appId, // Ensure appId is defined or fetched from a relevant source
    userId: userId, // This time we pass userId as a parameter since it's known at login
    sessionId: sessionId, // Ensure sessionId is a function that returns the session ID
    pageUrl: window.location.pathname,
    event: "Login",
    eventData: { methode: methode },
    timestamp: new Date().getTime(),
  };
  sendToBackend(eventRoute, data);
}

export async function trackSignUp(methode) {
  await appIdPromise;
  const data = {
    appId: appId,
    userId: userId, // Pass userId as a parameter since it's known at sign-up
    sessionId: sessionId,
    pageUrl: window.location.pathname,
    event: "SignUp",
    eventData: { methode: methode },
    timestamp: new Date().getTime(),
  };
  sendToBackend(eventRoute, data);
}
export async function trackSubscribe(subscriptionPlan, amount) {
  await appIdPromise;
  const data = {
    appId: appId, // Ensure appId is defined or fetched from a relevant source
    userId: userId, // The user's ID
    sessionId: sessionId, // Ensure sessionId is a function that returns the session ID
    pageUrl: window.location.pathname,
    event: "Subscribe",
    eventData: {
      subscriptionPlan: subscriptionPlan,
      amount: amount, // Details about the subscription plan
    },
    timestamp: new Date().getTime(),
  };
  sendToBackend(eventRoute, data);
}
export async function trackUnsubscribe(reason) {
  await appIdPromise;
  const data = {
    appId: appId, // Ensure appId is defined or fetched from a relevant source
    userId: userId, // The user's ID
    sessionId: sessionId, // Ensure sessionId is a function that returns the session ID
    pageUrl: window.location.pathname,
    event: "Unsubscribe",
    eventData: {
      reason: reason, // Reason for unsubscribing
    },
    timestamp: new Date().getTime(),
  };
  sendToBackend(eventRoute, data);
}
//ecommerce "call in html to use it"
export async function trackProductView(productName, productCategory) {
  await appIdPromise;
  var data = {
    appId: appId,
    userId: userId,
    sessionId: sessionId,
    pageUrl: window.location.pathname,
    event: "Product-View",
    eventData: {
      productCategory: productCategory,
      productName: productName,
    },

    timestamp: new Date().getTime(),
  };
  sendToBackend(eventRoute, data);

  // Log the product view data to the console or send it to a server
  // sendToBackend(ViewProductRoute, productViewLog);
}

// Function to track add to cart actions
export async function trackAddToCart(productName, productCategory) {
  await appIdPromise;
  console.log(productName);
  var data = {
    appId: appId,
    userId: userId,
    sessionId: sessionId,
    pageUrl: window.location.pathname,
    event: "Add-to-Cart",
    eventData: {
      productName: productName,
      productCategory: productCategory,
    },

    timestamp: new Date().getTime(),
  };
  sendToBackend(eventRoute, data);

  // Log the add to cart data to the console or send it to a server
  // sendToBackend(AddtoCartRoute, addToCartLog);
}

// Function to track purchases
export async function trackPurchase(orderId, name, category, price) {
  await appIdPromise; // Ensure the app ID, along with other necessary IDs, are loaded

  // Iterate over each product in the products array

  // Destructure each product object
  var data = {
    appId: appId,
    userId: userId,
    sessionId: sessionId,
    pageUrl: window.location.pathname,
    event: "Purchase",
    eventData: {
      orderId: orderId,
      productName: name, // Product name
      productCategory: category, // Product category
      productPrice: price, // Product price
    },
    timestamp: new Date().getTime(),
  };

  // Send the data for each product to the backend
  sendToBackend(eventRoute, data);
}

export async function trackContentEngagement(articleId, contentType, details) {
  await appIdPromise; // Ensure any necessary setup, like appId, is completed
  const data = {
    appId: appId,
    userId: userId, // Include user ID if available for more detailed tracking
    sessionId: sessionId, // Ensure sessionId is correctly obtained
    pageUrl: window.location.pathname,
    event: "Content-Engagement",
    eventData: {
      articleId: articleId,
      contentType: contentType,
      details: details, // Additional details like duration, comment text, etc.
    },
    timestamp: new Date().getTime(),
  };
  sendToBackend(eventRoute, data);
}

//ERROR TRACK EXP USE WITH TRY CATCH
export async function trackError(errorMessage, errorStack) {
  await appIdPromise; // Wait for the app ID promise to resolve if necessary
  const data = {
    appId: appId,
    userId: userId, // Include user ID if available, for more detailed tracking
    sessionId: sessionId, // Ensure sessionId is correctly obtained
    pageUrl: window.location.pathname,
    event: "Error",
    eventData: {
      message: errorMessage,
      stack: errorStack,
    },
    timestamp: new Date().getTime(),
  };
  sendToBackend(eventRoute, data);
}

//costm events
export async function track(eventName, eventDetails) {
  await appIdPromise;
  const data = {
    appId: appId,
    userId: userId,
    sessionId: sessionId,
    pageUrl: window.location.pathname,
    event: eventName,
    eventData: { "custom-event": eventDetails },
    timestamp: new Date().toISOString(),
  };
  sendToBackend(eventRoute, data);
}

///////////////////////////////visibility///////////////////////////////
function handleVisibility(targetElement) {
  var data = {
    appId: appId,
    userId: userId,
    sessionId: sessionId,
    pageUrl: window.location.pathname,
    event: "Visibility",
    eventData: {
      elementId: targetElement.id || "",
      tagName: targetElement.tagName || "",
    },

    timestamp: new Date().getTime(),
  };

  sendToBackend(eventRoute, data);

  // Log the visibility data to the console or send it to a server
  //  sendToBackend(visibilityRoute, visibilityLog);
}

// Function to track visibility based on data attribute
function trackVisibility() {
  var elementsToTrack = document.querySelectorAll('[tms="visibility"]');

  elementsToTrack.forEach((element) => {
    // Create an Intersection Observer

    var visibilityObserver = new IntersectionObserver((entries) => {
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
  var data = {
    appId: appId,
    userId: userId,
    sessionId: sessionId,
    pageUrl: window.location.pathname,
    event: "file-download",
    eventData: {
      linkUrl: linkUrl,
      fileExtension: fileExtension || "?",
      fileName: fileName || "?",
      linkId: linkId || "",
      linkText: linkText || "",
    },

    timestamp: new Date().getTime(),
  };

  sendToBackend(eventRoute, data);
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

    var data = {
      appId: appId,
      userId: userId,
      sessionId: sessionId,
      pageUrl: window.location.pathname,
      event: "video-play",
      eventData: {
        videoId: videoId,
        videoSrc: videoSrc,
        videoTitle: videoTitle,
        videoDuration: videoDuration,
      },

      timestamp: new Date().getTime(),
    };
    sendToBackend(eventRoute, data);

    // sendToBackend(VideoPlayRoute, video);
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
      const data = {
        appId: appId,
        userId: userId,
        sessionId: sessionId,
        pageUrl: window.location.pathname,
        event: "click",
        eventData: {
          elementId: event.target.id || "",
          tagName: event.target.tagName || "",
          textContent: event.target.textContent || "",
          href: event.target.href || "",
        },

        timestamp: new Date().getTime(),
      };
      console.log(data);
      sendToBackend(eventRoute, data);
      //  sendToBackend(clickEventRoute, clickedElementInfo);
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
  var data = {
    appId: appId,
    userId: userId,
    sessionId: sessionId,
    pageUrl: window.location.pathname,
    event: "form-submit",
    eventData: {
      formId: forminfo.formId || "",
      formName: forminfo.formName || "",
      formDestination: forminfo.formDestination || "",
      formSubmitText: forminfo.formSubmitText || "",
    },

    timestamp: new Date().getTime(),
  };
  sendToBackend(eventRoute, data);

  // await sendToBackend(FormRoute, formInfo);
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
  var data = {
    appId: appId,
    userId: userId,
    sessionId: sessionId,
    pageUrl: window.location.pathname,
    event: "query-search",
    eventData: {
      elementId: event.target.id || "",
      elementTagName: event.target.tagName || "",
      query: query || "",
    },

    timestamp: new Date().getTime(),
  };
  sendToBackend(eventRoute, data);
  // sendToBackend(querySearchRoute, searchData);
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
  const data = {
    appId: appId,
    userId: userId,
    sessionId: sessionId,
    pageUrl: window.location.pathname,
    event: "clipboard-copy",
    eventData: {
      elementId: event.target.id || "",
      elementTagName: event.target.tagName || "",
      copiedData: copiedData || "",
    },

    timestamp: new Date().getTime(),
  };

  sendToBackend(eventRoute, data);
  // sendToBackend(clipboardCopyRoute, clipboardEventData);
}
