const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileInput");
const resultBox = document.getElementById("result");
console.log("JS Connected");


dropArea.addEventListener("click", () => {
    fileInput.click();
});


dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("dragover");
});


dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
});


dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("dragover");

    const files = e.dataTransfer.files;

    if (files.length) {
        fileInput.files = files;
        showFile(files[0]);
    }
});


fileInput.addEventListener("change", () => {
    if (fileInput.files.length) {
        showFile(fileInput.files[0]);
    }
});


function showFile(file) {
    dropArea.innerHTML = `
        <i class="fa-solid fa-file-circle-check"></i>
        <p>${file.name}</p>
        <span>تم رفع الملف بنجاح</span>
    `;
}




   async function analyzeReport() {

    if (!fileInput.files.length) {
        alert("اختر ملف أولاً");
        return;
    }

    alert("جاري التحليل...");

    const file = fileInput.files[0];

    try {

        console.log("1");

        const formData = new FormData();
        formData.append("file", file);

        console.log("2");

        const response = await fetch(
            "https://hakeem-1.onrender.com/api/login",
            {
                method: "POST",
                body: formData
            }
        );

        console.log("3");

        const data = await response.json();

        console.log("4");

        console.log(data);

        if (data.success) {
            showResult(data.answer);
        } else {
            alert(data.message || "حدث خطأ");
        }

    } catch (error) {

        console.log("ERROR:");
        console.log(error);

        alert("خطأ في الاتصال بالسيرفر");
    }
}
function showResult(text) {

    if (!resultBox) {
        alert(text);
        return;
    }

    resultBox.innerHTML = `
        <h3>نتيجة التحليل</h3>
        <p>${text}</p>
    `;
}
