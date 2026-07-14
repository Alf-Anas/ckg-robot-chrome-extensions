# Privacy Policy for CKG Robot

**Last Updated:** July 2026

This Privacy Policy describes how **CKG Robot** ("we", "our", or "the Extension") handles user data. CKG Robot is a Google Chrome Extension designed specifically to assist healthcare workers in automating the data entry process for the "Sehat Indonesiaku" (CKG) application.

We are committed to maintaining your privacy and ensuring that all data processing is transparent, secure, and compliant with the Chrome Web Store Developer Program Policies.

---

## 1. No Server-Side Data Collection (Local Processing Only)

**CKG Robot does not collect, store, transmit, or sell any personal data or health records to external servers.**
All operations, data processing, and automation tasks are executed **entirely locally** within your web browser on your local device.

- We do not host any remote databases.
- We do not track your usage statistics or integrate any third-party analytics.

---

## 2. Types of Data Handled

Because the Extension functions as an autofill and automation tool, it accesses and processes the following types of data locally from the Excel files you upload:

- **Personally Identifiable Information (PII):** Such as patient names, ages, or identification numbers (NIK) needed for the registration process.
- **Health Information:** Such as screening records, default examination metrics, and medical indicators required to complete the CKG report.
- **Location Data:** Such as provinces, regencies/cities, sub-districts, and villages/wards used to match the application's location dropdown inputs.
- **Website Content:** The Extension reads and injects text values into input fields on the target web application to complete the automation.

_All the data mentioned above remains strictly inside your browser session and is discarded once the browser tab or extension is closed._

---

## 3. Chrome Permissions & Justifications

To perform its single-purpose automation, the Extension requests the following permissions:

- **`storage`:** Used locally to save your preferred column-mapping configurations and log histories so you do not have to re-configure them every time.
- **`scripting` & `activeTab`:** Used to safely inject the automation script and fill out the forms on the active "Sehat Indonesiaku" application tab.
- **`tabs` & `sidePanel`:** Used to render the Extension's user interface alongside your active tab and coordinate messages between the side panel and the page script.
- **`host_permissions` (`<all_urls>`):** Required because the target health system URLs and sub-domains are dynamic and subject to change by the authorities without prior notice. This ensures the autofill remains functional without requiring constant extension updates.

---

## 4. Compliance & Disclosures

In accordance with the Chrome Web Store Developer Program Policies, we declare that:

1. **We do NOT sell or transfer** any user data to third parties.
2. **We do NOT use or transfer** user data for purposes unrelated to the Extension's single-purpose utility (local autofill automation).
3. **We do NOT use or transfer** user data to determine creditworthiness or for lending purposes.

---

## 5. Contact & Support

If you have any questions, feedback, or concerns regarding this Privacy Policy or the security of the Extension, you can reach out via our GitHub Repository issues page or support channels.

You can also support this project voluntarily at **[Trakteer.id/alf-anas](https://trakteer.id/alf-anas)**.
