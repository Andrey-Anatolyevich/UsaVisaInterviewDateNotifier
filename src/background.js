(function () {
  if (window.hasRun)
    return;
  else
    window.hasRun = true;

  let settings = {
    default: {
      extensionEnabled: false,
      token: '',
      newDatesUrl: 'http://usa-dates.zzees.com/Dates/NewDates',
      badResponseDetectedUrl: 'http://usa-dates.zzees.com/Dates/BadResponseReceived',
      datesUrl: '',
      loginPageUrl: 'https://ais.usvisa-info.com/en-ca/niv/users/sign_in'
    },
    current: {}
  }
  settings.current = Object.assign({}, settings.default)

  let storage = {
    keys: {
      settings: 'settings'
    },
    loadSettingsAsync() {
      browser.storage.local.get(storage.keys.settings)
        .then(result => {
          let settingsFromStorage = result[storage.keys.settings]
          console.warn('settingsFromStorage: ')
          console.warn(settingsFromStorage)
          Object.assign(settings.current, settingsFromStorage)
          console.warn('loaded settings: ')
          console.warn(settings.current)
        });
    },
    saveSettingsAsync() {
      let settingsCleared = Object.assign({}, settings.current)
      delete settingsCleared.extensionEnabled
      let settingsContainer = {};
      settingsContainer[storage.keys.settings] = settingsCleared
      browser.storage.local.set(settingsContainer)
    }
  }

  let app = {
    icon(enabled) {
      const path = 'icons/icon-30-' + (enabled ? 'on' : 'off') + '.png';
      chrome.browserAction.setIcon({
        path
      });
    },
    startRequestsListener() {
      settings.current.extensionEnabled = true
      browser.webRequest.onBeforeRequest.addListener(
        app.onFilteredRequestCaptured,
        {
          urls: [
            settings.current.datesUrl,
            settings.current.loginPageUrl
          ],
          types: ["main_frame"]
        },
        ["blocking"]
      );
      app.icon(true)
    },
    stopRequestsListener() {
      browser.webRequest.onBeforeRequest.removeListener(app.onFilteredRequestCaptured)
      settings.current.extensionEnabled = false
      app.icon(false)
    },
    onFilteredRequestCaptured(details) {
      if (details.url == settings.current.loginPageUrl) {
        app.stopRequestsListener()
        beClient.reportBadResponseReceived()
        return
      }

      let filter = browser.webRequest.filterResponseData(details.requestId);
      let decoder = new TextDecoder("utf-8");
      let encoder = new TextEncoder();

      filter.ondata = event => {
        let response, eventDataDecoded
        let releaseRequest = () => {
          try {
            let stringEncoded = encoder.encode(eventDataDecoded)
            filter.write(stringEncoded)
          }
          catch { }
          filter.disconnect()
        }

        try {
          var data = event.data;
          eventDataDecoded = decoder.decode(data, { stream: true })
          response = JSON.parse(eventDataDecoded)
        }
        catch {
        }

        if (!response || response.error) {
          app.stopRequestsListener()
          beClient.reportBadResponseReceived()
            .then(releaseRequest)
            .catch(releaseRequest)
          return;
        }

        beClient.forwardDirect(eventDataDecoded, releaseRequest)
      }

      return {};
    }
  }

  let beClient = {
    forwardDirect(value, onDone) {
      let requestUrl = settings.current.newDatesUrl + '?token=' + settings.current.token
      let oReq = new XMLHttpRequest();
      oReq.open("POST", requestUrl);
      oReq.onreadystatechange = function () {
        if (oReq.readyState === XMLHttpRequest.DONE) {
          var status = oReq.status;
          if (status === 0 || (status >= 200 && status < 400)) {
            console.log('Data sent to backend');
            onDone()
          } else {
            onDone()
          }
        }
      };
      oReq.send(value);
    },
    reportBadResponseReceived(value) {
      let oReq = new XMLHttpRequest();
      oReq.open("POST", settings.current.badResponseDetectedUrl + '?token=' + settings.current.token);
      oReq.onreadystatechange = function () {
        if (oReq.readyState === XMLHttpRequest.DONE) {
          var status = oReq.status;
          if (status === 0 || (status >= 200 && status < 400)) {
            console.log('Bad Response notification sent to BE.');
          } else {
            console.log('Error reporting Bad Response to BE.');
          }
        }
      };
      oReq.send();
    }
  }

  let feClient = {
    subscribeToEvents() {
      browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message?.type) {
          case 'getState':
            sendResponse({ type: 'settings', value: settings.current })
            break
          case 'startListening':
            app.startRequestsListener()
            break
          case 'stopListening':
            app.stopRequestsListener()
            break
          case 'datesUrlUpdated':
            if (settings.current.extensionEnabled)
              return

            settings.current.datesUrl = message.newDatesUrl
            storage.saveSettingsAsync()
            break
          case 'loginPageUrlUpdated':
            if (settings.current.extensionEnabled)
              return

            settings.current.loginPageUrl = message.newValue
            storage.saveSettingsAsync()
            break
          case 'tokenUpdated':
            if (settings.current.extensionEnabled)
              return

            settings.current.token = message.newValue
            storage.saveSettingsAsync()
            break
          default:
            console.warn('BE received unsupported message:')
            console.warn(message)
            break
        }
      })
    }
  }

  feClient.subscribeToEvents()
})();