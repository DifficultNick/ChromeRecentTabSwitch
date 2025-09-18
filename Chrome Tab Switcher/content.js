console.log('tab handled by `Chrome Tab Switcher`');

document.addEventListener("keydown", (e) =>
{
	if (e.ctrlKey && e.code === "Backquote" && !e.repeat)
	{
		chrome.runtime.sendMessage({ cmd: "cycle-next" });
		e.preventDefault(); // чтобы не печаталось в полях ввода
	}
});

document.addEventListener("keyup", (e) =>
{
	if (e.key === "Control")
	{
		chrome.runtime.sendMessage({ cmd: "reset-cycle" });
	}
});