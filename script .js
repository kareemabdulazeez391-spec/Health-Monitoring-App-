// ===============================
// ZICCON HEALTH MONITOR
// ===============================

// Blood Pressure
function checkBloodPressure() {
  const systolic = Number(document.getElementById("systolic").value);
  const diastolic = Number(document.getElementById("diastolic").value);
  const result = document.getElementById("bpResult");

  if (!systolic || !diastolic) {
    result.textContent = "No reading";
    return "No reading";
  }

  if (systolic >= 180 || diastolic >= 120) {
    result.textContent = "Very High";
    result.className = "result danger";
    return "Very High";
  }

  if (systolic >= 140 || diastolic >= 90) {
    result.textContent = "High";
    result.className = "result warning-status";
    return "High";
  }

  if (systolic < 90 || diastolic < 60) {
    result.textContent = "Low";
    result.className = "result warning-status";
    return "Low";
  }

  result.textContent = "Within general range";
  result.className = "result good";

  return "Within general range";
}


// Blood Sugar
function checkSugar() {
  const sugar = Number(document.getElementById("sugar").value);
  const type = document.getElementById("sugarType").value;
  const result = document.getElementById("sugarResult");

  if (!sugar) {
    result.textContent = "No reading";
    return "No reading";
  }

  if (sugar >= 200) {
    result.textContent = "High";
    result.className = "result danger";
    return "High";
  }

  if (type === "fasting" && sugar >= 126) {
    result.textContent = "High";
    result.className = "result danger";
    return "High";
  }

  if (sugar < 70) {
    result.textContent = "Low";
    result.className = "result warning-status";
    return "Low";
  }

  result.textContent = "No obvious warning";
  result.className = "result good";

  return "No obvious warning";
}


// Pulse Rate
function checkPulse() {
  const pulse = Number(document.getElementById("pulse").value);
  const result = document.getElementById("pulseResult");

  if (!pulse) {
    result.textContent = "No reading";
    return "No reading";
  }

  if (pulse < 50) {
    result.textContent = "Low";
    result.className = "result warning-status";
    return "Low";
  }

  if (pulse > 100) {
    result.textContent = "High";
    result.className = "result warning-status";
    return "High";
  }

  result.textContent = "Within general resting range";
  result.className = "result good";

  return "Within general resting range";
}


// Temperature
function checkTemperature() {
  const temp = Number(document.getElementById("temperature").value);
  const result = document.getElementById("tempResult");

  if (!temp) {
    result.textContent = "No reading";
    return "No reading";
  }

  if (temp >= 38) {
    result.textContent = "Elevated";
    result.className = "result warning-status";
    return "Elevated";
  }

  if (temp < 35) {
    result.textContent = "Low";
    result.className = "result warning-status";
    return "Low";
  }

  result.textContent = "Normal range";
  result.className = "result good";

  return "Normal range";
}


// BMI
function calculateBMI() {
  const weight = Number(document.getElementById("weight").value);
  const height = Number(document.getElementById("height").value);
  const result = document.getElementById("bmiResult");

  if (!weight || !height) {
    result.textContent = "Enter weight and height";
    return;
  }

  const heightMeters = height / 100;
  const bmi = weight / (heightMeters * heightMeters);

  let category;

  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi < 25) {
    category = "Healthy range";
  } else if (bmi < 30) {
    category = "Overweight";
  } else {
    category = "Obesity range";
  }

  result.textContent = `${bmi.toFixed(1)} — ${category}`;

  if (bmi >= 18.5 && bmi < 25) {
    result.className = "result good";
  } else {
    result.className = "result warning-status";
  }
}


// Analyze All Health Readings
function analyzeHealth() {

  const bp = checkBloodPressure();
  const sugar = checkSugar();
  const pulse = checkPulse();
  const temperature = checkTemperature();

  const status = document.getElementById("overallStatus");

  const dangerous =
    bp === "Very High" ||
    sugar === "High";

  const warnings =
    bp === "High" ||
    bp === "Low" ||
    sugar === "Low" ||
    pulse === "High" ||
    pulse === "Low" ||
    temperature === "Elevated" ||
    temperature === "Low";

  if (dangerous) {
    status.className = "status danger";
    status.innerHTML =
      "⚠️ One or more readings may require prompt medical attention. " +
      "If you have severe symptoms, seek urgent professional medical care.";
  } 
  else if (warnings) {
    status.className = "status warning-status";
    status.innerHTML =
      "⚠️ Some readings are outside the expected range. " +
      "Consider repeating the measurement correctly and discussing persistent abnormal readings with a healthcare professional.";
  } 
  else {
    status.className = "status good";
    status.innerHTML =
      "✅ Your entered readings do not show an obvious warning based on the simple checks in this app. " +
      "This does not confirm that you are medically healthy.";
  }

  saveReading(bp, sugar, pulse, temperature);
}


