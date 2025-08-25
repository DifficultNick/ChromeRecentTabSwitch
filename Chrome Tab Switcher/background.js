console.log('Chrome Tab Switcher is running!');

let tabList = [];

function updateTabList(tabId) {
	const index = tabList.indexOf(tabId);
	if (index !== -1) {
		tabList.splice(index, 1);
	}
	tabList.unshift(tabId);
}

chrome.tabs.onActivated.addListener((activeInfo) => {
	updateTabList(activeInfo.tabId);
});

chrome.tabs.onRemoved.addListener((tabId) => {
	const index = tabList.indexOf(tabId);
	if (index !== -1) {
		tabList.splice(index, 1);
	}
});

function switchToLastUsedTab() {
	chrome.tabs.query({ currentWindow: true }, function (tabs) {
		let activeTab = tabs.find(tab => tab.active);
		if (!activeTab) return;

		for (let id of tabList) {
			if (id !== activeTab.id && tabs.find(t => t.id === id)) {
				chrome.tabs.update(id, { active: true });
				break;
			}
		}
	});
}

chrome.commands.onCommand.addListener((command) => {
	if (command === 'switch-to-last-used-tab') {
		switchToLastUsedTab();
	}
});