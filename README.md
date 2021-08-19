# USA Visa Interview Date notifier

This is an Firefox extension which would capture USA Visa Interview Dates response from [ais.usvisa-info.com](https://ais.usvisa-info.com) and send the dates to your Telegram from the bot: [USA Visa Date Notifier](https://t.me/DateReporterBot)

## Disclamer:
Due to the nature of the service and the application, it is not guaranteed to work properly past 2021. Over that, because it is relying on the current ways of [ais.usvisa-info.com](https://ais.usvisa-info.com), if the website developers change their patterns, it might and most likely will break the extension. Support for any changes in [ais.usvisa-info.com](https://ais.usvisa-info.com) can not be guaranteed.

## Download:
Version 0.1.0: [download](https://github.com/Andrey-Anatolyevich/UsaVisaInterviewDateNotifier/raw/main/build/UsaVisaInterviewDateNotifier_0.1.0.zip)

# Prerequisites:
- [Telegram](https://telegram.org) (any version would work, mobile or desktop)
- [Firefox](https://www.mozilla.org/en-US/firefox/) browser on your computer
- You have applied for a USA visa and booked an interview, but the interview date is too far in the future
- You have an account with [ais.usvisa-info.com](https://ais.usvisa-info.com) and you can "Reschedule Appointment"

## How it works high-level:
- You would configure a tab in Firefox to request interview dates
- The tab will be set for auto-update
- When the tab is updated, the extension with help of backend will send closest date to the chat between you and the Telegram bot: **USA Visa Date Notifier**
- If you would love to reschedule your interview to the new date, open the "Reschedule" page of [ais.usvisa-info.com](https://ais.usvisa-info.com) and pick the date while it is available. **Good dates disappear in few minutes!**

# Setting it all UP:
## Part 1: Telegram
- In Telegram find the bot called: "USA Visa Date Notifier":![USA Visa Date Notifier](https://raw.githubusercontent.com/Andrey-Anatolyevich/UsaVisaInterviewDateNotifier/main/pics/telegram-bot.jpg)
- Start chat with the bot
- Send `/token` to the bot to receive a browser token (this token will be needed later)

## Part 2: Firefox Extension
- In Firefox install this extension: [Tab Reloader](https://addons.mozilla.org/en-US/firefox/addon/tab-reloader/) (or similar)
- Download & unzip `USA Visa Interview Date notifier` extension files: [USA Visa Interview Date Notifier 0.1.0](https://github.com/Andrey-Anatolyevich/UsaVisaInterviewDateNotifier/raw/main/build/UsaVisaInterviewDateNotifier_0.1.0.zip)
- Unpack extension files into a directory of your choise
- In Firefox navigate to: [about:debugging](about:debugging)
- On left side of the screen click: ![This Firefox](https://raw.githubusercontent.com/Andrey-Anatolyevich/dateReporter-FirefoxExtension/main/pics/firefox-debugging.jpg)
- Click `Load Temporary Add-on...`
- Select `manifest.json` of the downloaded & unpacked extension
### Warning: The `USA Visa Interview Date notifier` extension you just added will be removed when you close the browser. SO, please keep Firefox open OR do the steps above after Firefox is reopened.

## Part 3: Getting the dates URL
- Log into your account at: [ais.usvisa-info.com](https://ais.usvisa-info.com)
- At your application page click `Continue`: ![Continue](https://raw.githubusercontent.com/Andrey-Anatolyevich/dateReporter-FirefoxExtension/main/pics/ais-continue.jpg)
- Click `Reschedule Appointment` and confirm
- Click `F12` on the keyboard (to open browser developer tools)
- Open `Network` tab: ![Network](https://raw.githubusercontent.com/Andrey-Anatolyevich/dateReporter-FirefoxExtension/main/pics/ais-network.jpg)
- In the `Network` tab click `xhr` button: ![](https://raw.githubusercontent.com/Andrey-Anatolyevich/dateReporter-FirefoxExtension/main/pics/ais-network-xhr.jpg)
- Reload the page (by clicking `F5` or a `Reload` button)
- **OPTIONAL:** On the page if a wrong city is selected, select the right city
- In the network tab **RIGHT CLICK -> COPY & SAVE SOMEWHERE** the URL of the last network request where the `File` is `.json`: ![](https://raw.githubusercontent.com/Andrey-Anatolyevich/dateReporter-FirefoxExtension/main/pics/ais-network-copyUrl.jpg)

## Part 4: Setting the dates tab
- Create a new tab
- In the new tab navigate to the URL you've copied & saved in the previous part
- If there are any dates available, you should see something similar to this: ![](https://raw.githubusercontent.com/Andrey-Anatolyevich/dateReporter-FirefoxExtension/main/pics/ais-dates.jpg)
- Click the 'USA Visa Interview Date notifier' extension icon and fill data:
![](https://raw.githubusercontent.com/Andrey-Anatolyevich/UsaVisaInterviewDateNotifier/main/pics/extension-fields.jpg)
  - Token from the telegram bot "USA Visa Date Notifier": enter here the token you received from the bot. If you lost it, send the bot `/token` to receive it again
  - [ais.usvisa-info.com](https://ais.usvisa-info.com) dates JSON URL: Enter here the URL you copied & saved in the previous part
  - [ais.usvisa-info.com](https://ais.usvisa-info.com) login page URL: this is the URL of the page, to which you are redirected when your session with [ais.usvisa-info.com](https://ais.usvisa-info.com) is expired. You can update the URL later to make sure the system can provide you with proper updates
- In the 'USA Visa Interview Date notifier' extension click `Enable`

## Part 5: Make the dates tab auto-updatable
- (1) Open the `Tab Reloader` extension settings window while in the Dates JSON tab (the tab from the previous part)
- (2) Set reloading time. It is suggested to set `Variation` to at least 20% AND to not refresh dates more often than once in 4 minutes
- (3) Enable `Tab Reloader` extension

# YOU ARE ALL SET!

Now in the chat with the bot in Telegram when you send `/state` message, in the reply you will see if "Last update received" chages after the "Dates" tab is updated in the browser

## Note:
When the session with [ais.usvisa-info.com](https://ais.usvisa-info.com) expires, if "ais.usvisa-info.com login page URL" is configured properly, the bot will send a message about it AND the `USA Visa Interview Date notifier` extension will be disabled.

You would have to login with [ais.usvisa-info.com](https://ais.usvisa-info.com) and reconfigure the Dates Tab. (As of July 2021, it happens 2-3 times a day)