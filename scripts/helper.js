function showErrorSwal(error, fallbackTitle = "Terjadi Kesalahan") {
    let title = fallbackTitle;
    let htmlContent = "";
    let icon = "error";

    if (Array.isArray(error)) {
        title = "Validasi Data Gagal";
        icon = "warning";

        const maxDisplay = 5;
        const displayedErrors = error.slice(0, maxDisplay);
        const remaining = error.length - maxDisplay;

        htmlContent = `
            <div class="text-start fs-6" style="max-height: 200px; overflow-y: auto; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                <ul class="mb-0 text-danger ps-3">
                    ${displayedErrors.map((err) => `<li>${err}</li>`).join("")}
                </ul>
                ${remaining > 0 ? `<p class="text-muted small mt-2 mb-0 text-center">...dan ${remaining} data error lainnya.</p>` : ""}
            </div>
        `;
    } else if (error instanceof Error) {
        title = error.name || "System Error";
        htmlContent = `<p class="fw-bold text-secondary mb-1">Pesan Sistem:</p><code class="text-danger">${error.message}</code>`;
    } else if (typeof error === "object" && error !== null) {
        title = error.title || title;
        htmlContent = error.message || JSON.stringify(error);
    } else if (typeof error === "string") {
        htmlContent = error;
    } else {
        htmlContent = "Terjadi kesalahan internal pada robot parser.";
    }

    Swal.fire({
        title: title,
        html: htmlContent,
        icon: icon,
        confirmButtonText: "Mengerti",
        confirmButtonColor: "#dc3545",
        allowOutsideClick: false,
        customClass: {
            popup: "border-0 shadow-lg",
        },
    });
}

function showSuccess(msg = "") {
    Swal.fire({
        title: "Berhasil!",
        text: msg,
        icon: "success",
    });
}

function normalizeHeaderString(str) {
    if (!str) return "";
    return str
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9\s_]/g, "")
        .trim()
        .replace(/\s+/g, "_");
}

function cleanNumberOnly(val) {
    if (val === null || val === undefined) return null;
    let str = val.toString().replace(/,/g, "."); // antisipasi koma desimal
    let cleaned = str.replace(/[^0-9.]/g, ""); // saring hanya angka dan titik desimal
    return cleaned ? Number(cleaned) : null;
}

function toDDMMYYYY(dateStr) {
    if (!dateStr) return null;
    if (!isNaN(dateStr) && Number(dateStr) > 20000) {
        const serial = Number(dateStr);
        const excelEpoch = Date.UTC(1899, 11, 30);
        const date = new Date(excelEpoch + serial * 86400000);
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
    }
    let parts = dateStr.toString().split(/[-/]/);
    if (!parts || parts.length < 3) return dateStr;
    let day, month, year;
    if (parts[0].length === 4) {
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        day = parseInt(parts[2], 10);
    } else {
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        year = parseInt(parts[2], 10);
    }
    return `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
}

function parseDDMMYYYY(dateStr) {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // JS months = 0-11
}

function cleanPhoneNumber(phone) {
    if (!phone) return "";
    let cleaned = phone.toString().replace(/\D/g, "");
    if (cleaned.startsWith("628")) {
        cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith("08")) {
        cleaned = cleaned.substring(1);
    }
    const minLength = 9;
    const maxLength = 13;
    if (cleaned.length < minLength || cleaned.length > maxLength) {
        return "";
    }
    if (!cleaned.startsWith("8")) {
        return "";
    }
    return cleaned;
}

function showPanelMessage(message) {
    const parent = document.getElementById("parent-text-message");
    const textDiv = document.getElementById("text-message");

    if (!parent || !textDiv) return;

    if (message && message.trim() !== "") {
        textDiv.textContent = message;
        parent.classList.remove("d-none"); // show
    } else {
        textDiv.textContent = "";
        parent.classList.add("d-none"); // hide
    }
}

function appendPanelMessage(message) {
    const parent = document.getElementById("parent-text-message");
    const textDiv = document.getElementById("text-message");

    if (!parent || !textDiv) return;
    if (message && message.trim() !== "") {
        if (textDiv.textContent.trim() === "") {
            textDiv.textContent = message;
        } else {
            const nextMessage = document.createElement("div");
            nextMessage.textContent = message;
            nextMessage.classList.add("mt-1");
            textDiv.appendChild(nextMessage);
        }
        parent.classList.remove("d-none");
        textDiv.scrollTop = textDiv.scrollHeight;
    }
}

function showLoading() {
    const spinner = document.getElementById("loading-spinner");
    if (spinner) {
        spinner.style.display = "block";
    }
}

function hideLoading() {
    const spinner = document.getElementById("loading-spinner");
    if (spinner) {
        spinner.style.display = "none";
    }
}
