// background.js

let tabList = []; // история вкладок
let switchMode = false;
let switchIndex = 0;

console.log('Extension loaded');

// Инициализация: добавляем текущую активную вкладку
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	if (tabs[0] && isValidTab(tabs[0])) {
		updateTabList(tabs[0].id);
	}
});

// ——— Утилита: обновляем список активности ———
function updateTabList(tabId) {
	const idx = tabList.indexOf(tabId);
	if (idx !== -1) {
		tabList.splice(idx, 1);
	}
	tabList.unshift(tabId);
}

// ——— Слушатели событий вкладок ———

// Когда вкладка активируется
chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		if (isValidTab(tab)) {
			updateTabList(activeInfo.tabId);
		}
	});

	if (!switchMode) {
		switchIndex = 0;
	}
});

// Когда вкладка закрывается
chrome.tabs.onRemoved.addListener((tabId) => {
	const idx = tabList.indexOf(tabId);
	if (idx !== -1) {
		tabList.splice(idx, 1);
	}
});

// ——— Основное переключение ———
function cycleNext() {
	chrome.tabs.query({ currentWindow: true }, (tabs) => {
		const validTabs = tabs.filter(isValidTab);
		const activeTab = validTabs.find((t) => t.active);
		if (!activeTab) return;

		if (!switchMode) {
			switchMode = true;
			switchIndex = 1; // начинаем со второй в истории
		}

		let nextTabId = null;
		while (switchIndex < tabList.length) {
			const candidateId = tabList[switchIndex];
			const candidateTab = validTabs.find((t) => t.id === candidateId);

			if (candidateTab) {
				nextTabId = candidateId;
				break;
			} else {
				switchIndex++; // пропустить закрытую или недопустимую
			}
		}

		if (nextTabId) {
			chrome.tabs.update(nextTabId, { active: true });
			switchIndex++;
		}
	});
}

// ——— Сброс переключательного режима ———
function resetCycle() {
	switchMode = false;
	switchIndex = 0;
}

// ——— Приём сообщений из content.js ———
chrome.runtime.onMessage.addListener((msg) => {
	if (msg.cmd === 'cycle-next') {
		cycleNext();
	} else if (msg.cmd === 'reset-cycle') {
		resetCycle();
	}
});

// ——— Фильтрация запрещённых вкладок ———
function isValidTab(tab) {
	if (!tab || !tab.url) return false;

	const url = tab.url;

	return !(
		url.startsWith('chrome://') ||
		url.startsWith('chrome-extension://') ||
		url.startsWith('edge://') ||
		url.includes('chrome.google.com/webstore') ||
		url === '' ||
		url === 'about:blank'
	);
}