// Save Reading
function saveReading(bp, sugar, pulse, temperature) {

  const reading = {
    date: new Date().toLocaleString(),
    bloodPressure:
      document.getElementById("systolic").value &&
      document.getElementById("diastolic").value
        ? `${document.getElementById("systolic").value}/${document.getElementById("diastolic").value}`
        : "N/A",

    sugar:
      document.getElementById("sugar").value
        ? `${document.getElementById("sugar").value} mg/dL`
        : "N/A",

    pulse:
      document.getElementById("pulse").value
        ? `${document.getElementById("pulse").value} BPM`
        : "N/A",

    temperature:
      document.getElementById("temperature").value
        ? `${document.getElementById("temperature").value} °C`
        : "N/A"
  };

  let history = JSON.parse(localStorage.getItem("healthHistory")) || [];

  history.unshift(reading);

  // Keep only the latest 10 records
  history = history.slice(0, 10);

  localStorage.setItem("healthHistory", JSON.stringify(history));

  displayHistory();
}


// Display History
function displayHistory() {

  const historyList = document.getElementById("historyList");

  const history =
    JSON.parse(localStorage.getItem("healthHistory")) || [];

  if (history.length === 0) {
    historyList.innerHTML =
      '<p class="empty">No readings saved yet.</p>';
    return;
  }

  historyList.innerHTML = "";

  history.forEach((item) => {

    const div = document.createElement("div");

    div.className = "history-item";

    div.innerHTML = `
      <strong>${item.date}</strong>
      <br><br>
      🩸 Blood Pressure: ${item.bloodPressure}
      <br>
      🍬 Blood Sugar: ${item.sugar}
      <br>
      ❤️ Pulse: ${item.pulse}
      <br>
      🌡️ Temperature: ${item.temperature}
    `;

    historyList.appendChild(div);
  });
}


// Clear History
function clearHistory() {

  if (confirm("Delete all saved health readings?")) {

    localStorage.removeItem("healthHistory");

    displayHistory();
  }
}


// Medical Information
function showIssue(issue) {

  const modal = document.getElementById("modal");
  const title = document.getElementById("modalTitle");
  const text = document.getElementById("modalText");

  const information = {

    hypertension: {
      title: "🩸 High Blood Pressure",
      text:
        "High blood pressure may have no obvious symptoms. Repeated elevated readings should be evaluated by a healthcare professional. Seek urgent medical attention for extremely high readings accompanied by symptoms such as chest pain, severe headache, difficulty breathing, weakness, confusion or vision problems."
    },

    diabetes: {
      title: "🍬 High Blood Sugar",
      text:
        "Persistently high blood glucose can be associated with diabetes or other conditions. Symptoms can include increased thirst, frequent urination, unusual tiredness and blurred vision. Persistent abnormal readings should be assessed by a healthcare professional."
    },

    heart: {
      title: "❤️ Heart-Related Symptoms",
      text:
        "Chest pain or pressure, severe difficulty breathing, fainting, sudden weakness, or other serious symptoms can require emergency medical attention. Do not rely on an app to diagnose a heart condition."
    },

    fever: {
      title: "🌡️ Fever",
      text:
        "Fever can occur with infections and other conditions. Monitor symptoms and hydration. Seek medical attention when fever is severe, persistent, associated with serious symptoms, or occurs in someone who is particularly vulnerable."
    }

  };

  title.textContent = information[issue].title;
  text.textContent = information[issue].text;

  modal.style.display = "flex";
}


// Emergency Information
function showEmergency() {

  const modal = document.getElementById("modal");
  const title = document.getElementById("modalTitle");
  const text = document.getElementById("modalText");

  title.textContent = "🚨 When to Seek Urgent Medical Help";

  text.textContent =
    "Seek urgent medical attention for serious symptoms such as severe chest pain or pressure, severe difficulty breathing, fainting, sudden weakness or numbness, confusion, seizures, severe bleeding, or other symptoms that feel life-threatening. Do not wait for this app to make a diagnosis.";

  modal.style.display = "flex";
}


// Close Modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}


// Close modal when clicking outside
window.onclick = function(event) {

  const modal = document.getElementById("modal");

  if (event.target === modal) {
    modal.style.display = "none";
  }
};


// Load history when app starts
document.addEventListener("DOMContentLoaded", displayHistory);