chrome.runtime.onStartup.addListener(async () => {
    await chrome.sidePanel.setPanelBehavior({
        openPanelOnActionClick: true,
    });
});
