; === MRU Tabswitcher installer for AutoHotkey v2 ===

#Requires AutoHotkey v2.0+

; Пути
scriptName := "tabswitcher_hotkey.ahk"
scriptDir := A_AppData "\Tabswitcher"
scriptPath := scriptDir "\" scriptName
shortcutPath := A_Startup "\Tabswitcher Shortcut.lnk"

; Текст основного хоткей-скрипта
hotkeyScript :=
(
'#Requires AutoHotkey v2.0+
#HotIf WinActive("ahk_exe chrome.exe")
^Tab::Send("!q")
#HotIf'
)

; Создание папки
DirCreate(scriptDir)

; Создание самого скрипта
if FileExist(scriptPath)
    FileDelete(scriptPath)
FileAppend(hotkeyScript, scriptPath)

; Удаление старого ярлыка автозагрузки
if FileExist(shortcutPath)
    FileDelete(shortcutPath)

; Команда создания ярлыка (без индексов в Format())
RunWaitCmd := Format('"{0}" /CreateShortcut "{1}"', A_AhkPath, shortcutPath)
RunWait(A_ComSpec ' /c ' RunWaitCmd, , "Hide")

; Запуск основного скрипта прямо сейчас
Run('"' scriptPath '"')

MsgBox "
(
Установка завершена!

Ctrl + Tab в Chrome теперь будет заменён на Alt + Q.

Убедись, что расширению назначено сочетание Alt + Q
посмотреть сочетания можно тут:
chrome://extensions/shortcuts

Скрипт для AutoHotKey запущен сейчас и добавлен в автозагрузку.
)"
ExitApp()